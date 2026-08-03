import { ArrowRight, Sparkles } from "lucide-react";
import { useDemoDispatch, useDemoState, useNavigate } from "@/state/DemoStateContext";
import { DEALS } from "@/data/deals";
import { PRECEDENT_CORPUS } from "@/data/precedentCorpus";
import { RedactedField } from "@/components/chrome/RedactedField";
import { FOCUS } from "@/components/shared/focus";

// Continues directly from A0: investigating a candidate the system already surfaced,
// never a search from scratch. Manual refinement narrows the existing shortlist — it
// never falls back into a plain search box.
export function A2ConfirmPrecedentScreen() {
  const state = useDemoState();
  const dispatch = useDemoDispatch();
  const navigate = useNavigate();

  const underReviewId = state.selectedPrecedentId ?? state.precedentCandidates[0]?.precedentDealId;
  const candidate = state.precedentCandidates.find((c) => c.precedentDealId === underReviewId);
  const deal = underReviewId ? DEALS[underReviewId] : undefined;
  const corpusRow = PRECEDENT_CORPUS.find((d) => d.id === underReviewId);

  const lenders = Array.from(new Set(PRECEDENT_CORPUS.flatMap((d) => d.lenderNames))).sort();
  const industries = Array.from(new Set(PRECEDENT_CORPUS.map((d) => d.industry))).sort();

  const alternates = state.precedentCandidates.filter((c) => {
    if (c.precedentDealId === underReviewId) return false;
    if (!state.precedentFilter) return true;
    const row = PRECEDENT_CORPUS.find((d) => d.id === c.precedentDealId);
    if (!row) return false;
    if (state.precedentFilter.lender && !row.lenderNames.includes(state.precedentFilter.lender)) return false;
    if (state.precedentFilter.industry && row.industry !== state.precedentFilter.industry) return false;
    return true;
  });

  function populateGridFrom(id: string) {
    dispatch({ type: "SELECT_PRECEDENT", precedentId: id });
    navigate("b1");
  }

  if (!candidate || !underReviewId) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center text-sm text-[#9a9a9a]">
        No candidate to review yet — visit A0 first, or jump there from Moments.
      </div>
    );
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto max-w-3xl px-6 py-8">
        <div className="font-mono text-[10px] font-semibold uppercase tracking-wide text-[#9a9a9a]">
          Moment A2 — Investigate &amp; confirm
        </div>
        <h1 className="mt-1 text-xl font-semibold tracking-tight text-[#1c1e1a]">{candidate.dealName}</h1>

        <div className="mt-4 rounded-xl border border-[rgba(0,0,0,0.08)] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          <div className="text-sm font-bold text-[#1c1e1a]">Why this was suggested</div>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-[#7a7a7a]">
            {candidate.matchedOn.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>

          {deal?.entity && (
            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-[rgba(0,0,0,0.06)] pt-4 text-sm">
              <div><span className="text-[#9a9a9a]">Borrower </span><span className="font-medium text-[#1c1e1a]">{deal.entity.borrower}</span></div>
              <div><span className="text-[#9a9a9a]">Holdings </span><span className="font-medium text-[#1c1e1a]">{deal.entity.holdings}</span></div>
              {deal.entity.intermediateHoldings && (
                <div><span className="text-[#9a9a9a]">Intermediate Holdings </span><span className="font-medium text-[#1c1e1a]">{deal.entity.intermediateHoldings}</span></div>
              )}
              <div><span className="text-[#9a9a9a]">Admin agent </span><span className="font-medium text-[#1c1e1a]">{deal.entity.adminAgent}</span></div>
              <div className="col-span-2"><span className="text-[#9a9a9a]">Lender group </span><span className="font-medium text-[#1c1e1a]">{deal.entity.lenderGroup.join(", ")}</span></div>
              <div className="col-span-2">
                <span className="text-[#9a9a9a]">Sponsor </span>
                <span className="font-medium text-[#1c1e1a]"><RedactedField sensitivity="sponsor-identity">{deal.sponsor.value}</RedactedField></span>
              </div>
            </div>
          )}

          {deal?.credibilityNote && (
            <div className="mt-4 flex items-start gap-2 rounded-lg bg-[#faf5ff] p-3">
              <Sparkles className="mt-0.5 h-3.5 w-3.5 flex-none text-[#9e46ff]" />
              <p className="text-xs leading-relaxed text-[#6b46a3]">{deal.credibilityNote}</p>
            </div>
          )}

          <button
            onClick={() => populateGridFrom(underReviewId)}
            className={`mt-5 flex items-center gap-1.5 rounded-[10px] bg-[#2354e8] px-3.5 py-2 text-sm font-bold text-white transition-transform transition-colors hover:bg-[#1a45c0] active:scale-[0.97] ${FOCUS}`}
          >
            Populate a grid from this precedent
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="mt-6">
          <div className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-wide text-[#9a9a9a]">
            Narrow the shortlist
          </div>
          <div className="flex items-center gap-2">
            <select
              value={state.precedentFilter?.lender ?? ""}
              onChange={(e) =>
                dispatch({
                  type: "REFINE_PRECEDENT_SHORTLIST",
                  filter: { ...state.precedentFilter, lender: e.target.value || undefined },
                })
              }
              className="rounded-[6px] border border-[rgba(0,0,0,0.08)] bg-white px-2 py-1.5 text-xs text-[#1c1e1a]"
            >
              <option value="">Any lender</option>
              {lenders.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
            <select
              value={state.precedentFilter?.industry ?? ""}
              onChange={(e) =>
                dispatch({
                  type: "REFINE_PRECEDENT_SHORTLIST",
                  filter: { ...state.precedentFilter, industry: e.target.value || undefined },
                })
              }
              className="rounded-[6px] border border-[rgba(0,0,0,0.08)] bg-white px-2 py-1.5 text-xs text-[#1c1e1a]"
            >
              <option value="">Any industry</option>
              {industries.map((i) => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
            {state.precedentFilter && (
              <button
                onClick={() => dispatch({ type: "REFINE_PRECEDENT_SHORTLIST", filter: null })}
                className="text-xs font-medium text-[#2354e8] hover:underline"
              >
                Clear
              </button>
            )}
          </div>

          <div className="mt-3 space-y-2">
            {alternates.length === 0 ? (
              <p className="text-xs text-[#bbbbbb]">No other candidates match this filter.</p>
            ) : (
              alternates.map((c) => (
                <div key={c.precedentDealId} className="flex items-center justify-between rounded-lg border border-[rgba(0,0,0,0.08)] bg-white px-3 py-2">
                  <div>
                    <div className="text-sm font-medium text-[#1c1e1a]">{c.dealName}</div>
                    <div className="text-xs text-[#9a9a9a]">{c.industry} · {c.matchScore}% match</div>
                  </div>
                  <button
                    onClick={() => dispatch({ type: "SELECT_PRECEDENT", precedentId: c.precedentDealId })}
                    className="rounded-[6px] border-2 border-[#d9d9d9] px-2.5 py-1 text-xs font-bold text-[#7a7a7a] hover:border-[#bbbbbb] hover:text-[#1c1e1a]"
                  >
                    Investigate instead
                  </button>
                </div>
              ))
            )}
          </div>
          {corpusRow && !deal?.entity && (
            <p className="mt-2 text-xs text-[#bbbbbb]">
              Full grid detail isn't seeded for {corpusRow.name} in this build — swap it in as the anchor deal to populate its grid.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
