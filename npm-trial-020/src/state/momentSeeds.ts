import type { Dispatch } from "react";
import { anchorDeal } from "@/data/deals";
import { NEW_MATTER } from "@/data/precedentCorpus";
import { matchPrecedents } from "@/detectors/matchPrecedents";
import { populateGrid } from "@/detectors/populateGrid";
import { detectUndefinedTerms } from "@/detectors/detectUndefinedTerms";
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
      seedB2Focus(terms, dispatch);
      return;
    }
    default:
      return;
  }
}

async function ensureCandidates(state: DemoState, dispatch: Dispatch<DemoAction>): Promise<void> {
  if (state.precedentCandidates.length > 0) return;
  const candidates = await matchPrecedents(NEW_MATTER);
  dispatch({ type: "SET_PRECEDENT_CANDIDATES", candidates });
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
  const precedentId = state.selectedPrecedentId ?? anchorDeal().id;
  if (!state.selectedPrecedentId) {
    dispatch({ type: "SELECT_PRECEDENT", precedentId });
  }
  const populated = await populateGrid({ precedentDealId: precedentId });
  const withUndefinedFlags = await detectUndefinedTerms(populated);
  dispatch({ type: "SET_GRID", terms: withUndefinedFlags });
  return withUndefinedFlags;
}

function seedB2Focus(terms: GridTerm[], dispatch: Dispatch<DemoAction>): void {
  const undefinedTerm = terms.find((t) => t.firmDefinition === "undefined_by_firm");
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
