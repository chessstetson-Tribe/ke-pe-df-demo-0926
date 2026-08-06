import type { Scenario } from "@/state/types";
import { JCREW_TRAPDOOR_SCENARIO } from "./jcrewTrapdoor";

// Eight cases grounded in the real 690-row Covenant Extraction Spike (three-pass
// eval against 15 K&E credit agreements) and Stage-1 planning feedback — not
// invented for the demo. Deal names are anonymized to their industry per the
// source's own classification ("restricted — pairs deal names with economics");
// the structural facts and figures are real. See
// npm-intex-030/agentic-corpus-design-1.md's sibling docs and the Slack thread
// this was scoped from for full provenance.

// --- Financing EBITDA — flagship "totally whiffs" case -------------------------
// Pass 1 answers "Not found," which is the reasonable answer a human reviewer
// would also give. Pass 3 finds four hard-coded quarterly figures in the tail of
// the EBITDA definition that sum to the deal's own fixed incremental prong —
// provable only by cross-referencing and doing the arithmetic.
export const FINANCING_EBITDA_SCENARIO: Scenario = {
  id: "financing-ebitda",
  kind: "miss",
  shortLabel: "Financing EBITDA",
  question: "What is Financing EBITDA for this deal?",
  dealName: "A portfolio-analytics SaaS credit agreement",
  vanilla: {
    pageCount: 340,
    chunkCount: 18,
    scanLines: [
      "§1.01 — Definitions — \"Consolidated EBITDA\"",
      "§1.01 — Definitions — \"Financing EBITDA\" (not a defined term)",
      "§2.01 — Incremental Facilities — fixed-dollar prong",
      "§1.01 — Definitions — \"Test Period\"",
    ],
    answer:
      "Not found — no Financing EBITDA figure is stated anywhere in the reviewed sections. This appears to be a term without a stipulated value in this document.",
  },
  tribe: {
    nodes: [
      { id: "ebitda-def", label: "Consolidated EBITDA def.", doc: "§1.01" },
      { id: "q1", label: "Q1–Q3 EBITDA, hard-coded", doc: "§1.01 tail" },
      { id: "q4", label: "Q4 EBITDA, hard-coded", doc: "§1.01 tail" },
      { id: "incremental", label: "Fixed incremental prong", doc: "§2.01" },
    ],
    edges: [
      ["ebitda-def", "q1"],
      ["q1", "q4"],
      ["q4", "incremental"],
    ],
    assertions: [
      "Four fiscal-quarter EBITDA figures are hard-coded in the tail of the Consolidated EBITDA definition — §1.01",
      "Q1 $46.4M, Q2 $49.2M, Q3 $56.4M, Q4 $61.5M — LTM sum $213,500,000",
      "The incremental/side-car debt provision pairs a $213,500,000 fixed-dollar prong with 100% of Consolidated EBITDA — §2.01",
      "\"Financing EBITDA\" is a naming convention, not itself a defined term in this document",
    ],
    answer:
      "The four hard-coded quarterly figures in the EBITDA definition's tail sum to exactly $213,500,000 — and that's also the deal's fixed incremental-debt prong. Confirmed arithmetically, not asserted.",
    correctionLabel: "Corrected via cross-reference",
    correctionDetail:
      "\"Not found\" is a reasonable first-pass answer — there's no line item called Financing EBITDA. But four separate hard-coded numbers in a different definition's tail sum to the exact figure the deal's own incremental prong uses. The answer was always in the document; it just wasn't where a keyword search would look.",
    scaleNote:
      "This exact shape — a figure that only exists as the sum of scattered hard-coded numbers — is why EBITDA figures accounted for 5 of the 8 uncorrected wrong answers in a 690-row, 15-deal extraction review.",
  },
};

