# K&E Debt Finance Demo — Presenter Script

**Version 1.0 — 2026-08-04**

*A tip-to-tail run-of-show for the built app (`npm-trial-020` / "DF Docket"), sequenced per `src/state/momentSequence.ts`. This is a script to read from and rehearse, not a new spec — it doesn't introduce any moment, screen, or capability the app doesn't already have. Where it makes a claim, it points back to `PRODUCT.md`, the Build Brief, the Moments doc, or the POV compendium so nothing said in the room outruns what's actually built or sourced.*

**Changelog:**
- v1.0 — 2026-08-04 — Initial script, written against the app as of `172cfee` (A2a flexible search + feedback loop UI) and the POV compendium added in `dcff51f`.

---

## 0. The two threads — say this before touching the laptop

Everything below is one continuous demo, but it's carrying two claims at once. Name both out loud in the cold open, then keep tagging which one each moment is proving — a room that can't tell the two apart will walk out remembering "AI extracted some text," not the actual pitch.

**Thread 1 — Precedent matching.** The Precedent Bank already knows this deal's characteristics and the firm's whole prior corpus, so a new matter opens to a ranked shortlist, not a blank search box. This is what turns "3 hours" into "10 seconds."

**Thread 2 — The learning loop.** Every thumbs-up/down, every grid correction, every undefined-term flag is a data point the system keeps — not just for this deal, but for the next associate, on a different deal, next quarter. The software and the data scaffold underneath it (and DealOS, which will eventually run this the same way it runs M&A) get better at the job on behalf of the *whole firm*, not just whoever's sitting at the keyboard today.

Say the second thread in Clinger's own words if the room is technical — it's K&E's own strategic language, not Tribe's marketing: *"We are not building AI tools. We are building a platform for compounding institutional intelligence."* The SOW's own phrase for the substrate underneath Thread 1 is **Data Scaffolding for Precedent**, "built so AI applications and agents are first-class consumers of it" — that scaffold is what Thread 2 is actually compounding.

**Quick-reference — what each moment is proving:**

| Moment | Precedent matching | Learning loop | One-line why |
|---|---|---|---|
| A0 | ●●● | ● | Zero-query synthesis; thumbs feed the shared detector |
| A1 | ●●● | — | Speed contrast; deliberately the fallback, not the loop |
| A2a | ●●● | ● | Same detector as A0, three entry points, still feeding one ledger |
| A2 | ●●● | ● | Investigate/confirm a candidate; feedback on the *reasoning*, not just the pick |
| B1 | ● | ●●● | Correction reasoning captured, not just a corrected value — this is the loop's fuel |
| B2 | — | ●●● | A gap the firm hasn't defined is routed to KM, not guessed — the loop reaching leadership |
| C1 | — | ●● | Triage funnel that gets sharper with use, not a one-off filter |
| E2 | ● | ●● | Scaffold reaching across a practice-area boundary, unprompted |
| F1 (close) | ● | ●●● | **Payoff**: B1's correction resurfaces as a worked example for a different associate on a different deal |
| F3 (alt close) | — | ● | Different thesis (honesty about limits) — use only if the room needs it instead |

Don't let the two threads collapse into one talking point. Precedent matching is what makes today's demo fast; the learning loop is what makes next quarter's demo — run by someone else, on a deal you've never seen — faster than this one.

---

## 1. Before you're in front of the room

- Confirm the anchor deal is **KinderCare** (`ANCHOR_DEAL_ID` in `src/data/deals/index.ts`) unless you've deliberately swapped to Medline for this room (see §6).
- Fresh reload → land on **Login**. Don't pre-navigate; the cold state is part of the story (Dashboard should show the matter *un*opened).
- Know your closing choice going in (F1 vs. F3, see §5) — don't decide live.
- The small `Demo` pennant (top-right chrome) is intentional — if anyone asks, say so plainly: this is a live-presenter prototype, not a shipped product screen.
- The unlabeled dot button, bottom-right, is yours, not the room's: click to advance one moment, press-and-hold to jump anywhere. `→` also advances. Rehearse both — you will want to jump at least once live.

---

## 2. Cold open (before Login) — ~1 min

