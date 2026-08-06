# OOB Agentic SaaS vs. Tribe — Live Explainer Demo Script (v3)

A ~4-minute core demo of the `npm-intex-030` explainer, plus an **Extras** section at the end for backup material — additional matters, deeper technical framing, and answers to likely follow-up questions. Only the Core Demo is meant to be performed live; Extras is reference material to have open in case the conversation goes somewhere specific.

**Lead matter:** Financing EBITDA (the portfolio-analytics SaaS matter). It's the biggest, cleanest reveal — a first-pass "not found," corrected by an exact arithmetic identity that's sitting in the document itself. It's the safest possible opener because the punchline isn't a legal judgment call anyone could push back on; it's four numbers that add up to a fifth number, verifiably, in the text. Nothing to relitigate.

**Second matter:** Open Market Purchases. This is where the closed feedback loop lives — confirming the gap creates a durable, firm-wide fact, and the rerun shows it firing on a second deal with no re-analysis. It's also low-risk in the same way: the gap it names is the industry's own well-known "Serta issue," not a proprietary claim about this specific document.

---

## Core Demo (~4 minutes)

### 0:00 — Open with the value statement, before the app is even up

**Say:**
> What we'd like to preview for you is some features of the kind of state-of-the-art system that's bespoke and customizable to K&E's own workflows, owned end-to-end by K&E, and that starts paying off on real matters in the near term while compounding in value over time through its own feedback loops. That's what protects — and grows — K&E's own value proposition, its corpus of precedent, in a way that stays fully in your control, not locked inside someone else's platform.

**Say:**
> And to be clear up front: we're not committing to one particular technical approach here. What you're about to see is illustrative — it's us showing you how we'd think about this problem smartly, not a spec for exactly what ships.

**Action:** Load the app. Splash modal is up.

**Say:**
> Even though this is live software, we thought that rather than showing you a traditional UI/UX demo, we'd run an explainer that contrasts what you might expect from a plain-vanilla, out-of-the-box AI product — the kind you'd get from a conventional pipeline or SaaS provider — with the K&E-first product you can expect from Tribe.

**Action:** Hover, then click "Try it out."

---

### 0:20 — Choose a matter

**Say:**
> We'll start by selecting a PE deal, or matter.

**Action:** Hover, then click the right arrow once or twice to cycle a card or two, then land on Matter 2 of 9 (the portfolio-analytics SaaS credit agreement, flagged term: Financing EBITDA).

**Say:**
> Each of these is a real matter from a review Tribe already ran — automated extraction, paired with expert human review on our side. What we're showing is the kind of improved accuracy you can expect from a bespoke Tribe solution. But what we want out of an interactive exercise like this is the kind of expert feedback that ensures the final product will be absolute best-in-class. That feedback is the point of doing this interactively rather than just showing you slides.

**Action:** Hover, then click "Open this matter →."

---

### 0:50 — Workflow: open the Grid, tap the flagged term

**Say:**
> Let's use the Workflow view here — the goal is for it to feel this intuitive and tap-through-simple, not like a chat window. This is the actual workflow your associates would be sitting in.

**Action:** Hover, then click "Workflow."

**Say:**
> This is considered to be from the matter's Grid — three terms already reviewed and confirmed, and one flagged for review: Financing EBITDA.

**Action:** Hover, then click the "Financing EBITDA" row.

**Say:**
> Here's what a plug-and-play, out-of-the-box AI tool would have extracted for this term — and it's a reasonable-sounding answer. It just happens to be wrong.

**Action:** Hover, then click "Compare against Tribe's scaffold →."

---

### 1:20 — The reveal

**Say:**
> On the left, the out-of-the-box side says "not found" — there's no line item literally called Financing EBITDA, so it stops there. On the right, Tribe's side traversed the document differently: it found four separate hard-coded quarterly figures buried in the tail of a completely different definition, added them up, and got exactly two hundred thirteen million five hundred thousand dollars — which is also this deal's own fixed incremental-debt prong, stated a few sections later. That's not an assertion. That's arithmetic, sitting right there in the text, that a keyword search was never going to connect.

**Action:** Let the scale note render; give it a beat.

**Say:**
> And to be clear about where this comes from: this is a real pattern from a review Tribe ran across fifteen K&E credit agreements — this exact shape, a figure that only exists as the sum of scattered numbers, was the single largest source of extraction errors in that whole review. So when we say "invite your experts to push on this," we mean it — we'd genuinely rather find out now if we've got something wrong than after this is in production.
>
> Worth naming: this is the difference between a simple agent harness bolted onto a search index, and a system that's actually schema-aware — Tribe traversed the document differently because it was built to understand this kind of provision, not just to search for the phrase.