// --- Incremental MFN — flagship "incomplete, not wrong" case -------------------
// Pass 1 correctly extracts the visible MFN. Pass 3 finds an identical, second
// MFN hidden in a different definition, plus a sunset date that means neither is
// actually live anymore.
export const INCREMENTAL_MFN_SCENARIO: Scenario = {
  id: "incremental-mfn",
  kind: "miss",
  shortLabel: "Incremental MFN",
  question: "Does this deal have more than one MFN (most-favored-nation) pricing protection?",
  dealName: "A childcare-sector credit agreement (Amendment No. 3)",
  vanilla: {
    pageCount: 410,
    chunkCount: 21,
    scanLines: ["§2.16(h) — Incremental Facilities — MFN Pricing Test", "§1.01 — Definitions — \"Applicable Rate\""],
    answer:
      "Yes — a single 50 basis-point MFN with a 12-month sunset, protecting against pricing on new Incremental Term Loans (§2.16(h)).",
  },
  tribe: {
    nodes: [
      { id: "mfn1", label: "MFN — Incremental Term Loans", doc: "§2.16(h)" },
      { id: "ratio-debt", label: "Permitted Ratio Debt def.", doc: "§7.03(i)" },
      { id: "closing-date", label: "Closing Date def.", doc: "§1.01" },
    ],
    edges: [
      ["mfn1", "ratio-debt"],
      ["ratio-debt", "closing-date"],
    ],
    assertions: [
      "§2.16(h) MFN: 50 bps margin test, 12-month sunset, covers Incremental Term Loans",
      "An identical 50 bps MFN sits inside the \"Permitted Ratio Debt\" definition — §7.03(i) — with no cross-reference from §2.16(h)",
      "Closing Date is defined as June 12, 2023 — the 12-month sunset expired June 12, 2024",
      "This Amendment No. 3 postdates the sunset — the MFN is inoperative as of this document's vintage",
    ],
    answer:
      "There are two identical MFN provisions, not one — the second lives inside the Permitted Ratio Debt definition, not the Incremental Facilities section. And because the sunset runs from the Closing Date, both expired before this Amendment No. 3 — so today, neither is live.",
    correctionLabel: "Corrected via cross-reference",
    correctionDetail:
      "The first-pass answer isn't wrong about what it found — it's incomplete about what else exists. A second, identical MFN sits in a completely different definition, and whether the protection is even still live depends on a date buried in a third definition.",
    scaleNote:
      "In a parallel deal in the same review set, a first pass didn't just miss a second MFN — it affirmatively denied one existed, when the same 50 bps test in fact self-executes onto a second category of debt through a cross-referenced pricing definition.",
  },
};

// --- EBITDA Definition and Add-Backs -------------------------------------------
// Pass 1 correctly confirms "no cap" on the add-back clause it found. It never
// finds the second, independently-drafted add-back channel living in a separate
// definition with its own de minimis election.
export const EBITDA_ADD_BACKS_SCENARIO: Scenario = {
  id: "ebitda-add-backs",
  kind: "miss",
  shortLabel: "EBITDA Add-Backs",
  question: "Is there a cap on cost-savings and synergy add-backs to EBITDA in this deal?",
  dealName: "A commercial-landscaping-services credit agreement",
  vanilla: {
    pageCount: 380,
    chunkCount: 19,
    scanLines: [
      "§1.1 — Consolidated EBITDA — clause (i) — run-rate synergies",
      "§1.1 — Consolidated EBITDA — clause (q) — new-contract run-rate income",
      "§1.1 — Consolidated EBITDA — clause (r) — CIM / Sponsor Model items",
    ],
    answer:
      "No — the run-rate cost-savings and synergy add-back in the Consolidated EBITDA definition (clause (i)) is uncapped, confirmed across the full document.",
  },
  tribe: {
    nodes: [
      { id: "ebitda-i", label: "EBITDA cl. (i) — synergies", doc: "§1.1" },
      { id: "pro-forma-adj", label: "Pro Forma Adjustment def.", doc: "§1.1" },
      { id: "de-minimis", label: "$10M de minimis election", doc: "§1.1" },
    ],
    edges: [
      ["ebitda-i", "pro-forma-adj"],
      ["pro-forma-adj", "de-minimis"],
    ],
    assertions: [
      "Consolidated EBITDA clause (i): uncapped run-rate synergies, actions taken or expected within 24 months",
      "A separate \"Pro Forma Adjustment\" definition carries its own uncapped cost-savings channel — an 8-fiscal-quarter Post-Acquisition Period, full-Test-Period realizability assumed",
      "That second channel carries its own $10M de minimis skip election — a mechanic absent from clause (i)",
      "A structurally identical second-channel pattern (different de minimis threshold) appears in a healthcare-distribution deal in the same review set",
    ],
    answer:
      "There isn't one uncapped add-back channel here — there are two, defined in two places that don't cross-reference each other. Clause (i) is uncapped, correctly. But the \"Pro Forma Adjustment\" definition carries a second, parallel uncapped channel with its own realizability window and its own $10M skip election — read alone, either definition looks complete.",
    correctionLabel: "Corrected via cross-reference",
    correctionDetail:
      "Confirming \"no cap\" on the clause you found is correct, and also insufficient — the real answer requires knowing a second, independently-drafted add-back mechanism exists at all, since nothing in either definition points to the other.",
    scaleNote:
      "This pattern — real add-back capacity split across two non-cross-referencing definitions — was the single largest source of graded errors in the review: EBITDA figures accounted for 5 of the 8 uncorrected wrong answers across 690 extractions.",
  },
};

