import { useDemoState } from "@/state/DemoStateContext";
import { canSeeField } from "@/data/fieldSensitivity";
import { DIFF_FUNNEL } from "@/data/sunGardDiff";
import type { DiffFlag } from "@/state/types";

const FUNNEL_STEPS: { key: keyof typeof DIFF_FUNNEL; label: string; cls: string }[] = [
  { key: "rawFlagCount", label: "Raw flags", cls: "bg-[#d1d5db]" },
  { key: "attorneyRelevantCount", label: "Attorney-relevant", cls: "bg-[#2354e8]" },
  { key: "clientShownCount", label: "Client-shown", cls: "bg-[#16a34a]" },
];

function FlagRow({ flag }: { flag: DiffFlag }) {
  const isLegalComment = flag.triage === "legal-comment";
  return (
    <div className="rounded-lg border border-[rgba(0,0,0,0.08)] bg-white p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-semibold text-[#1c1e1a]">{flag.clause}</span>
        <span
          className={`rounded-[4px] px-1.5 py-0.5 text-[9px] font-bold uppercase ${
            isLegalComment ? "bg-[#f3f4f6] text-[#6b7280]" : "bg-[#ecf4ff] text-[#2354e8]"
          }`}
        >
          {isLegalComment ? "Legal comment" : "Business issue"}
        </span>
      </div>
      <div className="mt-1.5 grid grid-cols-2 gap-3 text-xs">
        <div><span className="text-[#9a9a9a]">Term sheet: </span><span className="text-[#7a7a7a]">{flag.termSheetLanguage}</span></div>
        <div><span className="text-[#9a9a9a]">Credit agmt: </span><span className="text-[#7a7a7a]">{flag.creditAgreementLanguage}</span></div>
      </div>
    </div>
  );
}

// Persona-gated view: Partner sees only the client-shown business-issue list, never
// raw flags or internal legal comments — reusing the SAME fieldSensitivity lookup
// from Phase 1 (canSeeField was already denying "internal-legal-comment" to Partner
// before this moment existed). Legal-comment rows are FILTERED here, not shown as a
// redacted placeholder — a short clean list is the point, not a long list with some
// rows blanked out.
export function C1DiffScreen() {
  const state = useDemoState();
  const canSeeLegalComments = canSeeField(state.persona, "internal-legal-comment");
  const visibleFlags = state.diffFlags.filter((f) => f.triage === "business-issue" || canSeeLegalComments);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto max-w-3xl px-6 py-8">
        <div className="font-mono text-[10px] font-semibold uppercase tracking-wide text-[#9a9a9a]">
          Moment C1 — Term sheet ↔ credit agreement diff
        </div>
        <h1 className="mt-1 text-xl font-semibold tracking-tight text-[#1c1e1a]">SunGard — Triaged Divergences</h1>
        <p className="mt-1 text-xs text-[#bbbbbb]">
          Illustrative pair — none of the 15 real Covenant Extraction Spike deals have a paired term sheet in the
          source material.
        </p>

        {!canSeeLegalComments ? (
          <p className="mt-4 text-sm leading-relaxed text-[#7a7a7a]">
            {visibleFlags.length} item{visibleFlags.length === 1 ? "" : "s"} need your review — everything routine
            has already been triaged out.
          </p>
        ) : (
          <div className="mt-5 space-y-2">
            {FUNNEL_STEPS.map((step) => {
              const count = DIFF_FUNNEL[step.key];
              const pct = Math.max(6, Math.round((count / DIFF_FUNNEL.rawFlagCount) * 100));
              return (
                <div key={step.key}>
                  <div className="mb-1 flex items-baseline justify-between">
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-wide text-[#9a9a9a]">{step.label}</span>
                    <span className="font-serif text-lg font-semibold text-[#1c1e1a]">{count}</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#f3f4f6]">
                    <div className={`h-full rounded-full ${step.cls}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-6">
          <div className="mb-2 flex items-baseline justify-between">
            <h2 className="text-sm font-bold text-[#1c1e1a]">{canSeeLegalComments ? "Sample flags" : "Client-shown list"}</h2>
            <span className="text-xs font-medium text-[#9a9a9a]">{visibleFlags.length} shown</span>
          </div>
          <div className="space-y-2">
            {visibleFlags.map((flag) => (
              <FlagRow key={flag.id} flag={flag} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
