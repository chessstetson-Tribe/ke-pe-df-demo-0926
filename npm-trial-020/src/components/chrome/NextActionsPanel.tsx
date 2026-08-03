import { ListChecks } from "lucide-react";
import { useDemoDispatch, useDemoState } from "@/state/DemoStateContext";
import { rankedNextActions } from "@/state/selectors";
import { NextActionCard } from "./NextActionCard";

// Persistent, always visible — not buried in a menu. Every moment resolves new work
// into this panel rather than surfacing it only inside a sub-screen. Content is
// filtered to the acting persona's routing, so switching personas visibly changes
// what's here — this IS the demonstration that persona selection reshapes the app.
export function NextActionsPanel() {
  const state = useDemoState();
  const dispatch = useDemoDispatch();
  const items = rankedNextActions(state, state.persona.personaId);
  const openCount = items.filter((i) => i.status === "open").length;

  return (
    <aside className="flex w-80 flex-none flex-col overflow-hidden border-l border-[rgba(0,0,0,0.08)] bg-white">
      <div className="flex flex-none items-center gap-2 border-b border-[rgba(0,0,0,0.08)] px-4 py-3">
        <ListChecks className="h-4 w-4 text-[#7a7a7a]" />
        <span className="flex-1 font-mono text-[10px] font-semibold uppercase tracking-wide text-[#9a9a9a]">
          Next actions
        </span>
        <span className="rounded-[4px] bg-[#f3f4f6] px-1.5 py-0.5 text-[10px] font-bold text-[#6b7280]">{openCount}</span>
      </div>
      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
        {items.length === 0 ? (
          <div className="px-1 py-8 text-center text-xs leading-relaxed text-[#bbbbbb]">
            Nothing routed to you right now.
          </div>
        ) : (
          items.map((item, i) => (
            <NextActionCard
              key={item.id}
              item={item}
              rank={i + 1}
              onResolve={(id) => dispatch({ type: "RESOLVE_NEXT_ACTION", id })}
            />
          ))
        )}
      </div>
    </aside>
  );
}
