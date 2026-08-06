import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Chip } from "@/components/shared/Chip";
import { ALL_SCENARIOS } from "@/data/scenarios/library";
import type { Scenario } from "@/state/types";

// The gate in front of both "Ask" and "Workflow" — an iPhone-style card cycler,
// not a dropdown, since choosing a matter is the first thing an associate
// actually does before touching a specific term. Cards show the matter and
// which term is flagged, never the answer — that's what either mode reveals.
export function DealPicker({ onSelect }: { onSelect: (scenario: Scenario) => void }) {
  const [index, setIndex] = useState(0);
  const scenario = ALL_SCENARIOS[index];
  const badge =
    scenario.kind === "gap"
      ? { label: "Awaiting Kirkland input", variant: "purple" as const }
      : { label: "Needs review", variant: "amber" as const };

  function prev() {
    setIndex((i) => (i - 1 + ALL_SCENARIOS.length) % ALL_SCENARIOS.length);
  }
  function next() {
    setIndex((i) => (i + 1) % ALL_SCENARIOS.length);
  }

  return (
    <div className="mt-3">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous matter"
          className="flex-none rounded-full border-2 border-[#d9d9d9] p-1.5 text-[#7a7a7a] hover:border-[#bbbbbb]"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex-1 rounded-xl border border-[rgba(0,0,0,0.08)] bg-[#f5f6f9] p-4 text-center">
          <div className="font-mono text-[9px] font-semibold uppercase tracking-wide text-[#9a9a9a]">
            Matter {index + 1} of {ALL_SCENARIOS.length}
          </div>
          <div className="mt-1 text-sm font-semibold text-[#1c1e1a]">{scenario.dealName}</div>
          <div className="mt-2 flex items-center justify-center gap-1.5">
            <Chip variant={badge.variant}>{badge.label}</Chip>
          </div>
          <div className="mt-1.5 text-xs text-[#7a7a7a]">Flagged term: {scenario.shortLabel}</div>
        </div>

        <button
          type="button"
          onClick={next}
          aria-label="Next matter"
          className="flex-none rounded-full border-2 border-[#d9d9d9] p-1.5 text-[#7a7a7a] hover:border-[#bbbbbb]"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-2.5 flex items-center justify-center gap-1.5">
        {ALL_SCENARIOS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Go to ${s.shortLabel}`}
            className="h-1.5 w-1.5 rounded-full transition-colors"
            style={{ background: i === index ? "var(--accent-blue)" : "#d9d9d9" }}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={() => onSelect(scenario)}
        className="mt-3 w-full rounded-[8px] py-2 text-sm font-bold text-white"
        style={{ background: "var(--accent-blue)" }}
      >
        Open this matter →
      </button>
    </div>
  );
}
