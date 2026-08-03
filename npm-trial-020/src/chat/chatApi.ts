export interface ChatHistoryEntry {
  role: "user" | "assistant";
  content: string;
}

// The real model call — moved verbatim from the previous single-file App.tsx. Not a
// detector: this was already live today and stays live; the scripted-now/live-later
// swap boundary in src/detectors/ doesn't apply here.
export async function sendChatMessage(system: string, history: ChatHistoryEntry[], question: string): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system,
      messages: [...history, { role: "user", content: question }],
    }),
  });
  if (!res.ok) throw new Error("status " + res.status);
  const data = await res.json();
  const text = (data.content || [])
    .filter((b: { type: string }) => b.type === "text")
    .map((b: { text: string }) => b.text)
    .join("\n")
    .trim();
  return text || "(The model returned an empty response.)";
}
