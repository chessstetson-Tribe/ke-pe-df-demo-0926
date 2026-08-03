import { confColor, confFromText, renderCites } from "@/components/shared/Cite";
import { useDemoDispatch, useDemoState } from "@/state/DemoStateContext";
import type { NextActionItem } from "@/state/types";
import type { ChatMessage } from "./ChatContext";

export function MessageBubble({ message, index }: { message: ChatMessage; index: number }) {
  const dispatch = useDemoDispatch();
  const state = useDemoState();

  if (message.role === "user") {
    return (
      <div className="mb-5 flex justify-end">
        <div className="max-w-md rounded-2xl rounded-br-sm bg-[#2354e8] px-3.5 py-2 text-sm leading-relaxed text-white">
          {message.text}
        </div>
      </div>
    );
  }

  const confidence = message.confidence || confFromText(message.text);

  function addToNextActions() {
    const item: NextActionItem = {
      id: `chat-followup-${index}`,
      title: "Follow up on chat answer",
      why: message.text.slice(0, 96) + (message.text.length > 96 ? "…" : ""),
      stage: "grid",
      routedTo: state.persona.personaId,
      priority: 3,
      sourceModule: "chat.followup",
      status: "open",
    };
    dispatch({ type: "ADD_NEXT_ACTION", item });
  }

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2.5">
        <span className="grid h-7 w-7 flex-none place-items-center rounded-full bg-[#f4eaff] text-xs font-semibold text-[#9e46ff]">
          D
        </span>
        <span className="text-xs font-medium text-[#7a7a7a]">DF Docket AI</span>
        <span className={`rounded-full border px-2 py-0.5 text-xs font-bold ${confColor(confidence)}`}>
          {confidence} confidence
        </span>
      </div>
      <div className="mt-2 pl-10 font-serif text-base leading-relaxed text-[#1c1e1a]">{renderCites(message.text)}</div>
      <div className="mt-2 pl-10">
        <button
          type="button"
          onClick={addToNextActions}
          className="rounded-[6px] border-2 border-[#d9d9d9] px-2.5 py-1 text-xs font-bold text-[#7a7a7a] hover:border-[#bbbbbb] hover:text-[#1c1e1a]"
        >
          + Add to next actions
        </button>
      </div>
    </div>
  );
}