// --- Asset Sale Sweep — false-positive / over-inclusion case -------------------
// Pass 1 finds the sweep mechanics correctly, then over-includes: a nearby
// reference makes it look like casualty proceeds are covered when the actual
// defined-term scope excludes them.
export const ASSET_SALE_SWEEP_SCENARIO: Scenario = {
  id: "asset-sale-sweep",
  kind: "miss",
  shortLabel: "Asset Sale Sweep",
  question: "Are casualty and insurance proceeds subject to the mandatory prepayment sweep?",
  dealName: "A healthcare-products distribution credit agreement",
  vanilla: {
    pageCount: 520,
    chunkCount: 24,
    scanLines: ["§2.05(b)(ii) — Mandatory Prepayments — Asset Sale sweep", "§1.01 — Definitions — \"Net Proceeds\" (references Casualty Events)"],
    answer:
      "Yes — casualty and condemnation proceeds are captured by the Asset Sale sweep, since the \"Net Proceeds\" definition used by the sweep explicitly references Casualty Events.",
  },
  tribe: {
    nodes: [
      { id: "sweep", label: "Asset Sale sweep trigger", doc: "§2.05(b)(ii)" },
      { id: "disposition-def", label: "\"Disposition\" def.", doc: "§1.01" },
      { id: "casualty-clause", label: "Casualty Events clause", doc: "§7.05(i)" },
    ],
    edges: [
      ["sweep", "disposition-def"],
      ["disposition-def", "casualty-clause"],
    ],
    assertions: [
      "The sweep at §2.05(b)(ii) triggers only on \"Dispositions\" under §7.05(j)/(aa) — a defined term",
      "\"Disposition\" is defined without casualty events — §1.01",
      "Casualty and condemnation transfers sit in a separate, unswept clause — §7.05(i)",
      "\"Net Proceeds\" mentions Casualty Events, but that reference is vestigial — never the operative trigger",
    ],
    answer:
      "No — casualty and condemnation proceeds are not actually swept. The sweep's trigger is the defined term \"Disposition,\" which excludes casualty events by definition, and casualty transfers live in a separate clause the sweep never reaches. \"Net Proceeds\" mentions Casualty Events, but that's a leftover reference, not an operative one.",
    correctionLabel: "Corrected via cross-reference",
    correctionDetail:
      "A nearby mention of Casualty Events reads like confirmation, but the actual scope is set by the trigger's defined term, several sections over — and that term excludes exactly what the nearby reference seems to include.",
    scaleNote:
      "This was one of the error clusters the Debt Finance team itself predicted before this review ran: mandatory-prepayment sweeps are consistently narrower in practice than they read on a first pass.",
  },
};

