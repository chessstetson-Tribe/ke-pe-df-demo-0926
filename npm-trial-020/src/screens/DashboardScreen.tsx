import { ArrowRight, FolderOpen } from "lucide-react";
import { useDemoState, useNavigate } from "@/state/DemoStateContext";
import { NEW_MATTER } from "@/data/precedentCorpus";
import { RedactedField } from "@/components/chrome/RedactedField";
import { FOCUS } from "@/components/shared/focus";

// The anchor screen. Spine + Next-Actions are global chrome (always above the fold by
// construction); this screen's own job is the matter-open trigger — Dashboard must
// never present as a blank state waiting for a query.
export function DashboardScreen() {
  const state = useDemoState();
  const navigate = useNavigate();
  const opened = state.selectedPrecedentId !== null || state.precedentCandidates.length > 0;

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto max-w-3xl px-6 py-10">
          <div className="font-mono text-[10px] font-semibold uppercase tracking-wide text-[#9a9a9a]">Dashboard</div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#1c1e1a]">{NEW_MATTER.dealName}</h1>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-[rgba(0,0,0,0.08)] bg-white p-3">
              <div className="font-mono text-[9px] font-semibold uppercase tracking-wide text-[#9a9a9a]">Sponsor</div>
              <div className="mt-1 text-sm font-semibold text-[#1c1e1a]">
                <RedactedField sensitivity="sponsor-identity">{NEW_MATTER.sponsor}</RedactedField>
              </div>
            </div>
            <div className="rounded-xl border border-[rgba(0,0,0,0.08)] bg-white p-3">
              <div className="font-mono text-[9px] font-semibold uppercase tracking-wide text-[#9a9a9a]">Industry</div>
              <div className="mt-1 text-sm font-semibold text-[#1c1e1a]">{NEW_MATTER.industry}</div>
            </div>
            <div className="rounded-xl border border-[rgba(0,0,0,0.08)] bg-white p-3">
              <div className="font-mono text-[9px] font-semibold uppercase tracking-wide text-[#9a9a9a]">Deal size</div>
              <div className="mt-1 text-sm font-semibold text-[#1c1e1a]">
                <RedactedField sensitivity="deal-economics">${(NEW_MATTER.dealSizeUsd / 1_000_000).toFixed(0)}M</RedactedField>
              </div>
            </div>
            <div className="rounded-xl border border-[rgba(0,0,0,0.08)] bg-white p-3">
              <div className="font-mono text-[9px] font-semibold uppercase tracking-wide text-[#9a9a9a]">Covenant</div>
              <div className="mt-1 text-sm font-semibold text-[#1c1e1a]">{NEW_MATTER.covenantFlavor}</div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <div className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4 text-[#2354e8]" />
              <span className="text-sm font-bold text-[#1c1e1a]">{opened ? "Matter open" : "Open this matter"}</span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-[#7a7a7a]">
              {opened
                ? "Precedent candidates have already been matched against this deal's characteristics — no query needed."
                : `${NEW_MATTER.existingDocuments[0].name} is already sitting in the data room. Opening this matter matches it against the firm's whole precedent corpus automatically.`}
            </p>
            <button
              onClick={() => navigate("a0")}
              className={`mt-4 flex items-center gap-1.5 rounded-[10px] bg-[#2354e8] px-3.5 py-2 text-sm font-bold text-white transition-transform transition-colors hover:bg-[#1a45c0] active:scale-[0.97] ${FOCUS}`}
            >
              {opened ? "Review matched precedents" : "Open matter"}
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
  );
}
