# K&E Debt Finance — Software POV Resource Compendium

*Compiled 2026-08-02 for Chess Stetson, from a full sweep of Tribe's internal systems (Notion, Google Drive, Slack, Sybill call recordings, Salesforce/CRM) via Glean, Notion, Google Drive, Slack, and Sybill search. Every claim below is tied to a specific internal source and link. Organized debt-finance-first; broader K&E account context is included at the end where it's load-bearing for the POV, clearly separated from Debt Finance-specific material.*

**Last updated: 2026-08-03T04:39:04-0700 · Revision: 3**

**Changelog:**
- Rev 1 — 2026-08-02 — Initial compendium: engagement state, deal spine/vocabulary, stakeholders, literal user stories, validated evidence (extraction spike), pain-point quotes, central tensions, feature backlog, SOW scope evolution (V1→V4), competitive/broader K&E context, gaps, full source index.
- Rev 2 — 2026-08-03 — Added Section 5a (specific deals/precedents named in K&E materials: the 15-deal extraction sample set, onsite walkthrough documents, redacted fee letters, LME blocker vocabulary, unconfirmed names) and Section 5b (field-level extraction schema: per-term and per-row data contracts, full term catalog table, taxonomy mismatch, open navigation decision).
- Rev 3 — 2026-08-03T04:39:04-0700 — Added timestamped "Last updated" + revision counter to this header for downstream freshness checks.

---

## 1. State of the engagement (as of Aug 2, 2026)

