# K&E Debt Finance Demo — Moment Sequence (v3.1)

*Demo script draft. Assumes the Precedent Bank (the Debt-Finance-facing surface of Tribe's Context Engine) is already populated and running in the background — every moment below shows interaction with it, not its construction.*

*v3.1 — added J.Crew back in as an optional reserve moment (G1) at the end, since it was displaced from A2 by the KinderCare swap but still has real, sourced vocabulary behind it (the J.Crew Blocker term). Also added a G2 placeholder note explaining SunGard's continued use in C1.*
*v3 — replaced the placeholder classic-PE-deal picks (J.Crew, SunGard) in A2/B1/B2 with KinderCare, one of the 15 real credit agreements K&E itself provided for the Covenant Extraction Spike (Section 5a of the resource compendium) and one of only two documents actually used live in the July 14 onsite walkthroughs. C1 still uses a placeholder (see its updated source note) because none of the 15 confirmed real deals have a paired term sheet in the source material.*
*v2 — added Moment A0 and the Choice / New Information / System-Initiated tagging; reframed A1/A2/C1 around synthesis-first interaction rather than query-first. v1 was the initial six-moment sequence (A1 → A2 → B1 → B2 → C1 → E2 → closing).*

**Sequence:** A0 → A1 → A2 → B1 → B2 → C1 → E2 → (F1 or F3, room-dependent)

---

## Archetype overview

Before the moments, three archetypes recur throughout. Keeping the software's job for each one tight up front so we don't re-litigate it inside every moment below.

**The Associate** (junior/mid-level) — does the mechanical work: finding precedent, populating grids, checking term sheets against credit agreements. The software's job for this archetype is to take retrieval and first-pass extraction off their plate entirely, and turn manual verification into a fast confirm/correct motion — while keeping enough visible reasoning and source material that the work still teaches, rather than replaces, judgment.

**The Partner** — doesn't do the mechanical work, consumes triaged output and makes calls on ambiguous or high-stakes questions. The software's job for this archetype is to compress hundreds of raw flags into a short, sorted list, surface exactly the items that need a human judgment call, and stay invisible on everything routine.

**Knowledge Management / Practice Leadership** (Jill Gautier-type role, and above her) — currently *is* the search function, by hand, and separately owns governance decisions about who can see what. The software's job for this archetype is to absorb the search burden and turn access-control decisions into something they configure and sign off on, rather than something enforced ad hoc.

### A note on what the associate is actually doing in each moment

It's tempting to frame this software as a chat/search box the associate queries. That's the wrong default. The Precedent Bank already has the firm's whole precedent corpus, and it already has whatever's sitting in this deal's own data room or DMS folder (a term sheet, a draft credit agreement) the moment the matter is opened. So in most moments, the system has already done the synthesis — matched the new deal's documents against precedent — before the associate does anything. The associate's real job is usually to **choose**: confirm a match, approve a population, pick from a ranked shortlist, or override with something better. That's a fundamentally lower-effort action than "describe what you want in your own words," and it's worth being explicit about which is happening in each moment below.

Each moment is tagged with one of:
- **Choice** — the system already synthesized candidates from data it already has; the associate selects, confirms, drills in, or overrides.
- **New information** — the associate is supplying something the system didn't already have (a document not yet in the data room, a plain-language correction, a judgment call only a human can make).
- **System-initiated** — the software surfaces something proactively, with no associate action required to trigger it.

---

## Moment A0 — Open the deal, the blocker is already waiting (true opening beat)

**Archetype:** Associate

**Input type:** Choice (system-initiated synthesis; associate reviews and picks)

**What the software does for this archetype (recap):** does the synthesis before being asked — matching whatever's already in this deal's data room against the firm's whole precedent corpus — so the associate opens the matter to a decision, not a blank search box.

**Expected actions:**
1. Associate opens a new matter. The deal's own documents that already exist — e.g. a term sheet sitting in the data room — are already visible to the system.
2. Without any query being typed, the dashboard already shows what's blocking progress (e.g. "no precedent selected yet, grid not started") and a short ranked list of candidate precedents the system matched against this deal's known characteristics (sponsor, industry, size, lender set, covenant flavor).
3. Associate reviews the ranked candidates, drills into one to inspect it, and either accepts the top match or picks a different one from the list.

**Why this moment:** this is the real opening beat, not A1. It reframes the software from "a smarter search box" to "a system that already did the work" — the associate's job is choosing, not describing. It also sets up A1 and A2 correctly as variations for when the system's automatic match needs a manual assist, rather than the default mode of interaction.

**Source justification:** the underlying capability is the same **Sponsor-Tier Precedent Lookup**, promoted from Expansion to base scope in [SOW #07](https://docs.google.com/document/d/1rQBORQYKeP6ydcEyz_eivXjHp6EYNaIl7l7CDc_R5_Q) V2, and the same Stage 2 user story from [Product: Debt Finance](https://www.notion.so/3994f38daa2080bcbabfd26bf8385180) cited below. The framing of the deal spine as something the software should synthesize proactively — rather than wait to be asked — follows from the SOW V4 language on **Data Scaffolding for Precedent**, described as *"built so AI applications and agents are first-class consumers of it"* (Section 9). Note: the specific "blocker surfaced on open" interaction is our own design inference from that scaffolding language, not a literally quoted K&E feature request — worth flagging in the room as the product's own point of view on how the data should be used, not a verbatim client ask. The ranked candidates the dashboard would realistically surface are drawn from K&E's own actual precedent set — e.g. **Medline** or **KinderCare**, two of the 15 real credit agreements K&E itself provided for the Covenant Extraction Spike, not invented names (Section 5a of the resource compendium).

---

## Moment A1 — The 3-hour → 10-second moment (explicit lookup, when nothing auto-matched)

**Archetype:** Associate

**Input type:** New information (associate supplies a description the system doesn't already have a document-based match for)

**What the software does for this archetype (recap):** removes retrieval as a bottleneck even when the system had nothing to synthesize from automatically — e.g. finding a document that isn't a "precedent" in the deal-spine sense (an old engagement letter), so there's no deal-characteristics match to compute in advance.

**Expected actions:**
1. Associate describes what they need in their own words — not a document name, a description of the deal ("engagement letter, Kirkland lead-negotiated with Goldman as arranger, syndicated deal").
2. Precedent Bank identifies this as a document-retrieval intent and returns the matching engagement letter.
3. Result includes the deal team and date attached, so the associate can confirm it's the right document without opening it first.

**Why this moment:** direct restaging of the real, quoted K&E anecdote — *"that should be findable in 10 seconds"* vs. the 2–3 hours it actually took. No invented data required; this is the strongest, most literally evidenced moment in the whole set. Worth being explicit in the room that this is the *fallback* mode — an explicit ask for something the system had no reason to have pre-matched — not the primary way associates are expected to interact with the tool; A0 is.

**Source justification:** the "findable in 10 seconds" quote and the engagement-letter anecdote (Kirkland + Davis Polk, Goldman as lead) come directly from [Sybill: Welcome, Introductions & Intentions, 2026-07-14](https://app.sybill.ai/conversations/27864f0e-4863-4dbe-a487-4417e4890e6f). Jill Gautier's role as today's de facto human search engine, with no query tool, is documented in the same call and repeated in the [All K&E Stakeholders](https://www.notion.so/2cb4f38daa20800f811be8c87c0828c4) roster. The underlying user story — *"As an associate, I can find prior deals by sponsor, deal size, industry, and lender, so a search that can take hours today takes seconds"* — is from [Product: Debt Finance](https://www.notion.so/3994f38daa2080bcbabfd26bf8385180), Stage 2.

---

## Moment A2 — Investigating and confirming a matched precedent

**Archetype:** Associate

**Input type:** Choice, with optional manual refinement (adjusting a system-generated shortlist, not building a search from nothing)

**What the software does for this archetype (recap):** lets the associate go from "the system suggested this" to "I've confirmed this is right and I'm ready to build from it" — investigating a candidate rather than re-describing the deal from scratch.

**Expected actions:**
1. Continuing from A0, associate opens one of the system's ranked candidates — **KinderCare (Amendment No. 3 to Credit Agreement, 2024)** — to inspect why it was suggested (matched sponsor tier, industry, covenant flavor).
2. Associate can still refine the match manually if the auto-surfaced candidates aren't quite right — e.g. narrowing by a specific lender or tightening the industry filter — but this is an adjustment to an existing shortlist, not a search built from nothing.
3. Associate selects KinderCare and chooses to populate a grid from it.
4. Grid begins filling from that precedent's credit agreement (full population is Moment B1 — here we're just establishing the handoff from candidate confirmation to grid).

**Why this moment:** demonstrates that manual refinement is still available when the automatic match isn't quite right, without falling back to the "describe everything from scratch" mode. KinderCare is also a stronger pick than a generic precedent for a second reason: Carl, a Tribe engineer, already built a standalone KinderCare term-grid prototype ahead of the July 14 onsite as a "break-glass credibility proof." This moment can honestly say: this isn't hypothetical — someone on the team already proved the grid-population step works on this exact real deal.

**Source justification:** the search-by-characteristics user story ("sponsor, deal size, industry, and lender") is the same [Product: Debt Finance](https://www.notion.so/3994f38daa2080bcbabfd26bf8385180) Stage 2 story cited in A1. The promotion of this exact capability — named **Sponsor-Tier Precedent Lookup** — from Expansion scope to base scope between SOW V1 and V2, with the explicit rationale that deal retrieval is "the practice's actual first priority," is documented in [SOW #07 — Debt Finance](https://docs.google.com/document/d/1rQBORQYKeP6ydcEyz_eivXjHp6EYNaIl7l7CDc_R5_Q). KinderCare itself is real, confirmed, and richly documented: it's one of the 15 credit agreements K&E provided for the Covenant Extraction Spike, and — more specifically — the **Amendment No. 3 to Credit Agreement (10-10-2024, clean)** was one of only two documents run live in the actual July 14 onsite discovery walkthroughs, used as the anchor for the Post-Close Deep Dive session. Entity detail (Borrower KUEHG Corp.; Holdings KinderCare Learning Companies, Inc.; Intermediate Holdings KC Sub, LLC; admin agent Barclays; lender group DB, UBS, BofA, Jefferies, KKR, Citizens; Amendment No. 3 upsizing the revolver from $160M to $240M) and Carl's pre-built term-grid prototype are both documented in Section 5a of the resource compendium, sourced to the [Debt Finance Onsite Execution Guide V3](https://docs.google.com/document/d/1-WUgPe5Hm9SLiXLiMjvW1FrkKMah2mHNLRFOGUqpju0).

---

## Moment B1 — Grid auto-population with visible confidence

**Archetype:** Associate

**Input type:** Choice (system populates from the selected precedent; associate scans and accepts/flags)

**What the software does for this archetype (recap):** turns manual term-by-term extraction into a review-and-correct motion, with confidence and source shown rather than hidden.

**Expected actions:**
1. Associate confirms grid population from the KinderCare precedent (continuing from A2).
2. Terms populate with a per-term confidence indicator and a citation back to the source location in the document.
3. Associate scans the grid — high-confidence terms need only a glance; anything visually flagged as lower-confidence draws attention and invites a check.

**Why this moment:** this is where the extraction spike's real numbers belong — 78% correct on first pass, 99% after review. Show that honestly rather than presenting a uniformly confident grid; the credibility of the whole demo rests on this moment not overclaiming. KinderCare specifically strengthens this beat: its extraction results are individually documented, not just folded into the aggregate 78%/99% — the spike's write-up notes KinderCare's springing maturity was caught correctly, and that KinderCare (as a "conformed" amendment copy — the full agreement as amended) made extraction easier than expected, with "nearly all terms ARE extractable from them." That's a specific, checkable claim about this exact deal, not just a topline stat.

**Source justification:** the 78%-correct-first-pass / 99%-correct-after-review numbers, the per-term citation-to-source-location method, and the finding that self-reported model confidence was "useless" (returned "High" uniformly, dropped in favor of a two-verdict grounding + expert-review structure) all come from [debt-finance-extraction-experiment-executive-summary.md](https://drive.google.com/file/d/1Vux7-9-2F6FOPe2OjmuzsPBCDf5jmNHt) (the Covenant Extraction Spike, 690 extractions / 15 credit agreements, run by Nicolina Nanni, 2026-07-28). KinderCare's specific results — the correctly-caught springing maturity, and its status as a conformed amendment copy that extracted more easily than a full agreement — are documented in Section 5a of the resource compendium, sourced to the same executive summary and the [Google Sheet scoring workbook](https://docs.google.com/spreadsheets/d/1DWgTjusaE3PwuuYcKcZy2q92FK-i3E3cIJa-WIBBJRs). The underlying user story — *"As an associate, I can start a grid from a chosen precedent credit agreement, then check and correct the result"* — is from [Product: Debt Finance](https://www.notion.so/3994f38daa2080bcbabfd26bf8385180), Stage 2.

---

## Moment B2 — The undefined-term moment

**Archetype:** Associate (surfacing something Practice Leadership ultimately owns)

**Input type:** System-initiated (the tool flags the gap without being asked); resolving it requires New information from the firm, not just a choice

**What the software does for this archetype (recap):** distinguishes "wrong" from "the firm has never told us what the right answer looks like" — and says so plainly instead of guessing.

**Expected actions:**
1. Continuing the same KinderCare grid from B1, associate reaches a term the tool has not populated with confidence — e.g. Auto Cure or Collateral/Pledge Voting Limits.
2. Instead of a guess, the tool states plainly that K&E has never defined a pass/fail standard for this term and flags it for firm sign-off.
3. This can be logged or routed as an open item rather than resolved in the moment.

**Why this moment:** the single best trust-building beat in the sequence. A system that visibly knows what it doesn't know reads as more credible to a skeptical room than one that's confidently correct 100% of the time — and it turns the extraction spike's single most useful real finding (six undefined terms, not a model failure) directly into the demo. These six terms failed to grade on all 15 real credit agreements in the sample, KinderCare included — so this isn't a gap invented for the demo, it's the same gap the real spike hit on this exact document.

**Source justification:** the six undefined terms (Xerox, J. Crew, At Home, Anti-Coop, Auto Cure, Collateral/Pledge Voting Limits), the finding that 90 of 104 ungradeable rows trace to these six, and the framing that this "turns a vague 'we need more from Kirkland' into a concrete six-item ask" are all directly from [debt-finance-extraction-experiment-executive-summary.md](https://drive.google.com/file/d/1Vux7-9-2F6FOPe2OjmuzsPBCDf5jmNHt). That KinderCare was one of the 15 documents these terms were tested against (and failed to grade on) is documented in Section 5a of the resource compendium. The practice-leader sign-off angle connects to the user story *"As a practice leader, I sign off on an access model that controls which roles can see which deals and use which features"* in [Product: Debt Finance](https://www.notion.so/3994f38daa2080bcbabfd26bf8385180), Stage 1.

---

## Moment C1 — Term sheet ↔ Credit Agreement diff, triaged

**Archetype:** Associate (produces it) and Partner (consumes it)

**Input type:** New information at the front end (associate supplies the term sheet, if not already in the data room), then Choice for the rest (system computes the diff and triage; associate/partner confirm or re-sort)

**What the software does for each archetype (recap):** for the associate, replaces manual side-by-side comparison with an automatic diff; for the partner, replaces a wall of raw flags with a short, sorted list they can actually act on.

**Expected actions:**
1. If the term sheet and its corresponding credit agreement for this deal are already in the data room, the diff is already computed by the time the associate opens the comparison view — no upload needed. If either document isn't yet in the system (e.g. a credit agreement draft that just came in from the other side), the associate supplies it. Demo choice here: **SunGard**, already referenced as the "upside" case study rather than a failure case.
2. Tool identifies the document types and surfaces every divergence between the two.
3. Associate (or the tool automatically) sorts divergences into business issues (client-relevant) versus legal comments (internal-only).
4. Partner receives the short, triaged list — not the raw flag count.

**Why this moment:** the strongest evidentiary anchor in the whole demo. Yuli Wang, a Share Partner and the technical champion, already built his own version of this by hand and flagged ~200 discrepancies. Jason Kanner's own pilot triage ratio (roughly 300 raw → 50 attorney-relevant → 10 client-shown) is the target shape to land near. This moment says: we built, at scale, what your own most technical partner already proved was worth building.

**Source justification:** Yuli Wang's self-built term-sheet↔credit-agreement consistency checker and the ~200-discrepancy figure are documented in [All K&E Stakeholders](https://www.notion.so/2cb4f38daa20800f811be8c87c0828c4) and referenced again in the [Sybill: Welcome, Introductions & Intentions](https://app.sybill.ai/conversations/27864f0e-4863-4dbe-a487-4417e4890e6f) call. Jason Kanner's own pilot triage ratio (~300 raw → 50 attorney-relevant → 10 client-shown) is documented in the [K&E Feedback Punchlist (Debt Finance)](https://docs.google.com/document/d/1-mDMfN9wCNx3V4l9gRZGb8-7JvGpdVDBBnfy756meV0) and repeated in the SOW's feature-backlog framing. The underlying user story — *"As a partner, I can compare the term sheet to the credit agreement and see differences flagged for my review"* — is from [Product: Debt Finance](https://www.notion.so/3994f38daa2080bcbabfd26bf8385180), Stage 2. **SunGard remains a placeholder, unlike A2/B1/B2's KinderCare swap:** none of the 15 confirmed real deals in Section 5a of the resource compendium (ADT, BrightView, Clearwater Analytics, First Watch, Ingram Micro, Karman Holdings, KinderCare, Medline, Ping Identity, SailPoint, StandardAero, Surgery Partners, Thoughtworks, Traeger, ZoomInfo) has a paired term sheet in the source material — they're all Credit Agreements only (Section 5a explicitly notes an example Grid document was still outstanding from K&E as of the pre-onsite agenda, and no term sheet is mentioned for any of the 15). So there's currently no real, K&E-confirmed term-sheet-plus-credit-agreement pair to substitute in. If K&E supplies one, swap it in here; until then, flag SunGard in the room as illustrative rather than a K&E-named deal.

---

## Moment E2 — Cross-practice notification trigger

**Archetype:** Associate / Partner (as recipients), with the trigger originating from an M&A-side event

**Input type:** System-initiated (no associate action required to trigger it; associate/partner then make a Choice about how to respond)

**What the software does for this archetype (recap):** watches for events outside the Debt Finance team's normal view — happening in a different practice area entirely — and routes anything that could quietly create a covenant or disclosure problem to the right person, before it becomes one.

**Expected actions:**
1. An M&A-side event occurs on a related matter for the same client — e.g. a confidential IPO filing that creates a new legal entity.
2. The tool identifies that this entity is relevant to an existing credit agreement's obligor/guarantor structure.
3. It routes a flagged task to the Debt Finance attorney responsible for that credit agreement, rather than requiring anyone to notice the connection manually.

**Why this moment:** directly answers a real, named incident — a confidential IPO filing left a new legal entity undisclosed to Debt Finance for six months, forcing an emergency lender waiver. This is the best "no one has built this yet" moment in the sequence: it's Expansion scope in the SOW, not shipped anywhere, and it demonstrates the software reasoning *across* practice areas rather than only within Debt Finance's own document set.

**Source justification:** both real anecdotes behind this moment — the undetected subsidiary name change causing an accidental Event of Default, and the confidential IPO filing that left a new legal entity undisclosed to Debt Finance for six months, forcing an emergency lender waiver — come from [Sybill: Post-Close Deep Dive, 2026-07-14](https://app.sybill.ai/conversations/499d9b4b-b4b0-43ab-91fe-7bdaf362467e). The feature itself — **Cross-Practice Coordination**, routing M&A-side events like entity-name changes and confidential filings as tasks to the relevant Debt Finance attorney — was added as new Expansion-scope in [SOW #07 V2](https://docs.google.com/document/d/1rQBORQYKeP6ydcEyz_eivXjHp6EYNaIl7l7CDc_R5_Q), confirming it is scoped-but-unbuilt rather than shipped.

---

## Closing moment (choose one based on the room)

### Option F1 — Correction becomes a teaching artifact (better for a partner-skeptical room)

**Archetype:** Senior associate (as correction source) and Junior associate (as recipient)

**Input type:** New information from the senior associate (the original correction, back in B2); System-initiated resurfacing for the junior associate; Choice for the junior associate (accept the worked example or investigate further)

**What the software does for this archetype (recap):** treats a correction not as a one-time fix but as reusable teaching material — directly answering the concern that automation could hollow out how junior associates learn.

**Expected actions:**
1. A senior associate's correction from earlier in the demo (e.g. from B1/B2) is stored with its reasoning attached.
2. A junior associate later encounters the same or a similar term on a different deal.
3. The tool surfaces the prior correction as a worked example — showing not just the right answer, but how a senior associate reasoned to it.

**Why this moment:** directly answers the training-pipeline objection (manual grid-building is how associates learn) by making the tool part of the teaching process rather than a shortcut around it.

**Source justification:** Ashley Martin's verbatim concern — *"I have been very openly concerned about how the imposition of AI is going to affect how we train junior associates... when I'm doing comps... I have a third-year associate that's doing that and learning what those terms are"* — and Tim Hughes's direct counter, *"you're going to have to change how you train them,"* are both from [Sybill: Welcome, Introductions & Intentions, 2026-07-14](https://app.sybill.ai/conversations/27864f0e-4863-4dbe-a487-4417e4890e6f). The resulting two-tier roadmap split (precedent bank = low-risk/broad access; term extraction/synthesis = gated by seniority, human-in-the-loop, some questions route to "call the partner") is documented in both that call and the [7/14 Onsite Internal Synthesis](https://www.notion.so/39e4f38daa2081b49419c94b995900e4).

### Option F3 — Scope self-awareness (better for a technically sophisticated room)

**Archetype:** Associate

**Input type:** New information attempted (associate tries to pull terms from a document type outside current scope); System response is a stated limitation, not a Choice

**What the software does for this archetype (recap):** states its own scope boundaries plainly rather than quietly producing an incomplete answer.

**Expected actions:**
1. Associate attempts to price or extract terms from a fee letter (as opposed to a credit agreement).
2. Tool states that fee letters are not currently in extraction scope, and flags this as an open question rather than returning a partial or misleading result.

**Why this moment:** counterintuitively strengthens credibility — a system that names its own gaps lands better with a sophisticated audience than one that stays silent about them.

**Source justification:** the fee-letter scope gap — that the most sensitive economics (OID, market flex) live in fee letters, a document separate from the credit agreement, and that the July 14 onsite raised this explicitly as an open, unresolved question — is documented in the [Debt Finance Onsite Execution Guide V3](https://docs.google.com/document/d/1-WUgPe5Hm9SLiXLiMjvW1FrkKMah2mHNLRFOGUqpju0). That the Covenant Extraction Spike only sampled credit agreements, not fee letters, leaving this a "permanent hole" if unaddressed, is noted in the same source and echoed in [debt-finance-extraction-experiment-executive-summary.md](https://drive.google.com/file/d/1Vux7-9-2F6FOPe2OjmuzsPBCDf5jmNHt).

---

*Moments held in reserve beyond this sequence (precedent search variants by lender behavior and by concept, basket quantification, access-control visibility, standard-form drift detection, market-intelligence trend view, and the continuous end-to-end flow) are documented in the prior chat thread and can be pulled forward if the room wants more depth in a particular area.*

*Other real deals available if variety is wanted, or if a different room reacts better to a different sector: the full 15-deal Covenant Extraction Spike sample also includes ADT, BrightView, Clearwater Analytics, First Watch, Ingram Micro, Karman Holdings, Medline, Ping Identity, SailPoint, StandardAero, Surgery Partners, Thoughtworks, Traeger, and ZoomInfo (Section 5a of the resource compendium). Medline in particular is a strong alternate anchor to KinderCare — it was the other document run live in the July 14 onsite, used as the anchor for the full deal-spine walkthrough — and could replace KinderCare in A2/B1/B2 if a different narrative fits better.

---

## Optional moment — G1: J.Crew as the vocabulary-anchor moment (illustrative, not a K&E-confirmed deal)

**Archetype:** Associate

**Input type:** Choice (surfaced as a related-precedent suggestion, not queried directly)

J.Crew was the precedent used in A2/B1/B2 in earlier drafts of this sequence, before being swapped for KinderCare (a real, K&E-confirmed deal — see v3 changelog above). It's worth keeping in reserve rather than dropping entirely, because "J.Crew" isn't purely invented: **J. Crew Blocker** is real, current vocabulary in K&E's own extraction schema (Section 5b of the resource compendium — present in 11/15 of the real sample deals, "found by pattern" since it's never explicitly labeled in the documents themselves). The deal named J.Crew (2014) itself — the actual 2014 transaction where Nordstrom's-style IP was moved to an unrestricted subsidiary, the maneuver the blocker term is named after — is our own illustrative addition, not a document K&E supplied.

**Expected actions:**
1. While reviewing a grid (e.g. the KinderCare grid from B1), the tool surfaces a related note: "this deal's IP-transfer language pattern-matches the J.Crew Blocker construct."
2. Associate can optionally pull up the *named* precedent transaction (J.Crew, 2014) as background — not because it's in the firm's own precedent bank, but because it's the market event the vocabulary itself refers to.
3. This is framed to the room as "here's where this term's *name* comes from," not "here's a deal in your archive."

**Why this moment:** it's a good vocabulary/credibility beat — it shows the tool knows *why* a covenant construct is called what it's called, which reads as sophistication to a room of lawyers who use this shorthand daily. But it must be introduced carefully: presenting J.Crew (2014) as if it were pulled from K&E's own precedent bank would overstate what the research actually supports. Keep the distinction explicit in the room: the *term* is real and sourced; the *specific 2014 transaction* is illustrative market context, not a K&E document.

**Source justification:** J. Crew Blocker's presence in 11/15 real sample deals, and the fact that it's "never labeled — found by pattern" (i.e. K&E's documents don't use the term "J.Crew" themselves), is documented in Section 5b of the resource compendium. J.Crew's separate appearance as one of the six terms K&E has never formally *defined* a pass/fail standard for (Section 5) is a related but distinct fact — worth not conflating the two in the room. The 2014 J.Crew transaction itself is well-known market history, not sourced to any Tribe/K&E internal document.

---

## Optional moment — G2: SunGard as the term-sheet-diff illustration (already in use, flagged here for completeness)

**Archetype:** Associate / Partner

SunGard remains the working choice for Moment C1 (Section C1's source justification explains why: none of the 15 confirmed real K&E deals have a paired term sheet in the source material to substitute in). It's listed here mainly as a placeholder marker — if a real K&E-supplied term-sheet-and-credit-agreement pair becomes available, retire this reserve entry and update C1 directly rather than adding a parallel moment.