---

### 2:00 — Change matter, second gap

**Action:** Hover, then click "Ask another question" to reset, then "Try it out" again.

**Say:**
> Now let's look at a different kind of gap — not something the out-of-the-box tool got wrong, but something nobody has written down at all yet.

**Action:** Cycle the deal picker to Matter 8 of 9 (the aircraft-engine-MRO credit agreement, flagged term: Open Market Purchases). Hover, then click "Open this matter →."

**Say:**
> This time let's just ask it directly.

**Action:** Hover, then click "Ask" (the question is already filled in).

---

### 2:20 — The gap, named instead of guessed

**Say:**
> The left side answers confidently — yes, open market purchases are permitted — and never mentions anything unusual. The right side finds the same provision, but also notices that "open market purchase" itself is never actually defined anywhere in this document. That's the same undefined-term risk the market has called the Serta issue since 2020 — not a claim about this firm's judgment, just an observable fact about the drafting. Across the same fifteen-deal review, K&E hasn't set a firm-specific standard for this term in almost any of them — most deals just fall back on baseline industry convention instead.

**Action:** Hover, then click "Set the firm-wide standard for 'open market purchase' →."

**Say:**
> This is the closed feedback loop. That click didn't just note an opinion — it created a real fact, with an author, a scope, and a source citation, sitting in a shared scaffold now.

---

### 2:50 — Compounding

**Action:** Hover, then click "Run this same question on a second deal →."

**Say:**
> Same question, a second, unrelated deal. The left side has no memory of anything we just did — it makes the identical miss. The right side catches it immediately, citing the exact standard we just set, with no re-analysis. That's really the whole business case in one motion: pay once to close a gap, and it compounds — deal forty is cheap because deal one already built the structure deal forty needed. That's the self-improving part: it's not us updating a model, it's your own attorneys' judgment accumulating in a scaffold you own.

---

### 3:20 — Wrap

**Say:**
> One more thing worth naming — the underlying techniques — narrowing to the relevant passage before extracting, forcing everything into one fixed schema before comparing — are infrastructure Tribe already built and validated on debt finance itself, and half of it is directly reused from work we did on the M&A side of the firm. The piece that we're exploring here that's new is the precedent index, where we likewise expect to get industry-leading accuracy.

**Say:**
> So what I've shown here was bespoke and customizable to your workflows, and owned end-to-end by K&E: every fact it ever surfaces has a citation, every correction your attorneys make becomes durable, and none of it lives anywhere but in a scaffold that's yours. It pays for itself on real matters now, and it compounds — the corpus of precedent that's already your firm's edge gets more valuable every time someone uses this, instead of sitting still.

**Action:** Hold on the split screen; end here.

---

## Extras — backup material, not performed live unless asked

### Quick index

**Priority order, if you only have time for a couple of backups:** Matter 7 (Liens — shared/stacked baskets) is the must-include of the group, since Kirkland has specifically flagged stacked/shared baskets as a known gotcha. Matters 3 (MFN) and 4 (EBITDA Add-Backs) are both strong alternates — any of the three works, since all three are stronger apples-to-apples comparisons than the two "blocker" gaps, hinging on a checkable fact rather than a firm judgment call.

| # | Matter | Flagged term | Kind | The one-line hook |
|---|---|---|---|---|
| 7 ★★ must-include | Aerospace-components deal | Liens (shared/stacked baskets) | Miss | Two lien baskets look additive; a tail provision lets the borrower reclassify and stack one on top of the other at its own discretion. |
| 3 ★ | Childcare-sector deal (Amendment No. 3) | Incremental MFN | Miss | A second, identical MFN is hidden inside a different definition — and the sunset date means neither one is actually live anymore. |
| 4 ★ | Commercial-landscaping-services deal | EBITDA Add-Backs | Miss | Confirming "no cap" on the add-back clause you found is correct *and* incomplete — a second, independently-drafted uncapped channel sits in a totally separate definition. |
| 1 | KinderCare — Amendment No. 3 | J.Crew-style trapdoor | Gap | Stacked investment baskets + an unrestricted-sub mechanic + an IP carve-out create the same structural path at issue in the 2014 J.Crew deal — real in the document, not yet firm-flagged. |
| 5 | Healthcare-products distribution deal | Asset Sale Sweep | Miss | A nearby mention of "Casualty Events" reads like confirmation that casualty proceeds are swept — they're not; the actual trigger's defined term excludes them. |
| 6 | Security-and-alarm-monitoring deal | Restricted Debt Payments | Miss | The dollar baskets are extracted correctly and the practical answer is still wrong, because the covered-debt definition is narrower than it looks — junior-lien debt isn't actually restricted at all. |
| 9 | A new deal — term not yet in the schema | New/unseen term handling | Gap | Ties directly to Jill's own Stage-1 question: should new terms be auto-picked-up, or does a schema owner confirm them first? Tribe routes rather than guesses either way. |

