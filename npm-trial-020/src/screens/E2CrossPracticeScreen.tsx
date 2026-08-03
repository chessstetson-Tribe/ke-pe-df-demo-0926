import { ArrowRight, Check, GitBranch } from "lucide-react";
import { useDemoDispatch, useDemoState } from "@/state/DemoStateContext";
import type { CrossPracticeEvent, NextActionItem } from "@/state/types";

// System-initiated — no associate action required to trigger the underlying event;
// the associate/partner then choose how to respond. Demonstrates reasoning ACROSS
// practice areas: the trigger is modeled as an external M&A-side feed, not anything
// living inside Debt Finance's own document set. Pending events are seeded by
// momentSeeds.ts like every other moment (not fetched locally here) — that's what
// makes a cold direct-jump into E2 resolve "the deal being worked" the same way B1/B2
// do, instead of silently looking empty.
export function E2CrossPracticeScreen() {
  const state = useDemoState();
  const dispatch = useDemoDispatch();

  function route(event: CrossPracticeEvent) {
    const nextActionId = `e2-${event.id}`;
    const nextAction: NextActionItem = {
      id: nextActionId,
      title: "Review cross-practice entity flag",
      why: event.description,
      stage: "credit-agreement",
      routedTo: "associate",
      priority: 1,
      sourceModule: "e2.crossPractice",
      status: "open",
    };
    dispatch({
      type: "TRIGGER_CROSS_PRACTICE_EVENT",
      event: { ...event, createdNextActionId: nextActionId },
      nextAction,
    });
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto max-w-2xl px-6 py-8">
        <div className="font-mono text-[10px] font-semibold uppercase tracking-wide text-[#9a9a9a]">
          Moment E2 — Cross-practice notification
        </div>
        <h1 className="mt-1 text-xl font-semibold tracking-tight text-[#1c1e1a]">M&amp;A Event Feed</h1>
        <p className="mt-2 text-sm leading-relaxed text-[#7a7a7a]">
          An event source outside Debt Finance's own document set — the tool watches it independently and connects
          anything relevant back to an existing credit agreement's obligor/guarantor structure.
        </p>

        <div className="mt-5 space-y-3">
          {state.pendingCrossPracticeEvents.length === 0 && state.crossPracticeEvents.length === 0 && (
            <p className="text-sm text-[#9a9a9a]">No cross-practice events pending for this deal.</p>
          )}

          {state.pendingCrossPracticeEvents.map((event) => (
            <div key={event.id} className="rounded-xl border border-[rgba(0,0,0,0.08)] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              <div className="flex items-center gap-1.5">
                <GitBranch className="h-3.5 w-3.5 text-[#ea580c]" />
                <span className="font-mono text-[10px] font-semibold uppercase tracking-wide text-[#9a9a9a]">
                  {event.sourcePractice} event · not yet noticed
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-[#3a3a3a]">{event.description}</p>
              <button
                onClick={() => route(event)}
                className="mt-4 flex items-center gap-1.5 rounded-[10px] bg-[#2354e8] px-3.5 py-2 text-sm font-bold text-white transition-transform transition-colors hover:bg-[#1a45c0] active:scale-[0.97]"
              >
                Route to {event.routedToAttorney}
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}

          {state.crossPracticeEvents.map((event) => (
            <div key={event.id} className="flex items-start gap-2.5 rounded-xl bg-[#f1ffed] p-4">
              <Check className="mt-0.5 h-4 w-4 flex-none text-[#16a34a]" />
              <div>
                <div className="text-sm font-semibold text-[#10793d]">Routed — no manual notice required</div>
                <p className="mt-1 text-xs leading-relaxed text-[#3a6b46]">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
