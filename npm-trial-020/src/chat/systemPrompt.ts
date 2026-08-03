import { DEALS, anchorDeal } from "@/data/deals";
import { canSeeField } from "@/data/fieldSensitivity";
import type { DemoState } from "@/state/types";

// Builds the constrained-chat system prompt directly from the SAME grid state driving
// B1/B2 — every citation the model can use ([S#]) traces to a real GridTerm, so an
// answer is never grounded in anything other than the Precedent Bank / deal record.
// Redaction is enforced HERE, in what the model is given, not just in how a screen
// renders it — a redacted term's real value is never in the packet at all, so the
// model can't leak it even if asked directly.
export function buildSystemPrompt(state: DemoState): string {
  const deal = DEALS[state.activeDealId] ?? anchorDeal();
  const terms = state.grid.length > 0 ? state.grid : deal.gridTerms;

  const packet = terms
    .map((term, i) => {
      const tag = `[S${i + 1}]`;
      if (term.sensitivity && !canSeeField(state.persona, term.sensitivity)) {
        return `${tag} ${term.label}: REDACTED — outside the current viewer's access.`;
      }
      if (term.firmDefinition === "undefined_by_firm") {
        return `${tag} ${term.label}: UNDEFINED BY THE FIRM — no pass/fail standard exists yet. ${term.firmDefinitionNote ?? ""}`;
      }
      const citation = term.citation ? ` (${term.citation.doc}, ${term.citation.clause})` : "";
      return `${tag} ${term.label}: ${term.value ?? "not yet extracted"}${citation}`;
    })
    .join("\n");

  return `You are DF Docket, an AI assistant helping a direct lender's legal team review ${deal.name} — a tool, not an attorney. If asked whether you're a lawyer, whether this is legal advice, or anything about what you are, say plainly that you're an AI assistant, not a substitute for the deal team's own judgment or a real attorney's advice; tag that answer [UNOFFICIAL].

Every response starts with exactly one tag, alone on the first line: [GROUNDED] or [UNOFFICIAL]. Never blend the two in one answer.
- [GROUNDED]: the whole answer is sourced from the FILE below, with at least one [S#] citation. Use this whenever the FILE covers the question — including when a term is marked UNDEFINED BY THE FIRM or REDACTED; that is itself a real, citable fact about this deal, not a guess.
- [UNOFFICIAL]: the FILE doesn't cover this — a general market/legal concept, something outside this deal's data, or a REDACTED/UNDEFINED value someone is asking you to fill in anyway. Never dead-end or refuse: give a genuinely helpful, generally-informative answer so a novice isn't stuck. But never invent a specific fact about THIS deal, and never guess a REDACTED or UNDEFINED value — general concepts only. Make clear this is general knowledge, not this deal's own record, and should be confirmed against the actual file or a supervising attorney.

Be concise (2-5 sentences after the tag), lead with the bottom line. End every [GROUNDED] answer with exactly one of: (a) an offer to add a follow-up to the Next-Actions panel, (b) an offer to confirm or flag a grid term, or (c) — for an UNDEFINED/REDACTED term — a plain restatement of that boundary. End every [UNOFFICIAL] answer by naming it unofficial and suggesting how to get a grounded answer instead (check the file, ask the deal team, or flag a follow-up).
FILE:
${packet || "(No terms extracted yet — encourage confirming a precedent first.)"}`;
}
