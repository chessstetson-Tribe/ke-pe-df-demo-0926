import { useState } from "react";
import { AlertTriangle, ArrowRight, ChevronDown, ChevronUp, X } from "lucide-react";
import { useDemoDispatch, useDemoState, useNavigate } from "@/state/DemoStateContext";
import { NEW_MATTER } from "@/data/precedentCorpus";
import { FOCUS } from "@/components/shared/focus";
import { FeedbackButtons } from "@/components/shared/FeedbackButtons";
import { FeedbackReasonPicker } from "@/components/shared/FeedbackReasonPicker";

// The true opening beat — zero query typed. The system has already matched whatever's
// sitting in the data room (the term sheet) against the firm's whole precedent
// corpus; the associate's job is to CHOOSE, not describe the deal from scratch.
export function A0OpenMatterScreen() {
  const state = useDemoState();
  const dispatch = useDemoDispatch();
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [pickerOpenFor, setPickerOpenFor] = useState<string | null>(null);
  const [rejectedReasons, setRejectedReasons] = useState<Set<string>>(new Set());

  function investigate(precedentDealId: string) {
    dispatch({ type: "SELECT_PRECEDENT", precedentId: precedentDealId });
    navigate("a2");
  }

  function rejectReason(candidateId: string, reason: string) {
    setRejectedReasons((prev) => new Set(prev).add(`${candidateId}::${reason}`));
    dispatch({
      type: "RECORD_FEEDBACK",
      record: { id: `match-reason-${candidateId}-${reason}-${state.feedback.length}`, targetType: "match-reason", targetId: `${candidateId}::${reason}`, sentiment: "down", note: reason },
    });
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto max-w-3xl px-6 py-8">
        <div className="font-mono text-[10px] font-semibold uppercase tracking-wide text-[#9a9a9a]">
          Moment A0 — Open the deal
        </div>
        <h1 className="mt-1 text-xl font-semibold tracking-tight text-[#1c1e1a]">{NEW_MATTER.dealName}</h1>

        <div className="mt-4 flex items-start gap-3 rounded-xl border border-[#ffe8b0] bg-[#fffaf0] p-4">
          <AlertTriangle className="mt-0.5 h-4 w-4 flex-none text-[#b67c2a]" />
          <div>
            <div className="text-sm font-semibold text-[#1c1e1a]">No precedent selected yet — grid not started</div>
            <p className="mt-1 text-sm leading-relaxed text-[#7a7a7a]">
              {NEW_MATTER.existingDocuments[0].name} was already in the data room. It's been matched against the
              firm's whole precedent corpus below — no search needed.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-baseline justify-between">
            <div className="font-mono text-[10px] font-semibold uppercase tracking-wide text-[#9a9a9a]">
              Ranked candidates
            </div>
            <button onClick={() => navigate("a2a")} className="text-xs font-medium text-[#2354e8] hover:underline">
              Search the full precedent bank instead →
            </button>
          </div>
          <div className="space-y-2">
            {state.precedentCandidates.map((c, i) => {
              const expanded = expandedId === c.precedentDealId;
              return (
                <div key={c.precedentDealId} className="rounded-xl border border-[rgba(0,0,0,0.08)] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <span className="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-[4px] bg-[#f5f6f9] font-mono text-[10px] font-bold text-[#444444]">
                        {i + 1}
                      </span>
                      <div>
                        <div className="text-sm font-semibold text-[#1c1e1a]">{c.dealName}</div>
                        <div className="text-xs text-[#7a7a7a]">{c.summary}</div>
                      </div>
                    </div>
                    <div className="flex flex-none items-center gap-1.5">
                      <span className="rounded-[4px] bg-[#ecf4ff] px-2 py-0.5 text-xs font-bold text-[#2354e8]">
                        {c.matchScore}% match
                      </span>
                      <div className="relative">
                        <FeedbackButtons
                          onUp={() =>
                            dispatch({
                              type: "RECORD_FEEDBACK",
                              record: { id: `candidate-${c.precedentDealId}-up-${state.feedback.length}`, targetType: "precedent-candidate", targetId: c.precedentDealId, sentiment: "up" },
                            })
                          }
                          onDown={() => setPickerOpenFor(c.precedentDealId)}
                        />
                        <FeedbackReasonPicker
                          open={pickerOpenFor === c.precedentDealId}
                          onClose={() => setPickerOpenFor(null)}
                          onSubmit={(reason) => {
                            dispatch({
                              type: "RECORD_FEEDBACK",
                              record: { id: `candidate-${c.precedentDealId}-down-${state.feedback.length}`, targetType: "precedent-candidate", targetId: c.precedentDealId, sentiment: "down", note: reason },
                            });
                            setPickerOpenFor(null);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => setExpandedId(expanded ? null : c.precedentDealId)}
                      className={`flex items-center gap-1 rounded-[6px] border-2 border-[#d9d9d9] px-2.5 py-1 text-xs font-bold text-[#7a7a7a] hover:border-[#bbbbbb] hover:text-[#1c1e1a] ${FOCUS}`}
                    >
                      Why this match
                      {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    </button>
                    <button
                      onClick={() => investigate(c.precedentDealId)}
                      className={`flex items-center gap-1 rounded-[6px] bg-[#2354e8] px-2.5 py-1 text-xs font-bold text-white hover:bg-[#1a45c0] ${FOCUS}`}
                    >
                      Investigate
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                  {expanded && (
                    <ul className="mt-3 space-y-1 text-xs leading-relaxed text-[#7a7a7a]">
                      {c.matchedOn.map((reason) => {
                        const rejected = rejectedReasons.has(`${c.precedentDealId}::${reason}`);
                        return (
                          <li key={reason} className="flex items-center gap-1.5">
                            <span className={rejected ? "text-[#bbbbbb] line-through" : ""}>• {reason}</span>
                            {rejected ? (
                              <span className="text-[10px] font-medium text-[#9a9a9a]">noted — de-emphasizing this</span>
                            ) : (
                              <button
                                type="button"
                                title="Not relevant"
                                onClick={() => rejectReason(c.precedentDealId, reason)}
                                className="rounded-[4px] p-0.5 text-[#d9d9d9] hover:bg-[#f5f6f9] hover:text-[#c0392b]"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
