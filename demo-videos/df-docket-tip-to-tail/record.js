// DF Docket tip-to-tail demo recorder.
// Drives the real app with lifelike (eased, curved, jittered) mouse movement,
// records video, and logs a timed "beat" for every narratable moment so the
// companion script markdown can be built with real timestamps afterward.
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const APP_URL = process.env.APP_URL || "http://localhost:5183/";
const OUT_DIR = process.env.OUT_DIR || __dirname;
const VIDEO_DIR = path.join(OUT_DIR, "video");
const EVENTS_PATH = path.join(OUT_DIR, "events.json");
const W = 1440;
const H = 900;

fs.mkdirSync(VIDEO_DIR, { recursive: true });

let mouseX = W * 0.5;
let mouseY = H * 0.4;
let startTime = null;
const events = [];

function beat(label, note) {
  const t = startTime ? Date.now() - startTime : 0;
  events.push({ label, note, t_ms: t });
  console.log(`[${(t / 1000).toFixed(2)}s] ${label}${note ? " — " + note : ""}`);
}

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function rand(min, max) {
  return min + Math.random() * (max - min);
}

// Playwright's video capture records only what the page renders — the real OS/
// browser mouse cursor is compositor-level and never shows up in the frame.
// Without this, all the eased/curved movement below would be invisible in the
// recording even though the clicks land correctly. This injects a small on-page
// cursor + click-ripple overlay purely for recording purposes, driven from the
// same coordinates every humanMove/click step already computes.
async function injectCursor(page) {
  await page.addInitScript(() => {
    // window.__setCursorPos/__cursorRipple must exist immediately (steps call
    // them right after navigation), so define them eagerly with a pending-value
    // queue; the actual DOM element is only built once documentElement is
    // guaranteed to exist. This init script can run before ANY document
    // structure exists (Chromium fires it at new-document creation, ahead of
    // HTML parsing), so touching documentElement/body synchronously here can
    // throw — defer the real build to DOMContentLoaded when it's unavailable yet.
    let pendingPos = null;
    let pendingRipple = null;
    window.__setCursorPos = (x, y) => {
      const el = document.getElementById("__demo_cursor");
      if (el) el.style.transform = `translate(${x}px, ${y}px)`;
      else pendingPos = [x, y];
    };
    window.__cursorRipple = (x, y) => {
      if (!document.body) {
        pendingRipple = [x, y];
        return;
      }
      const r = document.createElement("div");
      r.className = "__demo_ripple";
      r.style.left = x + "px";
      r.style.top = y + "px";
      document.body.appendChild(r);
      setTimeout(() => r.remove(), 450);
    };
    // Runs the whole eased/curved path as a single requestAnimationFrame loop
    // paced by the BROWSER's own clock, self-contained after one call — this is
    // what keeps cursor animation from requiring a round trip to Node per step,
    // which was heavy enough to visibly starve the video screencast capture.
    let __animToken = 0;
    window.__animateCursor = (points, durationMs) => {
      const el = document.getElementById("__demo_cursor");
      if (!el || points.length === 0) return;
      const token = ++__animToken;
      const t0 = performance.now();
      function tick(now) {
        if (token !== __animToken) return; // superseded by a newer move
        const frac = durationMs > 0 ? Math.min(1, (now - t0) / durationMs) : 1;
        const idx = Math.min(points.length - 1, Math.floor(frac * points.length));
        const [x, y] = points[idx];
        el.style.transform = `translate(${x}px, ${y}px)`;
        if (frac < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    };

    function build() {
      const style = document.createElement("style");
      style.textContent = `
        #__demo_cursor { position: fixed; left:0; top:0; width:0; height:0; z-index:2147483647; pointer-events:none; transform: translate(-100px,-100px); }
        #__demo_cursor svg { position:absolute; left:0; top:0; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.45)); }
        .__demo_ripple { position: fixed; left:0; top:0; z-index: 2147483646; pointer-events:none; border-radius:50%; border: 2px solid rgba(35,84,232,0.85); background: rgba(35,84,232,0.16); transform: translate(-50%,-50%); animation: __demo_ripple_anim 420ms ease-out forwards; }
        @keyframes __demo_ripple_anim { from { width:6px; height:6px; opacity:1; } to { width:38px; height:38px; opacity:0; } }
        #__demo_tc { position: fixed; left:10px; bottom:8px; z-index:2147483647; pointer-events:none; font: 600 11px/1.4 ui-monospace, monospace; color: rgba(255,255,255,0.92); background: rgba(0,0,0,0.55); padding: 2px 7px; border-radius: 4px; letter-spacing: 0.03em; }
      `;
      document.documentElement.appendChild(style);
      const cur = document.createElement("div");
      cur.id = "__demo_cursor";
      cur.innerHTML =
        '<svg width="22" height="26" viewBox="0 0 22 26"><path d="M1 1 L1 20.5 L6.2 16 L9.6 23.5 L13 22 L9.7 14.5 L16.5 14.5 Z" fill="#1c1e1a" stroke="white" stroke-width="1.4" stroke-linejoin="round"/></svg>';
      document.documentElement.appendChild(cur);
      if (pendingPos) cur.style.transform = `translate(${pendingPos[0]}px, ${pendingPos[1]}px)`;
      if (pendingRipple) window.__cursorRipple(pendingRipple[0], pendingRipple[1]);

      // Burned-in elapsed-time readout, driven by the same Date.now() clock the
      // node-side beat log uses (window.__startClock() is called at the same
      // instant startTime is captured) — this is what lets the timed script's
      // timestamps be verified directly against a frame, since video encoders
      // don't always preserve exact wall-clock timing.
      const tc = document.createElement("div");
      tc.id = "__demo_tc";
      tc.textContent = "00:00";
      document.documentElement.appendChild(tc);
      setInterval(() => {
        if (!window.__demoStartClock) return;
        const ms = Date.now() - window.__demoStartClock;
        const s = Math.max(0, Math.floor(ms / 1000));
        tc.textContent = `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
      }, 200);
    }

    window.__startClock = () => {
      window.__demoStartClock = Date.now();
    };

    if (document.documentElement) build();
    else document.addEventListener("DOMContentLoaded", build, { once: true });
  });
}

async function startOnPageClock(page) {
  await page.evaluate(() => window.__startClock && window.__startClock());
}

async function setCursorPos(page, x, y) {
  await page.evaluate(([px, py]) => window.__setCursorPos && window.__setCursorPos(px, py), [x, y]);
}

async function cursorRipple(page, x, y) {
  await page.evaluate(([px, py]) => window.__cursorRipple && window.__cursorRipple(px, py), [x, y]);
}

// Moves the (tracked) mouse position from wherever it currently is to (targetX,
// targetY) along a slightly curved (quadratic bezier) path, sampled at an
// eased (slow-fast-slow) rate with small per-step jitter — approximates a real
// hand's acceleration/deceleration and imperfect aim, rather than teleporting.
//
// The path itself is computed here (Node side), but the VISUAL animation is
// handed to the browser as one batch (window.__animateCursor) rather than
// walked step-by-step over the CDP wire — a per-step page.evaluate round trip
// (the original approach) was heavy enough, across dozens of moves, to starve
// the page's own main thread and visibly desync the video's screencast capture
// from real wall-clock time. Only the FINAL position is sent as a real
// page.mouse.move (an invisible OS-level pointer move, needed for correct
// hover/click hit-testing) — intermediate points only ever drive the overlay.
async function humanMove(page, targetX, targetY) {
  const startX = mouseX;
  const startY = mouseY;
  const dx = targetX - startX;
  const dy = targetY - startY;
  const dist = Math.hypot(dx, dy);
  const steps = clamp(Math.round(dist / 9), 14, 48);
  const curveMag = (Math.random() < 0.5 ? -1 : 1) * Math.min(dist * 0.28, 90);
  const nx = dist > 0 ? -dy / dist : 0;
  const ny = dist > 0 ? dx / dist : 0;
  const ctrlX = startX + dx * 0.5 + nx * curveMag;
  const ctrlY = startY + dy * 0.5 + ny * curveMag;

  const points = [];
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const et = easeInOutCubic(t);
    const x = (1 - et) * (1 - et) * startX + 2 * (1 - et) * et * ctrlX + et * et * targetX;
    const y = (1 - et) * (1 - et) * startY + 2 * (1 - et) * et * ctrlY + et * et * targetY;
    const jitter = i === steps ? 0 : rand(-0.7, 0.7);
    points.push([x + jitter, y + jitter]);
  }
  const durationMs = steps * rand(9, 13);

  await page.evaluate(
    ([pts, dur]) => window.__animateCursor && window.__animateCursor(pts, dur),
    [points, durationMs]
  );
  await page.mouse.move(targetX, targetY);
  await page.waitForTimeout(durationMs);
  mouseX = targetX;
  mouseY = targetY;
}

async function moveToLocator(page, locator) {
  await locator.scrollIntoViewIfNeeded();
  const box = await locator.boundingBox();
  if (!box) throw new Error("Element has no bounding box (not visible)");
  const tx = box.x + box.width * rand(0.32, 0.68);
  const ty = box.y + box.height * rand(0.32, 0.68);
  await humanMove(page, tx, ty);
  return { tx, ty };
}

async function humanHover(page, locator, dwellMs = [250, 550]) {
  await moveToLocator(page, locator);
  await page.waitForTimeout(rand(dwellMs[0], dwellMs[1]));
}

async function humanClick(page, locator, label, note) {
  await moveToLocator(page, locator);
  await page.waitForTimeout(rand(120, 280));
  await page.mouse.down();
  await cursorRipple(page, mouseX, mouseY);
  await page.waitForTimeout(rand(35, 75));
  await page.mouse.up();
  if (label) beat(label, note);
}

async function humanType(page, locator, text, label, note) {
  await moveToLocator(page, locator);
  await page.mouse.down();
  await cursorRipple(page, mouseX, mouseY);
  await page.waitForTimeout(rand(30, 60));
  await page.mouse.up();
  await page.waitForTimeout(rand(150, 300));
  for (const ch of text) {
    await page.keyboard.type(ch);
    await page.waitForTimeout(rand(28, 95));
    if (Math.random() < 0.04) await page.waitForTimeout(rand(180, 380)); // thinking pause
  }
  if (label) beat(label, note);
}

async function humanScroll(page, atX, atY, totalDy, label, note) {
  await humanMove(page, atX, atY);
  const steps = 5 + Math.floor(rand(0, 4));
  for (let i = 0; i < steps; i++) {
    await page.mouse.wheel(0, totalDy / steps);
    await page.waitForTimeout(rand(80, 160));
  }
  if (label) beat(label, note);
}

async function pause(ms, label, note) {
  await new Promise((r) => setTimeout(r, ms));
  if (label) beat(label, note);
}

async function rowFor(page, labelText) {
  // Walks up from the term-label text node to its GridTermRow container.
  return page
    .locator(`text=${labelText}`)
    .first()
    .locator("xpath=ancestor::div[contains(@class,'rounded-lg') and contains(@class,'border')][1]");
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: W, height: H },
    recordVideo: { dir: VIDEO_DIR, size: { width: W, height: H } },
  });
  const page = await context.newPage();
  await injectCursor(page);

  await page.goto(APP_URL, { waitUntil: "networkidle" });
  await page.waitForSelector("text=Continue with firm SSO");

  // Set the node-side beat clock and the in-page burned-in timecode from the
  // same instant, AFTER navigation lands — starting them pre-navigation would
  // leave them referencing a document that gets torn down by goto(), and the
  // navigation itself would then show up as pure drift between the two clocks.
  startTime = Date.now();
  await startOnPageClock(page);
  beat("start", "cold open on the login screen");

  await setCursorPos(page, mouseX, mouseY);
  await pause(rand(900, 1300), "login_view", "DF Docket — Sign in with your firm identity");

  await humanClick(page, page.getByRole("button", { name: "Continue with firm SSO" }), "login_click", "mocked enterprise SSO — Azure AD/Intapp implied, not real auth");

  await page.waitForSelector("text=Who's working this matter?");
  await pause(rand(500, 800), "persona_view", "persona select — the choice reshapes every screen downstream");

  // Scan the options like a human would before committing.
  const partnerCard = page.locator("button", { hasText: "Deal partner" });
  const kmCard = page.locator("button", { hasText: "Practice leadership / KM" });
  const associateCard = page.locator("button", { hasText: "Junior / mid-level associate" });
  await humanHover(page, partnerCard, [300, 500]);
  beat("persona_hover_partner", "considers Partner");
  await humanHover(page, kmCard, [250, 450]);
  beat("persona_hover_km", "considers Knowledge Management");
  await humanClick(page, associateCard, "persona_click_associate", "picks Associate — mechanical work, teaches rather than just outputs");

  await page.waitForSelector("text=Meadowbrook Early Learning Holdings");
  await pause(rand(600, 900), "dashboard_view", "dashboard — deal snapshot + spine/next-actions chrome already visible");

  await humanClick(page, page.getByRole("button", { name: "Open matter" }), "dashboard_click_open", "opens the matter — no query typed yet");

  await page.waitForSelector("text=Moment A0");
  await pause(rand(700, 1000), "a0_view_blocker", "A0 — blocker + ranked precedents already waiting on open");

  await humanScroll(page, W * 0.5, H * 0.55, 220, "a0_scroll", "scrolls to the ranked candidate list");

  const a0TopHelpful = page.locator('button[title="Helpful"]').first();
  await humanClick(page, a0TopHelpful, "a0_thumbsup_kindercare", "thumbs-up on the #1 ranked candidate (KinderCare) — feeds the match-quality signal back");

  const whyMatchBtn = page.getByRole("button", { name: /Why this match/ }).first();
  await humanClick(page, whyMatchBtn, "a0_expand_why", "expands why KinderCare was suggested — industry, size, anchor prototype");
  await pause(rand(1200, 1700), "a0_read_why");

  await humanClick(
    page,
    page.getByRole("button", { name: /Search the full precedent bank instead/ }),
    "a0_click_search_bank",
    "elects to search the full bank manually instead of accepting the auto-match immediately"
  );

  await page.waitForSelector("text=Search the precedent bank");
  await pause(rand(500, 800), "a2a_view", "A2a — flexible precedent search: facets + natural language, same scorer as A0");

  await humanType(
    page,
    page.getByPlaceholder(/large-cap sponsor deal/),
    "small childcare facility",
    "a2a_type_query",
    "describes the deal in plain language rather than picking filters — literally the app's own placeholder example"
  );

  await humanClick(page, page.getByRole("button", { name: /^Search$/ }), "a2a_search_click", "runs the NL search");
  await page.waitForSelector("text=/\\d+ deals?/");
  await pause(rand(900, 1300), "a2a_results", "the full 15-deal bank narrows down, KinderCare on top");

  const firstInvestigateBtn = page.getByRole("button", { name: "Investigate" }).first();
  const firstCard = firstInvestigateBtn.locator('xpath=ancestor::div[contains(@class,"rounded-xl")][1]');
  const firstCardText = await firstCard.innerText();
  beat("a2a_top_result_check", `top result card text starts: ${firstCardText.slice(0, 40)}`);
  if (!firstCardText.includes("KinderCare")) {
    throw new Error(`Expected KinderCare as top NL-search result, got: ${firstCardText}`);
  }

  await humanClick(page, firstInvestigateBtn, "a2a_investigate_click", "investigates the top-ranked candidate");

  await page.waitForSelector("text=Moment A2");
  await pause(rand(700, 1000), "a2_view_entity", "A2 — entity detail (KUEHG Corp., Barclays, lender group, revolver upsize) confirms this is a real, richly-documented deal");

  const a2WhyHelpful = page.locator('button[title="Helpful"]').first();
  await humanClick(page, a2WhyHelpful, "a2_thumbsup_why", "confirms the match reasoning is sound");
  await pause(rand(900, 1300), "a2_read_credibility", "reads the credibility note — this grid-population step was already proven on this exact deal");

  await humanClick(
    page,
    page.getByRole("button", { name: /Populate a grid from this precedent/ }),
    "a2_click_populate_grid",
    "hands off from confirmed candidate to grid population"
  );

  await page.waitForSelector("text=Moment B1");
  await pause(rand(700, 1100), "b1_view_grid", "B1 — grid auto-populates with per-term grounding + review signals, never one blended score");

  await humanScroll(page, W * 0.5, H * 0.6, 260, "b1_scroll_1", "scans past the high-confidence, already-confirmed terms");

  const leverageRow = await rowFor(page, "Financial Covenant — Net Leverage Ratio");
  await humanHover(page, leverageRow, [400, 650]);
  beat("b1_read_leverage", "reads the springing covenant term — grounded in source, still unreviewed");
  await humanClick(page, leverageRow.locator('button[title="Helpful"]'), "b1_confirm_leverage", "confirms it — fast, glanceable, no correction needed");

  const cocRow = await rowFor(page, "Change of Control Definition");
  await humanHover(page, cocRow, [400, 650]);
  beat("b1_read_coc", "reads the Change of Control term — inferred, not grounded, still needs a human check");
  await humanClick(page, cocRow.locator('button[title="Not helpful"]'), "b1_correct_coc_open", "flags it for correction instead of a blind confirm");

  const cocValueInput = cocRow.locator('input[placeholder="Corrected value"]');
  await moveToLocator(page, cocValueInput);
  await page.mouse.down();
  await cursorRipple(page, mouseX, mouseY);
  await page.waitForTimeout(rand(30, 60));
  await page.mouse.up();
  await page.keyboard.press("ControlOrMeta+a");
  await page.waitForTimeout(rand(150, 250));
  await page.keyboard.press("Backspace");
  await humanType(
    page,
    cocValueInput,
    "Ceasing to hold at least 35% of voting power (confirmed against Amendment No. 3, §1.01 — matches the threshold the firm corrected to on a prior deal)",
    "b1_correct_coc_edit_value",
    "refines the value with the citation, not just accepting the inferred text as-is"
  );

  const cocReasoning = cocRow.locator("textarea");
  await humanType(
    page,
    cocReasoning,
    "Confirmed independently against Amendment No. 3 (Sec. 1.01) — the 35% floor is correct. This is the same defined-term pattern the firm corrected on a prior deal (bare-majority default is wrong); worth surfacing to the next associate who hits this term.",
    "b1_correct_coc_type",
    "the reasoning is what makes this reusable teaching material later, not just a fixed value"
  );
  await humanClick(page, cocRow.locator("button", { hasText: "Save correction" }), "b1_correct_coc_save", "saves the correction — this is the live moment that will resurface at the close");

  await pause(rand(500, 800));
  await humanScroll(page, W * 0.5, H * 0.6, 240, "b1_scroll_2", "scrolls to the undefined-term rows");

  const undefinedGapBtn = page.getByRole("button", { name: /View firm-definition gap/ }).first();
  await humanHover(page, undefinedGapBtn, [350, 550]);
  await humanClick(page, undefinedGapBtn, "b1_click_undefined_gap", "opens the Auto Cure gap — the system declines to guess");

  await page.waitForSelector("text=Moment B2");
  await pause(rand(900, 1300), "b2_view", "B2 — states plainly that K&E has never defined this term; routes to Knowledge Management instead of guessing");
  await pause(rand(700, 1000), "b2_read_routed", "the routed Next Action is visible, addressed to the right owner");

  await humanClick(page, page.getByRole("button", { name: /Back to grid/ }), "b2_click_back", "returns to the grid rather than leaving the flag stranded");
  await page.waitForSelector("text=Moment B1");
  await pause(rand(500, 700));

  // Presenter jump straight to the closing "learning loop" payoff — this control
  // exists specifically so a presenter can skip ahead live, in any order.
  const presenterDot = page.locator('button[title="Next moment (hold for full list)"]');
  await moveToLocator(page, presenterDot);
  beat("presenter_longpress_start", "long-presses the presenter dot to open the full jump list");
  await page.mouse.down();
  await cursorRipple(page, mouseX, mouseY);
  await page.waitForTimeout(650);
  await page.mouse.up();
  await page.waitForSelector("text=F1 — Teaching artifact");
  beat("presenter_menu_open");
  await pause(rand(500, 700));

  await humanClick(page, page.getByRole("button", { name: /F1 — Teaching artifact/ }), "presenter_click_f1", "jumps to the closing moment — correction becomes a teaching artifact");

  await page.waitForSelector("text=Closing — F1");
  await pause(rand(900, 1300), "f1_view", "F1 — 'Worked examples for you': the loop closes");

  await humanScroll(page, W * 0.5, H * 0.55, 200, "f1_scroll", "scrolls through the corrections on record");
  await pause(rand(1500, 2000), "f1_read_prior", "the prior, seeded correction on a different deal — same term, same reasoning pattern");
  await pause(rand(1500, 2000), "f1_read_new", "the correction made moments ago on B1, already sitting alongside it — the corpus just grew, live");

  beat("end", "tip-to-tail run complete");

  await context.close();
  await browser.close();

  fs.writeFileSync(EVENTS_PATH, JSON.stringify({ events, totalMs: Date.now() - startTime }, null, 2));
  console.log("Events written to", EVENTS_PATH);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