*(Matters 2 and 8 are the two performed in the Core Demo.)*

---

### Backup walkthroughs — full Action/Say plan for each

Each one assumes you're starting from the split screen or the splash. General setup for all of them:

**Setup Action:** Hover, then click "Ask another question" (or "Change matter" if you're already inside a matter) → "Try it out" if needed → cycle the deal picker to the matter number below → hover, then click "Open this matter →."

---

#### Matter 1 — KinderCare, J.Crew-style trapdoor (Gap · ~45s)

**Action:** Open Matter 1 of 9. Mode: Ask (question is prefilled) → hover, click "Ask."

**Say:**
> This one opens on KinderCare — real entity detail, a real facility amount. The out-of-the-box side reads the investment baskets and the unrestricted-subsidiary mechanic individually and calls it standard market language — no flag at all. Tribe's side traces those same two baskets stacking together with an IP carve-out, and recognizes that combination as the same structural path at issue in the 2014 J.Crew transaction — real in this document, just not yet something the firm has formally flagged.

**Action:** Hover, then click "Confirm this is a J.Crew-style blocker →."

**Say:**
> Confirming writes a firm-wide definition — any future deal with this same basket-stacking pattern gets flagged automatically from here on.

**Action (optional, if time):** Hover, then click "Run this same question on a second deal →."

**Say:**
> Same pattern, a second deal — Karman Holdings — and Tribe catches it instantly this time, no re-analysis.

---

#### Matter 3 — Childcare-sector deal, Incremental MFN (Miss · ~30s)

**Action:** Open Matter 3 of 9. Mode: Ask → click "Ask."

**Say:**
> The out-of-the-box side finds a real MFN and describes it accurately — fifty basis points, twelve-month sunset. It's just not the whole story. Tribe's side finds an identical second MFN hiding inside a totally different definition, and — this is the sharper point — notices the sunset clock already ran out before this amendment was even signed. So the real answer isn't "yes, one MFN" — it's "there were two, and neither is live anymore."

---

#### Matter 4 — Commercial-landscaping deal, EBITDA Add-Backs (Miss · ~30s)

**Action:** Open Matter 4 of 9. Mode: Workflow, to show the Grid once more if you haven't already → tap the flagged row → "Compare against Tribe's scaffold →."

**Say:**
> Here the out-of-the-box tool actually gets the specific clause right — it correctly confirms no cap on that clause. The problem is there's a second, completely separate add-back channel sitting in a different definition, with its own realizability window and its own ten-million-dollar skip election. Being right about the clause you found, and being right about the deal's real add-back exposure, turn out to be two different questions.

---

#### Matter 5 — Healthcare-products distribution deal, Asset Sale Sweep (Miss · ~30s)

**Action:** Open Matter 5 of 9. Mode: Ask → click "Ask."

**Say:**
> This is the one where the out-of-the-box tool actually says yes when the real answer is no. It sees "Casualty Events" mentioned right next to the sweep provision and assumes that means casualty proceeds are covered. Tribe traces the actual operative trigger — a defined term called "Disposition" — and finds that term specifically excludes casualty events. The nearby mention is a leftover reference, not the real rule.

---

#### Matter 6 — Security-and-alarm-monitoring deal, Restricted Debt Payments (Miss · ~30s)

**Action:** Open Matter 6 of 9. Mode: Ask → click "Ask."

**Say:**
> The baskets here are extracted correctly, dollar for dollar. The miss is scope: the covenant only actually covers subordinated debt, not junior-lien debt the way the question implies. So junior-lien payments are actually unrestricted — the baskets that look like they're gating them never apply to that debt in the first place.

---

#### Matter 7 — Aerospace-components deal, Liens (Miss · ~30s)

**Action:** Open Matter 7 of 9. Mode: Ask → click "Ask."

**Say:**
> Both lien baskets are found correctly, and the natural assumption is you just add them together for total capacity. Tribe finds a tail provision, well past either basket, that lets the borrower reclassify and stack one basket on top of the other at its own discretion — so the real ceiling on secured capacity is higher than simple addition, and isn't even a fixed number.

---

#### Matter 9 — New deal, term outside the schema (Gap · ~45s)

**Action:** Open Matter 9 of 9. Mode: Workflow → hover, click "Workflow."

**Say:**
> This is the one that answers Jill's own Stage-1 question directly: what happens when a term shows up that isn't yet in the schema at all? Notice this matter's grid doesn't even show a normal highlighted row for it — it's a dashed "flag this unrecognized term" affordance instead.

**Action:** Hover, then click "Flag this unrecognized term," then "Route to schema owner →" (this submits and opens the split screen).

**Say:**
> The out-of-the-box side would happily answer this from general drafting knowledge anyway — that's the hallucination risk, since it's not grounded in this deal's actual file. Tribe's side declines to guess and flags it instead.

**Action:** In the split screen, hover, then click "Add this term to the firm schema →."

**Say:**
> Confirming adds it to the schema with an initial extraction hypothesis, not a guessed answer — so it's ready, not risky, the next time it shows up. This is also the "customizable" piece — the schema itself isn't fixed; it grows to match how K&E actually defines and extracts terms, so the extraction gets more bespoke to your own workflows over time, not more generic.

---

### If asked: "What assumptions are baked into each side?"

**OOB (vanilla) side:**
- Assumes retrieval-then-extract is sufficient on its own — chunk the document, retrieve the top-k passages closest to the question, answer from whatever's in them. No schema, no normalization step, nothing connecting one passage to another.
- Assumes a single pass is the final answer — there's no attorney-in-the-loop correction step, and no mechanism to durably record a correction even if one is made in the moment.
- Assumes each question is independent — with no scaffold, nothing learned on one deal or one question ever carries forward to the next.

**Tribe side:**
- Assumes retrieval-then-extract is necessary but not sufficient — it's the first stage, but every extracted item then gets normalized into one fixed schema (the firm's term catalog) before it's usable. That normalization step is what lets the system notice that two differently-worded provisions are actually the same defined concept, or that a figure buried in one definition's tail is the same number a different definition depends on.
- Assumes corrections are data, not just conversation — every confirm/correct action an attorney takes is captured as a typed, cited assertion in a shared scaffold, not a one-off answer that evaporates after the session.
- Assumes the shared scaffold, not any single document, is the unit of memory — once a fact is set, it's checked against every future deal automatically, which is why the rerun needs no re-analysis.

