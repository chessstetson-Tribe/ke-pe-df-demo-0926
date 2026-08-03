import type { DealRecord } from "./types";

// Strong alternate anchor to KinderCare — the other document run live at the July 14
// onsite (anchor for the full deal-spine walkthrough there). Stubbed without full grid
// detail in phase 1; swap ANCHOR_DEAL_ID in data/deals/index.ts to promote it.
export const medline: DealRecord = {
  id: "medline",
  name: "Medline Industries — Credit Agreement",
  sponsor: { value: "Blackstone, Carlyle, and Hellman & Friedman (2021 recapitalization)", sensitivity: "sponsor-identity" },
  industry: "Healthcare products manufacturing & distribution",
  dealSizeUsd: { value: 7_700_000_000, sensitivity: "deal-economics" },
  covenantFlavor: "Covenant-lite, large-cap sponsor-backed structure",
  gridTerms: [],
};