**Say:**
"K&E told us the same thing three different ways this summer: precedent and judgment are locked in people's heads, not in a system; finding the right prior deal is an administrative burden; and the document you're building today has to be right for years, because errors here aren't cheap to fix later. What I'm going to show you is one system that does two things about that — it finds the right precedent for a new deal in seconds instead of hours, and every time someone in this firm corrects it, the *next* person's version of this same system is a little smarter. Not their own private copy — the firm's."

**Click:** Continue with firm SSO → land on **Persona Select**.

---

## 3. Persona Select — ~30 sec

**Say:**
"Three people touch a deal like this, and the same screens are going to look different depending on who's logged in — that's not a settings toggle, it's the actual access model. I'll start as the Associate — the person doing the mechanical work today — and switch personas live later so you can see the same data reshape itself."

**Click:** **Associate** card → lands on Dashboard.

*(If asked why three and not more: Partner consumes triaged output only; Knowledge Management owns the firm-definition gaps and access sign-off — both get their moment later, B2 and the persona-switch demo in §4.4.)*

---

## 4. The core sequence

### 4.1 Dashboard — ~30 sec

**Say:**
"This is deliberately not a blank landing page waiting for a query. There's one matter, unopened, and the system already knows its sponsor, industry, size, and covenant flavor from what's already sitting in the data room — a term sheet, in this case. Watch what happens the second I open it: no search box first."

**Click:** **Open matter**.

*Thread tag: setup only — the real Thread 1 moment is next.*

---

### 4.2 Moment A0 — Open the deal, the blocker is already waiting — ~2.5 min

**Say (on load, before touching anything):**
"Zero query typed, and the system already told me two things: what's blocking this deal right now — no precedent selected, grid not started — and a ranked shortlist of candidate precedents it matched against this deal's own characteristics. That's the whole point of Thread 1: the associate's job here isn't to search, it's to *choose*."

**Click:** **Why this match** on the top candidate to expand the reasoning bullets.

**Say:**
"Sponsor tier, industry, covenant flavor, facility size — every one of these is a real signal the same detector used to rank this list, not a black box. And if a bullet's wrong for this deal —"

**Click:** thumbs-down on one match-reason bullet → **Not relevant** reason picker appears → pick a quick reason (e.g. **Wrong sponsor tier**) or type one.

**Say:**
"— that correction doesn't just fix my screen. It's logged against this exact detector, the same one A2a's facet search and natural-language search both call. One scoring function, three ways in, and every one of them gets sharper from the same feedback ledger. That's Thread 2 starting on literally the first screen."

**Click:** **Investigate** on the top candidate (KinderCare) → into A2 territory, but pause here if you want A1 first.

*Thread tag: heavy Thread 1, first real Thread 2 beat.*

---

### 4.3 Moment A1 — the fallback lookup — ~1.5 min (optional if room is short on time)

Jump back or forward to A1 explicitly via the presenter dock — it's not adjacent to A0 in the live flow once you've clicked into a candidate.

**Say:**
"Quick detour, because it's the single most literally-evidenced thing in this whole demo. Someone at K&E told us finding an old engagement letter — Kirkland-negotiated, Goldman as arranger — took two to three hours by hand, because there's no query tool for it, just Jill knowing where things are. Watch."

**Click:** the pre-filled or typed description → **Search**.

**Say (as result returns):**
"Deal team and date, attached, before I even open the file — I can confirm relevance without opening it. That's ten seconds, and this is the *fallback* path, deliberately — it's what happens when there's nothing for the system to have pre-matched. A0 is the default; this is what's left when A0 has nothing to work with."

*Thread tag: pure Thread 1 — no feedback UI here, and that's honest, not an oversight: there's nothing to correct in a raw retrieval hit the way there is in a ranked match or an extracted term.*

---

### 4.4 Moment A2a — flexible precedent search — ~2 min

**Say:**
"A0 auto-suggests. But sometimes an associate wants to search the whole precedent bank on their own terms — by sponsor tier, industry, lender, deal size, or just in plain language."

**Click:** a facet (e.g. lender = a specific name) *or* type into the natural-language box (`e.g. "large-cap sponsor deal with KKR as a lender"`) → **Search**.