**Honest scope note:** two of these three techniques — retrieval-then-extract, and schema-first normalization — are infrastructure Tribe already built and validated (on Debt Finance itself, and reused in part from M&A). The third, the persistent cross-matter precedent index, is the genuinely new piece being built here — flagged as new rather than presented as already proven.

### If asked: "Is this real data?"

Deal names are anonymized to industry (per K&E's own "never pair deal name with economics" rule from the July onsite) — but every figure, citation, and structural fact is real, drawn from a three-pass extraction review Tribe ran across all fifteen K&E credit agreements provided for the Covenant Extraction Spike.

### If asked: "Does it matter whether I use Ask or Workflow?"

No — they're two different presentational paths into the exact same resolved case. Workflow mimics how an associate would actually navigate the app (open the deal, tap the flagged term); Ask is the fast path for typing a question directly. Either one lands on the identical answer for a given matter — the point is that the answer doesn't change based on how you got there.

### If asked: "How does this scale across other practice areas?" (full technical version)

Tribe's real edge is efficiently and accurately building the structured, cited data that AI needs to reason over dense legal documents — and reusing that infrastructure across practice areas is the platform bet.

- **Retrieval-then-extract** — narrow to the relevant passage first, then extract with a citation. Ports cleanly, no difference: already built as infrastructure and already validated on Debt Finance itself via the Covenant Extraction Spike.
- **Normalize-then-diff** — force every source into one fixed schema before comparing. The schema-first extraction half transfers directly from M&A's Enricher pattern, just re-pointed at a different term catalog. What doesn't transfer: M&A never had to reconcile one document against another (it clusters similar documents by counterparty; it doesn't diff a Grid against a Term Sheet against a Credit Agreement) — so the actual diff/alignment logic is new, built for Debt Finance specifically.
- **Indexed similarity search** — the genuine gap. M&A's clustering solves a one-time, same-matter disambiguation problem, computed once. Debt Finance needs a persistent, cross-matter index queried repeatedly as new deals come in, over time. There's no M&A equivalent to lift — this is a new system, not a reused pattern.

One-line summary if pressed for time: two of three techniques inherit real, working infrastructure from M&A — one fully, one half; the third, precedent retrieval, is a new capability Debt Finance requires that M&A's architecture never had to solve.

### If asked: "What happens if I disagree with one of these?"

That's exactly the "Is this extraction right?" thumbs control on every term in Workflow mode, and the confirm step on every undefined-term gap — both are real product surfaces for an attorney to correct something, not just decorative. In the full DF Docket product, that correction becomes a durable fact the same way confirming a gap does here.