// --- Restricted Debt Payments — correct baskets, wrong scope -------------------
// Pass 1 finds the right dollar baskets and still gets the practical answer
// wrong, because the baskets only gate a narrower category of debt than the
// question implies.
export const RESTRICTED_DEBT_PAYMENTS_SCENARIO: Scenario = {
  id: "restricted-debt-payments",
  kind: "miss",
  shortLabel: "Restricted Debt Payments",
  question: "Can this borrower prepay its junior-lien debt without restriction?",
  dealName: "A security-and-alarm-monitoring credit agreement",
  vanilla: {
    pageCount: 300,
    chunkCount: 16,
    scanLines: ["§6.09(b)(i) — Restricted Debt Payments — baskets (E)–(H)"],
    answer:
      "No — junior debt payments are restricted, subject to the baskets in §6.09(b)(i): a $350M general basket, a shared $415M basket, and an unlimited prong below 2.90x net total leverage.",
  },
  tribe: {
    nodes: [
      { id: "junior-financing", label: "\"Junior Financing\" def.", doc: "§6.09 lead-in" },
      { id: "baskets", label: "Baskets (E)–(H)", doc: "§6.09(b)(i)" },
    ],
    edges: [["junior-financing", "baskets"]],
    assertions: [
      "\"Junior Financing\" is defined as debt contractually subordinated in right of payment only — no dollar threshold",
      "The definition does not reach junior-lien debt or unsecured debt at all",
      "Baskets (E)–(H) exist, but they only gate payments on subordinated debt — everything else is already unrestricted",
    ],
    answer:
      "Yes — junior-lien and unsecured debt can be prepaid freely. The covenant's baskets are real, but they only gate payments on debt that's contractually subordinated. Junior-lien debt isn't subordinated debt, so it's outside the restriction entirely; the baskets never apply to it in the first place.",
    correctionLabel: "Corrected via cross-reference",
    correctionDetail:
      "Getting the baskets right and getting the covenant's actual reach right are two different questions. The baskets are correctly extracted; the scope-defining term they sit under is the fact that changes the practical answer.",
    scaleNote:
      "This same shape — correct baskets, wrong assumption about which debt is covered — showed up across most of the deals in the review, not just this one. It's a recurring scope-definition miss, not a one-off drafting quirk.",
  },
};

// --- Liens — additive baskets vs. a stacking tail ------------------------------
// Pass 1 finds both headline lien baskets correctly and treats them as simply
// additive. It misses a tail provision that lets one basket ride the other's
// capacity at the borrower's discretion.
export const LIENS_SCENARIO: Scenario = {
  id: "liens",
  kind: "miss",
  shortLabel: "Liens (shared/stacked baskets)",
  question: "What is the total secured-lien capacity available to this borrower?",
  dealName: "An aerospace-components credit agreement",
  vanilla: {
    pageCount: 360,
    chunkCount: 17,
    scanLines: ["Permitted Liens cl. (25) — general basket", "Permitted Liens cl. (24) — ratio-based basket"],
    answer:
      "Two independent baskets: a general basket (greater of a stated dollar amount or a percentage of EBITDA) and a separate ratio-based basket available below a stated leverage level — added together for total capacity.",
  },
  tribe: {
    nodes: [
      { id: "basket25", label: "Fixed general basket", doc: "cl. (25)" },
      { id: "basket24", label: "Ratio-based basket", doc: "cl. (24)" },
      { id: "tail", label: "Reclassification tail", doc: "Permitted Liens def., tail" },
    ],
    edges: [
      ["basket25", "tail"],
      ["basket24", "tail"],
    ],
    assertions: [
      "The Permitted Liens definition's tail allows a lien to be incurred under any combination of clauses",
      "The Borrower may reclassify among clauses at its sole discretion",
      "A lien can be split-classified — partly under the ratio-based clause, partly under a fixed clause",
      "This lets fixed-basket liens ride ratio-based capacity, materially expanding effective capacity beyond either headline number",
    ],
    answer:
      "The two baskets aren't simply additive — a tail provision lets the borrower reclassify and split-stack liens between them at its own discretion, which means the real ceiling on secured capacity is higher than either basket read alone, and isn't a single fixed number at all.",
    correctionLabel: "Corrected via cross-reference",
    correctionDetail:
      "Both headline baskets are drafted clearly and both were found correctly. The number that actually matters — how much they can be stacked — lives in unrelated boilerplate at the end of the definition, not near either basket.",
    scaleNote:
      "The identical reclassification-tail mechanic appears in a second, unrelated deal in the same review set — an aircraft-engine-MRO credit agreement — suggesting this is a market-standard drafting pattern, not a one-off.",
  },
};

