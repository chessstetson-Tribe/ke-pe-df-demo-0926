# K&E Debt Finance Demo — Software Build Brief

**Version 3.1 — 2026-08-03**

*(Versioning now tracks `KE-Debt-Finance-Demo-Moments.md` directly — this brief is at parity with source v3.1. Prior internal version numbers, 1.0–1.2, are folded into this history below rather than continued as a separate scheme.)*

**Changelog:**
- v3.1 — 2026-08-03 — Renumbered to match source doc versioning going forward. No content change from prior v1.2 beyond this renumbering; future bumps will track the source doc's version number directly so brief/source parity is always visible at a glance.
- v1.2 — 2026-08-03 — Corrected stale placeholder deal references: A2 was still naming "J.Crew" as the example precedent from an earlier draft-era description; fixed to **KinderCare (Amendment No. 3, 2024)**, matching the source doc's v3 swap. Added the KinderCare entity/lender detail (Borrower KUEHG Corp., Holdings, admin agent Barclays, lender group, revolver upsize) and Carl's pre-built prototype note to A2. Added KinderCare's specific extraction results (springing maturity, conformed-copy ease of extraction) to B1. Named KinderCare explicitly in B2 for consistency. Added a note flagging the anchor deal (KinderCare) as swappable config, not hardcoded, with Medline named as the strongest alternate and the full 15-deal pool listed.
- v1.1 — 2026-08-03 — Synced to `KE-Debt-Finance-Demo-Moments.md` v3.1. Added Moment A0 (the true opening beat, sequenced before A1 — was missing from v1.0) and folded in the two reserve moments, G1 (J.Crew vocabulary-anchor) and G2 (SunGard placeholder), as an optional-moments appendix. Updated the suggested flow and dashboard requirements to reflect A0's "blocker already waiting on open" behavior.
- v1.0 — 2026-08-03 — Initial build brief, synthesized from `KE-Debt-Finance-Demo-Moments.md` v3.1: global requirements (deal progress spine, ranked next-actions, constrained AI chat, confidence/provenance, access model, scope-boundary states), personas, moment-by-moment workflow specs (A1, A2, B1, B2, C1, E2, F1/F3), data model notes, and out-of-scope items.

---

*A requirements specification for a downstream builder agent. This is not a wireframe — spatial/positional notes are given only where the arrangement is load-bearing for the function being demonstrated. Source: `KE-Debt-Finance-Demo-Moments.md`, cross-referenced against the fuller POV compendium for grounding detail (stakeholder concerns, vocabulary, data provenance).*

---

## 0. What this demo has to prove, in one sentence

The software has to make visible, at every moment, that a deal is moving through a defined spine (**Precedent → Grid → Term Sheet/Commitment Letter → Credit Agreement → Post-Close**) toward accurate closing — and that every AI interaction is pulling the deal forward on that spine, never wandering into open-ended chat. Every screen should answer two questions for whoever's looking at it: *where is this deal right now*, and *what's the single next thing that matters*.

---

## 1. Global requirements (apply across every screen/moment)

### 1.1 Deal Progress System (persistent, always visible)
- A **top-level, global "deal progress" indicator** must be present on every authenticated screen — not just the dashboard. Treat it as chrome, not a page feature.
- Beneath/adjacent to the global bar, render **sub-progress specifically mapped to the five-stage spine**: Precedent → Grid → Term Sheet/Commitment Letter → Credit Agreement → Post-Close. Each stage needs its own visual completion state (not-started / in-progress / needs-review / complete), because the deal doesn't move linearly and a stage can stall on "needs review" without blocking the whole bar from looking healthy.
- The bar must be able to show **looping/re-entry** — Post-Close can send a deal back to Precedent on refinancing. Don't hardcode a one-way progress metaphor; the underlying model is a loop, not a line.
- Where possible, tie a stage's progress percentage to something concrete already in this spec (e.g., Grid stage progress = % of grid terms confirmed vs. flagged vs. undefined) rather than an arbitrary number — this is what makes the bar feel "visceral" rather than decorative.

