import { DEALS } from "@/data/deals";
import { NEW_MATTER } from "@/data/precedentCorpus";
import type {
  CorrectionRecord,
  DemoState,
  FirmDefinition,
  FirmDefinitionStatus,
  GridTerm,
  MatchFactor,
  NextActionItem,
  PersonaId,
  PrecedentCandidate,
  SpineStageId,
  SpineStageStatus,
} from "./types";

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
  const undefinedCount = terms.filter((t) => effectiveFirmDefinition(state, t) === "undefined_by_firm").length;
  const flagged = terms.length - confirmed - undefinedCount;
  const denominator = confirmed + flagged + undefinedCount;
  return denominator === 0 ? 0 : Math.round((confirmed / denominator) * 100);
}

export function gridStageStatus(state: DemoState): SpineStageStatus {
  if (state.grid.length === 0) return "not-started";
  const hasUndefined = state.grid.some((t) => effectiveFirmDefinition(state, t) === "undefined_by_firm");
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

// --- Learning-loop selectors ---------------------------------------------------
// These are what make thumbs feedback actually DO something to the data scaffold,
// rather than just sit in a log: every render, candidate scores and grid terms are
// recomputed against `state.feedback` / `state.firmDefinitions` / `state.corrections`
// fresh — nothing here is stored pre-computed, so it can never drift out of sync with
// the feedback that produced it.

const VOTE_DELTA = 8;

// A direct up/down vote on a specific candidate nudges its score for the rest of the
// session — thumbs-up/down on a precedent card reorders the list live.
export function precedentVoteBoost(state: DemoState, dealId: string): number {
  return state.feedback
    .filter((f) => f.targetType === "precedent-candidate" && f.targetId === dealId)
    .reduce((sum, f) => sum + (f.sentiment === "up" ? VOTE_DELTA : -VOTE_DELTA), 0);
}

// Rejecting a match reason targets the FACTOR category (e.g. "industry"), not one
// candidate's specific value — so it ripples to every other candidate scored on that
// same factor, anywhere it's rendered, for the rest of the session.
export function rejectedFactors(state: DemoState): Set<MatchFactor> {
  return new Set(
    state.feedback
      .filter((f) => f.targetType === "match-reason" && f.sentiment === "down")
      .map((f) => f.targetId as MatchFactor),
  );
}

// The score actually shown/sorted-by anywhere a candidate renders — base detector
// score, minus any rejected factors' points, plus any direct vote boost.
export function effectiveMatchScore(state: DemoState, candidate: PrecedentCandidate): number {
  const rejected = rejectedFactors(state);
  const remaining = candidate.matchedOn
    .filter((m) => !rejected.has(m.factor))
    .reduce((sum, m) => sum + m.points, 0);
  return Math.max(0, Math.min(100, remaining + precedentVoteBoost(state, candidate.precedentDealId)));
}

export function isFirmDefined(state: DemoState, label: string): FirmDefinition | undefined {
  return state.firmDefinitions.find((d) => d.label === label);
}

// A term seeded as "undefined_by_firm" reads as resolved everywhere the moment ANY
// deal's grid gets a firm definition for that label this session — the underlying
// seeded GridTerm is never mutated (so the F1/B2 "this term as originally seeded" story
// stays intact); this is the live override every renderer should check instead of
// `term.firmDefinition` directly.
export function effectiveFirmDefinition(state: DemoState, term: GridTerm): FirmDefinitionStatus {
  if (term.firmDefinition === "undefined_by_firm" && isFirmDefined(state, term.label)) return "defined";
  return term.firmDefinition;
}

// A correction made on a DIFFERENT deal for the same term label — resurfaced live on
// this deal's grid, not just at F1 closing.
export function priorCorrectionForOtherDeal(
  state: DemoState,
  label: string,
  currentDealId: string,
): CorrectionRecord | undefined {
  return state.corrections.find((c) => c.gridTermLabel === label && c.dealId !== currentDealId);
}
