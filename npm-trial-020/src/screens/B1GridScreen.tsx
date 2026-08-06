import { AlertTriangle, CheckCircle2, History } from "lucide-react";
import { useDemoDispatch, useDemoState, useNavigate } from "@/state/DemoStateContext";
import { DEALS, anchorDeal } from "@/data/deals";
import { effectiveFirmDefinition, isFirmDefined, priorCorrectionForOtherDeal } from "@/state/selectors";
import { GridTermRow } from "@/components/shared/GridTermRow";

// Turns manual term-by-term extraction into a review-and-correct motion. Confidence
// is never a single blended score — grounding and review render as two separate
// chips per term, and never look uniformly "done."
export function B1GridScreen() {
  const state = useDemoState();
  const dispatch = useDemoDispatch();
  const navigate = useNavigate();
  const deal = DEALS[state.activeDealId] ?? anchorDeal();
  const undefinedCount = state.grid.filter((t) => effectiveFirmDefinition(state, t) === "undefined_by_firm").length;

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
          {state.grid.map((term) => {
            const effective = effectiveFirmDefinition(state, term);
            // Only the STATUS is overridden for display — the seeded term itself is
            // never mutated, so F1/B2's "as originally seeded" story stays intact.
            const displayTerm = effective !== term.firmDefinition ? { ...term, firmDefinition: effective } : term;
            const resolvedDefinition = term.firmDefinition === "undefined_by_firm" ? isFirmDefined(state, term.label) : undefined;
            const priorCorrection =
              term.review !== "corrected" ? priorCorrectionForOtherDeal(state, term.label, state.activeDealId) : undefined;

            return (
              <div key={term.id}>
                <GridTermRow
                  term={displayTerm}
                  focused={state.focusedGridTermId === term.id}
                  onFocus={(id) => dispatch({ type: "FOCUS_GRID_TERM", termId: id })}
                  onConfirm={(id) => dispatch({ type: "CONFIRM_GRID_TERM", termId: id })}
                  onCorrect={(id, value, reasoning) => dispatch({ type: "CORRECT_GRID_TERM", termId: id, value, reasoning })}
                />
                {effective === "undefined_by_firm" && (
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
                {resolvedDefinition && (
                  <div className="mt-1 ml-1 flex items-start gap-1.5 text-xs text-[#10793d]">
                    <CheckCircle2 className="mt-0.5 h-3 w-3 flex-none" />
                    <span>Firm now defines this — resolved by {resolvedDefinition.authorPersona} this session, applies here too.</span>
                  </div>
                )}
                {priorCorrection && (
                  <div className="mt-1.5 ml-1 flex items-start gap-2 rounded-lg bg-[#f5f6f9] px-2.5 py-2 text-xs">
                    <History className="mt-0.5 h-3 w-3 flex-none text-[#7a7a7a]" />
                    <div className="flex-1">
                      <span className="text-[#3a3a3a]">
                        An attorney already corrected this exact term on {DEALS[priorCorrection.dealId]?.name ?? priorCorrection.dealId}: "
                        {priorCorrection.correctedValue}" — {priorCorrection.reasoning}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        dispatch({
                          type: "CORRECT_GRID_TERM",
                          termId: term.id,
                          value: priorCorrection.correctedValue,
                          reasoning: priorCorrection.reasoning,
                        })
                      }
                      className="flex-none rounded-[6px] border-2 border-[#d9d9d9] px-2 py-1 text-[10px] font-bold text-[#7a7a7a] hover:border-[#bbbbbb] hover:text-[#1c1e1a]"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>
            );
          })}
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
