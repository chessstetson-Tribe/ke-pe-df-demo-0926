import { AlertTriangle } from "lucide-react";
import { useDemoDispatch, useDemoState, useNavigate } from "@/state/DemoStateContext";
import { DEALS, anchorDeal } from "@/data/deals";
import { GridTermRow } from "@/components/shared/GridTermRow";

// Turns manual term-by-term extraction into a review-and-correct motion. Confidence
// is never a single blended score — grounding and review render as two separate
// chips per term, and never look uniformly "done."
export function B1GridScreen() {
  const state = useDemoState();
  const dispatch = useDemoDispatch();
  const navigate = useNavigate();
  const deal = DEALS[state.activeDealId] ?? anchorDeal();
  const undefinedCount = state.grid.filter((t) => t.firmDefinition === "undefined_by_firm").length;

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto max-w-3xl px-6 py-8">
        <div className="font-mono text-[10px] font-semibold uppercase tracking-wide text-[#9a9a9a]">
          Moment B1 — Grid
        </div>
        <h1 className="mt-1 text-xl font-semibold tracking-tight text-[#1c1e1a]">{deal.name}</h1>

        <div className="mt-3 rounded-xl bg-[#f5f6f9] p-3 text-xs leading-relaxed text-[#3a3a3a]">
          Across the Covenant Extraction Spike (690 extractions, 15 credit agreements): <strong>78% correct on first
          pass, 99% after review</strong>. {deal.credibilityNote ? deal.credibilityNote.split(" A Tribe")[0] + "." : ""}
        </div>

        <div className="mt-5 space-y-2">
          {state.grid.map((term) => (
            <div key={term.id}>
              <GridTermRow
                term={term}
                focused={state.focusedGridTermId === term.id}
                onFocus={(id) => dispatch({ type: "FOCUS_GRID_TERM", termId: id })}
                onConfirm={(id) => dispatch({ type: "CONFIRM_GRID_TERM", termId: id })}
                onCorrect={(id, value, reasoning) => dispatch({ type: "CORRECT_GRID_TERM", termId: id, value, reasoning })}
              />
              {term.firmDefinition === "undefined_by_firm" && (
                <button
                  onClick={() => {
                    dispatch({ type: "FOCUS_GRID_TERM", termId: term.id });
                    navigate("b2");
                  }}
                  className="mt-1 ml-1 flex items-center gap-1 text-xs font-bold text-[#9e46ff] hover:underline"
                >
                  <AlertTriangle className="h-3 w-3" />
                  View firm-definition gap →
                </button>
              )}
            </div>
          ))}
        </div>

        {undefinedCount > 0 && (
          <p className="mt-4 text-xs text-[#9a9a9a]">
            {undefinedCount} term{undefinedCount > 1 ? "s" : ""} on this grid have never been defined by the firm — routed to Knowledge Management, not guessed at.
          </p>
        )}
      </div>
    </div>
  );
}
