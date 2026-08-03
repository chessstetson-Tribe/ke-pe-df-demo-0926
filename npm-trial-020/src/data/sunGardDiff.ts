import type { DiffFlag } from "@/state/types";

// Working placeholder pair for Moment C1 — SunGard, per the Moments doc: none of the
// 15 real Covenant Extraction Spike deals have a paired term sheet in the source
// material (all 15 are credit-agreement-only), so this is illustrative rather than a
// K&E-named deal. Swap for a real K&E-supplied term-sheet/credit-agreement pair here
// directly if one becomes available — this is the one moment intentionally NOT bound
// to an anchor-deal config, since C1's own source note explains why.
export const SUNGARD_DEAL_ID = "sungard";

// Target shape from Jason Kanner's own pilot triage ratio (real, not invented):
// ~300 raw flags -> 50 attorney-relevant -> 10 client-shown. The sample below is a
// representative subset for the demo list, not a literal enumeration of 300 rows —
// same treatment as B1's 78%/99% topline stat.
export const DIFF_FUNNEL = {
  rawFlagCount: 300,
  attorneyRelevantCount: 50,
  clientShownCount: 10,
};

export const SUNGARD_DIFF_FLAGS: DiffFlag[] = [
  {
    id: "sg-pricing-grid",
    dealId: SUNGARD_DEAL_ID,
    clause: "Pricing Grid",
    termSheetLanguage: "Applicable Margin at Level II: SOFR + 325 bps",
    creditAgreementLanguage: "Applicable Margin at Level II: SOFR + 350 bps",
    triage: "business-issue",
  },
  {
    id: "sg-prepayment-premium",
    dealId: SUNGARD_DEAL_ID,
    clause: "Prepayment Premium",
    termSheetLanguage: "Silent on any prepayment premium",
    creditAgreementLanguage: "1.00% soft-call premium added for voluntary prepayments in year one",
    triage: "business-issue",
  },
  {
    id: "sg-mfn-sunset",
    dealId: SUNGARD_DEAL_ID,
    clause: "MFN Sunset",
    termSheetLanguage: "Most-favored-nation protection sunsets after 12 months",
    creditAgreementLanguage: "MFN protection sunsets after 18 months",
    triage: "business-issue",
  },
  {
    id: "sg-covenant-stepdown",
    dealId: SUNGARD_DEAL_ID,
    clause: "Financial Covenant Step-Down",
    termSheetLanguage: "Leverage covenant steps down to 4.50x by year 3",
    creditAgreementLanguage: "Leverage covenant reaches 4.50x only in year 4",
    triage: "business-issue",
  },
  {
    id: "sg-ecf-sweep",
    dealId: SUNGARD_DEAL_ID,
    clause: "Excess Cash Flow Sweep",
    termSheetLanguage: "50% ECF sweep, contemplated to step down with leverage",
    creditAgreementLanguage: "75% ECF sweep, no step-down provision included",
    triage: "business-issue",
  },
  {
    id: "sg-cod-put",
    dealId: SUNGARD_DEAL_ID,
    clause: "Change of Control Repurchase",
    termSheetLanguage: "Silent on change-of-control repurchase price",
    creditAgreementLanguage: "Repurchase price set at 101% of principal (standard, but not termed out with the sponsor)",
    triage: "business-issue",
  },
  {
    id: "sg-rp-basket",
    dealId: SUNGARD_DEAL_ID,
    clause: "Restricted Payments Basket",
    termSheetLanguage: "\"Customary\" general RP basket referenced, no dollar figure given",
    creditAgreementLanguage: "General RP basket capped at $15,000,000 — below the sponsor's typical precedent range",
    triage: "business-issue",
  },
  {
    id: "sg-permitted-holders-exhibit",
    dealId: SUNGARD_DEAL_ID,
    clause: "§1.01 — \"Permitted Holders\"",
    termSheetLanguage: "n/a",
    creditAgreementLanguage: "Definition cross-references Exhibit C, which was never attached to the draft",
    triage: "legal-comment",
  },
  {
    id: "sg-notices-template",
    dealId: SUNGARD_DEAL_ID,
    clause: "§9.02 — Notices",
    termSheetLanguage: "n/a",
    creditAgreementLanguage: "Address block still shows the prior firm's contact information from the template",
    triage: "legal-comment",
  },
  {
    id: "sg-numbering-inconsistency",
    dealId: SUNGARD_DEAL_ID,
    clause: "§7.11 cross-references",
    termSheetLanguage: "n/a",
    creditAgreementLanguage: "Referenced as \"§7.1\" in two places instead of \"§7.11\"",
    triage: "legal-comment",
  },
  {
    id: "sg-agent-capitalization",
    dealId: SUNGARD_DEAL_ID,
    clause: "Article VIII — defined-term usage",
    termSheetLanguage: "n/a",
    creditAgreementLanguage: "\"Agent\" capitalized inconsistently throughout the article",
    triage: "legal-comment",
  },
  {
    id: "sg-governing-law-stray-ref",
    dealId: SUNGARD_DEAL_ID,
    clause: "§11.09 — Governing Law",
    termSheetLanguage: "n/a",
    creditAgreementLanguage: "Governing-law clause cites New York; a stray cross-reference in §11.09 cites Delaware",
    triage: "legal-comment",
  },
  {
    id: "sg-signature-block-format",
    dealId: SUNGARD_DEAL_ID,
    clause: "Signature Pages",
    termSheetLanguage: "n/a",
    creditAgreementLanguage: "Formatting doesn't match the firm's standard closing-set template",
    triage: "legal-comment",
  },
];
