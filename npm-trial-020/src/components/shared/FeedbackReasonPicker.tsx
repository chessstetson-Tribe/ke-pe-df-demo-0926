import { useState } from "react";
import { FOCUS } from "./focus";

const QUICK_REASONS = ["Wrong industry", "Wrong sponsor tier", "Wrong size", "Other"];

// The "more specific than a text box" thumbs-down surface for precedent candidates —
// quick reason chips instead of free text, since the reason a candidate is a bad
// match almost always falls into one of a few facets we already know about. "Other"
// still falls back to a short free-text field rather than a dead end.
export function FeedbackReasonPicker({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}) {
  const [otherText, setOtherText] = useState("");
  const [showOther, setShowOther] = useState(false);
  if (!open) return null;

  function pick(reason: string) {
    if (reason === "Other") {
      setShowOther(true);
      return;
    }
    onSubmit(reason);
  }

  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose} />
      <div className="dropdown-animate absolute left-0 top-6 z-40 w-60 rounded-xl border border-[rgba(0,0,0,0.08)] bg-white p-2 shadow-[0_14px_34px_rgba(0,0,0,0.15)]">
        <div className="px-1 pb-1.5 font-mono text-[9px] font-semibold uppercase tracking-wide text-[#bbbbbb]">
          What's off about this match?
        </div>
        {!showOther ? (
          <div className="flex flex-wrap gap-1.5 px-1">
            {QUICK_REASONS.map((reason) => (
              <button
                key={reason}
                type="button"
                onClick={() => pick(reason)}
                className={`rounded-full border border-[#d9d9d9] px-2 py-1 text-xs font-medium text-[#3a3a3a] hover:border-[#2354e8] hover:text-[#2354e8] ${FOCUS}`}
              >
                {reason}
              </button>
            ))}
          </div>
        ) : (
          <div className="px-1">
            <input
              autoFocus
              value={otherText}
              onChange={(e) => setOtherText(e.target.value)}
              placeholder="Say more…"
              className={`w-full rounded-[4px] border border-[rgba(0,0,0,0.08)] px-2 py-1.5 text-xs text-[#1c1e1a] ${FOCUS}`}
            />
            <button
              type="button"
              onClick={() => onSubmit(otherText.trim() || "Other")}
              className={`mt-2 rounded-[6px] bg-[#2354e8] px-2.5 py-1 text-xs font-bold text-white hover:bg-[#1a45c0] ${FOCUS}`}
            >
              Send feedback
            </button>
          </div>
        )}
      </div>
    </>
  );
}
