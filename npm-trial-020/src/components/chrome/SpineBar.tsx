import { RotateCcw } from "lucide-react";
import { useDemoState } from "@/state/DemoStateContext";
import { spineStagePercent, spineStageStatus } from "@/state/selectors";
import type { SpineStageId } from "@/state/types";
import { SpineStage } from "./SpineStage";

const STAGES: { id: SpineStageId; label: string }[] = [
  { id: "precedent", label: "Precedent" },
  { id: "grid", label: "Grid" },
  { id: "term-sheet-commitment", label: "Term Sheet / Commitment" },
  { id: "credit-agreement", label: "Credit Agreement" },
  { id: "post-close", label: "Post-Close" },
];

// Persistent on every authenticated screen — chrome, not a page feature. The model is
// a loop, not a line: Post-Close can send a deal back to Precedent on refinancing,
// shown here as an explicit connecting arrow rather than a one-way progress metaphor.
export function SpineBar() {
  const state = useDemoState();
  const activeStageId = STAGES.find((s) => spineStageStatus(state, s.id) !== "complete")?.id ?? "post-close";

  return (
    <div className="flex flex-none items-center gap-1 border-b border-[rgba(0,0,0,0.08)] bg-white px-4 py-2">
      {STAGES.map((stage, i) => (
        <div key={stage.id} className="flex min-w-0 flex-1 items-center gap-1">
          <SpineStage
            label={stage.label}
            status={spineStageStatus(state, stage.id)}
            percent={spineStagePercent(state, stage.id)}
            active={stage.id === activeStageId}
          />
          {i === STAGES.length - 1 && (
            <span className="flex flex-none items-center gap-1 pl-1 pr-0.5 text-[#bbbbbb]" title="Refinancing loops a deal back to Precedent">
              <RotateCcw className="h-3.5 w-3.5" strokeWidth={2} />
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
