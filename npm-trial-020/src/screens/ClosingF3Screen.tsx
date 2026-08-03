import { useState } from "react";
import { FileWarning } from "lucide-react";
import { ScopeBoundaryNotice } from "@/components/chrome/ScopeBoundaryNotice";
import { FOCUS } from "@/components/shared/focus";

// States its own scope boundary plainly rather than quietly producing an incomplete
// answer — a system that names its own gaps reads as more credible to a sophisticated
// room than one that stays silent about them.
export function ClosingF3Screen() {
  const [attempted, setAttempted] = useState(false);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto max-w-2xl px-6 py-8">
        <div className="font-mono text-[10px] font-semibold uppercase tracking-wide text-[#9a9a9a]">
          Closing — F3 · Scope self-awareness
        </div>
        <h1 className="mt-1 text-xl font-semibold tracking-tight text-[#1c1e1a]">Fee Letter — Economics (OID / Market Flex)</h1>

        {!attempted ? (
          <div className="mt-4 rounded-xl border border-[rgba(0,0,0,0.08)] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <div className="flex items-center gap-2">
              <FileWarning className="h-4 w-4 text-[#7a7a7a]" />
              <span className="text-sm font-semibold text-[#1c1e1a]">Extract pricing terms</span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-[#7a7a7a]">
              Try pulling the original issue discount and market-flex terms from the fee letter for this facility.
            </p>
            <button
              onClick={() => setAttempted(true)}
              className={`mt-4 rounded-[10px] bg-[#2354e8] px-3.5 py-2 text-sm font-bold text-white transition-transform transition-colors hover:bg-[#1a45c0] active:scale-[0.97] ${FOCUS}`}
            >
              Extract from fee letter
            </button>
          </div>
        ) : (
          <div className="mt-4">
            <ScopeBoundaryNotice
              title="Fee letters are not currently in extraction scope"
              body="OID and market-flex economics live in the fee letter, a document type separate from the credit agreement. This build only extracts from credit agreements — logging this as an open scope question for firm sign-off, rather than returning a partial or misleading figure."
            />
          </div>
        )}
      </div>
    </div>
  );
}
