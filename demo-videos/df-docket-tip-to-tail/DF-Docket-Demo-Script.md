# DF Docket — Tip-to-Tail Demo Script

**Video file:** `df-docket-demo.webm` (1440×900, ~1:19 runtime)
**Persona:** Associate (junior) · **Anchor deal:** KinderCare — Amendment No. 3 to Credit Agreement
**Through-line:** matching a new deal (Meadowbrook) to precedent deals for debt finance, and a live "learning loop" moment where a correction made on-screen resurfaces as teaching material at the close.

## How to use this

Every screen in the recording carries a small burned-in elapsed-time readout in the bottom-left corner (`00:00`, `00:01`, …). **Use that on-screen readout to line up your voiceover, not your video player's own scrubber** — screen-recording encoders don't always preserve perfectly linear wall-clock timing, so a player's seek bar can drift a second or two from the numbers below by the end of the clip. The corner readout is ground truth; the timestamps in this script are keyed to it.

The video has no audio track — narrate live or record a voiceover against these cues, then mux it in.

---

## 0:00 – 0:02 — Cold open: Login

**On screen:** DF Docket's login screen. Mocked SSO, framed as enterprise auth.

> "This is DF Docket — a live-presenter tool built with Kirkland & Ellis's Debt Finance practice. Sign-in here is mocked, but it's deliberately framed as real enterprise auth — Azure AD, Intapp ethical-wall gating — because that's the actual stack this would sit behind."

*(0:02 — click "Continue with firm SSO.")*

Source: login screen is explicitly scoped as "mocked... no real security requirement, just needs to exist as a believable entry point" (`KE-Debt-Finance-Demo-Software-Build-Brief.md`, §"Login / Auth (mocked)").

---

## 0:03 – 0:05 — Persona select

**On screen:** Three persona cards — Associate, Partner, Knowledge Management. The cursor visits Partner and KM briefly before landing on Associate.

> "Three personas, and the choice isn't cosmetic — it reshapes the Next-Actions panel, what's redacted, and what routing options even appear, on every screen from here on. Today we're the associate: the person doing the mechanical work — retrieval, grid population, term verification. This is also the view built to teach, not just output an answer."

*(0:05 — click Associate.)*

Source: `PRODUCT.md` §2 ("Persona is central state... switching it live re-renders every screen already mounted"); three-persona model from `KE-Debt-Finance-Demo-Software-Build-Brief.md` §2.

---

## 0:06 – 0:07 — Dashboard

**On screen:** Meadowbrook Early Learning Holdings — sponsor, industry, deal size, covenant flavor. Deal spine (Precedent → Grid → Term Sheet → Credit Agreement → Post-Close) and an empty Next-Actions panel are already visible chrome, not a separate page.

> "Meadowbrook is our new matter — a fictional childcare-sector deal standing in for a real one. Notice the spine and the Next-Actions panel are already here, above the fold, before we've done anything. That's deliberate: this app is never a blank canvas waiting for a query."

*(0:06 — click "Open matter.")*

Source: `PRODUCT.md` §3–4 (deal spine and Next-Actions panel as "persistent, global" chrome); `NEW_MATTER` fictional deal defined in `src/data/precedentCorpus.ts`.

---

## 0:07 – 0:13 — Moment A0: the deal opens with the blocker already waiting

**On screen:** "No precedent selected yet — grid not started." Below it, a ranked candidate list — **KinderCare, 55% match** — with no query typed. Cursor thumbs-up's the top candidate, then expands "Why this match."

> "This is the real opening beat — not a search box. Meadowbrook's own term sheet was already in the data room, and the system has already matched it against the firm's whole precedent corpus before anyone touched a keyboard. KinderCare comes back on top at 55% — same industry, similar facility size, and it's the firm's proven anchor deal. The associate's job isn't to describe the deal from scratch. It's to choose."

*(0:10 — thumbs-up the match — that feedback is logged, feeding the same signal a real system would use to get better over time.)*
*(0:10 — expand "Why this match" to show the reasoning: industry, size, the anchor-deal credibility bump.)*

*(0:13 — click "Search the full precedent bank instead" to show the manual path too.)*

> "And if the auto-match weren't good enough, the associate isn't stuck — there's a full manual search sitting one click away."

