import { NEW_MATTER } from "@/data/precedentCorpus";
import type { DemoState, SpineStageId, SpineStageStatus } from "./types";

const PRISTINE_SPINE: Record<SpineStageId, SpineStageStatus> = {
  precedent: "not-started",
  grid: "not-started",
  "term-sheet-commitment": "not-started",
  "credit-agreement": "not-started",
  "post-close": "not-started",
};

export function createInitialState(): DemoState {
  return {
    screen: "login",
    authenticated: false,
    persona: { personaId: "associate", seniority: "junior", onDealTeam: true },
    activeDealId: NEW_MATTER.dealId,
    spine: { ...PRISTINE_SPINE },
    nextActions: [],
    precedentCandidates: [],
    precedentFilter: null,
    selectedPrecedentId: null,
    grid: [],
    focusedGridTermId: null,
    diffFlags: [],
    corrections: [],
    crossPracticeEvents: [],
    dirty: {},
  };
}