// --- Company Buybacks / Open Market Purchases — post-Serta undefined term -----
// The provision exists and is found correctly. "Open market purchase" itself is
// undefined in the document — the same category of drafting risk the market has
// called the Serta issue since 2020.
export const OPEN_MARKET_PURCHASE_SCENARIO: Scenario = {
  id: "open-market-purchase",
  kind: "gap",
  shortLabel: "Open Market Purchases (LME)",
  question: "Does this deal define what counts as an \"open market purchase\" of its own debt?",
  dealName: "An aircraft-engine-MRO credit agreement",
  vanilla: {
    pageCount: 470,
    chunkCount: 23,
    scanLines: ["§10.07(j) — Company buybacks — open market purchase mechanics", "§1.01 — \"Dutch Auction\" (defined term)"],
    answer:
      "Yes — the borrower can make open market purchases of its own debt under §10.07(j), alongside the defined Dutch Auction process.",
  },
  tribe: {
    nodes: [
      { id: "buyback-clause", label: "Buyback provision", doc: "§10.07(j)" },
      { id: "dutch-auction-def", label: "\"Dutch Auction\" def.", doc: "§1.01" },
      { id: "omp-def", label: "\"Open market purchase\" — undefined", doc: "§1.01" },
    ],
    edges: [
      ["buyback-clause", "dutch-auction-def"],
      ["dutch-auction-def", "omp-def"],
    ],
    assertions: [
      "§10.07(j) permits open market purchases of the borrower's own debt",
      "\"Dutch Auction\" is a defined term with its own conditions section",
      "\"Open market purchase\" itself is not a defined term anywhere in this document",
      "This is the exact drafting gap the market has called the \"Serta issue\" since 2020 — undefined terms nobody stress-tested",
    ],
    answer:
      "The provision exists, but \"open market purchase\" itself is never defined — the same category of undefined-term risk the market has called a Serta issue since 2020. It's not that the firm has no view; the document's drafting never pinned the term down, and nobody's supplied a firm-wide standard either.",
    gapLabel: "Undefined term (post-Serta)",
    gapDetail:
      "\"Open market purchase\" appears in this provision but is never a defined term — and K&E hasn't yet asserted a standing firm-wide standard for what should count. Across a 15-deal sample, almost none of them set a firm-specific standard for it either — most just fall back on baseline industry convention.",
    confirmCta: "Set the firm-wide standard for \"open market purchase\" →",
    fact: {
      id: "fact-open-market-purchase",
      term: "Open market purchase",
      definition:
        "A purchase of the borrower's own debt executed through ordinary secondary-market trading channels, at prevailing market prices, without a Dutch-auction or negotiated-tender process and without using MNPI obtained as a lender.",
      author: "you",
      scope: "org-wide — every deal, for the rest of this session",
      sourceAnchor: "aircraft-engine-MRO credit agreement, §10.07(j); pattern confirmed across a 15-deal review — no firm-specific standard set in nearly any of them",
    },
  },
  rerun: {
    dealName: "a landscaping-services credit agreement",
    vanillaAnswer:
      "Yes — open market purchases are permitted under the buyback provision. No unusual drafting risk is indicated.",
    tribeAnswerTemplate:
      "Flagged immediately: this deal's buyback provision has the same undefined \"open market purchase\" gap — resolved using the \"{{fact}}\" standard the firm set earlier. No re-analysis needed.",
  },
};