### 1.2 Ranked Next-Actions Panel (persistent, always visible)
- A dedicated, always-present panel — not buried in a menu — listing the **ranked next most important actions** to move the deal forward. This is not a generic to-do list; it should read as prioritized and urgent (e.g., visually distinct #1 item).
- Each item in this panel needs: what it is, why it matters (one line), which stage of the spine it belongs to, and who it's routed to (Associate / Partner / KM — see personas in §2).
- Items in this panel are the *only* place new work should "appear" from — every moment below (undefined terms, flagged diffs, cross-practice triggers) should resolve into an entry here, not just live silently inside a sub-screen.
- This panel should visibly shrink/reorder as items are resolved, so progress is felt turn-over-turn, not just at the big-bar level.

### 1.3 Constrained AI Chat
- Chat exists, but it is **not open-ended**. Every response must be traceable to one of: the Precedent Bank, the Deal OS record for this deal, or K&E's own source documents (credit agreements, term sheets, grids). No answer should read as generic LLM knowledge.
- Every chat interaction should **terminate in a deal-forward action**, not just information. Practically: answers should end by either (a) updating something in the Next-Actions panel, (b) offering to populate/confirm a grid term, (c) flagging something for partner review, or (d) explicitly stating a boundary ("this is out of scope" / "K&E hasn't defined this — flagging for sign-off") rather than guessing. Chat that just answers-and-stops is out of spec.
- Chat must be able to say, plainly, when it doesn't know something (see §3, Moment B2) rather than produce a confident-sounding guess. This "I don't know, and here's why, and here's who to ask" behavior is a first-class response type, not an error state.
- Every substantive chat claim needs a visible citation back to its source document and location (not just "source: credit agreement" — the specific clause/page/section).

### 1.4 Confidence & Provenance, everywhere extraction happens
- Anywhere a term is auto-populated (grids, summaries, diffs), show a **per-term confidence indicator** and a **citation to the exact source location**. Do not hide confidence behind a hover-only affordance — low confidence should be visually obvious at a glance, because the whole demo's credibility rests on this being honest rather than uniformly reassuring.
- Do not implement a single blanket "confidence: High/Medium/Low" self-report as the *only* signal — real data showed self-reported confidence is close to useless. Favor a structure with at least two distinguishable signals (e.g., "grounded in source" vs. "reviewed as correct/complete"), surfaced separately.

### 1.5 Access & Role Model
- The system must gate what's visible by **persona** (see §2) and, within a persona, by deal-team membership.
- Sponsor identity and deal economics are never shown together to anyone outside the deal team — one or the other, never both. This should be enforced/demonstrable in the UI (e.g., a redacted-field state), not just documented.
- Junior-associate access should visibly be a subset of full associate access — the demo should be able to show the same screen rendering differently by seniority.

### 1.6 Explicit Scope Boundaries
- The system should be able to state its own scope limits out loud (e.g., "fee letters are not currently in extraction scope") as a first-class UI state, not a silent gap. This applies wherever a user's action would otherwise imply a capability that doesn't exist yet.

---

## 2. Personas (needed for login/persona-select and for gating everything above)

Build three selectable personas, each changing what the same screens show:

1. **Associate** (junior/mid) — mechanical work: retrieval, grid population, term sheet vs. credit agreement verification. Needs: fast confirm/correct interactions, visible reasoning/source material (this persona's view should teach, not just output an answer).
2. **Partner** — consumes triaged output, makes judgment calls on ambiguous/high-stakes items only. Needs: short, sorted, high-signal lists — this persona should almost never see raw/unsorted flags.
3. **Knowledge Management / Practice Leadership** (Jill Gautier-type, and above) — owns search today by hand, and owns access-control/sign-off decisions. Needs: a way to absorb search requests as structured queries (not ad hoc asks) and a way to configure/sign off on access-model decisions rather than approve them one-off.

Persona selection should visibly change: what's in the Next-Actions panel, what depth of data is shown, and whether "call the partner" / "flag for KM sign-off" routing options appear.

---

## 3. Screen/workflow requirements, mapped to demo moments

Suggested overall flow (per the moment sequence): **Login/Auth → Persona Select → Dashboard/Open-Matter (Moment A0) → A1 → A2 → B1 → B2 → C1 → E2 → closing moment F1 or F3**. Each moment below should be buildable as a distinct workflow/screen state, not one monolithic view — the builder should be able to demo them independently or in sequence.

Note the source material is explicit that **A0, not A1, is the real opening beat** — the system should present synthesized candidates on matter-open before any query is typed. A1's explicit-search behavior is the fallback path for when nothing auto-matched, not the primary interaction mode. Get this ordering right in the build; presenting A1-style search as the default entry point would misrepresent the product's actual point of view.

### Login / Auth (mocked)
- Simple mocked auth screen — no real security requirement, just needs to exist as a believable entry point before persona select. Should imply enterprise auth (K&E's actual stack uses Azure AD/Intapp ethical-wall gating per program context) without needing to actually implement it.

### Persona Select
- Screen presenting the three personas from §2 as the entry choice, framing what each persona will see/do differently. This choice should persist and visibly reshape the dashboard that follows.

### Dashboard (splash/landing)
- This is the anchor screen combining §1.1 (global + spine progress) and §1.2 (next-actions panel) at high visual priority — these two elements should be the first things visible, above the fold, not scrolled-to.
- Any blocking issues (e.g., an undefined term, an unresolved cross-practice flag) must surface here directly, not require drilling into a sub-screen to discover.
- Opening a matter from this screen is itself a workflow trigger — see Moment A0 immediately below. The dashboard should not present as a blank state waiting for a query; it should already show synthesized output the moment a matter is opened.

### Moment A0 — Open the deal, the blocker is already waiting (true opening beat)
- **Persona:** Associate.
- **Interaction:** user opens a new matter. No query is typed.
- **Required system behavior:** the system has already matched whatever documents already exist in this deal's data room (e.g., a term sheet) against the firm's whole precedent corpus, and on open — with zero user input — shows (a) what's currently blocking progress in plain language (e.g., "no precedent selected yet, grid not started") and (b) a short ranked list of candidate precedents matched against this deal's known characteristics (sponsor, industry, size, lender set, covenant flavor).
- **User action:** review the ranked candidates, drill into one to inspect why it was suggested, and either accept the top match or pick a different one from the list. This is a **selection**, not a search — do not require the user to type anything to get this initial output.
- Treat this as the true landing state of opening any matter — it should feel like the system already did the work, not like a search box waiting to be used. A1 and A2 (below) are the fallback/manual-assist paths for when this automatic match needs a human nudge, not the default mode.
- Ranked candidates shown here should be drawn from real precedent examples (e.g., Medline or KinderCare) rather than placeholder names, since this is the screen a skeptical viewer will judge the product's credibility on first.

### Moment A1 — Natural-language document retrieval ("3 hours → 10 seconds")
- **Persona:** Associate.
- **Interaction:** a free-text/natural-language search box where the user describes a document by characteristics ("engagement letter, Kirkland lead-negotiated with Goldman as arranger, syndicated deal") rather than a filename.
- **System response:** returns the matching document with deal team and date attached *before* the user opens it, so they can confirm relevance without opening the file — this pre-open confirmation is the point of the moment, not incidental.
- Frame this as the sharpest, most literally-evidenced moment — build it first and make it feel fast (near-instant response), since the entire moment's value is the speed contrast against a known 2–3 hour manual baseline.

### Moment A2 — Investigating and confirming a matched precedent
- **Persona:** Associate.
- **Interaction:** continuing directly from A0, the associate opens one of the system's ranked candidates — **KinderCare (Amendment No. 3 to Credit Agreement, 2024)** — to inspect *why* it was suggested (matched sponsor tier, industry, covenant flavor). This must read as investigating a candidate the system already surfaced, not searching from scratch.
- **Manual refinement, still available:** the associate can narrow the shortlist manually (e.g., by a specific lender or tighter industry filter) if the auto-match isn't quite right — this is an adjustment to an existing shortlist, not a fresh search. Don't collapse this into a plain search box; it should feel like refining, not starting over.
- **System response:** associate selects KinderCare and triggers "populate a grid from this precedent" — full population happens in B1; this screen's job is just the handoff from candidate confirmation to grid-building.
- **Entity detail to have on hand for this specific deal** (use exactly, this is what makes the demo credible to a skeptical technical audience): Borrower **KUEHG Corp.**; Holdings **KinderCare Learning Companies, Inc.**; Intermediate Holdings **KC Sub, LLC**; admin agent **Barclays**; lender group **DB, UBS, BofA, Jefferies, KKR, Citizens**; Amendment No. 3 upsized the revolver from **$160M to $240M**.
- **Credibility note to build in:** a Tribe engineer already built a standalone KinderCare term-grid prototype ahead of the real July 14 K&E onsite as a "break-glass credibility proof." The demo can honestly frame this moment as "this isn't hypothetical — this exact grid-population step was already proven on this exact deal," not a simulated capability.
- Should be able to pivot directly into showing that this same precedent touches an unresolved/undefined term (sets up B2) — build the data model so a precedent can carry a flag like this forward into the next moment rather than being a dead-end result.

### Moment B1 — Grid auto-population with visible confidence
- **Persona:** Associate.
- **Interaction:** confirm grid population from the **KinderCare** precedent (continuing from A2); grid fills in with terms.
- **Required states per term:** confidence level + citation to source location (§1.4). High-confidence terms should read as "glanceable"; lower-confidence terms need a distinct visual treatment that invites a check, not a uniform list.
- **Deal-specific detail worth surfacing, not just aggregate stats:** KinderCare's own extraction results are individually documented, not folded only into the aggregate 78%/99% figures — its springing maturity was caught correctly, and because KinderCare is a "conformed" amendment copy (the full agreement as amended through Amendment No. 3), it extracted more easily than expected ("nearly all terms ARE extractable from them"). Surface this as a specific, checkable claim about this exact deal, not just a topline stat — that specificity is part of the credibility case.
- This is where the honest, non-uniform confidence rendering matters most — do not let this screen default to a "looks-done" grid; some rows visibly need attention.

### Moment B2 — The undefined-term state
- **Persona:** Associate (surfacing something Practice Leadership ultimately owns).
- **Interaction:** continuing the same **KinderCare** grid from B1, the user reaches a term the system did not populate with confidence.
- **Required system behavior:** state plainly that this term has never been defined by the firm (not "the system failed" — a firm-definition gap), and route it as a flagged/open item rather than resolving it with a guess.
- This flagged item must appear in the Next-Actions panel (§1.2) and should be assignable/routable toward KM/Practice Leadership sign-off, since that's who owns resolving it.
- Build this as a reusable state, not a one-off screen — any term extraction anywhere in the system should be able to enter this "undefined by the firm" state rather than only ever showing found/not-found.

### Moment C1 — Term Sheet ↔ Credit Agreement diff, triaged
- **Personas:** Associate (produces), Partner (consumes).
- **Interaction:** user brings in a term sheet and its corresponding credit agreement for the same deal; system identifies every divergence.
- **Required triage behavior:** divergences must be automatically (or associate-assisted) split into **business issues** (client-relevant) vs. **legal comments** (internal-only) — this split is the core function being demonstrated, not an optional filter.
- **Partner view:** must show only the short, triaged, sorted list — never the raw flag count. The demo should be able to show the funnel shape explicitly (e.g., a visible "raw flags → attorney-relevant → client-shown" narrowing), since that funnel is itself the evidence of value.

### Moment E2 — Cross-practice notification trigger
- **Personas:** Associate/Partner as recipients; the trigger event originates outside Debt Finance (M&A-side).
- **Interaction:** simulate an M&A-side event (e.g., a confidential IPO filing creating a new legal entity) and show the system independently identifying that this entity is relevant to an existing credit agreement's obligor/guarantor structure.
- **Required system behavior:** auto-route a flagged task to the specific Debt Finance attorney responsible for that credit agreement — this must appear as a new item in that attorney's Next-Actions panel without requiring anyone to have manually noticed the cross-practice connection.
- This is the one moment that must demonstrate reasoning *across* practice areas (not just within Debt Finance's own document set) — the builder should treat this as a distinct data/event source (an "M&A event feed") rather than something living inside Debt Finance's own document set.

### Closing moment — build both, selectable at demo time
Two alternate closing workflows; the presenter should be able to pick one live depending on the room (per the source doc: skeptical-of-automation room vs. technically sophisticated room). Build both as distinct, switchable states rather than picking one.

**Option F1 — Correction becomes a teaching artifact**
- **Personas:** Senior associate (source of a correction), Junior associate (recipient).
- **Interaction:** a correction made earlier in the demo (from B1/B2) is stored with its reasoning attached; later, a junior associate encountering a similar term on a different deal sees that prior correction surfaced as a worked example — not just the right answer, but the senior associate's reasoning.
- This directly answers the training-pipeline concern — the corrected term needs to carry its *reasoning*, not just its final value, forward into future retrieval.

**Option F3 — Scope self-awareness**
- **Persona:** Associate.
- **Interaction:** user attempts to extract/price terms from a fee letter (as opposed to a credit agreement).
- **Required system behavior:** state plainly that fee letters are not currently in extraction scope, and log this as an open scope question rather than returning a partial/misleading result. This reuses the "explicit scope boundary" state from §1.6.

---

## 4. Data model notes for the builder (not UI, but needed to make the above work)

- **Deal spine stage** needs to be a first-class property on every document/term/grid object, not just a dashboard concept — this is what lets the global progress bar aggregate honestly instead of being hand-set.
- **Confidence** and **grounding/citation** should be modeled as two separate fields per extracted term (per §1.4), not one combined score.
- **Undefined-term flag** (B2) needs to be a distinct state from "not found" — the demo's credibility depends on the system being able to say "the firm hasn't told us" versus "we couldn't locate this," and these should never be visually or semantically merged.
- **Next-Actions items** need a source pointer (which moment/module generated them) and a routing target (which persona), so the panel in §1.2 can be genuinely populated by every workflow above rather than hardcoded per-screen.
- **Correction records** (for F1) need to store reasoning text, not just a corrected value, and need to be retrievable by term-similarity across deals, not just within the original deal.
- **Cross-practice events** (E2) should be modeled as an external feed distinct from Debt Finance's own document set, so the demo can visibly show the system reaching outside its "home" data to make the connection.

---

## 5. Optional / reserve moments (build if time allows; not required for MVP sequence)

These two are flagged in the source as reserve material — worth making buildable/toggleable, but they should not block or delay the core A0→A1→A2→B1→B2→C1→E2→closing sequence.

### Moment G1 — J.Crew as the vocabulary-anchor moment
- **Persona:** Associate.
- **Interaction:** while reviewing a grid (e.g., during B1), the system surfaces a related note that this deal's language pattern-matches the "J.Crew Blocker" construct — a real, sourced term in K&E's own extraction schema.
- **Required framing, must be preserved in the build:** the *term* (J.Crew Blocker) is real, sourced K&E vocabulary; the *specific 2014 J.Crew transaction* offered as background is illustrative market context, not a document from K&E's own precedent bank. The UI must keep this distinction explicit — do not let this render as if J.Crew (2014) were pulled from the firm's own archive. This is a credibility/vocabulary beat ("the tool knows why a term is named what it's named"), not a precedent-retrieval result, and should be visually distinguishable from a true Moment A0/A2 precedent match.

### Moment G2 — SunGard as the term-sheet-diff placeholder
- **Persona:** Associate / Partner.
- No separate screen needed — this is a data-sourcing note for Moment C1, not a distinct workflow. SunGard is the working placeholder in C1 because none of the 15 confirmed real K&E deals have a paired term sheet in the source material. Build C1 so the underlying document pair is swappable — if a real K&E-supplied term-sheet-and-credit-agreement pair becomes available later, it should be a data swap, not a rebuild.

### Note — the anchor deal (KinderCare) should be swappable, not hardcoded
KinderCare is the current anchor for A0/A2/B1/B2, but the source material is explicit that it's one of a larger pool of real, K&E-provided credit agreements (all 15 from the Covenant Extraction Spike: ADT, BrightView, Clearwater Analytics, First Watch, Ingram Micro, Karman Holdings, KinderCare, Medline, Ping Identity, SailPoint, StandardAero, Surgery Partners, Thoughtworks, Traeger, ZoomInfo). **Medline** in particular is flagged as a strong alternate anchor — it was the *other* document run live at the July 14 onsite (used for the full deal-spine walkthrough, vs. KinderCare's Post-Close Deep Dive framing). Build the anchor-deal binding as configuration, not a hardcoded value, so the presenter can swap anchors if a different room/sector fits better without a rebuild.

---

## 6. Explicitly out of scope for this demo build

- Real authentication, real Azure AD/Intapp integration — mock only.
- Anonymized market benchmarking, portco-facing compliance view — named as backlogged, not V1, in the source material; don't build them in.
- Fee-letter extraction itself — the correct demo behavior is stating the boundary (F3), not implementing extraction.
- Any single "confidence: High" self-reported score as the *only* signal shown to a user — flagged above as known to be unreliable in practice.
