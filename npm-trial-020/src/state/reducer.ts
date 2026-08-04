import { createInitialState } from "./initialState";
import type {
  ActingPersona,
  CorrectionRecord,
  CrossPracticeEvent,
  DemoState,
  DiffFlag,
  FeedbackRecord,
  GridTerm,
  NextActionItem,
  PrecedentCandidate,
  ScreenId,
  SpineStageId,
  SpineStageStatus,
} from "./types";

export type DemoAction =
  | { type: "NAVIGATE"; screen: ScreenId }
  | { type: "LOGIN" }
  | { type: "LOGOUT" }
  | { type: "SET_PERSONA"; persona: ActingPersona }
  | { type: "SET_PRECEDENT_CANDIDATES"; candidates: PrecedentCandidate[] }
  | { type: "SELECT_PRECEDENT"; precedentId: string }
  | { type: "REFINE_PRECEDENT_SHORTLIST"; filter: { lender?: string; industry?: string } | null }
  | { type: "SET_GRID"; terms: GridTerm[] }
  | { type: "FOCUS_GRID_TERM"; termId: string | null }
  | { type: "CONFIRM_GRID_TERM"; termId: string }
  | { type: "CORRECT_GRID_TERM"; termId: string; value: string; reasoning: string }
  | { type: "ADD_NEXT_ACTION"; item: NextActionItem }
  | { type: "RESOLVE_NEXT_ACTION"; id: string }
  | { type: "SET_SPINE_STAGE"; stage: SpineStageId; status: SpineStageStatus }
  | { type: "SET_DIFF_FLAGS"; flags: DiffFlag[] }
  | { type: "SET_PENDING_CROSS_PRACTICE_EVENTS"; events: CrossPracticeEvent[] }
  | { type: "TRIGGER_CROSS_PRACTICE_EVENT"; event: CrossPracticeEvent; nextAction: NextActionItem }
  | { type: "RECORD_FEEDBACK"; record: FeedbackRecord };

export function demoReducer(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case "NAVIGATE":
      return { ...state, screen: action.screen };

    case "LOGIN":
      return { ...state, authenticated: true, screen: "persona-select" };

    case "LOGOUT":
      // Explicit, presenter-driven reset — not an inactivity timeout (there isn't
      // one). Returns to a genuinely clean slate, same as a fresh page load.
      return createInitialState();

    case "SET_PERSONA":
      return { ...state, persona: action.persona };

    case "SET_PRECEDENT_CANDIDATES":
      return { ...state, precedentCandidates: action.candidates, dirty: { ...state.dirty, a0: true } };

    case "SELECT_PRECEDENT":
      return {
        ...state,
        selectedPrecedentId: action.precedentId,
        activeDealId: action.precedentId,
        dirty: { ...state.dirty, a2: true },
        // Selecting a precedent is itself the resolution of A0's "no precedent
        // selected yet" blocker — don't leave it sitting open for a manual click.
        nextActions: state.nextActions.map((i) =>
          i.sourceModule === "a0.blocker" ? { ...i, status: "resolved" } : i,
        ),
      };

    case "REFINE_PRECEDENT_SHORTLIST":
      return { ...state, precedentFilter: action.filter };

    case "SET_GRID":
      return { ...state, grid: action.terms, dirty: { ...state.dirty, b1: true } };

    case "FOCUS_GRID_TERM":
      return { ...state, focusedGridTermId: action.termId };

    case "CONFIRM_GRID_TERM":
      return {
        ...state,
        grid: state.grid.map((t) => (t.id === action.termId ? { ...t, review: "confirmed" } : t)),
      };

    case "CORRECT_GRID_TERM": {
      const term = state.grid.find((t) => t.id === action.termId);
      if (!term) return state;
      const correction: CorrectionRecord = {
        id: `correction-${action.termId}-${state.corrections.length}`,
        dealId: term.dealId,
        gridTermLabel: term.label,
        originalValue: term.value,
        correctedValue: action.value,
        reasoning: action.reasoning,
        authorPersona: state.persona.personaId,
      };
      return {
        ...state,
        grid: state.grid.map((t) =>
          t.id === action.termId ? { ...t, value: action.value, review: "corrected" } : t,
        ),
        corrections: [...state.corrections, correction],
      };
    }

    case "ADD_NEXT_ACTION":
      if (state.nextActions.some((i) => i.id === action.item.id)) return state;
      return { ...state, nextActions: [...state.nextActions, action.item] };

    case "RESOLVE_NEXT_ACTION":
      return {
        ...state,
        nextActions: state.nextActions.map((i) =>
          i.id === action.id ? { ...i, status: "resolved" } : i,
        ),
      };

    case "SET_SPINE_STAGE":
      return { ...state, spine: { ...state.spine, [action.stage]: action.status } };

    case "SET_DIFF_FLAGS":
      return { ...state, diffFlags: action.flags, dirty: { ...state.dirty, c1: true } };

    case "SET_PENDING_CROSS_PRACTICE_EVENTS":
      return { ...state, pendingCrossPracticeEvents: action.events, dirty: { ...state.dirty, e2: true } };

    case "TRIGGER_CROSS_PRACTICE_EVENT":
      if (state.crossPracticeEvents.some((e) => e.id === action.event.id)) return state;
      return {
        ...state,
        crossPracticeEvents: [...state.crossPracticeEvents, action.event],
        pendingCrossPracticeEvents: state.pendingCrossPracticeEvents.filter((e) => e.id !== action.event.id),
        nextActions: [...state.nextActions, action.nextAction],
      };

    case "RECORD_FEEDBACK":
      return { ...state, feedback: [...state.feedback, action.record] };

    default:
      return state;
  }
}
