import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, GitBranch } from "lucide-react";
import { Chip } from "@/components/shared/Chip";
import { MiniGraph } from "@/components/panes/MiniGraph";
import type { ScaffoldFact, Scenario } from "@/state/types";

type Step = "traversing" | "answer";

// Mirrors VanillaPane's timing so both sides land their "answer" at roughly the
// same moment — the point is that Tribe's answer additionally names what it can't
// yet resolve, not that it's slower. The confirm step is the one thing that is
// NOT on a timer: it waits for a real click, because the learning-loop point only
// lands if the correction is something the viewer did, not something that
// happened to them.
export function TribePane({
  scenario,
  fact,
  onAnswered,
  onConfirm,
}: {
  scenario: Scenario;
  fact: ScaffoldFact | null;
  onAnswered?: () => void;
  onConfirm: () => void;
}) {
  const { tribe, dealName } = scenario;
  const [step, setStep] = useState<Step>("traversing");

  useEffect(() => {
    setStep("traversing");
    const t = setTimeout(() => {
      setStep("answer");
      onAnswered?.();
    }, 1500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dealName]);

  return (
    <div className="flex h-full flex-col rounded-xl border p-5" style={{ borderColor: "var(--tribe-border)", background: "var(--tribe-bg)" }}>
      <div className="flex items-center justify-between">
        <div className="font-mono text-[10px] font-semibold uppercase tracking-wide" style={{ color: "var(--tribe-accent)" }}>
          Tribe
        </div>
        <Chip variant="purple">{scenario.isStub ? "stub" : "scaffold traversal"}</Chip>
      </div>
      <div className="mt-1 text-sm font-semibold text-[#1c1e1a]">{dealName}</div>

      <div className="mt-3 flex items-center gap-1.5 text-xs" style={{ color: "var(--tribe-text)" }}>
        <GitBranch className="h-3.5 w-3.5" />
        <span>{step === "traversing" ? "Traversing the scaffold…" : `${tribe.assertions.length} typed assertions consulted`}</span>
      </div>

      <div className="mt-2.5">
        <MiniGraph nodes={tribe.nodes} active={step === "answer"} />
      </div>

      {step === "answer" && (
        <div className="mt-2.5 space-y-1">
          {tribe.assertions.map((line, i) => (
            <div
              key={line}
              className="rounded-[4px] border px-2 py-1 font-mono text-[10px]"
              style={{ borderColor: "var(--tribe-border)", color: "var(--tribe-text)", animation: `chunk-flood-in 0.3s ease-out ${i * 0.06}s backwards` }}
            >
              {line}
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 flex-1">
        {step === "answer" && (
          <div className="rounded-lg border bg-white p-3" style={{ borderColor: "var(--tribe-border)" }}>
            <p className="text-sm leading-relaxed text-[#1c1e1a]">{tribe.answer}</p>

            {scenario.kind === "miss" ? (
              <div className="mt-3 flex items-start gap-1.5 rounded-lg bg-[#f1ffed] px-2.5 py-2 text-xs text-[#10793d]">
                <CheckCircle2 className="mt-0.5 h-3 w-3 flex-none" />
                <div>
                  <span className="font-bold">{tribe.correctionLabel}. </span>
                  <span>{tribe.correctionDetail}</span>
                </div>
              </div>
            ) : !fact ? (
              <div className="mt-3 rounded-lg border border-[#e6d1ff] bg-[#faf5ff] p-2.5">
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 flex-none" style={{ color: "var(--tribe-accent)" }} />
                  <span className="text-xs font-bold" style={{ color: "var(--tribe-accent)" }}>
                    {tribe.gapLabel}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-relaxed" style={{ color: "var(--tribe-text)" }}>
                  {tribe.gapDetail}
                </p>
                <button
                  type="button"
                  onClick={onConfirm}
                  className="mt-2 rounded-[6px] px-2.5 py-1 text-xs font-bold text-white"
                  style={{ background: "var(--tribe-accent)" }}
                >
                  {tribe.confirmCta}
                </button>
              </div>
            ) : (
              <div className="mt-3 flex items-start gap-1.5 rounded-lg bg-[#f1ffed] px-2.5 py-2 text-xs text-[#10793d]">
                <CheckCircle2 className="mt-0.5 h-3 w-3 flex-none" />
                <span>
                  Added to the shared scaffold — set by {fact.author}, scope: {fact.scope}. Source: {fact.sourceAnchor}.
                </span>
              </div>
            )}

            {tribe.scaleNote && (
              <p className="mt-2.5 text-[11px] leading-relaxed text-[#9a9a9a]">{tribe.scaleNote}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
