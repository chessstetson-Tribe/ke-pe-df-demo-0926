import { RotateCcw, FlaskConical } from "lucide-react";
import { VanillaPane } from "@/components/panes/VanillaPane";
import { TribePane } from "@/components/panes/TribePane";
import { RerunRow } from "@/components/panes/RerunRow";
import type { Scenario, TribeBeat } from "@/state/types";

export function SplitScreen({
  scenario,
  askedText,
  beat,
  onTribeAnswered,
  onConfirmGap,
  onRerun,
  onReset,
}: {
  scenario: Scenario;
  askedText: string;
  beat: TribeBeat;
  onTribeAnswered: () => void;
  onConfirmGap: () => void;
  onRerun: () => void;
  onReset: () => void;
}) {
  const factCommitted = beat === "corrected" || beat === "reran";

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="font-mono text-[10px] font-semibold uppercase tracking-wide text-[#9a9a9a]">You asked</div>
          <h1 className="mt-0.5 text-lg font-semibold tracking-tight text-[#1c1e1a]">{askedText || scenario.question}</h1>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="flex flex-none items-center gap-1.5 rounded-[6px] border-2 border-[#d9d9d9] px-2.5 py-1.5 text-xs font-bold text-[#7a7a7a] hover:border-[#bbbbbb] hover:text-[#1c1e1a]"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Ask another question
        </button>
      </div>

      {scenario.isStub && (
        <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-[#fef8e7] px-3 py-2 text-xs text-[#b67c2a]">
          <FlaskConical className="h-3.5 w-3.5 flex-none" />
          <span>
            Illustrative stub — this combination isn't a fully-sourced worked example. Use the suggestion chips in the ask
            modal, or a resolved category/concern pair, for one of the 9 real cases.
          </span>
        </div>
      )}

      <div className="mt-5 grid grid-cols-2 gap-4">
        <VanillaPane
          dealName={scenario.dealName}
          pageCount={scenario.vanilla.pageCount}
          chunkCount={scenario.vanilla.chunkCount}
          scanLines={scenario.vanilla.scanLines}
          answer={scenario.vanilla.answer}
          isStub={scenario.isStub}
        />
        <TribePane
          scenario={scenario}
          fact={factCommitted ? scenario.tribe.fact : null}
          onAnswered={onTribeAnswered}
          onConfirm={onConfirmGap}
        />
      </div>

      {factCommitted && beat !== "reran" && (
        <div className="mt-4 flex items-center justify-center">
          <button
            type="button"
            onClick={onRerun}
            className="rounded-[6px] px-3 py-1.5 text-xs font-bold text-white"
            style={{ background: "var(--accent-blue)" }}
          >
            Run this same question on a second deal →
          </button>
        </div>
      )}

      {beat === "reran" && <RerunRow scenario={scenario} />}
    </div>
  );
}
