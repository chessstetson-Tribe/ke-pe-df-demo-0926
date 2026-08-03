import { ArrowRight, GraduationCap } from "lucide-react";
import { useDemoState } from "@/state/DemoStateContext";
import type { CorrectionRecord } from "@/state/types";

function CorrectionCard({ correction, onCurrentGrid }: { correction: CorrectionRecord; onCurrentGrid: boolean }) {
  return (
    <div className="rounded-xl border border-[rgba(0,0,0,0.08)] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-semibold text-[#1c1e1a]">{correction.gridTermLabel}</span>
        {onCurrentGrid && (
          <span className="rounded-[4px] bg-[#ecf4ff] px-1.5 py-0.5 text-[9px] font-bold uppercase text-[#2354e8]">
            On your current grid
          </span>
        )}
      </div>
      <div className="mt-2 flex items-center gap-2 text-sm">
        <span className="text-[#9a9a9a] line-through">{correction.originalValue ?? "—"}</span>
        <ArrowRight className="h-3.5 w-3.5 flex-none text-[#bbbbbb]" />
        <span className="font-semibold text-[#1c1e1a]">{correction.correctedValue}</span>
      </div>
      <div className="mt-3 rounded-lg bg-[#f5f6f9] p-3">
        <div className="font-mono text-[9px] font-semibold uppercase tracking-wide text-[#9a9a9a]">Reasoning</div>
        <p className="mt-1 text-sm leading-relaxed text-[#3a3a3a]">{correction.reasoning}</p>
      </div>
      <div className="mt-2 text-xs text-[#9a9a9a]">Corrected by: {correction.authorPersona}</div>
    </div>
  );
}

// Treats a correction not as a one-time fix but as reusable teaching material —
// directly answering the concern that automation could hollow out how junior
// associates learn. Corrections carry their REASONING, not just the final value
// (state.corrections / CorrectionRecord.reasoning), and are retrievable by
// term-similarity (gridTermLabel) across deals, not just within the deal where the
// correction originally happened.
export function ClosingF1Screen() {
  const state = useDemoState();
  const isJunior = state.persona.personaId === "associate" && state.persona.seniority === "junior";

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto max-w-2xl px-6 py-8">
        <div className="font-mono text-[10px] font-semibold uppercase tracking-wide text-[#9a9a9a]">
          Closing — F1 · Correction becomes a teaching artifact
        </div>
        <div className="mt-2 flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-[#9e46ff]" />
          <h1 className="text-xl font-semibold tracking-tight text-[#1c1e1a]">
            {isJunior ? "Worked examples for you" : "Corrections on record"}
          </h1>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-[#7a7a7a]">
          {isJunior
            ? "A senior associate's past correction on a similar term, surfaced here because you're working a deal that hits the same term — not just the right answer, but how they reasoned to it."
            : "Every correction records reasoning, not just a value, so it can resurface as a worked example the next time a junior associate hits a similar term on a different deal."}
        </p>

        <div className="mt-5 space-y-3">
          {state.corrections.map((correction) => (
            <CorrectionCard
              key={correction.id}
              correction={correction}
              onCurrentGrid={state.grid.some((t) => t.label === correction.gridTermLabel)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
