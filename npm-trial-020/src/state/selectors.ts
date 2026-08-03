import { DEALS } from "@/data/deals";
import { NEW_MATTER } from "@/data/precedentCorpus";
import type { DemoState, NextActionItem, PersonaId, SpineStageId, SpineStageStatus } from "./types";

// Before a precedent is selected, activeDealId is still the new matter itself
// (which has no DealRecord) — fall back to its name rather than silently showing
// the anchor precedent's name, which would misrepresent which deal is "active."
export function activeDealName(state: DemoState): string {
  return DEALS[state.activeDealId]?.name ?? (state.activeDealId === NEW_MATTER.dealId ? NEW_MATTER.dealName : state.activeDealId);
}

// Precedent and Grid stage status/percentage are always DERIVED from real underlying
// state (never stored), per the brief's requirement to tie progress to something
// concrete. The other three stages aren't data-driven until phase 2/3, so they fall
// back to the stored (manually-set) spine record.

export function precedentStageStatus(state: DemoState): SpineStageStatus {
  return state.selectedPrecedentId ? "complete" : "not-started";
}

export function gridStagePercent(state: DemoState): number {
  const terms = state.grid;
  if (terms.length === 0) return 0;
  const confirmed = terms.filter((t) => t.review === "confirmed" || t.review === "corrected").length;
  const undefinedCount = terms.filter((t) => t.firmDefinition === "undefined_by_firm").length;
  const flagged = terms.length - confirmed - undefinedCount;
  const denominator = confirmed + flagged + undefinedCount;
  return denominator === 0 ? 0 : Math.round((confirmed / denominator) * 100);
}

export function gridStageStatus(state: DemoState): SpineStageStatus {
  if (state.grid.length === 0) return "not-started";
  const hasUndefined = state.grid.some((t) => t.firmDefinition === "undefined_by_firm");
  const allConfirmed = state.grid.every((t) => t.review === "confirmed" || t.review === "corrected");
  if (allConfirmed) return "complete";
  if (hasUndefined) return "needs-review";
  return "in-progress";
}

export function spineStageStatus(state: DemoState, stage: SpineStageId): SpineStageStatus {
  if (stage === "precedent") return precedentStageStatus(state);
  if (stage === "grid") return gridStageStatus(state);
  return state.spine[stage];
}

export function spineStagePercent(state: DemoState, stage: SpineStageId): number {
  if (stage === "precedent") return state.selectedPrecedentId ? 100 : 0;
  if (stage === "grid") return gridStagePercent(state);
  const status = state.spine[stage];
  return status === "complete" ? 100 : status === "needs-review" || status === "in-progress" ? 50 : 0;
}

export function rankedNextActions(state: DemoState, forPersona?: PersonaId): NextActionItem[] {
  const items = forPersona ? state.nextActions.filter((i) => i.routedTo === forPersona) : state.nextActions;
  return [...items].sort((a, b) => {
    if (a.status !== b.status) return a.status === "open" ? -1 : 1;
    return a.priority - b.priority;
  });
}

export function openNextActionCount(state: DemoState, forPersona?: PersonaId): number {
  return rankedNextActions(state, forPersona).filter((i) => i.status === "open").length;
}