Source: `KE-Debt-Finance-Demo-Moments.md`, Moment A0 ("the true opening beat... the associate's job is choosing, not describing"); KinderCare's status as one of 15 real credit agreements from K&E's Covenant Extraction Spike, `KE-Debt-Finance-Software-POV-Resources.md` §5a.

---

## 0:13 – 0:19 — Moment A2a: flexible precedent search

**On screen:** The full 15-deal precedent bank, unfiltered. Cursor types **"small childcare facility"** — literally the app's own placeholder example — into the natural-language box, hits Search, and the list narrows with KinderCare back on top.

> "This is the same matching capability from A0, just reachable a second way — facets, or plain language. 'Small childcare facility' is the app's own suggested example. One phrase, and fifteen deals narrow down to the ones that actually fit — KinderCare still on top."

*(0:19 — click "Investigate" on the top result.)*

Source: `PRODUCT.md` §5 ("Facet dropdowns... and a natural-language box both call the *same* scoring detector... one capability, three entry points"); underlying user story — "As an attorney, I can find prior deals by sponsor, deal size, industry, and lender" — `KE-Debt-Finance-Software-POV-Resources.md` §4, Stage 2.

---

## 0:20 – 0:23 — Moment A2: confirm the precedent

**On screen:** KinderCare's entity detail — Borrower KUEHG Corp., Holdings, admin agent Barclays, the six-bank lender group — plus a purple credibility note.

> "This is where the demo stops being hypothetical. KUEHG Corp., Barclays as admin agent, the lender group — this is a real, K&E-provided credit agreement, one of only two documents actually walked through live at K&E's July onsite. And a Tribe engineer had already built a standalone grid-population prototype on this exact deal before that onsite ever happened — this step was proven before it was demoed."

*(0:21 — thumbs-up the match reasoning.)*
*(0:23 — click "Populate a grid from this precedent.")*

Source: KinderCare entity detail and "break-glass credibility proof" — `KE-Debt-Finance-Demo-Moments.md`, Moment A2 and `KE-Debt-Finance-Software-POV-Resources.md` §5a.

---

## 0:23 – 0:27 — Moment B1: the grid populates

**On screen:** KinderCare's grid fills in — Revolving Facility Amount (redacted, since a junior associate's economics view is gated), Maturity Date, Springing Maturity Trigger, Administrative Agent, Lender Group, all "Grounded in source" / "Reviewed · confirmed."

> "Terms populate with two separate signals per row, never one blended score — is it grounded in the actual document, and has a human reviewed it. Across the real extraction spike this is based on — 690 extractions, 15 credit agreements — that was 78% correct on the first pass, 99% after review. High-confidence rows here are exactly that: glanceable, nothing to do."

*(0:26 — reach the Net Leverage Ratio covenant, still "Needs review" despite being grounded — a quick thumbs-up confirms it.)*

Source: 78%/99% figures and per-term grounding+review structure — `KE-Debt-Finance-Demo-Moments.md`, Moment B1; KinderCare-specific extraction notes (springing maturity caught correctly, conformed-copy ease of extraction) — same source and `KE-Debt-Finance-Software-POV-Resources.md` §5.

---

## 0:27 – 1:04 — The live correction: where the loop starts

**On screen:** "Change of Control Definition" — grounding is **Inferred**, not grounded in source, still needs review. Cursor clicks thumbs-down instead of a blind confirm, opens the correction form, replaces the value with a citation-backed version, and writes out real reasoning before saving.

> "This one's inferred, not grounded — the system isn't fully sure, and it says so instead of hiding it. So instead of a blind confirm, we correct it: the 35% voting-power threshold is right, but let's cite exactly where — Amendment No. 3, section 1.01 — and note that this matches a threshold the firm corrected to on a prior deal. That reasoning is the whole point. It's not just fixing a value — it's leaving a worked example behind for whoever hits this exact term next."

*(This is the longest single beat in the recording — roughly 0:27 to 1:04 — because the value and reasoning are typed out in full rather than pasted. That's deliberate: this is the one moment in the whole run demonstrating the actual mechanics of the learning loop, so it's worth sitting in.)*

*(1:04 — click "Save correction.")*

