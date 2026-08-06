import { useState } from "react";
import { ArrowLeft, MessageSquare, SlidersHorizontal } from "lucide-react";
import { DealPicker } from "@/components/gridPicker/DealPicker";
import { SingleDealWorkflow } from "@/components/gridPicker/SingleDealWorkflow";
import type { Scenario } from "@/state/types";

type Mode = "ask" | "workflow";

// The deal picker gates BOTH modes — choosing a matter is the first thing an
// associate does, before "ask" or "workflow" even makes sense as a choice.
// Once a matter is chosen, the two modes are just different presentational
// paths into the same resolved Scenario: typing a question, or tapping through
// the matter's own Grid the way the real app works. Either one calls the same
// onAsk(scenario, question) — never two different answers for one matter.
export function AtomicAskModal({ onAsk, onClose }: { onAsk: (scenario: Scenario, rawText: string) => void; onClose: () => void }) {
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [mode, setMode] = useState<Mode>("ask");
  const [text, setText] = useState("");

  function chooseScenario(s: Scenario) {
    setScenario(s);
    setText(s.question);
    setMode("ask");
  }

  function changeMatter() {
    setScenario(null);
    setText("");
  }

  function submitAsk() {
    if (!scenario) return;
    onAsk(scenario, text.trim() || scenario.question);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className={`max-h-[90vh] w-full overflow-y-auto rounded-2xl bg-white p-5 shadow-xl ${scenario ? "max-w-xl" : "max-w-md"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="font-mono text-[10px] font-semibold uppercase tracking-wide text-[#9a9a9a]">
          {scenario ? "Ask one question" : "Choose a matter"}
        </div>
        <h2 className="mt-0.5 text-base font-semibold text-[#1c1e1a]">
          {scenario ? "What do you want to check?" : "Which matter are you working?"}
        </h2>

        {!scenario ? (
          <DealPicker onSelect={chooseScenario} />
        ) : (
          <>
            <button type="button" onClick={changeMatter} className="mt-2 flex items-center gap-1 text-xs font-medium text-[#7a7a7a] hover:text-[#1c1e1a]">
              <ArrowLeft className="h-3.5 w-3.5" /> Change matter
            </button>
            <div className="mt-1 text-sm font-semibold text-[#1c1e1a]">{scenario.dealName}</div>

            <div className="mt-3 flex gap-1.5">
              <button
                type="button"
                onClick={() => setMode("ask")}
                className={`flex items-center gap-1.5 rounded-[6px] px-2.5 py-1.5 text-xs font-bold ${
                  mode === "ask" ? "bg-[#1c1e1a] text-white" : "border-2 border-[#d9d9d9] text-[#7a7a7a] hover:border-[#bbbbbb]"
                }`}
              >
                <MessageSquare className="h-3.5 w-3.5" />
                Ask in plain language
              </button>
              <button
                type="button"
                onClick={() => setMode("workflow")}
                className={`flex items-center gap-1.5 rounded-[6px] px-2.5 py-1.5 text-xs font-bold ${
                  mode === "workflow" ? "bg-[#1c1e1a] text-white" : "border-2 border-[#d9d9d9] text-[#7a7a7a] hover:border-[#bbbbbb]"
                }`}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Workflow
              </button>
            </div>

            {mode === "ask" ? (
              <div className="mt-3">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-[rgba(0,0,0,0.08)] px-3 py-2 text-sm text-[#1c1e1a] focus:border-[#2354e8] focus:outline-none"
                />
                <p className="mt-1.5 text-[11px] leading-relaxed text-[#9a9a9a]">
                  Whatever you type is echoed as the question above the split screen — this matter's own worked example
                  resolves either way.
                </p>
                <button
                  type="button"
                  onClick={submitAsk}
                  className="mt-2.5 w-full rounded-[6px] py-2 text-sm font-bold text-white"
                  style={{ background: "var(--accent-blue)" }}
                >
                  Ask
                </button>
              </div>
            ) : (
              <SingleDealWorkflow scenario={scenario} onAsk={onAsk} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
