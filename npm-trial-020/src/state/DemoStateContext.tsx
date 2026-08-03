import { createContext, useCallback, useContext, useReducer, type Dispatch, type ReactNode } from "react";
import { createInitialState } from "./initialState";
import { demoReducer, type DemoAction } from "./reducer";
import { seedScreen } from "./momentSeeds";
import type { DemoState, ScreenId } from "./types";

const StateCtx = createContext<DemoState | null>(null);
const DispatchCtx = createContext<Dispatch<DemoAction> | null>(null);

export function DemoStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(demoReducer, undefined, createInitialState);
  return (
    <StateCtx.Provider value={state}>
      <DispatchCtx.Provider value={dispatch}>{children}</DispatchCtx.Provider>
    </StateCtx.Provider>
  );
}

export function useDemoState(): DemoState {
  const ctx = useContext(StateCtx);
  if (!ctx) throw new Error("useDemoState must be used inside DemoStateProvider");
  return ctx;
}

export function useDemoDispatch(): Dispatch<DemoAction> {
  const ctx = useContext(DispatchCtx);
  if (!ctx) throw new Error("useDemoDispatch must be used inside DemoStateProvider");
  return ctx;
}

// Navigating to a screen and seeding the state it assumes are fused into one call —
// this is what makes a presenter's direct jump (PresenterNav) and the sequential
// "Next ->" flow the SAME code path rather than two. Screen switches synchronously;
// scripted detectors resolve near-instantly today, and this is the one seam that
// absorbs real network latency later without any caller changing.
export function useNavigate() {
  const state = useDemoState();
  const dispatch = useDemoDispatch();
  return useCallback(
    (screen: ScreenId) => {
      dispatch({ type: "NAVIGATE", screen });
      void seedScreen(screen, state, dispatch);
    },
    [state, dispatch],
  );
}