Source: correction records carry reasoning, not just a corrected value, and are retrievable by term-similarity across deals — `PRODUCT.md` §5 (Phase 3 / F1) and `KE-Debt-Finance-Demo-Software-Build-Brief.md` §4 ("Correction records... need to store reasoning text, not just a corrected value").

---

## 1:06 – 1:09 — Moment B2: the undefined-term state

**On screen:** Scroll down to Auto Cure — no value, no citation, a purple "Undefined by firm" badge. Click through to B2.

> "This one's different again — not low-confidence, not a correction opportunity. Auto Cure is a term K&E has never defined a firm-wide pass/fail standard for. That's not a system failure — the tool says plainly that the firm hasn't told it what right looks like, and routes it to Knowledge Management instead of guessing."

*(1:09 — B2 screen: the routed Next-Action, addressed to KM, not the associate.)*

> "This is one of six terms that failed to grade across all fifteen real credit agreements in K&E's own extraction pilot — including KinderCare. It's not a gap invented for the demo; it's the same gap the real pilot hit on this exact document."

*(1:10 — back to the grid.)*

Source: six undefined terms (Auto Cure among them) failing to grade across all 15 spike documents — `KE-Debt-Finance-Demo-Moments.md`, Moment B2; `KE-Debt-Finance-Software-POV-Resources.md` §5 ("104 rows... couldn't be graded at all — this is the actually useful finding").

---

## 1:11 – 1:13 — Presenter jump to the close

**On screen:** A long-press on the small, unlabeled dot in the bottom-right corner opens the full moment list; click "F1 — Teaching artifact."

> "One more thing worth showing before we close: this tool is built so a presenter can jump to any moment live, in any order — sequential flow and a direct jump are the exact same code path. We're skipping the term-sheet diff and cross-practice moments for time and going straight to the payoff."

Source: `AGENTS.md` §"Navigation" ("a presenter can jump to any moment live, in any order... one canonical sequence, two triggers").

---

## 1:14 – 1:19 — Moment F1: the loop closes

**On screen:** "Worked examples for you" — because we're a junior associate, the framing itself changes. Two correction cards: a seeded correction from a prior deal on this exact same term ("Change of Control Definition" — a bare-majority threshold corrected to 35%), and, sitting right alongside it, the correction just made on KinderCare moments ago — both tagged "On your current grid."

> "This is the whole thesis. A senior associate corrected this same term on a different deal once before — the reasoning is right there, not just the fixed value. And the correction we just made, thirty seconds ago, is already sitting next to it. The system — and the firm's own data behind it — got a little better at its job while we were still in the room. That's the loop: precedent in, grid out, correction in, and the next associate who hits this term doesn't start from zero."

Source: `PRODUCT.md` §5, Phase 3 ("a seeded prior correction, plus any correction made live on B1 during the session, resurfaces as a worked example"); the training-pipeline tension this answers — Ashley Martin: *"I have been very openly concerned about how the imposition of AI is going to affect how we train junior associates"* — and Tim Hughes's counter, *"you're going to have to change how you train them"* — `KE-Debt-Finance-Demo-Moments.md`, Closing Option F1; `KE-Debt-Finance-Software-POV-Resources.md` §7.1.

---

## What this cut deliberately leaves out

For time, this run doesn't touch **A1** (fallback NL document search), **C1** (term sheet ↔ credit agreement diff), **E2** (cross-practice M&A trigger), or **F3** (fee-letter scope boundary) — all real, built moments, reachable the same way via the presenter dock. If a longer cut is useful later, the natural extension point is picking up right after B2 and walking C1 → E2 → F3 before landing on F1, or swapping F1 for F3 entirely for a more technically skeptical room (per `KE-Debt-Finance-Demo-Moments.md`'s own closing-moment guidance: F1 for a partner-skeptical room, F3 for a technically sophisticated one).

## Sources referenced throughout

- `PRODUCT.md` — product vision, deal spine, personas, access model
- `AGENTS.md` — navigation/moment-jump architecture
- `KE-Debt-Finance-Demo-Moments.md` (v3.1) — moment-by-moment script and sourcing
- `KE-Debt-Finance-Demo-Software-Build-Brief.md` (v3.1) — requirements spec
- `KE-Debt-Finance-Software-POV-Resources.md` (Rev 3) — underlying research compendium (stakeholder quotes, extraction-spike numbers, the 15-deal sample)
