import type { Dispatch } from "react";
import { anchorDeal } from "@/data/deals";
import { NEW_MATTER } from "@/data/precedentCorpus";
import { matchPrecedents } from "@/detectors/matchPrecedents";
import { populateGrid } from "@/detectors/populateGrid";
import { detectUndefinedTerms } from "@/detectors/detectUndefinedTerms";
import { diffTermSheet } from "@/detectors/diffTermSheet";
import { watchCrossPracticeFeed } from "@/detectors/watchCrossPracticeFeed";
import { SUNGARD_DEAL_ID } from "@/data/sunGardDiff";
import { effectiveFirmDefinition } from "./selectors";
import type { DemoAction } from "./reducer";
import type { DemoState, GridTerm, NextActionItem, ScreenId } from "./types";

// The ONLY caller of detectors/. Navigating to a screen and seeding the state it
// assumes are treated as one logical transition — a presenter jumping straight to B2
// gets a KinderCare grid with the undefined term already reached, without replaying
// A0 -> A2 -> B1 first. Idempotent: re-running a seed that already has its data is a
// no-op (guarded by state checks below), so switching back to an in-progress moment
// never clobbers work already done.
export async function seedScreen(
  screen: ScreenId,
  state: DemoState,
  dispatch: Dispatch<DemoAction>,
): Promise<void> {
  switch (screen) {
    case "a0":
      await seedA0(state, dispatch);
      return;
    case "a2":
      await ensureCandidates(state, dispatch);
      return;
    case "b1":
      await ensureCandidates(state, dispatch);
      await ensureGrid(state, dispatch);
      return;
    case "b2": {
      await ensureCandidates(state, dispatch);
      // Thread the freshly-populated terms through the return value rather than
      // re-reading `state.grid` afterward — `state` here is the snapshot from
      // BEFORE this function's own dispatches landed, so re-reading it would still
      // see the empty pre-seed grid.
      const terms = await ensureGrid(state, dispatch);
      seedB2Focus(terms, dispatch, state);
      return;
    }
    case "c1":
      await ensureDiffFlags(state, dispatch);
      return;
    case "e2":
      await ensurePendingCrossPracticeEvents(state, dispatch);
      return;
    default:
      return;
  }
}

async function ensureCandidates(state: DemoState, dispatch: Dispatch<DemoAction>): Promise<void> {
  if (state.precedentCandidates.length > 0) return;
  const candidates = await matchPrecedents(NEW_MATTER);
  dispatch({ type: "SET_PRECEDENT_CANDIDATES", candidates });
}

// Shared by any moment that needs "the deal actually being worked" rather than the
// still-unmatched new matter — resolves to the anchor deal and dispatches
// SELECT_PRECEDENT if nothing has been chosen yet, so a cold direct-jump into any of
// these moments behaves identically to arriving there after A0/A2.
function resolveActiveDealId(state: DemoState, dispatch: Dispatch<DemoAction>): string {
  if (state.selectedPrecedentId) return state.selectedPrecedentId;
  const precedentId = anchorDeal().id;
  dispatch({ type: "SELECT_PRECEDENT", precedentId });
  return precedentId;
}

async function seedA0(state: DemoState, dispatch: Dispatch<DemoAction>): Promise<void> {
  await ensureCandidates(state, dispatch);
  if (state.selectedPrecedentId) return;
  const blocker: NextActionItem = {
    id: "a0-blocker-no-precedent",
    title: "No precedent selected yet — grid not started",
    why: `${NEW_MATTER.dealName}'s grid can't begin until a matched precedent is confirmed.`,
    stage: "precedent",
    routedTo: "associate",
    priority: 1,
    sourceModule: "a0.blocker",
    status: "open",
  };
  dispatch({ type: "ADD_NEXT_ACTION", item: blocker });
}

async function ensureGrid(state: DemoState, dispatch: Dispatch<DemoAction>): Promise<GridTerm[]> {
  if (state.grid.length > 0) return state.grid;
  const precedentId = resolveActiveDealId(state, dispatch);
  const populated = await populateGrid({ precedentDealId: precedentId });
  const withUndefinedFlags = await detectUndefinedTerms(populated);
  dispatch({ type: "SET_GRID", terms: withUndefinedFlags });
  return withUndefinedFlags;
}

async function ensureDiffFlags(state: DemoState, dispatch: Dispatch<DemoAction>): Promise<void> {
  if (state.diffFlags.length > 0) return;
  const flags = await diffTermSheet({
    dealId: SUNGARD_DEAL_ID,
    termSheetDocId: "sungard-term-sheet",
    creditAgreementDocId: "sungard-credit-agreement",
  });
  dispatch({ type: "SET_DIFF_FLAGS", flags });
}

async function ensurePendingCrossPracticeEvents(state: DemoState, dispatch: Dispatch<DemoAction>): Promise<void> {
  if (state.pendingCrossPracticeEvents.length > 0 || state.crossPracticeEvents.length > 0) return;
  const dealId = resolveActiveDealId(state, dispatch);
  const events = await watchCrossPracticeFeed(dealId);
  dispatch({ type: "SET_PENDING_CROSS_PRACTICE_EVENTS", events });
}

function seedB2Focus(terms: GridTerm[], dispatch: Dispatch<DemoAction>, state: DemoState): void {
  // Effective, not raw — a term already firm-defined (via another deal, this
  // session) is resolved and shouldn't be re-flagged on a cold jump into B2.
  const undefinedTerm = terms.find((t) => effectiveFirmDefinition(state, t) === "undefined_by_firm");
  if (!undefinedTerm) return;
  dispatch({ type: "FOCUS_GRID_TERM", termId: undefinedTerm.id });
  const item: NextActionItem = {
    id: `b2-undefined-${undefinedTerm.id}`,
    title: `“${undefinedTerm.label}” is undefined by the firm`,
    why: undefinedTerm.firmDefinitionNote ?? "No firm-wide pass/fail standard exists for this term yet.",
    stage: "grid",
    routedTo: "km",
    priority: 2,
    sourceModule: "b2.undefinedTerm",
    status: "open",
  };
  dispatch({ type: "ADD_NEXT_ACTION", item });
}