**Say:**
"This is the same detector as A0 under the hood — one capability, three doors into it: auto-suggest on open, facets, natural language. It's not three separate search features to maintain, and it means feedback given through *any* door improves what the *other* doors surface next time."

**Click:** thumbs-down on a candidate or a match-reason bullet here too, if time allows, to reinforce that it's the same ledger as A0.

*Thread tag: Thread 1 primary, Thread 2 reinforced (same detector, same ledger as A0).*

---

### 4.5 Moment A2 — investigate and confirm KinderCare — ~2.5 min

**Say:**
"Back to the candidate I picked in A0. This isn't a fresh search — I'm investigating a match the system already made."

**Click:** expand entity detail — **Borrower KUEHG Corp.**, **Holdings KinderCare Learning Companies, Inc.**, **Intermediate Holdings KC Sub, LLC**, admin agent **Barclays**, lender group (DB, UBS, BofA, Jefferies, KKR, Citizens), revolver upsized **$160M → $240M** by Amendment No. 3.

**Say:**
"I want to be straight with this room about something: this isn't a simulated capability. A Tribe engineer built a standalone version of exactly this grid-population step on this exact deal before we ever sat down with you on July 14 — this demo is showing you something that was already proven, not something we're hoping works."

**Click:** if the top match isn't quite right, show the manual-refine path — **Clear** a filter or narrow by lender — then re-select KinderCare. Frame it as adjusting a shortlist, not starting over.

**Click:** **Populate a grid from this precedent**.

