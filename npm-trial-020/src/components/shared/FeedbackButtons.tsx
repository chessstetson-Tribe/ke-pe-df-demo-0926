import { useState } from "react";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { FOCUS } from "./focus";

// A dumb, reusable thumbs-up/down icon pair — no dispatch or popover logic of its
// own. Every call site fully owns what "up"/"down" means for its surface (a domain
// action, a generic RECORD_FEEDBACK log, opening a note box, whatever fits), so this
// stays a plain visual atom rather than trying to be a one-size-fits-all feedback
// widget.
export function FeedbackButtons({
  onUp,
  onDown,
}: {
  onUp: () => void;
  onDown: () => void;
}) {
  const [vote, setVote] = useState<"up" | "down" | null>(null);

  return (
    <span className="inline-flex items-center gap-0.5">
      <button
        type="button"
        title="Helpful"
        onClick={() => {
          setVote("up");
          onUp();
        }}
        className={`rounded-[4px] p-1 transition-colors ${
          vote === "up" ? "bg-[#f1ffed] text-[#10793d]" : "text-[#bbbbbb] hover:bg-[#f5f6f9] hover:text-[#7a7a7a]"
        } ${FOCUS}`}
      >
        <ThumbsUp className="h-3 w-3" />
      </button>
      <button
        type="button"
        title="Not helpful"
        onClick={() => {
          setVote("down");
          onDown();
        }}
        className={`rounded-[4px] p-1 transition-colors ${
          vote === "down" ? "bg-[#fdeeec] text-[#c0392b]" : "text-[#bbbbbb] hover:bg-[#f5f6f9] hover:text-[#7a7a7a]"
        } ${FOCUS}`}
      >
        <ThumbsDown className="h-3 w-3" />
      </button>
    </span>
  );
}
