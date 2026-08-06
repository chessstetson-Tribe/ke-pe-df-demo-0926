import { useState } from "react";
import { AlertTriangle, ArrowLeft, ChevronRight, Plus, ThumbsDown, ThumbsUp } from "lucide-react";
import { Chip } from "@/components/shared/Chip";
import { MiniSpineBar } from "@/components/gridPicker/MiniSpineBar";
import { NEW_TERM_HANDLING_SCENARIO } from "@/data/scenarios/library";
import type { Scenario } from "@/state/types";

type Step = "list" | "detail";

// Real terms the extraction spike found clean across all 15 documents —
// shown as inert filler rows so the selected matter's grid doesn't look like
// it has exactly one term in it, the way a real grid never does.
const FILLER_TERMS = ["Date", "Fees", "Call Protection"];

function previewFor(scenario: Scenario): { value: string; badgeLabel: string; badgeVariant: "amber" | "purple" } {
  if (scenario.kind === "gap") {
    return { value: "No value extracted", badgeLabel: "Awaiting Kirkland input", badgeVariant: "purple" };
  }
  const raw = scenario.vanilla.answer;
  return { value: raw.length > 78 ? `${raw.slice(0, 78)}…` : raw, badgeLabel: "Needs review", badgeVariant: "amber" };
}

// The per-matter iPhone-style tap flow the deal picker gates into: open the
// matter's own Grid, tap its one flagged term, decide to run it against Tribe.
// Whatever the presenter taps through, the button at the bottom calls the same
// onAsk(scenario, question) "Ask in plain language" would — two paths into the
// same worked example, never two different answers for the same matter.
export function SingleDealWorkflow({ scenario, onAsk }: { scenario: Scenario; onAsk: (scenario: Scenario, question: string) => void }) {
  const [step, setStep] = useState<Step>("list");
  const isNewTerm = scenario.id === NEW_TERM_HANDLING_SCENARIO.id;
  const preview = previewFor(scenario);

  if (step === "detail" && isNewTerm) {
    return (
      <div className="mt-3">
        <button type="button" onClick={() => setStep("list")} className="flex items-center gap-1 text-xs font-medium text-[#7a7a7a] hover:text-[#1c1e1a]">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to grid
        </button>
        <div className="mt-2 flex items-start gap-2.5 rounded-xl border border-[#e6d1ff] bg-[#faf5ff] p-3.5">
          <AlertTriangle className="mt-0.5 h-4 w-4 flex-none" style={{ color: "var(--tribe-accent)" }} />
          <div>
            <div className="text-sm font-semibold text-[#1c1e1a]">Term not on this grid</div>
            <p className="mt-1 text-xs leading-relaxed text-[#6b46a3]">
              This matter has language that isn't yet in the firm's extraction schema. Before it's treated as
              gradeable anywhere, it needs a schema owner to confirm it belongs and how it should be extracted.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onAsk(scenario, scenario.question)}
          className="mt-3 w-full rounded-[8px] py-2 text-sm font-bold text-white"
          style={{ background: "var(--accent-blue)" }}
        >
          Route to schema owner →
        </button>
      </div>
    );
  }

  if (step === "detail") {
    return (
      <div className="mt-3">
        <button type="button" onClick={() => setStep("list")} className="flex items-center gap-1 text-xs font-medium text-[#7a7a7a] hover:text-[#1c1e1a]">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to grid
        </button>

        <div className="mt-2 rounded-xl border border-[rgba(0,0,0,0.08)] bg-white p-3.5">
          <div className="flex items-start justify-between gap-2">
            <div className="text-sm font-semibold text-[#1c1e1a]">{scenario.shortLabel}</div>
            <Chip variant={preview.badgeVariant}>{preview.badgeLabel}</Chip>
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-[#3a3a3a]">{preview.value}</p>
          {scenario.vanilla.scanLines[0] && (
            <div className="mt-2 font-mono text-[10px] text-[#9a9a9a]">{scenario.vanilla.scanLines[0]}</div>
          )}
          <div className="mt-2.5 flex items-center gap-2 border-t border-[rgba(0,0,0,0.06)] pt-2.5">
            <span className="text-xs text-[#9a9a9a]">Is this extraction right?</span>
            <button type="button" className="rounded-[6px] border-2 border-[#d9d9d9] p-1 text-[#7a7a7a] hover:border-[#bbbbbb]" title="Looks right">
              <ThumbsUp className="h-3 w-3" />
            </button>
            <button type="button" className="rounded-[6px] border-2 border-[#d9d9d9] p-1 text-[#7a7a7a] hover:border-[#bbbbbb]" title="Not sure">
              <ThumbsDown className="h-3 w-3" />
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onAsk(scenario, scenario.question)}
          className="mt-3 w-full rounded-[8px] py-2 text-sm font-bold text-white"
          style={{ background: "var(--accent-blue)" }}
        >
          Compare against Tribe's scaffold →
        </button>
      </div>
    );
  }

  return (
    <div className="mt-3">
      <MiniSpineBar />
      <div className="mt-2 font-mono text-[10px] font-semibold uppercase tracking-wide text-[#9a9a9a]">{scenario.dealName} — Grid</div>

      <div className="mt-1.5 space-y-1">
        {FILLER_TERMS.map((label) => (
          <div key={label} className="flex items-center justify-between gap-2 rounded-lg px-2.5 py-2 opacity-60">
            <div className="text-sm font-medium text-[#1c1e1a]">{label}</div>
            <Chip variant="green">Reviewed · confirmed</Chip>
          </div>
        ))}

        {isNewTerm ? (
          <button
            type="button"
            onClick={() => setStep("detail")}
            className="flex w-full items-center gap-2 rounded-lg border border-dashed border-[#d9d9d9] px-2.5 py-2 text-left text-[#7a7a7a] hover:border-[#bbbbbb] hover:text-[#1c1e1a]"
          >
            <Plus className="h-3.5 w-3.5 flex-none" />
            <span className="text-sm font-medium">Flag this unrecognized term</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setStep("detail")}
            className="flex w-full items-center justify-between gap-2 rounded-lg border border-[#2354e8] bg-[#ecf4ff] px-2.5 py-2 text-left"
          >
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-[#1c1e1a]">{scenario.shortLabel}</div>
              <div className={`truncate text-xs ${scenario.kind === "gap" ? "italic text-[#9a9a9a]" : "text-[#7a7a7a]"}`}>{preview.value}</div>
            </div>
            <div className="flex flex-none items-center gap-1.5">
              <Chip variant={preview.badgeVariant}>{preview.badgeLabel}</Chip>
              <ChevronRight className="h-3.5 w-3.5 text-[#2354e8]" />
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