- **Deal**: "Kirkland & Ellis - Debt Finance Operating System Expansion," CRM Opportunity ID `006PY00000yvUZtYAM`, Stage "2 - Technical Validation," ~$3.023M ($1.25M + $3.20M), close targeted Aug 7 2026. Owner: Linda Erickson. — [FY26 Roll-Up — Bi-Week of Jul 20, 2026](https://www.notion.so/39f4f38daa20803c9625d00043f7d8db), [GM & Principal Submissions — Bi-Week of Jul 20, 2026](https://www.notion.so/39f4f38daa20809c90bed2b17092bbcb)
- **SOW**: "Kirkland & Ellis — SOW #07 — Debt Finance," four drafts V1 (Jul 3) → V4 (Jul 26, last modified Jul 30), $2,838,000 total, mid-July–Dec 15 2026. — [Google Doc](https://docs.google.com/document/d/1rQBORQYKeP6ydcEyz_eivXjHp6EYNaIl7l7CDc_R5_Q)
- **PM**: Nicolina Nanni, staying on as Debt Finance workstream owner (confirmed in staffing docs below); mandate: "Lead structured discovery sessions with K&E Debt Finance attorneys and pod counterparts to map current deal workflows, identify friction points, and define the highest-leverage DealOS features for this workstream." — [Nicolina Nanni – K&E New Hire Game Plan](https://www.notion.so/3914f38daa208161880cc54556737c9b)
- **Milestones hit**: July 14, 2026 discovery onsite in K&E's NYC office (multiple sessions); July 22–28 covenant-extraction spike (690 extractions across 15 credit agreements).
- **Staffing sizing**: "Debt Finance ≈ 1–2 pods after ~4 weeks of discovery... Debt Finance is the most-shaped SOW (more clarity after early-July client meeting)." Check size floated between $3M–$8M before landing near $3M. — [K&E Staffing @June 10](https://www.notion.so/37b4f38daa2080c0a1c9f2e28f0688d6), [K&E Staffing @June 25](https://www.notion.so/3914f38daa20815393bbe38c02cb4579)
- **Risk flagged internally**: Firm Committee "may favor concentrating firepower on M&A first before layering in Debt Finance" — a live sequencing risk as of late June. — *(Slack, #kirkland-ellis-account, late June 2026 — no direct permalink captured; re-search Slack if you need the exact thread)*

---

## 2. The Debt Finance deal spine (the model the software has to fit)

**Precedent → Grid → Term Sheet / Commitment Letter → Credit Agreement → Post-Close**, looping back to Precedent on refinancing. — [Product: Debt Finance](https://www.notion.so/3994f38daa2080bcbabfd26bf8385180), [SOW #07](https://docs.google.com/document/d/1rQBORQYKeP6ydcEyz_eivXjHp6EYNaIl7l7CDc_R5_Q), [7/14 Onsite — What We Heard — Internal Synthesis](https://www.notion.so/39e4f38daa2081b49419c94b995900e4)

**How it differs from M&A** (this is the crux of why Debt Finance needs its own product logic, not a relabeled M&A workflow):
- The Credit Agreement is lived under for **~7 years**; a purchase agreement lives about six weeks. "The document lives for years and errors are unfixable" — accuracy/defensibility governs over speed. — [SOW #07](https://docs.google.com/document/d/1rQBORQYKeP6ydcEyz_eivXjHp6EYNaIl7l7CDc_R5_Q)
- Debt Finance negotiates with **~5 lenders simultaneously**, not one counterparty — any issues-list/comparison tool needs cross-lender comparison built in. — [Sybill: Post-Close Deep Dive, 2026-07-14](https://app.sybill.ai/conversations/499d9b4b-b4b0-43ab-91fe-7bdaf362467e)
- Judgment concentrates **upstream** — precedent choice, grid-weighting, what's negotiable with a given lender — not in drafting itself. "Most of it is comparing to other deals." — [Slack, #kirkland-ellis-account, June 3 2026 touch-base], [SOW #07](https://docs.google.com/document/d/1rQBORQYKeP6ydcEyz_eivXjHp6EYNaIl7l7CDc_R5_Q)
- Debt Finance explicitly does **not** want the "why" (reasoning/rationale behind a term) captured the way M&A does — they want "every version of this term we've used" (the *what*), not the rationale. This is the opposite of M&A's knowledge-graph framing. — [7/14 Onsite Internal Synthesis](https://www.notion.so/39e4f38daa2081b49419c94b995900e4)
- Refinancing restarts the whole loop — the spine is a loop, not a line. — [7/14 Onsite Internal Synthesis](https://www.notion.so/39e4f38daa2081b49419c94b995900e4)

**Vocabulary (use exactly — K&E lawyers prize linguistic precision):**
- **Precedent** — a prior deal used as the template for a new one, selected by sponsor, deal size/EBITDA, industry, lender set.
- **Grid** — two distinct types: **business grid** (sent to lenders) vs. **comprehensive/internal grid** (kept in-house). Built from a chosen precedent, then updated with lender markups.
- **Term Sheet** — negotiated output, attached to the Commitment Letter.
- **Commitment Letter / Commitment Papers** — 70+ pages, includes Term Sheet as an exhibit.
- **Credit Agreement (CA)** — the long-lived implementation document.
- **Fee Letters** — a *separate* document holding the most sensitive economics (OID, market flex) — NOT inside the Credit Agreement.
- **Flex** — how far a deal moved from its initial terms to its final closed terms; today this history mostly survives only inside the CA once the Grid is abandoned.
- **Issues Grid / List**, **Deal Bank** (new DB tied to MatterClose), **CTRAN** and **KENI** (existing K&E internal data services), **iManage / KE Connect** (existing DMS).
— [Product: Debt Finance](https://www.notion.so/3994f38daa2080bcbabfd26bf8385180) (glossary section), [Debt Finance Onsite Execution Guide V3](https://docs.google.com/document/d/1-WUgPe5Hm9SLiXLiMjvW1FrkKMah2mHNLRFOGUqpju0)

---

## 3. Stakeholders (Debt Finance practice)

| Name | Role | Notes |
|---|---|---|
| **Melissa Hutson** | Share Partner, Global Executive Committee | Economic owner of the Debt Finance lane; champion; wants broad internal access to precedent |
| **Jason Kanner** | Share Partner | More protective of associate workload; ran his own term-sheet consistency pilot |
| **Yuli Wang** | Share Partner | The technical champion — already built a term-sheet↔credit-agreement consistency checker himself (flagged ~200 discrepancies), engaged first with good technical questions in the demo |
| **Ashley Martin** | Income Partner | The clearest skeptical voice on automation — concerned about junior-associate training being hollowed out |
| **Michelle Kilkenney** | Share Partner | Framed the post-close relationship as a ~7-year "ecosystem," distinct from M&A's episodic relationship |
| **Andrea Weintraub** | Share Partner | Raised access-control concerns (not everyone should see everything) alongside Ashley |
| **Judson "Jud" Oswald** | Share Partner | Roster only |
| **Tim Hughes** | Income Partner | AI advocate; countered Ashley: "you're going to have to change how you train them" |
| **Justin Greer, Conor O'Muiri** | Income Partners | Roster only |
| **Jill Gautier** | Knowledge Management | Discovery POC; today's de facto human search engine for precedent requests, no query tool to help her |

— [All K&E Stakeholders](https://www.notion.so/2cb4f38daa20800f811be8c87c0828c4), [Kirkland & Ellis (main account page)](https://www.notion.so/3494f38daa2081e38a8ded2c44caaeac), [Sybill: Welcome, Introductions & Intentions, 2026-07-14](https://app.sybill.ai/conversations/27864f0e-4863-4dbe-a487-4417e4890e6f)

**Tribe side:** Nicolina Nanni (PM, day-to-day owner), Hadley Riegel (account/AE), Carl Mueller (technical/AI engineer), Linda Erickson (account lead, deal owner).

---

## 4. Literal user stories

Source: canonical Notion product doc — [Product: Debt Finance](https://www.notion.so/3994f38daa2080bcbabfd26bf8385180). These are staged, not a flat backlog.

### Stage 1 — Discovery & Workflow Foundation (4 weeks)
- "As Kirkland's schema owner, I help design the term list and data format, so the firm owns how its deals are represented and can change it later."
- "As a Kirkland attorney I review the AI's extracted terms and say what is wrong in plain words, so my corrections become test cases and the system improves without me writing specs."
- "As a practice leader, I sign off on an access model that controls which roles can see which deals and use which features."

### Stage 2 — Dedicated Debt-Finance Workflows (10 weeks)
- "As an associate, I can find prior deals by sponsor, deal size, industry, and lender, so a search that can take hours today takes seconds."
- "As an associate, I can start a grid from a chosen precedent credit agreement, then check and correct the result, so that my time goes to judgment calls instead of manual extraction/copying text." (extracted text cited to source location; human corrections captured as learnings)
- "As an associate, I can combine lender grid responses into one comparison grid..." *(source text is cut off at this point in the Notion doc — worth reopening the page directly to get the rest of this line)*
- "As an associate, I can generate a summary report of a closed deal's credit agreement from the terms extracted, so I do not re-read the document."
- "As a partner, I can compare the term sheet to the credit agreement and see differences flagged for my review."
- "As a junior associate, I see only the data and features my role allows."

### Stage 3 — Integration & Client-Facing (6 weeks)
- "As a Kirkland attorney, I run the Debt Finance workflows inside DealOS."
- "As a sponsor client, I can see the key documents for my closed deals in one place through the Client Portal."

### Success metrics named alongside these stories
Extraction accuracy vs. an agreed test set; coverage (% of priority terms reliably extracted); time-to-retrieve-a-term vs. a manual baseline (measured by watching associates work); acceptance rate (used as-is vs. redone); lateral-attorney ramp time.

---

## 5. Validated evidence — the Covenant Extraction Spike (real numbers, not aspirational)

— [debt-finance-extraction-experiment-executive-summary.md](https://drive.google.com/file/d/1Vux7-9-2F6FOPe2OjmuzsPBCDf5jmNHt), author Nicolina Nanni, run 2026-07-28

- **Setup**: K&E's 46-term priority list run against 15 client-provided example credit agreements → 690 extractions. Three-pass method, all Claude: (1) extraction — value, quote, cited location; (2) grounding-check agent — does the quote exist at the cite, do numbers match; (3) "debt finance expert" review agent — is this the correct/complete provision, attentive to answers spanning multiple locations. Then **100% human review**, 690/690 rows, in a custom eval UI.
- **Results**: 78% of the 586 gradeable rows correct on first pass; **99% correct after the two review passes**; only 8 rows (1.4%) remained wrong (5 where first pass said "not found" and the expert pass located an answer; 3 where a missed provision materially changed the result).
- **104 rows (15%) couldn't be graded at all — this is the actually useful finding.** 90 of those 104 trace to **six terms K&E has never defined**: Xerox, J. Crew, At Home, Anti-Coop, Auto Cure, Collateral/Pledge Voting Limits — each failed on all 15 documents for lack of a definition/pass-fail standard from K&E. Turns "we need more from Kirkland" into a concrete six-item ask.
- **7 terms were clean across all 15 documents**: Date, Fees, Call Protection, Portability, Voting Caps, Snooze-Lose, Non-US Subsidiaries.
- Errors clustered exactly where the Debt Finance team predicted at the July 14 onsite: terms whose answer spans multiple provisions (EBITDA add-backs — 5 of the 8 wrong rows alone, hiding in "deemed quarterly figures" rather than a stated line item — plus buyback mechanics, sweeps, restricted debt payments).
- **Methodology note relevant to product design**: self-reported model confidence was useless (returned "High" uniformly) — dropped in favor of the two-verdict taxonomy (grounding + expert-review) plus a mandatory human gate.
- Difficulty tracks the **term**, not the document — amendment copies performed identically to full agreements.
- Some term definitions live **outside** the Credit Agreement entirely — in a security agreement, an amendment, or in one case a section lost in markdown conversion.
- **Governance note**: K&E's rule that KM shares either economics or deal name, never both, applies to this dataset too — the restricted artifacts here pair them and need a sanitization pass before further circulation.
- **Carry-forwards named**: get the 6 undefined terms defined by K&E; request expected outcomes/pass-fail criteria plus completed grids for the 15 sample deals as exemplars; fold the expert-pass's search-location logic back into the extraction prompt (starting with Financing EBITDA); check prompts into a persistent store so they aren't lost to session state.

---

## 5a. Specific deals and precedents named in K&E materials

Exhaustive list of every specific company/deal name surfaced across the sweep, organized by how confirmed/real each one is.

### The 15 real credit agreements used in the Covenant Extraction Spike
Source: "Debt Finance - First Pass Extraction" scoring workbook — [Google Sheet](https://docs.google.com/spreadsheets/d/1DWgTjusaE3PwuuYcKcZy2q92FK-i3E3cIJa-WIBBJRs); executive summary — [debt-finance-extraction-experiment-executive-summary.md](https://drive.google.com/file/d/1Vux7-9-2F6FOPe2OjmuzsPBCDf5jmNHt). Real, named companies, provided by K&E and converted to markdown for the spike (46 terms × 15 documents = 690 extractions, run 2026-07-24):

| Company | Document type |
|---|---|
| ADT | Full CA (Term Loan A only) |
| BrightView (Amdt 9) | Conformed copy through Amendment No. 9 |
| Clearwater Analytics | Full CA |
| First Watch | Full CA |
| Ingram Micro | Full CA (Term Loan B only) |
| Karman Holdings | Full CA |
| KinderCare (Amdt 3) | Conformed copy through Amendment No. 3 |
| Medline | Full CA |
| Ping Identity | Full CA |
| SailPoint | Full CA (Revolver only) |
| StandardAero | Full CA |
| Surgery Partners | Full CA |
| Thoughtworks | Amended & Restated CA (full) |
| Traeger | Full CA (includes DDTL) |
| ZoomInfo (Amdt 7) | Conformed copy through Amendment No. 7 |

Deal-specific findings: Traeger is the sample's only real delayed-draw term loan; ADT and KinderCare both have springing maturities the extraction caught correctly; Medline has a euro tranche caught cleanly; BrightView/KinderCare/ZoomInfo are all "conformed" amendment copies (full agreement as amended), which made extraction easier than expected — "nearly all terms ARE extractable from them."

### The 2 documents used live in onsite discovery walkthroughs
- **Medline Credit Agreement (10-21-2021, clean)** — anchor document for the full deal-spine walkthrough session.
- **KinderCare — Amendment No. 3 to Credit Agreement (10-10-2024, clean)** — run "off the screen" as the anchor for the Post-Close Deep Dive session ("walk us through what was happening around this one — who called, what did they need, what did answering take?"). Entity detail captured: Borrower **KUEHG Corp.**; Holdings **KinderCare Learning Companies, Inc.**; Intermediate Holdings **KC Sub, LLC**; admin agent **Barclays**; lender group includes **DB, UBS, BofA, Jefferies, KKR, Citizens**. Amendment No. 3 upsized the revolver from $160M to $240M.
- Carl (Tribe engineer) had already built a **KinderCare term-grid prototype**, held in reserve as a "break-glass credibility proof" for the onsite — not a planned agenda item.
— [Debt Finance Onsite Execution Guide V3](https://docs.google.com/document/d/1-WUgPe5Hm9SLiXLiMjvW1FrkKMah2mHNLRFOGUqpju0)

### The 4 redacted/pseudonymized fee letters
Provided as sample documents for the July 14 onsite, but explicitly redacted — codenames and even the lender name are pseudonyms (one fee letter's lender is redacted as **"Uncle Deadly,"** a Muppets character — the giveaway that these aren't real names):
- **Project Bronco** (Fifth Amendment and Incremental Facility Amendment to a First Lien Credit Agreement; borrower entities "Bronco," "Bronco Affiliate," "Bronco Ultimate Parent" — a Cayman Islands exempted company)
- **Lion**
- **Project Eleanor**
- **Dandelion** (borrower entities "Dandelion Finance II LLC," "Dandelion International Finance Company," "Dandelion A/S")

Treat these four as anonymized stand-ins, not real deal names — useful for fee-letter structure, not for identifying actual K&E clients. — [Debt Finance Onsite Execution Guide V3](https://docs.google.com/document/d/1-WUgPe5Hm9SLiXLiMjvW1FrkKMah2mHNLRFOGUqpju0)

### Market-standard covenant "blocker" terms named after famous precedent deals
The extraction spike's Wave 4 term list ("LME Blockers & Voting") names covenant provisions after the market transactions that made them famous — industry-standard shorthand, not K&E's own deals, but constant vocabulary in K&E's priority-term list: **J.Crew**, **Chewy**, **Serta**, **NYDJ**, **At Home**, **PluralSight**, **Xerox** — plus generic mechanics like buybacks, voting caps, snooze-lose, anti-coop, sacred rights, and Excluded Subsidiary provisions. Several of these (Xerox, J.Crew, At Home, Anti-Coop) are among the six terms flagged as undefined/ungradeable in the spike (Section 5). — [Google Sheet](https://docs.google.com/spreadsheets/d/1DWgTjusaE3PwuuYcKcZy2q92FK-i3E3cIJa-WIBBJRs)

### Named design-partner sponsors/portcos referenced for UI testing
**"PPC" and "Olympus"** — named as the pair to test a specific navigation decision against: a separate debt tab vs. the sponsor's single-portco view (see Section 5b). Distinct from the extraction-sample companies above; these appear to be real or near-real design-partner references from the Client Portal program, not sample credit agreements. — [Debt Finance Onsite Execution Guide V3](https://docs.google.com/document/d/1-WUgPe5Hm9SLiXLiMjvW1FrkKMah2mHNLRFOGUqpju0)

### Names that appeared but are NOT confirmed real precedent deals
- **"Acquisition of PetCo Inc."** and **"NaturePak"** — used in the Punchlist purely as illustrative examples of the naming-convention rule ("use banker/common deal names, not internal codenames") — no evidence these are real precedent deals K&E discussed.
- **"Ballis" or "Calder"** — appear in a discovery pre-work question ("what would make partners tell Ballis or Calder this was worth doing?") — read in context as placeholder names for other partners/colleagues, not deal names. Flagged for completeness; low confidence these are deals at all.

### A gap worth knowing about
As of the circulated pre-onsite agenda, an **example Grid document was still requested from K&E and had not yet been received** — meaning Tribe may not yet have a real (or even redacted) Grid to study directly. Worth checking whether it arrived after July 14. — [Debt Finance Onsite Execution Guide V3](https://docs.google.com/document/d/1-WUgPe5Hm9SLiXLiMjvW1FrkKMah2mHNLRFOGUqpju0)

---

## 5b. What should actually show up on screen — the field-level schema

Section 4's user stories and Section 8's feature list describe *pages/tabs* ("there's a Credit Facility tab," "there's a covenant tracker"). This section is one level deeper: the literal field-by-field spec of what populates each screen, pulled from Tribe's actual scoring workbook for the extraction spike.

### The per-row schema for any extracted-term display
Every term shown to an attorney is specified with these fields — this is the concrete data contract behind "As a Kirkland attorney I review the AI's extracted terms and say what is wrong in plain words":

**Definition-time schema** (what K&E specified per term, before extraction): `Category → Term → What to Capture → Expected Format → Where It Lives (citation target) → Notes/Risks`

**Runtime schema** (what populates each row of the actual grid UI): `Document → Doc Type → Category → Term → Extracted Value → Supporting Quote → Cite → Claude Confidence → Claude Notes → Your Verdict (Correct/Partial/Wrong/Missed/Can't grade) → Your Notes`

This means the minimum viable UI for any extracted term is: **the value, the verbatim source quote, a clickable citation, a confidence flag, and a human-correction field** — not just the value alone.

— [Debt Finance - First Pass Extraction (Google Sheet)](https://docs.google.com/spreadsheets/d/1DWgTjusaE3PwuuYcKcZy2q92FK-i3E3cIJa-WIBBJRs)

### The full term catalog (what fields exist, by category)

| Category | Term | What to capture | Expected format | Notes/risks |
|---|---|---|---|---|
| Transaction Overview | Date | 'Dated as of' date; for amendments, capture both amendment date and underlying agreement date | Date(s) | Watch "effective as of" variant (Clearwater) |
| Transaction Overview | Parties | Borrower(s), Holdings, Sponsor, Admin/Collateral Agent, Lead Arrangers, L/C Issuers, Swing Line Lender | Role: name(s) list | Arranger lists sometimes only on cover page/schedules — lost in PDF→MD conversion (Surgery Partners, SailPoint) |
| Transaction Overview | Facilities/Structure | Each facility: type, amount, maturity/tenor, amortization; DDTL draw window/conditions | Per facility: $, tenor, amort % | Consider sub-fields (type/amount/maturity/amort/DDTL) for the grid |
| Transaction Overview | Financing EBITDA | Stated Closing Date/Financing EBITDA figure, if any | $ figure or Not found | Usually NOT stated (1 of 15); often only inferable from grower baskets — needs a policy call on whether inference is grid-acceptable |
| Transaction Overview | Closing Leverage | Stated closing leverage, or flagged extrapolation | Ratio or Not found | Never stated in any of the 15 — extraction = inference |
| Economics | Pricing | Margins per facility: benchmark (SOFR/LIBOR/ABR), spread, floors, step-downs | Benchmark + spread + floor + grid | Highly consistent location; complexity varies (flat vs. multi-level, IPO/ratings step-downs) |
| Economics | Fees | Commitment/ticking, L/C participation & fronting, agent/arranger, upfront/funding fees | List with rates | Agent/arranger amounts ALWAYS in undisclosed fee letters — permanent gap; grid should say "per Fee Letter" |
| Economics | Call Protection | Prepayment premium/soft call: rate, trigger, window | e.g. "1.00% soft call, 6 mo." or None | "None" is reliable/meaningful; watch which date anchors the window in amended deals |
| Incremental | Incremental Capacity | Free-and-clear amount, ratio prong(s), reallocation, voluntary prepayment add-backs | $X + Y% EBITDA; ratio X.XXx by type | Structure varies widely — use sub-fields |
| Incremental | Incremental MFN | MFN threshold (bps), sunset/duration, carve-outs | bps + sunset + carve-outs; "No MFN" valid | Carve-outs often gut the protection — never record the threshold alone |
| Mandatory Prepayments | ECF Sweep | Starting %, leverage step-downs, de minimis floor, dollar-for-dollar credits | 50% stepping to 25%/0% at X.XXx; floor $X | Floors can be large enough to neutralize the sweep entirely |
| Mandatory Prepayments | Asset Sale Sweep | % of Net Proceeds, ratio step-downs, reinvestment rights, thresholds, which dispositions swept | 100% with step-downs; reinvestment 12-18mo | Scope matters as much as the % — some sweeps reach only specific baskets |
| Financial Covenants | Financial Covenant Trigger | Springing vs. maintenance vs. revolver-only-in-benefit vs. cov-lite none; utilization trigger % | Controlled vocabulary + trigger % | Classification is the hard part — recommend a fixed picklist |
| Financial Covenants | Financial Covenant Level | Ratio type/level(s) with step-downs, acquisition step-ups/holidays | X.XXx + steps | Acquisition step-up elections exist |
| Financial Covenants | EBITDA Add-Backs | Cost-savings/synergies cap or uncapped; uncapped layers; unusual items | Cap Y% / Z-mo lookforward, or Uncapped + layers | Cap sometimes lives outside the EBITDA definition itself; uncapped in ~7 of 15 |
| Negative Covenants | Indebtedness | Ratio debt test(s) + level + sublimits; general/free-and-clear basket | greater of $X / Y% EBITDA; ratio X.XXx | Ratio test type varies (leverage-based vs. FCCR) |
| Negative Covenants | Liens | General liens basket; ratio-based lien capacity if any | greater of $X / Y% EBITDA | Extracts cleanly — least problematic covenant in the sample |
| Negative Covenants | Investments | General basket; unlimited ratio prong; UnSub/non-loan-party baskets | greater of $X / Y% EBITDA | STRUCTURAL FLAG: HY-style deals have no standalone covenant — runs through the RP covenant instead |
| Negative Covenants | Restricted Payments | Starter/general basket; unlimited ratio prong; other headline prongs | greater of $X / Y% EBITDA | High-water-mark grower mechanics change what "% of EBITDA" even means |
| Negative Covenants | Restricted Debt Payments | Junior/subordinated debt prepayment basket; unlimited ratio prong | greater of $X / Y% EBITDA | Threshold-scoped regimes exist (e.g. junior debt below $20M entirely outside the covenant) |
| Negative Covenants | Dispositions | FMV requirement, % cash consideration + cap, general basket | 75% cash standard + basket $X | Can be absent entirely; FMV condition occasionally missing |
| Negative Covenants | Affiliate Transactions | De minimis threshold above which arm's-length/fairness applies; key exceptions | $X threshold + exceptions | Location varies deal to deal |
| Negative Covenants | Available Amount / Builder Basket | Starter amount; builder mechanic (50% CNI vs. Retained ECF vs. EBITDA-minus-fixed-charges vs. greatest-of); per-use conditions | Starter $X + builder type + conditions | Highest-variance term in the sample — needs sub-fields |
| Negative Covenants | Reclassification / Stacking | Express rights to reclassify between baskets/ratio prongs; automatic-reclassification variants | Yes/No + operative description | Automatic reclassification on financials delivery is the aggressive variant to flag |
| LME Blockers & Voting | J. Crew Blocker | Restrictions on transferring/licensing material IP to Unrestricted Subsidiaries | Yes/No/Partial + description | Present 11/15; ordinary-course carve-outs weaken it; never labeled — found by pattern |
| LME Blockers & Voting | Chewy Blocker | Guarantor release standard: automatic vs. conditioned on bona fide third-party disposition | Yes/No/Partial + release standard | Requires reading two provisions together |
| LME Blockers & Voting | Serta Blocker | Sacred right requiring affected-lender consent to subordinate liens/payment priority; DIP carve-outs | Yes/No/Partial + exception language | Present 8/15, but 5 of 8 carry a ratable-offer exception permitting uptiers — "Yes" alone misleads |
| LME Blockers & Voting | NYDJ Blocker | Consent threshold to amend pro rata sharing/payment waterfall | Consent standard (all/affected/Required Lenders) | Notable gaps — one deal's sacred right is literally "[reserved]" |
| LME Blockers & Voting | Company Buybacks | Repurchase mechanics: Dutch auction, open market, cancellation, conditions | Short description + caps | Very consistent home; public deals may be company-only |
| LME Blockers & Voting | At Home Blocker | Caps/prohibitions on Investments in Unrestricted Subsidiaries generally, beyond IP | Yes/No/Partial + basket structure | SME DEFINITION NEEDED — most deals graded "Partial" |
| LME Blockers & Voting | PluralSight Blocker | Caps on investments in/transfers to non-guarantor Restricted Subsidiaries | Yes/No/Partial + caps | Same SME pass/fail need as At Home |
| LME Blockers & Voting | Xerox Blocker | UNDEFINED — client terms list includes the label without a definition | — (pending definition) | No distinct provision matched in any of the 15 documents |
| LME Blockers & Voting | Voting Caps | Affiliated Lender purchase caps, Debt Fund Affiliate caps, net-short disenfranchisement, Disqualified Institution regimes | Short description of each cap | Present 14/15; absent only in the one public-company deal |
| LME Blockers & Voting | Snooze-Lose / Snooze-Drag | Deemed consent on non-response within X days; yank-a-bank mandatory assignment | Which mechanic(s) + period | Most deals have yank-a-bank only, not true deemed-consent |
| LME Blockers & Voting | Excluded Subsidiary Definition | Category list (immaterial, non-wholly-owned, CFC/FSHCO, prohibited-by-law, etc.) + breadth flags | Category list + risk flags | Non-wholly-owned prong is the key risk flag — good candidate for automated annotation |
| LME Blockers & Voting | Anti-Coop Provisions | Restrictions on lenders entering cooperation agreements re potential LMEs | Yes/No | 0/15 in this sample, including all 2025 vintages — a reliable negative |
| LME Blockers & Voting | Additional Sacred Lender Voting Rights | Each-affected-lender consent list beyond Serta/NYDJ | List + gaps vs. market | Cross-deal variance is the value here |
| Affirmative Covenants | Financial Reporting | Annual/quarterly deadlines, going-concern carve-outs, compliance certificate, budget requirement | Annual X days / quarterly Y days + flags | Consistent location; outliers extract cleanly |
| Affirmative Covenants | Other Notable Covenants | Anything nonstandard: ratings maintenance, post-closing schedules, sanctions breadth | Free text | Judgment-heavy by design |
| Guarantees & Collateral | Immaterial Subsidiaries | Definition thresholds (% Total Assets/EBITDA/revenues, individual + aggregate) | X% assets / Y% EBITDA | INVERSION TRAP: some deals define "Material Subsidiary" instead |
| Guarantees & Collateral | Non-US Subsidiaries | Foreign sub guarantee/collateral treatment (CFC/FSHCO exclusions, 65% pledge) | Excluded? + pledge % | Structural outlier: one deal has Canadian subs fully guaranteeing the Canadian tranche |
| Guarantees & Collateral | Excluded Assets | Real property mortgage threshold, leasehold exclusion, control agreements/landlord waivers | Real property $X / "all excluded" | CORPUS GAP: 4 of 15 deals define this only in the Security Agreement, not in the corpus provided |
| Guarantees & Collateral | Collateral/Pledge Voting Limits | Limits on pledged voting equity (65% CFC caps), pre/post-default voting rights | Pending SME confirmation | TERMS LIST AMBIGUITY — all extractions flagged Medium confidence for this reason |
| Portability | Portability | Whether Change of Control can occur without EoD/prepayment trigger | No/Yes + test, window, conditions | Reliable including negatives (13/15 No) |
| Events of Default | Equity Cure | Permitted? usage caps, shortfall vs. overcure, proceeds counted as EBITDA | Caps + flags | Consistent mechanics; valuable outliers exist |
| Events of Default | Auto Cure | Deemed-cure regimes: defaults deemed never-continuing once remedied | Yes/No + description | SLEEPER FINDING — present in 10+/15; promote to a first-class grid item |

### A taxonomy mismatch worth resolving before locking any information architecture
The **printed handout** used live at the July 14 onsite (attorneys marked it up by hand as "schema evidence") grouped terms into only **six** top-level categories: **Structure / Pricing / Financial Covenants / Capacity & Baskets / Lender Protections / Reporting**. That does not match the **eleven** categories actually used in the built extraction schema above (Transaction Overview, Economics, Incremental, Mandatory Prepayments, Financial Covenants, Negative Covenants, LME Blockers & Voting, Affirmative Covenants, Guarantees & Collateral, Portability, Events of Default). These two taxonomies have not been reconciled in any material found — worth doing before committing to a screen/tab structure, since it directly determines how many top-level groupings a "Credit Facility" or "Compliance Guide" view needs. — [Debt Finance Onsite Execution Guide V3](https://docs.google.com/document/d/1-WUgPe5Hm9SLiXLiMjvW1FrkKMah2mHNLRFOGUqpju0)

### An open navigation decision
"One navigation idea to test with **PPC and Olympus** [named design partners]: a separate debt tab vs. the sponsor's single-portco view" — i.e., whether Debt Finance content gets its own dedicated tab or is woven into a unified per-sponsor page. Framed as Trevor's literal "walk-away" from the onsite — an open, unresolved layout question, not a made decision. — [Debt Finance Onsite Execution Guide V3](https://docs.google.com/document/d/1-WUgPe5Hm9SLiXLiMjvW1FrkKMah2mHNLRFOGUqpju0)

---

## 6. Direct pain points, in attorneys' own words

All from the July 14, 2026 onsite discovery sessions (Sybill call recordings) unless noted. Speaker attribution is only given where the transcript makes it unambiguous — many quotes below are attributed to "the room" or a named individual only when clearly first-person-referenced in-transcript.

**Precedent retrieval is the confirmed, quantified pain:**
- **"DMS sucks. It's not searchable... I've gotten to the point where I'm back to where I started, where I was storing documents on my hard drive because I couldn't find them. It's terrible."**
- Real anecdote: an attorney emailed colleagues for "a recent syndicated deal for a good but not great sponsor for a good but not great company" — someone had to dig through a personal hard-drive folder and manually send docs to Melissa Hutson.
- Real anecdote: needed an engagement letter Kirkland and Davis Polk had negotiated together with Goldman as lead — **"that should be findable in 10 seconds"** vs. the actual **2-3 hours** it took.
- Jill Gautier is today's de facto human search engine for precedent requests, with no query tool.
— [Sybill: Welcome, Introductions & Intentions](https://app.sybill.ai/conversations/27864f0e-4863-4dbe-a487-4417e4890e6f)

**Grid workflow pain:**
- **Grid reconciliation, named "super time consuming": "we don't always update to a final grid... you have to go back to the credit agreement and verify, okay, was this actually agreed."**
- Desired feature: auto-pull the last 3-4 grids for a sponsor (or similar sponsors/industry) to populate a new grid, filterable by lender subgroup.
— [Sybill: Welcome, Introductions & Intentions](https://app.sybill.ai/conversations/27864f0e-4863-4dbe-a487-4417e4890e6f)

**Post-close operational pain:**
- Compliance-guide pain: a borrowing notice **"embedded in a 150-page exhibit,"** no standalone Word version — associates manually extract it every time. Ask: auto-generate standalone documents for Borrowing Notice, Interest Election Period Notice, Compliance Certificate.
- QA failure named directly: compliance guides sometimes ship with **unedited boilerplate footnotes because nobody proofread them.**
- Real anecdote: an undetected subsidiary name change caused an accidental Event of Default months later.
- Real anecdote: a client confidentially filed for IPO; a new legal entity needed for the credit agreement went undisclosed to Debt Finance for **6 months**, forcing an emergency lender waiver. This is the concrete case for a cross-practice (M&A ↔ Debt Finance) notification trigger.
— [Sybill: Post-Close Deep Dive](https://app.sybill.ai/conversations/499d9b4b-b4b0-43ab-91fe-7bdaf362467e)

**Client-relationship framing:**
- Michelle Kilkenney's framing: Debt Finance's client relationship isn't episodic like M&A — it runs ~7 years, an "ecosystem" — so the platform should make K&E "stickier" throughout that lifecycle, not just at the deal moment.
- **Melissa and Jason: "letting/making us the default depository of clients' finance-related information data will be good enough"** — most PE sponsors have no dedicated system of their own; simple document aggregation is already valuable without heavy AI.
— [Sybill: Post-Close Deep Dive](https://app.sybill.ai/conversations/499d9b4b-b4b0-43ab-91fe-7bdaf362467e), [Sybill: Welcome, Introductions & Intentions](https://app.sybill.ai/conversations/27864f0e-4863-4dbe-a487-4417e4890e6f)

**One narrative-flavor quote worth keeping for any deck:** a client lead compared the debt finance share partner job to **"rewriting fellowship of the rings over and over again — same story, slightly different path each time."** — *(Slack, #kirkland-ellis-account)*

---

## 7. Central tensions (the actual design decisions a POV has to take a position on)

### 7.1 Automation vs. the associate training pipeline — the central tension
Ashley Martin, verbatim: **"I have been very openly concerned about how the imposition of AI is going to affect how we train junior associates... when I'm doing comps... I have a third-year associate that's doing that and learning what those terms are."** Manual grid-building and term extraction **is** how associates learn to reason about covenants — a concrete example given: a junior associate misreading which basket a lender's comment applies to (incremental debt vs. incremental equivalent debt), and correcting that mistake *is* the training. Elsewhere, phrased as: "I want to make sure they [junior associates] are mastering the substance, not just mastering how to use the AI."

Tim Hughes's counter: **"you're going to have to change how you train them."**

This produced the room's self-split of the roadmap into two risk tiers — this is the actual V1 shape the team converged on:
1. **Precedent bank / deal retrieval** — broadly supported, low risk, high value — just build it.
2. **Term extraction / synthesis / recommendation** — caution, guardrails, gated by seniority; for some covenant questions, the answer should literally be **"call the partner."**

— [Sybill: Welcome, Introductions & Intentions](https://app.sybill.ai/conversations/27864f0e-4863-4dbe-a487-4417e4890e6f), [7/14 Onsite Internal Synthesis](https://www.notion.so/39e4f38daa2081b49419c94b995900e4), [Product: Debt Finance](https://www.notion.so/3994f38daa2080bcbabfd26bf8385180)

Tribe's stated answer so far: role-based access controls (already built for M&A) plus mandatory human-in-the-loop review ("we extracted this key term, can you double-check this is correct"). An enablement/L&D track was floated for Sept/Oct (tentative) — explicitly aimed at addressing Ashley's concern directly, on the theory that getting her on board could flip the most skeptical voice into an advocate.

### 7.2 Client self-service vs. relationship control
The Client Portal design work (Section 8 below) specs a self-service **covenant tracker** ("how much restricted payment basket is left?"). But in the actual onsite, partners pushed back hard on self-service for exactly this kind of question:

**Melissa/Michelle: "I would rather they come to us because... I want to know why they're asking it."** A client's one-off covenant question is often diagnostic — one such question revealed a client had missed an audit deadline entirely, something a self-service tool would never have surfaced. Junior client contacts are more comfortable with informal/AI outreach; senior contacts prefer relationship calls. There's also an explicit strategic tension named openly in the room: a portal that makes clients "beholden" to K&E (a form of data lock-in) is a *deliberate* design consideration, not an accident.

This is a real, unresolved conflict between the Punchlist's UX spec and what partners said in discovery — worth resolving explicitly rather than building around it silently. — [Sybill: Post-Close Deep Dive](https://app.sybill.ai/conversations/499d9b4b-b4b0-43ab-91fe-7bdaf362467e), [K&E Feedback Punchlist](https://docs.google.com/document/d/1-mDMfN9wCNx3V4l9gRZGb8-7JvGpdVDBBnfy756meV0)

### 7.3 Fee letters — a likely scope hole
The most sensitive economics — OID, market flex — live in **fee letters**, a document separate from the Credit Agreement. The July 14 onsite raised this explicitly as an open question: is the fee letter in extraction scope at all? Three of four sample fee letters provided were amendment/refi turns recurring across a loan's life. If only credit agreements get parsed (as the extraction spike did), pricing intelligence has a **permanent hole** — and there's also an unresolved question of who's allowed to see fee-letter terms even internally. — [Debt Finance Onsite Execution Guide V3](https://docs.google.com/document/d/1-WUgPe5Hm9SLiXLiMjvW1FrkKMah2mHNLRFOGUqpju0)

### 7.4 Access control — contested, not settled
Melissa wants everyone on the practice to see everything; Ashley and Andrea disagree — not everyone should. The stated K&E norm: for anyone *not* on a deal, sponsor name **or** economics can be shared, never both; associates shouldn't get precedent access until they "pass a bar" of writing grids themselves first. Access should follow the DMS convention (deal-team membership governs visibility), then aggregate for the rest — but junior-associate-specific access remains an open, divided question. — [7/14 Onsite Internal Synthesis](https://www.notion.so/39e4f38daa2081b49419c94b995900e4), [Debt Finance Onsite Execution Guide V3](https://docs.google.com/document/d/1-WUgPe5Hm9SLiXLiMjvW1FrkKMah2mHNLRFOGUqpju0)

### 7.5 What vs. why
Unlike M&A, Debt Finance explicitly said capturing *why* a precedent was chosen (the reasoning/knowledge-graph layer) is **not** a near-term priority — they want *what* terms exist, not the rationale behind them. This directly shaped the SOW's scope demotions (Section 9). — [7/14 Onsite Internal Synthesis](https://www.notion.so/39e4f38daa2081b49419c94b995900e4)

---

## 8. Feature backlog / UX decisions

Source: the Debt Finance design-partner session, compiled as a punchlist — [K&E Feedback Punchlist (Debt Finance)](https://docs.google.com/document/d/1-mDMfN9wCNx3V4l9gRZGb8-7JvGpdVDBBnfy756meV0), owner Natalie Abeysana. Framing note in the source doc: *"this is a separate stream from M&A — debt finance clients have ongoing, week-to-week interaction with K&E long after a deal closes, which shapes nearly every design decision below."*

**Information architecture:**
- No standalone "Compliance Guide" tab — only exists post-closing; replaced by a **Post-Closing landing experience** (next quarterly report due date, current loan parties, current directors/officers, credit agreement + amendment history).
- No standalone "Covenants" tab/label anywhere — every agreement has covenants, it's not Debt-specific; route covenant questions through the existing "Needs Your Input" area.
- Two distinct deal states, **Active** and **Post-Closing**, visibly reflected in the UI.
- Debt Finance must read as **visually co-equal to M&A** throughout — not a secondary or specialist add-on.
- Combined view with cross-cutting filters rather than a hard M&A/Debt toggle; one filter state persists across tabs.
- Open item, not yet scoped: per-deal default view preferences (e.g., capital markets contact defaults to Debt-only).

**Documents:**
- Sub-group by deal stage: grids, commitment papers, credit agreement, ancillary documents.
- Visible distinction between "final" documents (signed commitment letter, term sheet) and "in process" (credit agreement still being negotiated).
- Skip a standalone diligence-report-style view for Debt Finance for now — keep everything inside Documents.
- Document versioning extends to Debt Finance documents, at parity with M&A.

**AI assistant (KAI):**
- A clear "publish" action must gate when a document becomes AI-queryable — drafts should never be visible to the assistant.
- Must account for amendments and "confirmed" agreements — the AI should reflect the current state of an agreement, including published amendments, not just the original.

**Credit Facility tab (portfolio-company page) — the concrete feature list:**
- Dedicated Credit Facility tab, separate from M&A content.
- Surface the credit agreement and key debt documents (commitment papers, credit agreement, term sheet iterations).
- **Credit agreement summary** — plain-language distillation of key terms and baskets — "the primary thing clients need to access without calling K&E."
- **Two reading levels**: sophisticated/defined-terms (capital markets professionals) vs. plain English (GCs, portco finance teams).
- **Compliance guide** — interactive structured covenant view, split into: Negative covenants (debt limits, acquisition restrictions, asset sale rules), Affirmative covenants (financial statement/audit delivery, notice obligations), Maintenance covenants (ratio tests, e.g. debt/EBITDA cap).
- **Covenant tracker** — portco CFO or sponsor logs activity against baskets and sees remaining capacity in real time (e.g. "how much restricted payment basket is left?"). *(See tension 7.2 above — this conflicts with partner sentiment from discovery.)*
- **Calendar view** for affirmative covenant deadlines — quarterly filings, audit delivery, notice obligations.
- **Q&A log** — running history of client questions to the debt team and the answers given, surfaced for reference.

**Active Deal — Debt Finance view:**
- Debt Finance tab/section mirroring the M&A deal view, but debt-specific.
- **Document negotiation timeline**: initial grid → lender markup → K&E proposed revision → term sheet → credit agreement (same version-tracking pattern used for M&A purchase agreements).
- Surface the debt deal team and contacts separately from M&A contacts.

**Portfolio-company entity & guarantor tracking:**
- **Guarantor group/entity list** — always-current list of every entity in the credit agreement's guarantor group; auto-updates on a joinder.
- Ripple tracking: guarantor group → org structure → org doc repository → D&O slates must stay in sync.
- **Joinder workflow tracker** — a checklist for when a portco acquires a new entity and joins it to the credit facility (frequent, and happens without M&A involvement).

**Navigation & access:**
- "Contact your K&E team" panel surfaces both M&A and debt contacts from the same portco page — clients don't want to navigate to two places.
- Role-based access: capital-markets professionals at larger sponsors see debt content without M&A noise; at middle-market sponsors, where one person covers both, everything shows combined without extra navigation.
- Debt documents accessible both from the filtered Credit Facility tab and the full document repository — clients explicitly asked for both modes.
- A closing book for debt financing in the portal at close, parallel to the M&A closing bible.

**Explicitly backlogged, not V1:**
- **Anonymized market benchmarking via KAI** — e.g. "What is the average capital lease basket for industrial companies with EBITDA over $300M?" — flagged as having significant confidentiality/client-sensitivity issues, needs a future roadmap discussion with K&E leadership.
- **Portco-facing compliance view** — a simplified compliance guide for the portfolio company's own finance team (as distinct from the sponsor), turning today's static guides interactive.

---

## 9. SOW scope evolution — what K&E itself validated or rejected

Source: [Kirkland & Ellis — SOW #07 — Debt Finance](https://docs.google.com/document/d/1rQBORQYKeP6ydcEyz_eivXjHp6EYNaIl7l7CDc_R5_Q), tracked across 4 drafts. The *deltas* between drafts are the single best evidence of what K&E actually validated vs. what Tribe assumed going in.

**V1 (July 3, pre-onsite) — original base/expansion/optional structure:**
- *Base scope*: Extraction & Comparison (Extraction Schema); Drafting Spine (Grid → Term Sheet → first-draft Credit Agreement with partner-review checkpoints); Term Sheet↔Credit Agreement Consistency Check; Reporting Summary + Compliance Guide; Client Portal Debt-Finance View.
- *Expansion scope*: Sponsor-Tier Precedent Lookup; Standard-Form Drift Detection; Post-Close Portfolio-Company Surface.
- *Optional scope*: Market-Intelligence Capability (gated on GC ethical-wall guidance); Debt Finance Knowledge Layer.

**V2 (July 17, post-onsite redline) — major resequencing:**
- Framing shifts from "DealOS-equivalent-of-M&A" to **"Precedent Bank and the Workflows It Supports."**
- **Demoted** base → Expansion scope: Compliance Guide and Client Portal Debt-Finance View. Explicit rationale in the doc: *"the practice was clear that near-term post-close value is internal, preserving deal knowledge and continuity for Customer's own team, ahead of any client-facing surface."*
- **Promoted** Expansion → base scope: Sponsor-Tier Precedent Lookup — deal retrieval confirmed as part of the precedent bank, the practice's actual first priority.
- New Expansion items added: **Cross-Practice Coordination** (M&A-side events like entity-name changes, liquidations, confidential filings surfaced as a routed task to the Debt Finance attorney on a related matter) and **Narrative Account History** (running cross-matter account history from extracted terms).
- Access model formalized as **"Guardrails as Designed Scope"** — explicitly "the ask, not an afterthought": follows K&E's DMS conventions, deal-team membership governs visibility, sponsor identity or economics can be shared outside a deal team, never both.

**V3 (July 21) and V4 (July 26, last modified July 30) — reframed again around capacity/scale, restructured into three Stages:**
- **Stage 1 (4 wks, Discovery + Workflow Foundation)**: deep discovery extending the July 14 session; Existing-Systems Review (reuse vs. rebuild); Extraction Schema; **Data Scaffolding for Precedent** (V4 adds: "built so AI applications and agents are first-class consumers of it... state of the art for AI-application integration"); Extraction at Scale (covenant-level); Access and Guardrails.
- **Stage 2 (10 wks, Dedicated Debt-Finance Workflows)**: Precedent Bank + Deal Retrieval (searchable by sponsor/deal size/industry/lender); **Grid Population and Markup Collation** — named explicitly as "the highest-effort manual steps the practice named"; Term Sheet↔Credit Agreement Consistency Check; **Post-Close Reporting Summary** (internal-first, no client surface yet); Role-Based Gating.
- **Stage 3 (6 wks, Firm- and Client-Facing)**: **DealOS Surfacing** (Debt Finance workflows run inside the same platform as M&A, not a parallel tool); **Post-Close Client Experience (Debt Finance)** — V1 client-facing, "initially focused on a post-close document repository"; Hardening/Evaluation/Delivery.
- **Optional Scope, held constant across all versions**: Market-Intelligence Capability (GC-gated); Standard-Form Drift Detection; Deal Lifecycle Client Experience (ongoing visibility from deal initiation through post-close); Debt Finance Knowledge Layer (captures judgment/prediction/reasoning behind chosen terms — explicitly held back until after schema validation).

**Key Challenges named as the problem statement (stable across drafts, could seed epics directly):**
1. Precedent and judgment locked in individuals — lives in partners' heads/email, hard to reuse, transfer, or surface at the point of decision.
2. The document lives for years and errors are unfixable — accuracy/defensibility governs over speed.
3. "What is market" is reachable only by asking around, even though the answer lives in K&E's own precedent and data; standard form quietly drifts from market with no one watching.
4. The post-close relationship runs on memory (email/phone/recall); associate turnover means knowledge loss.
5. *(added V2+)* "How the next generation learns" — manual work is the associates' training ground; careless automation risks a generation that can approve answers without knowing how they were reached. Inverse opportunity: capture how senior lawyers reason and pass it down, so associate readiness is *demonstrated*, not assumed.
6. *(V4 reframe, promoted to lead challenge)* "Deal capacity is constrained by manual work" — finding the right prior deal is an administrative burden (docs spread across DMS/email/personal files); lender responses arrive in inconsistent formats and are consolidated by hand; grids get rebuilt manually in Word/Excel every deal.

**Architecture notes (stable across drafts):** Debt-finance source documents are clean, true PDFs converted from Word (originating Word files often available) — **no diligence step, no OCR problem**, unlike M&A. This is repeatedly used in the SOW to argue the build is more contained than M&A. The engagement reuses the existing DealOS harness (extraction pipelines, eval framework, human-in-the-loop review, consistency checking). Storage substrate (relational vs. graph vs. ontology) is deferred to a joint technical exchange between Tribe's tech lead and K&E's schema owner. K&E's own Credit Agreement corpus is understood to number **in the thousands of agreements.**

**Acceptance criteria (V3/V4, staged):**
- Stage 1: Extraction Schema + Data Scaffolding documented with mutual sign-off; extraction hits an agreed accuracy target on priority terms, measured against a discovery-defined eval set; RBAC model signed off.
- Stage 2: deal retrieval / Grid population tested with real users on real deals; consistency check demonstrated at scale; reporting summary generated from a single extraction; role-based gating operating.
- Stage 3: V1 workflows live inside DealOS; V1 client experience live for designated clients.

---

## 10. Competitive & strategic context specific to Debt Finance

- Debt Finance was evaluating **Olin** (an existing generalized covenant-review tool) as an alternative to building purpose-built with Tribe. Direct sentiment: **"bar is low," "not very happy with them,"** current platform **"requires too many clicks."** Jason Kanner on Olin specifically: **"they don't use it, it doesn't help."**
- **Palantir** was introduced as a competing bidder during the same evaluation window.
- Two explicit strategic drivers named for going custom instead of Olin: **(1) IP ownership** — "if we help Olin build this, do they just turn around and sell it to everyone else?" **(2)** Olin wasn't built around how K&E's Debt Finance team actually works.
- A broader fear named in the room: **debt finance could become a commodity practice** — a defensible technology moat is the open strategic question the whole engagement is trying to answer.
- Debt Finance's problem was explicitly framed as **"traditional gridding/comparison"** as distinct from other legal-tech players (e.g. IFG) that focus on **"automating negotiation processes"** — a useful positioning line: Tribe/K&E's bet is structured-data-and-retrieval-first, not negotiation-automation-first.
- When shown an early mockup, K&E's Innovation team (Chris) responded well to **"trend analysis over time for specific terms/metrics,"** firm-specific data aggregation across matters/lenders, and tools embedded **"in the flow"** rather than a separate interface — direct quote: **"Seeing trends over time is very interesting."**
— *(Slack, #kirkland-ellis-account, April–June 2026 — no direct permalinks captured; re-search Slack for exact threads if needed)*

---

## 11. Broader K&E account context (not Debt-Finance-specific, but directly relevant to the POV)

This section is intentionally separated — these facts shape *how* Debt Finance software should be positioned and built, but they describe the wider K&E account/platform rather than Debt Finance itself.

**The platform Debt Finance extends into:**
- **DealOS** = K&E's single-pane-of-glass for deal execution (matter status, diligence, documents, issues, tasks, time), owned by the firm rather than rented from a vendor. K&E's own systems of record (iManage, Intapp, Exchange) stay put; DealOS orchestrates on top. — [K&E Engagement Overview (Start Here)](https://www.notion.so/37a4f38daa20813abca1fd4e3050efaa), [DealOS Vision deck](https://docs.google.com/presentation/d/1N3HkgL9-Yr8e5VF_jDHU7-aKq3JCznQKyOBtIpX2rBw)
- **Client Portal V1** (HighQ + custom Tribe React) launched June 30, 2026 for 3 PE design partners on M&A; Debt Finance discovery is explicitly framed as "in flight to extend the portal to a second practice area." — [K&E Engagement Overview](https://www.notion.so/37a4f38daa20813abca1fd4e3050efaa)
- **Knowledge Graph** workstream (captures partner judgment/reasoning as structured queryable data) is explicitly **not** how Debt Finance is scoped today — Debt Finance cares about outcomes (the *what*), not reasoning (the *why*), unlike M&A. — [7/14 Onsite Internal Synthesis](https://www.notion.so/39e4f38daa2081b49419c94b995900e4)
- **DealOS Vision deck** positions Debt Finance as **"proof the platform generalizes"** — discovery with design partners complete, building toward pilot; "M&A came first because the pain was sharpest." North star: "The platform carries a second practice as naturally as it carries M&A" (owner: Nicolina Nanni). — [DealOS Vision](https://docs.google.com/presentation/d/1N3HkgL9-Yr8e5VF_jDHU7-aKq3JCznQKyOBtIpX2rBw)
- Governance/trust framing that will apply to any Debt Finance feature: Azure AD auth, Intapp ethical-wall checks before anything surfaces, full audit logging, partner gates on anything client-facing — "AI drafts, attorneys decide." — [DealOS Vision](https://docs.google.com/presentation/d/1N3HkgL9-Yr8e5VF_jDHU7-aKq3JCznQKyOBtIpX2rBw), [K&E SOC2/Compliance Framework](https://www.notion.so/2d84f38daa208018890ecc84f3d6918a)
- K&E's Product-Design intake process (Intake → Prioritized → Validated → Scoped → In Build → Shipped) is the same pipeline Debt Finance feature requests flow through — no bespoke process. — [K&E Product-Design Process](https://www.notion.so/3754f38daa2081aeaf0de4e17e1052c1)

**K&E's own strategic thesis (useful framing language for any POV deck):**
- Clinger (client-side strategic champion), quoted: **"We are not building AI tools. We are building a platform for compounding institutional intelligence... Most firms will subscribe to Harvey and get marginally more efficient. K&E is building DealOS + a knowledge graph + a client portal + an agent layer — a platform that compounds."** — [K&E Account Ramp · Linda Erickson](https://www.notion.so/3894f38daa2081f393a0c8297385ea15)
- Other named AI vendors in K&E's broader portfolio for context/benchmarking: **Harvey**, **Legora** (portal benchmark), **DeepJudge** (precedent-search vendor).

**Tribe's own strategic read on why Debt Finance matters beyond this one account:**
- Tribe's company-wide "Context Engine" platform thesis names **K&E Debt Finance as the flagship proof point**: *"Primary account is K&E debt finance... the same graph has to apply across AP [another account]."* The 12-week experiment described: "Deploy [the context engine] at K&E debt finance, the primary account, adding the SME correction loop. K&E gets its real deliverable on it. Apply the same graph across AP... count what happened [code reuse %]." Bar to invest further: the second account reusing 60%+ of the component unchanged, with quality holding at both. — [Proposal: Tribe Platform, What We Build and How](https://www.notion.so/3a94f38daa2081508537c9978c961695)
- The 5-part loop this proposal describes (Ingest → Extract → Encode → Correct → Refresh) is the generalized version of exactly what the Debt Finance extraction schema and human-correction loop already are — meaning whatever software argument gets made for K&E Debt Finance doubles as the case study for Tribe's broader platform thesis. Worth designing the correction-loop mechanism (SME watches the agent, corrects in plain language, correction becomes a test case, no spec-writing) as an explicitly reusable pattern, not a one-off Debt Finance feature.

**Operating culture notes relevant to any pitch:**
- K&E lawyers prize linguistic precision — use their vocabulary exactly (Section 2 above).
- External K&E communications are email only, never Slack.
- Demos beat decks: **"the May 7 SPM won the room because we showed something working in front of 400 partners."**
— [K&E Account Ramp · Linda Erickson](https://www.notion.so/3894f38daa2081f393a0c8297385ea15)

**Program financials touching Debt Finance (for context, not the focus):**
- GTM tracking named K&E Debt Finance ($3.2M) alongside FIS IBS ($5M) and Koch as the firm's near-term deals to convert as of July 20, 2026. — [GTM Weekly: July 20th](https://www.notion.so/3a24f38daa208058844ecc8cbb6557cd)
- Total 2026 K&E program spend (all practices, not just Debt Finance) tracked against a $19.8M booked ceiling. — *Original Project Plan + Pricing spreadsheet* (internal, not linked here — pricing detail, low relevance to product POV)

**Related but distinct workstream — explicitly NOT part of Debt Finance:**
- An "Enterprise Knowledge Layer" / internal-knowledge-retrieval workstream is being scoped separately (competing internally against McKinsey's "Cortex" architecture). Linda Erickson's framing: **"Debt Finance = near-term close; enterprise knowledge = the long tail."** K&E lacks "a clear, consolidated repository of user stories and requirements for enterprise knowledge work" — a gap Tribe is addressing separately (David Delormer + incoming PM Boris), not through the Debt Finance workstream. Keep these two efforts distinct when building the Debt Finance POV. — [Sybill: Chess / Linda continued K&E context, 2026-07-30](https://app.sybill.ai/conversations/af154895-9b9b-4897-aea0-31b0c74c679f)

---

## 12. Gaps, unresolved questions, and suggested next steps

- **Linear ticket-level backlog** — referenced repeatedly (`linear.app/tribeprojects/project/debt-finance-7128a7ad50fd`) but not reachable through Notion/Drive/Glean search tools used in this sweep. If granular, current tickets are needed, check Linear directly.
- **No real associate-level ground truth yet.** Discovery so far has been supervisor's-eye-view only — Jill Gautier explicitly excluded associates from the July 14 sessions. "2-3 mid-level associate SMEs" were flagged as a to-do (via Melissa Hutson) for real associate-level input; unclear whether this happened.
- **KE Connect training-video library** — a rich library of K&E-internal training videos (junior associate workflows, credit-agreement deep dives, an AI primer Melissa/Jill gave Debt Finance in June) was found inside KE Connect/SharePoint. As of July 31, 2026 there's an open, unresolved question about whether it's ethical to mine this without K&E explicitly handing it over, and how to extract at scale under K&E's **ZDR (zero data retention) policy** (any automated extraction must run fully on K&E's own devices/models). Trevor Noon's read: "ask first... KM generally owns this." — *(Slack, #kirkland-ellis-account, July 31 2026)*
- **Fee letters in/out of scope** — still an open question as of the July 14 onsite (Section 7.3); resolve before committing to any "market intelligence"/pricing feature.
- **Client self-service vs. relationship control** — Section 7.2 is a live contradiction between the Punchlist's UX spec and what partners actually said in discovery; needs an explicit decision, not a default.
- **"What We Heard v2 (Onsite Readback SKELETON)"** — this Drive file turned out to be an **unfilled HTML template** with placeholder brackets, not actual filled content. Useful only for its scope-guardrail rules (e.g., always say "six-week discovery," never "4-6"; never signal delivery commitment on Expansion/Optional scope items in client-facing material). — [link](https://drive.google.com/file/d/1EW9fTyBmT3E9vNHL6KVk_wJ3RVB4BkRw)
- **K&E Onboarding Cheat Sheet** (text version) 404'd during this search — may have moved or been archived. An HTML version was referenced but not independently verified: `https://drive.google.com/file/d/1KMqMuVPOvI1VaM1Ev0DyLPwOSfBkVde1/view`

---

## 13. Full annotated source index (reverse chronological)

*Every document/resource surfaced in this research sweep, newest first by last-modified date. Use this as the master bibliography.*

| Date | Title | Type | Link |
|---|---|---|---|
| 2026-08-02 | Kirkland & Ellis (main account page) | Notion | [link](https://www.notion.so/3494f38daa2081e38a8ded2c44caaeac) |
| 2026-07-31 | K&E Engagement Overview (Start Here) | Notion | [link](https://www.notion.so/37a4f38daa20813abca1fd4e3050efaa) |
| 2026-07-31 | Product: Debt Finance | Notion | [link](https://www.notion.so/3994f38daa2080bcbabfd26bf8385180) |
| 2026-07-31 | Weekly Email Updates - K+E | Notion | [link](https://www.notion.so/2844f38daa2080a4a808de3711783565) |
| 2026-07-30 | Kirkland & Ellis — SOW #07 — Debt Finance (V4, last modified) | Google Doc | [link](https://docs.google.com/document/d/1rQBORQYKeP6ydcEyz_eivXjHp6EYNaIl7l7CDc_R5_Q) |
| 2026-07-30 | Chess / Linda continued K&E context | Sybill call | [link](https://app.sybill.ai/conversations/af154895-9b9b-4897-aea0-31b0c74c679f) |
| 2026-07-30 | Proposal: Tribe Platform, What We Build and How | Notion | [link](https://www.notion.so/3a94f38daa2081508537c9978c961695) |
| 2026-07-28 | debt-finance-extraction-experiment-executive-summary.md (Covenant Extraction Spike) | Drive (md) | [link](https://drive.google.com/file/d/1Vux7-9-2F6FOPe2OjmuzsPBCDf5jmNHt) |
| 2026-07-27 | K&E - Enterprise Program Delivery Dashboard | Notion | [link](https://www.notion.so/2cb4f38daa2081c9a9cdf559fe6eca9e) |
| 2026-07-27 | FY26 Roll-Up — Bi-Week of Jul 20, 2026 | Notion | [link](https://www.notion.so/39f4f38daa20803c9625d00043f7d8db) |
| 2026-07-27 | GM & Principal Submissions — Bi-Week of Jul 20, 2026 | Notion | [link](https://www.notion.so/39f4f38daa20809c90bed2b17092bbcb) |
| 2026-07-23 | DealOS Vision (17-slide deck) | Google Slides | [link](https://docs.google.com/presentation/d/1N3HkgL9-Yr8e5VF_jDHU7-aKq3JCznQKyOBtIpX2rBw) |
| 2026-07-22 (call), 07-23 (indexed) | K&E<>Tribe biweekly Innovation sync | Sybill call | [link](https://app.sybill.ai/conversations/be9ae704-56af-4834-90cb-07dcc44caf86) |
| 2026-07-21 | K&E Enablement | Notion | [link](https://www.notion.so/3604f38daa2080429a5dca49f2289074) |
| 2026-07-20 | GTM Weekly: July 20th | Notion | [link](https://www.notion.so/3a24f38daa208058844ecc8cbb6557cd) |
| 2026-07-16 | 7/14 Debt Finance Onsite — What We Heard — Internal Synthesis | Notion | [link](https://www.notion.so/39e4f38daa2081b49419c94b995900e4) |
| 2026-07-16 | K&E SOC2/Compliance Framework | Notion | [link](https://www.notion.so/2d84f38daa208018890ecc84f3d6918a) |
| 2026-07-14, 13:29–16:50 UTC | Sybill: Welcome, Introductions & Intentions (onsite kickoff) | Sybill call | [link](https://app.sybill.ai/conversations/27864f0e-4863-4dbe-a487-4417e4890e6f) |
| 2026-07-14, 15:29–16:49 UTC | Sybill: Post-Close Deep Dive | Sybill call | [link](https://app.sybill.ai/conversations/499d9b4b-b4b0-43ab-91fe-7bdaf362467e) |
| 2026-07-14, 20:14–21:02 UTC | Sybill: Synthesis & V1 Hypotheses | Sybill call | [link](https://app.sybill.ai/conversations/6e163a5f-9a6a-4477-90ff-571bd474235b) |
| 2026-07-14 | 2026-07-14 Debt Finance Onsite - Execution Guide Facilitator V3 | Google Doc | [link](https://docs.google.com/document/d/1-WUgPe5Hm9SLiXLiMjvW1FrkKMah2mHNLRFOGUqpju0) |
| 2026-07-13 | 2026-07 Debt Finance — What We Heard v2 (Onsite Readback SKELETON) — *unfilled template, see Section 12* | Drive (html) | [link](https://drive.google.com/file/d/1EW9fTyBmT3E9vNHL6KVk_wJ3RVB4BkRw) |
| 2026-07-13 | Execution Guide V3 (duplicate HTML render of the doc above) | Drive (html) | [link](https://drive.google.com/file/d/11s5HlBSQtSmYIzDnIwwXLg7OvQJsKZTp) |
| 2026-07-13 | GTM Weekly: July 13th | Notion | [link](https://www.notion.so/39c4f38daa2080fa892de68bb1190b12) |
| 2026-07-09 (call 07-08) | K&E Debt Finance Workshop Prep | Sybill call | [link](https://app.sybill.ai/conversations/facc8202-f7b6-45b2-af0c-5bcaae2ec26b) |
| 2026-07-06 | Nicolina Nanni - Kirkland & Ellis New Hire Game Plan | Notion | [link](https://www.notion.so/3914f38daa208161880cc54556737c9b) |
| 2026-07-02 | K&E Staffing @June 25, 2026 | Notion | [link](https://www.notion.so/3914f38daa20815393bbe38c02cb4579) |
| 2026-07-01 | K&E Account Ramp · Linda Erickson | Notion | [link](https://www.notion.so/3894f38daa2081f393a0c8297385ea15) |
| 2026-06-29 | Governance & Operating Model [WIP for Phase 2] | Notion | [link](https://www.notion.so/2cb4f38daa2081e9af67df90af7f4a96) |
| 2026-06-18 (created 06-08) | K&E Feedback Punchlist (Debt Finance) | Google Doc | [link](https://docs.google.com/document/d/1-mDMfN9wCNx3V4l9gRZGb8-7JvGpdVDBBnfy756meV0) |
| 2026-06-17 | K&E Staffing @June 10, 2026 | Notion | [link](https://www.notion.so/37b4f38daa2080c0a1c9f2e28f0688d6) |
| 2026-06-16 | K&E Product-Design Process | Notion | [link](https://www.notion.so/3754f38daa2081aeaf0de4e17e1052c1) |
| 2026-07-03 (created 05-22) | K&E Onboarding Cheat Sheet · text version — *404'd during this sweep, may have moved* | Notion | [link](https://www.notion.so/3684f38daa2081d28074de404a8b38fd) |
| 2026-05-01 | K&E Technical Quality Standards [WIP] | Notion | [link](https://www.notion.so/3534f38daa2080b2aad5db04149184de) |
| 2026-04-21 | Kirkland & Ellis (page created) | Notion | *(see main account page above)* |
| 2026-04-19/18 | DRAFT/Tribe Weekly Reflections - 2026-04-17/18 | Notion | [4/18](https://www.notion.so/3464f38daa2081cdb69cf2717bd7a21c) · [4/18 draft](https://www.notion.so/3464f38daa2081619f01e74eb9e1e121) · [4/17 draft](https://www.notion.so/3474f38daa2081acba6ded0b8659230a) |
| 2026-04-13 | K&E Reporting (central hub) | Notion | [link](https://www.notion.so/3274f38daa20803393f7e9c12e6b5c6b) |
| — | All K&E Stakeholders | Notion | [link](https://www.notion.so/2cb4f38daa20800f811be8c87c0828c4) |
| — | Original Project Plan + Pricing - K&E Expansion ($19.8M Rollup) | Google Sheets | [link](https://docs.google.com/spreadsheets/d/19Rml--j5-uLnWS9SjnzKkoV_-26AE7XCgD9kg9rgaNs) |
| — | Debt Finance Linear Project (ticket-level backlog — not reachable via search tools) | Linear | `linear.app/tribeprojects/project/debt-finance-7128a7ad50fd` |
| — | #kirkland-ellis-account channel history (Olin/Palantir eval, mockup feedback, ZDR/KE Connect question) | Slack | *(no direct permalinks captured — re-search Slack if exact threads are needed)* |
| — | Salesforce Opportunity 006PY00000yvUZtYAM | Salesforce/CRM | *(referenced in Notion roll-ups above; not directly linked)* |

---

*End of compendium. Ping me if you want this turned into a slide-ready narrative, want the Linear backlog pulled in, or want any single source reopened for the parts that were truncated in search snippets (especially the cut-off user story in Section 4, Stage 2).*
