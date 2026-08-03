import { Send } from "lucide-react";
import { useChat } from "./ChatContext";
import { FOCUS } from "@/components/shared/focus";

export function Composer({ placeholder }: { placeholder: string }) {
  const { input, setInput, send, sending } = useChat();
  return (
    <div className="flex-none border-t border-[rgba(0,0,0,0.08)] px-4 py-3">
      <div className="flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
          placeholder={placeholder}
          className={`flex-1 rounded-[6px] border border-[rgba(0,0,0,0.08)] bg-white px-3 py-2 text-sm text-[#1c1e1a] placeholder:text-[#9a9a9a] ${FOCUS}`}
        />
        <button
          onClick={send}
          disabled={sending || !input.trim()}
          className={`grid h-9 w-9 flex-none place-items-center rounded-[10px] bg-[#2354e8] text-white transition-transform transition-colors hover:bg-[#1a45c0] active:scale-[0.97] ${FOCUS}`}
          style={{ opacity: sending || !input.trim() ? 0.5 : 1 }}
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
