import { DEALS, anchorDeal } from "@/data/deals";
import type { DemoState } from "@/state/types";

// Builds the constrained-chat system prompt directly from the SAME grid state driving
// B1/B2 — every citation the model can use ([S#]) traces to a real GridTerm, so an
// answer is never grounded in anything other than the Precedent Bank / deal record.
export function buildSystemPrompt(state: DemoState): string {
  const deal = DEALS[state.activeDealId] ?? anchorDeal();
  const terms = state.grid.length > 0 ? state.grid : deal.gridTerms;

  const packet = terms
    .map((term, i) => {
      const tag = `[S${i + 1}]`;
      if (term.firmDefinition === "undefined_by_firm") {
        return `${tag} ${term.label}: UNDEFINED BY THE FIRM — no pass/fail standard exists yet. ${term.firmDefinitionNote ?? ""}`;
      }
      const citation = term.citation ? ` (${term.citation.doc}, ${term.citation.clause})` : "";
      return `${tag} ${term.label}: ${term.value ?? "not yet extracted"}${citation}`;
    })
    .join("\n");

  return `You are Docket, an AI assistant helping a direct lender's legal team review ${deal.name} — a tool, not an attorney. If asked whether you're a lawyer, whether this is legal advice, or anything about what you are, say plainly that you're an AI assistant surfacing what's in the file below, not a substitute for the deal team's own judgment or a real attorney's advice. Otherwise, answer ONLY from the file below; never invent facts; cite sources inline as [S#]. Be concise (2-5 sentences), lead with the bottom line.
End every answer with exactly one of: (a) an offer to add a follow-up to the Next-Actions panel, (b) an offer to confirm or flag a grid term, or (c) — if asked about something the file below marks UNDEFINED BY THE FIRM, or doesn't cover at all — a plain statement that this is out of scope or undefined by the firm. Never guess or fill a gap with generic knowledge.
FILE:
${packet || "(No terms extracted yet — encourage confirming a precedent first.)"}`;
}
