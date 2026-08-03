import { PRECEDENT_CORPUS, type CorpusDeal } from "@/data/precedentCorpus";
import { anchorDeal } from "@/data/deals";
import type { PrecedentCandidate } from "@/state/types";
import type { DealCharacteristics } from "./types";

// TODAY: deterministic scoring against the static corpus.
// LATER: replace only this function's body — e.g.
//   const res = await callModel({ system: PRECEDENT_MATCH_PROMPT, input: characteristics });
//   return parsePrecedentCandidates(res);
// Callers (momentSeeds.ts, A0OpenMatterScreen) never change: same input shape, same
// Promise<PrecedentCandidate[]> output shape.
export async function matchPrecedents(
  characteristics: DealCharacteristics,
  corpus: CorpusDeal[] = PRECEDENT_CORPUS,
): Promise<PrecedentCandidate[]> {
  const anchor = anchorDeal();
  const scored = corpus.map((deal) => scoreDeal(characteristics, deal, anchor.id));
  return scored.sort((a, b) => b.matchScore - a.matchScore).slice(0, 6);
}

function scoreDeal(chars: DealCharacteristics, deal: CorpusDeal, anchorId: string): PrecedentCandidate {
  const matchedOn: string[] = [];
  let score = 0;

  if (deal.industry === chars.industry) {
    score += 50;
    matchedOn.push(`industry (${deal.industry})`);
  }
  if (deal.covenantFlavor === chars.covenantFlavor) {
    score += 25;
    matchedOn.push(`covenant flavor (${deal.covenantFlavor})`);
  }
  // Anchor deal gets a small credibility bump — it's the one with a proven grid-population
  // prototype already built, which is itself a legitimate reason to rank it first in a tie.
  if (deal.id === anchorId) {
    score += 5;
    matchedOn.push("proven grid-population prototype already built on this deal");
  }
  if (matchedOn.length === 0) {
    matchedOn.push("part of the firm's broader precedent pool");
  }

  return {
    precedentDealId: deal.id,
    dealName: deal.name,
    sponsor: "", // resolved from the deal record where available; corpus rows are stub-only
    industry: deal.industry,
    matchScore: Math.min(100, score),
    matchedOn,
    summary: `${deal.name} — ${deal.industry}, ${deal.covenantFlavor}.`,
  };
}
