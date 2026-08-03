import { useState } from "react";
import { ChevronDown, Compass } from "lucide-react";
import { useDemoState, useNavigate } from "@/state/DemoStateContext";
import type { ScreenId } from "@/state/types";
import { FOCUS } from "@/components/shared/focus";

const GROUPS: { label: string; items: { id: ScreenId; label: string }[] }[] = [
  { label: "Start", items: [{ id: "dashboard", label: "Dashboard" }] },
  {
    label: "Core sequence",
    items: [
      { id: "a0", label: "A0 — Open the deal" },
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

// Deliberately a "god-mode" jump list, independent of persona/flow gating — this is a
// live-presenter tool, and a presenter must be able to jump straight to any moment,
// not just click "next." Navigating here and the in-screen "Next ->" buttons call the
// exact same navigate() helper, so a direct jump seeds identically to a sequential run.
export function PresenterNav() {
  const [open, setOpen] = useState(false);
  const state = useDemoState();
  const navigate = useNavigate();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-[#1c1e1a] hover:bg-[#f5f6f9] ${FOCUS}`}
      >
        <Compass className="h-3.5 w-3.5 text-[#9a9a9a]" />
        Moments
        <ChevronDown className="h-3.5 w-3.5 text-[#9a9a9a]" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="dropdown-animate absolute left-0 top-9 z-40 w-72 rounded-xl border border-[rgba(0,0,0,0.08)] bg-white p-1 shadow-[0_14px_34px_rgba(0,0,0,0.15)]">
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
          </div>
        </>
      )}
    </div>
  );
}
