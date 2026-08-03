import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp, MessageSquare } from "lucide-react";
import { useDemoState } from "@/state/DemoStateContext";
import { activeDealName } from "@/state/selectors";
import { useChat } from "./ChatContext";
import { MessageBubble } from "./MessageBubble";
import { Composer } from "./Composer";

export function ChatDock() {
  const [open, setOpen] = useState(false);
  const { messages, sending } = useChat();
  const state = useDemoState();
  const scrollRef = useRef<HTMLDivElement>(null);
  const dealName = activeDealName(state);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, sending]);

  return (
    <div
      className="flex-none border-t border-[rgba(0,0,0,0.08)] bg-white transition-[height] duration-300 ease-out"
      style={{ height: open ? 360 : 44 }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-11 w-full flex-none items-center gap-2 px-4 text-left hover:bg-[#f5f6f9]"
      >
        <MessageSquare className="h-3.5 w-3.5 text-[#9e46ff]" />
        <span className="flex-1 text-sm font-medium text-[#1c1e1a]">Ask counsel — {dealName}</span>
        {open ? <ChevronDown className="h-4 w-4 text-[#9a9a9a]" /> : <ChevronUp className="h-4 w-4 text-[#9a9a9a]" />}
      </button>
      {open && (
        <div className="flex flex-col" style={{ height: 360 - 44 }}>
          <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
            {messages.length === 0 && (
              <div className="text-sm leading-relaxed text-[#9a9a9a]">
                Ask anything about {dealName} — answers cite the file. Try “What conditions precedent are still
                open?” or “What's blocking closing?”
              </div>
            )}
            {messages.map((m, i) => (
              <MessageBubble key={i} message={m} index={i} />
            ))}
            {sending && (
              <div className="mb-6 flex items-center gap-2.5">
                <span className="grid h-7 w-7 flex-none place-items-center rounded-full bg-[#f4eaff] text-xs font-semibold text-[#9e46ff]">
                  D
                </span>
                <span className="text-sm text-[#9a9a9a]">Thinking…</span>
              </div>
            )}
          </div>
          <Composer placeholder={`Ask about ${dealName}…`} />
        </div>
      )}
    </div>
  );
}
