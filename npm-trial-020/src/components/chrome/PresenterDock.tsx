import { useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import { useDemoState, useNavigate } from "@/state/DemoStateContext";
import { nextMomentFrom } from "@/state/momentSequence";
import type { ScreenId } from "@/state/types";

const GROUPS: { label: string; items: { id: ScreenId; label: string }[] }[] = [
  { label: "Start", items: [{ id: "dashboard", label: "Dashboard" }] },
  {
    label: "Core sequence",
    items: [
      { id: "a0", label: "A0 — Open the deal" },
      { id: "a2a", label: "A2a — Search precedents" },
      { id: "a2", label: "A2 — Confirm precedent" },
      { id: "b1", label: "B1 — Grid" },
      { id: "b2", label: "B2 — Undefined term" },
    ],
  },
  {
    label: "Later",
    items: [
      { id: "a1", label: "A1 — Search" },
      { id: "c1", label: "C1 — Term sheet diff" },
      { id: "e2", label: "E2 — Cross-practice" },
    ],
  },
  {
    label: "Closing",
    items: [
      { id: "closing-f1", label: "F1 — Teaching artifact" },
      { id: "closing-f3", label: "F3 — Scope boundary" },
    ],
  },
];

const LONG_PRESS_MS = 450;

// Deliberately unlabeled and out of the audience's sightline — a presenter control,
// not a product feature. Click advances to the next moment in MOMENT_SEQUENCE (same
// order the ArrowRight shortcut uses — one canonical sequence, not two); press and
// hold opens the full jump list for an out-of-order dive, still calling the same
// navigate() every other entry point uses, so seeding never diverges by trigger.
export function PresenterDock() {
  const [open, setOpen] = useState(false);
  const state = useDemoState();
  const navigate = useNavigate();
  const timerRef = useRef<number | null>(null);
  const longPressFired = useRef(false);

  function clearTimer() {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  function handlePointerDown() {
    longPressFired.current = false;
    clearTimer();
    timerRef.current = window.setTimeout(() => {
      longPressFired.current = true;
      setOpen(true);
    }, LONG_PRESS_MS);
  }

  function handlePointerUp() {
    clearTimer();
    if (!longPressFired.current) {
      navigate(nextMomentFrom(state.screen));
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="dropdown-animate absolute bottom-12 right-0 z-40 w-72 rounded-xl border border-[rgba(0,0,0,0.08)] bg-white p-1 shadow-[0_14px_34px_rgba(0,0,0,0.15)]">
            {GROUPS.map((group) => (
              <div key={group.label} className="border-b border-[rgba(0,0,0,0.06)] py-1 last:border-b-0">
                <div className="px-2.5 pb-1 pt-1 font-mono text-[9px] font-semibold uppercase tracking-wide text-[#bbbbbb]">
                  {group.label}
                </div>
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      navigate(item.id);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm transition-colors hover:bg-[#f5f6f9] ${
                      state.screen === item.id ? "font-semibold text-[#2354e8]" : "text-[#1c1e1a]"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            ))}
            <div className="mt-1 border-t border-[rgba(0,0,0,0.08)] px-2.5 pt-2 pb-1 text-xs text-[#bbbbbb]">
              Click the dot to advance · hold to jump · ArrowRight also advances
            </div>
          </div>
        </>
      )}
      <button
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={clearTimer}
        onContextMenu={(e) => e.preventDefault()}
        title="Next moment (hold for full list)"
        className="grid h-8 w-8 place-items-center rounded-full border border-[rgba(0,0,0,0.08)] bg-white text-[#bbbbbb] shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition-colors hover:text-[#7a7a7a] active:scale-95"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
