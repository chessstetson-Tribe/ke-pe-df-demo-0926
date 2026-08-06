import { useState } from "react";
import { MessageSquare, SlidersHorizontal } from "lucide-react";
import { JCREW_TRAPDOOR_SCENARIO, QUESTION_FACETS, RESOLVED_FACET_COMBO, resolveFacetScenario } from "@/data/scenarios/jcrewTrapdoor";
import type { Scenario } from "@/state/types";

type Mode = "ask" | "select";

// The single atomic interaction the whole app hangs off. Two entry styles for the
// same act (typing vs. picking terms), one submit, one resolved Scenario — never
// more than one question in flight, never a multi-turn thread. Only one scenario
// is wired today; both modes say so plainly rather than faking generality
// (live-interactive-explainer.md: "leave one visible seam").
export function AtomicAskModal({ onAsk, onClose }: { onAsk: (scenario: Scenario, rawText: string) => void; onClose: () => void }) {
  const [mode, setMode] = useState<Mode>("ask");
  const [text, setText] = useState("");
  const [facets, setFacets] = useState<Record<string, string>>(RESOLVED_FACET_COMBO);

  const facetsResolved =
    facets.deal === RESOLVED_FACET_COMBO.deal &&
    facets.provision === RESOLVED_FACET_COMBO.provision &&
    facets.concern === RESOLVED_FACET_COMBO.concern;

  function submitAsk() {
    const raw = text.trim() || JCREW_TRAPDOOR_SCENARIO.question;
    onAsk(JCREW_TRAPDOOR_SCENARIO, raw);
  }

  function submitSelect() {
    const resolved = resolveFacetScenario(facets);
    onAsk(resolved, resolved.question);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="font-mono text-[10px] font-semibold uppercase tracking-wide text-[#9a9a9a]">Ask one question</div>
        <h2 className="mt-0.5 text-base font-semibold text-[#1c1e1a]">
          What do you want to check against the precedent bank?
        </h2>

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
            onClick={() => setMode("select")}
            className={`flex items-center gap-1.5 rounded-[6px] px-2.5 py-1.5 text-xs font-bold ${
              mode === "select" ? "bg-[#1c1e1a] text-white" : "border-2 border-[#d9d9d9] text-[#7a7a7a] hover:border-[#bbbbbb]"
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Pick from terms
          </button>
        </div>

        {mode === "ask" ? (
          <div className="mt-3">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={JCREW_TRAPDOOR_SCENARIO.question}
              rows={3}
              className="w-full rounded-lg border border-[rgba(0,0,0,0.08)] px-3 py-2 text-sm text-[#1c1e1a] focus:border-[#2354e8] focus:outline-none"
            />
            <p className="mt-1.5 text-[11px] leading-relaxed text-[#9a9a9a]">
              This live build runs one worked example end-to-end — whatever you type is echoed as the question above the
              split screen that follows.
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
          <div className="mt-3 space-y-2.5">
            {QUESTION_FACETS.map((facet) => (
              <div key={facet.id}>
                <label className="text-[11px] font-semibold text-[#7a7a7a]">{facet.label}</label>
                <select
                  value={facets[facet.id]}
                  onChange={(e) => setFacets((f) => ({ ...f, [facet.id]: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-[rgba(0,0,0,0.08)] bg-white px-2.5 py-1.5 text-sm text-[#1c1e1a] focus:border-[#2354e8] focus:outline-none"
                >
                  {facet.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
            <p className="text-[11px] leading-relaxed text-[#9a9a9a]">
              {facetsResolved
                ? "This combination runs the full, fully-sourced worked example."
                : "This combination will run as an illustrative stub — only KinderCare / Investment baskets / IP leakage is a full worked example right now."}
            </p>
            <button
              type="button"
              onClick={submitSelect}
              className="w-full rounded-[6px] py-2 text-sm font-bold text-white"
              style={{ background: "var(--accent-blue)" }}
            >
              Ask
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