// --- New/unseen term handling — cross-cutting governance case -----------------
// Not a specific extraction miss — the open Stage-1 design question of what
// happens when a term shows up that isn't yet in the firm's schema at all.
// Vanilla's failure mode here is different in kind: it answers anyway, from
// general knowledge, ungrounded in either deal's actual file.
export const NEW_TERM_HANDLING_SCENARIO: Scenario = {
  id: "new-term-handling",
  kind: "gap",
  shortLabel: "New/unseen term handling",
  question: "This deal has a term that's not yet in the firm's extraction schema — how should that be handled?",
  dealName: "A new deal — a term outside the current schema",
  vanilla: {
    pageCount: 390,
    chunkCount: 6,
    scanLines: ["Nearest lexical matches — no exact term hit", "General market drafting conventions (not this deal's file)"],
    answer:
      "Sure — based on standard credit agreement drafting, provisions like this typically work as follows: [a plausible, generic explanation, not grounded in this deal's own file].",
  },
  tribe: {
    nodes: [
      { id: "schema-check", label: "Firm schema check", doc: "firm term list" },
      { id: "no-match", label: "No match found", doc: "—" },
      { id: "routing", label: "Routed to schema owner", doc: "—" },
    ],
    edges: [
      ["schema-check", "no-match"],
      ["no-match", "routing"],
    ],
    assertions: [
      "This term is not yet in the firm's extraction schema",
      "Answering from general knowledge would not be grounded in this deal's own file",
      "Open Stage-1 design question: should new terms be picked up automatically, or does a schema owner flag them first?",
    ],
    answer:
      "This term isn't in the current schema — so instead of guessing at what it should mean from general drafting knowledge, it's flagged for the K&E schema owner to confirm before it's treated as a gradeable term at all.",
    gapLabel: "Unrecognized term — not yet in schema",
    gapDetail:
      "New/unseen-term handling was flagged as an open design question during Stage 1 planning: should the system pick these up automatically, or should a K&E schema owner confirm a new term before it's extracted anywhere? Until that's resolved, an unrecognized term gets routed, not guessed at.",
    confirmCta: "Add this term to the firm schema →",
    fact: {
      id: "fact-new-term-added",
      term: "the newly-flagged term",
      definition:
        "Added to the firm's extraction schema by explicit schema-owner sign-off, with an initial extraction hypothesis (where it typically lives, what it should include) rather than a guessed answer.",
      author: "you",
      scope: "org-wide schema — every future deal checks against this term going forward",
      sourceAnchor: "Stage-1 discovery — new-term-handling design decision",
    },
  },
  rerun: {
    dealName: "a second deal with the same unrecognized term",
    vanillaAnswer: "Sure — [answers again from general knowledge, still not grounded in either deal's file].",
    tribeAnswerTemplate:
      "Recognized immediately — this term was added to the schema after the last deal. No re-flagging, no re-guessing; it's answered against the standard the firm just set.",
  },
};

export const LIBRARY_SCENARIOS: Scenario[] = [
  FINANCING_EBITDA_SCENARIO,
  INCREMENTAL_MFN_SCENARIO,
  EBITDA_ADD_BACKS_SCENARIO,
  ASSET_SALE_SWEEP_SCENARIO,
  RESTRICTED_DEBT_PAYMENTS_SCENARIO,
  LIENS_SCENARIO,
  OPEN_MARKET_PURCHASE_SCENARIO,
  NEW_TERM_HANDLING_SCENARIO,
];

export const ALL_SCENARIOS: Scenario[] = [JCREW_TRAPDOOR_SCENARIO, ...LIBRARY_SCENARIOS];

