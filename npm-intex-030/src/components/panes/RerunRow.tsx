import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { Chip } from "@/components/shared/Chip";
import type { Scenario } from "@/state/types";

// The compounding-knowledge payoff, deliberately rendered with NO animation and NO
// delay — the point of this row is "no re-analysis needed," so it should look
// instantaneous next to the first pair's staged reveal, not repeat the same
// scanning/traversing beat.
export function RerunRow({ scenario }: { scenario: Scenario }) {
  const { rerun, tribe } = scenario;
  const tribeAnswer = rerun.tribeAnswerTemplate.replace("{{fact}}", tribe.fact.term);

  return (
    <div className="mt-4 grid grid-cols-2 gap-4">
      <div className="rounded-xl border p-4" style={{ borderColor: "var(--vanilla-border)", background: "var(--vanilla-bg)" }}>
        <div className="flex items-center justify-between">
          <div className="font-mono text-[10px] font-semibold uppercase tracking-wide" style={{ color: "var(--vanilla-accent)" }}>
            OOB Agentic SaaS — {rerun.dealName}
          </div>
        </div>
        <div className="mt-2 rounded-lg border bg-white p-2.5" style={{ borderColor: "var(--vanilla-border)" }}>
          <Chip variant="green">High confidence</Chip>
          <p className="mt-1.5 text-sm leading-relaxed text-[#1c1e1a]">{rerun.vanillaAnswer}</p>
        </div>
        <div className="mt-2 flex items-start gap-1.5 text-xs" style={{ color: "var(--vanilla-text)" }}>
          <AlertTriangle className="mt-0.5 h-3 w-3 flex-none" />
          <span>Same miss as before — the correction on the last deal never reached this one.</span>
        </div>
      </div>

      <div className="rounded-xl border p-4" style={{ borderColor: "var(--tribe-border)", background: "var(--tribe-bg)" }}>
        <div className="flex items-center justify-between">
          <div className="font-mono text-[10px] font-semibold uppercase tracking-wide" style={{ color: "var(--tribe-accent)" }}>
            Tribe — {rerun.dealName}
          </div>
        </div>
        <div className="mt-2 rounded-lg border bg-white p-2.5" style={{ borderColor: "var(--tribe-border)" }}>
          <Chip variant="purple">Firm-defined — resolved instantly</Chip>
          <p className="mt-1.5 text-sm leading-relaxed text-[#1c1e1a]">{tribeAnswer}</p>
        </div>
        <div className="mt-2 flex items-start gap-1.5 text-xs" style={{ color: "var(--tribe-text)" }}>
          <CheckCircle2 className="mt-0.5 h-3 w-3 flex-none" />
          <span>Same fact, same session, a different deal — no re-teaching.</span>
        </div>
      </div>
    </div>
  );
}
