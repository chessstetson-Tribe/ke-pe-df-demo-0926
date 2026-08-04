import { useState } from "react";
import { FOCUS } from "./focus";

// The generic thumbs-down fallback — a free-text box — for any surface that doesn't
// have something more specific to show instead (a correction field, a reason
// picker). Parent must position this inside a `relative` container; it renders
// itself as an absolutely-positioned popover anchored to that container's corner.
export function FeedbackNoteBox({
  open,
  onClose,
  onSubmit,
  placeholder = "What's wrong with this?",
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (note: string) => void;
  placeholder?: string;
}) {
  const [note, setNote] = useState("");
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose} />
      <div className="dropdown-animate absolute left-0 top-6 z-40 w-64 rounded-xl border border-[rgba(0,0,0,0.08)] bg-white p-2.5 shadow-[0_14px_34px_rgba(0,0,0,0.15)]">
        <textarea
          autoFocus
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className={`w-full rounded-[4px] border border-[rgba(0,0,0,0.08)] px-2 py-1.5 text-xs text-[#1c1e1a] ${FOCUS}`}
        />
        <button
          type="button"
          onClick={() => {
            onSubmit(note.trim());
            setNote("");
          }}
          className={`mt-2 rounded-[6px] bg-[#2354e8] px-2.5 py-1 text-xs font-bold text-white hover:bg-[#1a45c0] ${FOCUS}`}
        >
          Send feedback
        </button>
      </div>
    </>
  );
}
