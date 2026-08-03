import type { ScreenId } from "./types";

// The full sequence per KE-Debt-Finance-Demo-Moments.md: A0 -> A1 -> A2 -> B1 -> B2 ->
// C1 -> E2 -> (F1 or F3). Dashboard is prepended as the true start; both closing
// variants are included so "next" can walk through either during rehearsal, looping
// back to Dashboard after F3. Shared by the presenter dock's click-to-advance and the
// keyboard shortcut — one canonical order, not two.
export const MOMENT_SEQUENCE: ScreenId[] = [
  "dashboard",
  "a0",
  "a1",
  "a2",
  "b1",
  "b2",
  "c1",
  "e2",
  "closing-f1",
  "closing-f3",
];

export function nextMomentFrom(current: ScreenId): ScreenId {
  const i = MOMENT_SEQUENCE.indexOf(current);
  if (i === -1) return MOMENT_SEQUENCE[0];
  return MOMENT_SEQUENCE[(i + 1) % MOMENT_SEQUENCE.length];
}
