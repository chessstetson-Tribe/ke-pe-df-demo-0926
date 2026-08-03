import { createContext, useContext, useRef, useState, type ReactNode } from "react";
import { useDemoState } from "@/state/DemoStateContext";
import { buildSystemPrompt } from "./systemPrompt";
import { sendChatMessage, type ChatHistoryEntry } from "./chatApi";

export type ChatMode = "grounded" | "unofficial";

export interface ChatMessage {
  role: "user" | "assistant";
  text: string;
  confidence?: "High" | "Medium" | "Low";
  mode?: ChatMode;
}

interface ChatContextValue {
  messages: ChatMessage[];
  input: string;
  setInput: (v: string) => void;
  sending: boolean;
  send: () => Promise<void>;
}

const Ctx = createContext<ChatContextValue | null>(null);

// Parses the leading [GROUNDED]/[UNOFFICIAL] tag the system prompt requires. Falls
// back to a citation-count heuristic if the model ever drops the tag, rather than
// silently mislabeling an ungrounded answer as grounded.
function parseModeTag(raw: string): { mode: ChatMode; text: string } {
  const match = raw.match(/^\s*\[(GROUNDED|UNOFFICIAL)\]\s*/i);
  if (match) {
    return { mode: match[1].toUpperCase() === "GROUNDED" ? "grounded" : "unofficial", text: raw.slice(match[0].length).trim() };
  }
  const hasCitation = /\[S\d+\]/.test(raw);
  return { mode: hasCitation ? "grounded" : "unofficial", text: raw };
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const demoState = useDemoState();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const demoStateRef = useRef(demoState);
  demoStateRef.current = demoState;

  async function send() {
    const q = input.trim();
    if (!q || sending) return;
    setMessages((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setSending(true);
    let hist: ChatHistoryEntry[] = messages.map((m) => ({ role: m.role, content: m.text }));
    while (hist.length && hist[0].role === "assistant") hist = hist.slice(1);
    try {
      const system = buildSystemPrompt(demoStateRef.current);
      const raw = await sendChatMessage(system, hist, q);
      const { mode, text } = parseModeTag(raw);
      setMessages((m) => [...m, { role: "assistant", text, mode }]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: "I couldn't reach the model just now. In the local build this routes to your API key — try again in a moment.",
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  return <Ctx.Provider value={{ messages, input, setInput, sending, send }}>{children}</Ctx.Provider>;
}

export function useChat(): ChatContextValue {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useChat must be used inside ChatProvider");
  return ctx;
}
