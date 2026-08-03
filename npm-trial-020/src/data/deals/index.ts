import { kinderCare } from "./kinderCare";
import { medline } from "./medline";
import type { DealRecord } from "./types";

// Swappable config, not a hardcoded value in logic — per the brief's explicit note
// that KinderCare is the current anchor but Medline is the strongest alternate.
// Change this one line to re-anchor A0/A2/B1/B2 without touching component code.
export const ANCHOR_DEAL_ID: string = "kindercare";

export const DEALS: Record<string, DealRecord> = {
  kindercare: kinderCare,
  medline: medline,
};

export function anchorDeal(): DealRecord {
  return DEALS[ANCHOR_DEAL_ID];
}

export { kinderCare, medline };
export type { DealRecord } from "./types";