*Thread tag: Thread 1 (confirming), light Thread 2 (feedback still live on this screen's match-reason bullets and alternates).*

---

### 4.6 Moment B1 — grid population, and where the loop's fuel actually gets made — ~3.5 min

**Say (as the grid fills):**
"Every term here carries two separate signals, not one — grounded-in-source or inferred, and reviewed-or-not. We stopped trusting a single self-reported 'confidence: high' a while back — real testing showed models say 'high confidence' almost uniformly, whether they're right or not. Two honest signals beat one reassuring one."

**Point at:** a high-confidence row (glanceable) next to a row flagged for review.

**Say:**
"And I want to be specific about this deal, not just wave at an aggregate number: across the actual spike — 690 extractions, 15 real credit agreements — 78% came back correct on the first pass, 99% after review. KinderCare specifically caught its springing maturity correctly, and because this is a conformed amendment copy — the whole agreement as amended — it extracted *more* easily than a typical draft, not less."

**Click:** thumbs-down on an unreviewed term → correction form opens → fill **Corrected value** and, critically, **Reasoning — why this correction** → **Save correction**.

**Say (this is the thesis line — slow down here):**
"Here's the part that matters more than the correction itself: I didn't just overwrite a value. I wrote down *why*. That reasoning doesn't disappear once I hit save — it gets stored against this term label, retrievable by term-similarity across *every future deal*, not just this one. Hold onto that; it comes back at the very end of this demo, on a deal I haven't even opened yet."

*Thread tag: this is the loop's manufacturing floor. Everything after this either escalates a gap (B2) or cashes in a correction (F1).*

---

### 4.7 Moment B2 — the undefined-term state — ~2.5 min

**Say:**
"Same grid, different kind of gap. This term isn't wrong and it isn't missing — the firm has simply never told the system what a pass/fail answer looks like for it. That's a different problem than an extraction miss, and the system says so plainly instead of guessing."

**Click:** **View firm-definition gap →**.

**Say:**
"This isn't a demo contrivance — this is the single most useful thing the real extraction spike found. Six terms, across all 15 real credit agreements, never graded — including on this exact document. Ninety of a hundred and four ungradeable rows trace back to just those six terms. That's not 'the AI failed six times.' That's a concrete, six-item ask for practice leadership, instead of a vague 'we need more from Kirkland.'"

**Point at:** the item now live in the **Next Actions** panel, routed to `km`.

**Say:**
"And this is where Thread 2 stops being about one associate's grid and starts being about the whole firm. Once Knowledge Management signs off on a standard for this term, it's not just this deal's grid that gets fixed — every future grid that hits this same term, on any deal, in any practice group running this same scaffold, inherits that answer. That's the firm getting better at its own job, not just this associate."

**Optional — persona switch, right here:** flip to **Partner** in the header, then to **Knowledge Management**, and point out the Next Actions panel reshaping and the deal-team/seniority toggles changing what's redacted. This is the cheapest, most concrete way to show "same screens, different visibility" without a separate detour screen.

*Thread tag: pure Thread 2, and the moment that names the "whole firm" claim explicitly — don't skip this line even if you're cutting time elsewhere.*

---

### 4.8 Moment C1 — term sheet ↔ credit agreement diff, triaged — ~2 min

**Say:**
"Bring in a term sheet and its credit agreement, and the system finds every divergence between them. The interesting part isn't the list — it's the funnel."

**Point at:** raw flags → attorney-relevant → client-shown narrowing (KM/senior view).

**Say:**
"One of your own partners already built a version of this by hand and flagged around two hundred discrepancies himself. Another partner's own pilot triage ratio — roughly three hundred raw flags down to fifty attorney-relevant down to ten client-shown — is the shape we're targeting here, not a number we invented. We're not proposing something net-new to this practice; we're proposing to build, at scale, what your most technical partner already proved by hand was worth doing."

**Note honestly if asked:** this screen doesn't carry its own thumbs-up/down UI today — the "loop" here is the triage split itself getting reused and tuned deal over deal, not a live feedback button on this particular screen. Don't claim a feedback control that isn't on this screen.

*Thread tag: Thread 2 by proof-of-value, not by a literal feedback control on this screen — say it that way if pressed.*

---

### 4.9 Moment E2 — cross-practice notification — ~2 min

**Say:**
"This one's unprompted — nobody asks the system to look for this, it's watching on its own. Somewhere else in the firm, on the M&A side, a confidential IPO filing just created a new legal entity."

**Click:** **Route to {attorney}**.

**Say:**
"The system already worked out that this new entity sits inside an existing credit agreement's guarantor structure, and routed a flag to the specific debt-finance attorney responsible for it — without anyone having to notice the connection by hand. This is the real incident behind this moment: a confidential filing like this once went undisclosed to debt finance for six months and forced an emergency lender waiver. This isn't built anywhere yet — it's scoped, not shipped — but it's the clearest picture of what 'the whole firm' actually means: the same data scaffold reaching across a practice-area line most tools stop at."

*Thread tag: Thread 2 at its widest radius — the firm, not just the practice group.*

---

## 5. Closing — pick one live, based on the room

Both are built; decide which one *before* you walk in, based on the room's temperament (per the source material), and don't switch mid-demo unless the room's reaction genuinely calls for it.

### 5.1 Option F1 — Correction becomes a teaching artifact (recommended — this is the through-line's payoff)

Use this closing whenever the room's concern (spoken or not) is *"does this replace how junior people learn."* It's also the version that literally resolves Thread 2 — use it whenever the through-line is the point of the session, not just one strand among several.

**Say:**
"Remember the correction I made back on the KinderCare grid — the one where I wrote down *why*, not just the fixed value? Watch what happens when I switch to a junior associate, on a different matter entirely, who hits a similar term."

**Click:** switch persona/seniority to junior associate → jump to **Closing — F1**.

**Say:**
"That's not the right answer appearing from nowhere. That's a senior associate's actual reasoning, resurfacing as a worked example, because the term matched by similarity, not because anyone remembered to go looking for it. This is the direct answer to something one of your own people raised with us on day one — a concern that automation would quietly hollow out how associates learn, because grid-building today *is* the training ground. Our answer isn't to avoid that risk. It's to make every correction a lesson that outlives the deal it happened on, and hands it to the next person who needs it — anywhere in the firm, not just back to the person who made it."

**Say (the actual close):**
"This is the whole thesis in one screen. A precedent bank that gets faster to search the more it's used, and a correction that gets more valuable the further it travels from where it started. That's what your own team described wanting — not another AI tool bolted onto the side of a workflow, but a platform where the firm's own judgment compounds instead of leaking out the door every time someone leaves. That's what this is built to be part of."

### 5.2 Option F3 — Scope self-awareness (alternate — use for a room skeptical of overclaiming)

Use this closing instead when the room's real worry is *"is this going to confidently hand us something wrong."*

**Click:** jump to **Closing — F3** → **Extract from fee letter**.

**Say:**
"Fee letters carry the most sensitive economics in a deal — OID, market flex — and they're a different document from the credit agreement entirely. Watch what happens when I ask this system to do something it doesn't actually do yet."

**Point at:** the scope-boundary notice, not an attempted answer.

**Say:**
"It doesn't guess, and it doesn't quietly return something half-right. It says plainly this isn't in scope, and logs it as an open question rather than a silent gap. A system that names its own limits out loud is more trustworthy than one that's confidently right most of the time — and this room, more than most, will be the one that finds the 1% where 'confidently right' becomes a real problem."

*If you use F3 to close, don't drop Thread 2 — bridge back to it in one sentence before you finish: "The same honesty applies in reverse — every gap this system flags, like the ones we saw in B2, is exactly what gets the firm's own definitions filled in, which is what makes the *next* answer here grounded instead of a boundary statement."*

---

## 6. If the room wants more, or a different deal

- **Swap the anchor:** `ANCHOR_DEAL_ID` in `src/data/deals/index.ts`. Medline is the strongest alternate — it's the *other* document run live at the July 14 onsite, used there for the full deal-spine walkthrough rather than KinderCare's Post-Close framing. No rebuild required.
- **G1 (J.Crew vocabulary beat), if there's time and the room enjoys shorthand:** while on the B1 grid, mention that this deal's IP-transfer language pattern-matches the **J. Crew Blocker** construct — real, current vocabulary in K&E's own extraction schema (11 of 15 real sample deals), never explicitly labeled in the documents themselves, found by pattern. If you pull up the 2014 J.Crew transaction as color, say plainly that the *term* is real and sourced, the *2014 deal itself* is market context we added, not a document from K&E's own archive. Don't let this read as "found in your files" — it wasn't.
- **Other real anchors available**, all from the same 15-deal Covenant Extraction Spike: ADT, BrightView, Clearwater Analytics, First Watch, Ingram Micro, Karman Holdings, Ping Identity, SailPoint, StandardAero, Surgery Partners, Thoughtworks, Traeger, ZoomInfo.

---

## 7. Guardrails — don't say these

A few claims the source material explicitly does *not* support. Saying them will get caught by anyone in the room who was in the July 14 sessions.

- **Don't call B1/F1's correction-reasoning capture a "knowledge graph."** Debt Finance explicitly told the team capturing *why* a precedent was chosen is not a near-term priority — the **Debt Finance Knowledge Layer** is held-back scope. F1's reasoning capture is a narrower, already-validated thing: training continuity for corrections, sourced to Ashley Martin's and Tim Hughes's actual exchange — not a resurrection of the deprioritized reasoning layer. Keep the two distinct if asked.
- **Don't imply C1 has a live feedback button on-screen.** It doesn't today; the "gets better" claim there is about the triage funnel matching a partner's own proven ratio, not a literal thumbs control (see §4.8).
- **Don't imply the client portal or compliance guide are in this build.** Both were explicitly demoted from base to Expansion scope post-onsite — this demo doesn't touch them, and shouldn't be described as if it does.
- **Don't overstate E2 or the Cross-Practice Coordination feature as shipped.** Say "scoped, not built yet" — it's Expansion scope in the SOW, and the demo itself frames it as a capability being proven, not a shipped one.
- **Don't claim real authentication.** Login is mocked on purpose; say so if asked, don't dodge it.

---

## 8. Timing budget

| Section | Minutes |
|---|---|
| Cold open + persona select | ~2 |
| A0 | ~2.5 |
| A1 (optional) | ~1.5 |
| A2a | ~2 |
| A2 | ~2.5 |
| B1 | ~3.5 |
| B2 (+ optional persona-switch aside) | ~2.5–4 |
| C1 | ~2 |
| E2 | ~2 |
| Closing (F1 or F3) | ~2.5 |
| **Core total** | **~23–26 min** |

Cuttable first if short on time: A1 (say the "10 seconds" line verbally instead), the G1 aside, and the persona-switch detour inside B2 (fold it into the Persona Select framing instead).
