import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import type { GridTerm } from "@/state/types";

// Deliberately does NOT reuse <Row/> — the brief requires two independent per-term
// signals (grounding, review) rendered as separate chips, never blended into one
// status. `firmDefinition === "undefined_by_firm"` is a third, orthogonal axis: when
// set, it replaces the grounding/review chips entirely with a single purple badge,
// since "the firm never defined this" is a different kind of gap than an
// extraction-confidence signal — it must never look like a low-confidence row.
const GROUNDING_META: Record<GridTerm["grounding"], { label: string; cls: string }> = {
  grounded_in_source: { label: "Grounded in source", cls: "bg-[#f1ffed] text-[#10793d]" },
  inferred: { label: "Inferred", cls: "bg-[#fef8e7] text-[#b67c2a]" },
  not_extracted: { label: "Not extracted", cls: "bg-[#f3f4f6] text-[#6b7280]" },
};

const REVIEW_META: Record<GridTerm["review"], { label: string; cls: string }> = {
  confirmed: { label: "Reviewed · confirmed", cls: "bg-[#f1ffed] text-[#10793d]" },
  corrected: { label: "Reviewed · corrected", cls: "bg-[#ecf4ff] text-[#2354e8]" },
  unreviewed: { label: "Needs review", cls: "bg-[#fef8e7] text-[#b67c2a]" },
};

export function GridTermRow({
  term,
  focused = false,
  onFocus,
  onConfirm,
  onCorrect,
}: {
  term: GridTerm;
  focused?: boolean;
  onFocus?: (id: string) => void;
  onConfirm?: (id: string) => void;
  onCorrect?: (id: string, value: string, reasoning: string) => void;
}) {
  const [correcting, setCorrecting] = useState(false);
  const [draftValue, setDraftValue] = useState(term.value ?? "");
  const [draftReasoning, setDraftReasoning] = useState("");
  const isUndefined = term.firmDefinition === "undefined_by_firm";

  return (
    <div
      className={`rounded-lg border px-3 py-3 transition-colors ${
        isUndefined
          ? "border-[#e6d1ff] bg-[#faf5ff]"
          : focused
            ? "border-[#2354e8] bg-[#ecf4ff]"
            : "border-transparent hover:bg-[#f5f6f9]"
      }`}
    >
      <button type="button" onClick={() => onFocus?.(term.id)} className="flex w-full items-start justify-between gap-3 text-left">
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-[#1c1e1a]">{term.label}</div>
          <div className="mt-0.5 text-sm text-[#3a3a3a]">
            {term.value ?? <span className="italic text-[#9a9a9a]">No value extracted</span>}
          </div>
          {term.citation && (
            <div className="mt-1 font-mono text-[10px] text-[#9a9a9a]">
              {term.citation.doc} — {term.citation.clause}
            </div>
          )}
        </div>
        <div className="flex flex-none flex-col items-end gap-1.5">
          {isUndefined ? (
            <span className="inline-flex items-center gap-1 rounded-[4px] bg-[#f4eaff] px-2 py-0.5 text-[10px] font-bold text-[#9e46ff]">
              <AlertTriangle className="h-3 w-3" strokeWidth={2.5} />
              Undefined by firm
            </span>
          ) : (
            <>
              <span className={`rounded-[4px] px-2 py-0.5 text-[10px] font-bold ${GROUNDING_META[term.grounding].cls}`}>
                {GROUNDING_META[term.grounding].label}
              </span>
              <span className={`rounded-[4px] px-2 py-0.5 text-[10px] font-bold ${REVIEW_META[term.review].cls}`}>
                {REVIEW_META[term.review].label}
              </span>
            </>
          )}
        </div>
      </button>

      {isUndefined && term.firmDefinitionNote && (
        <p className="mt-2 text-xs leading-relaxed text-[#6b46a3]">{term.firmDefinitionNote}</p>
      )}

      {!isUndefined && term.review === "unreviewed" && (onConfirm || onCorrect) && (
        <div className="mt-2 flex items-center gap-2">
          {onConfirm && (
            <button
              type="button"
              onClick={() => onConfirm(term.id)}
              className="rounded-[6px] bg-[#2354e8] px-2.5 py-1 text-xs font-bold text-white hover:bg-[#1a45c0]"
            >
              Confirm
            </button>
          )}
          {onCorrect && (
            <button
              type="button"
              onClick={() => setCorrecting((v) => !v)}
              className="rounded-[6px] border-2 border-[#d9d9d9] px-2.5 py-1 text-xs font-bold text-[#7a7a7a] hover:border-[#bbbbbb] hover:text-[#1c1e1a]"
            >
              Correct
            </button>
          )}
        </div>
      )}

      {correcting && onCorrect && (
        <div className="mt-2.5 space-y-2 rounded-md bg-white p-2.5">
          <input
            value={draftValue}
            onChange={(e) => setDraftValue(e.target.value)}
            placeholder="Corrected value"
            className="w-full rounded-[4px] border border-[rgba(0,0,0,0.08)] px-2 py-1.5 text-xs text-[#1c1e1a]"
          />
          <textarea
            value={draftReasoning}
            onChange={(e) => setDraftReasoning(e.target.value)}
            placeholder="Reasoning — why this correction (surfaced later as a worked example)"
            className="w-full rounded-[4px] border border-[rgba(0,0,0,0.08)] px-2 py-1.5 text-xs text-[#1c1e1a]"
            rows={2}
          />
          <button
            type="button"
            onClick={() => {
              if (!draftValue.trim() || !draftReasoning.trim()) return;
              onCorrect(term.id, draftValue.trim(), draftReasoning.trim());
              setCorrecting(false);
            }}
            className="rounded-[6px] bg-[#2354e8] px-2.5 py-1 text-xs font-bold text-white hover:bg-[#1a45c0]"
          >
            Save correction
          </button>
        </div>
      )}
    </div>
  );
}
