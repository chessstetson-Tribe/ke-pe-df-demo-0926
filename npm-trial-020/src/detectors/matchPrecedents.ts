import { PRECEDENT_CORPUS, SPONSOR_TIER_LABEL, type CorpusDeal } from "@/data/precedentCorpus";
import { anchorDeal } from "@/data/deals";
import type { PrecedentCandidate } from "@/state/types";
import type { DealCharacteristics } from "./types";

// TODAY: deterministic scoring against the static corpus.
// LATER: replace only this function's body — e.g.
//   const res = await callModel({ system: PRECEDENT_MATCH_PROMPT, input: characteristics });
//   return parsePrecedentCandidates(res);
// Callers (momentSeeds.ts, A0OpenMatterScreen) never change: same input shape, same
// Promise<PrecedentCandidate[]> output shape.
//
// Scores across the same facets Product: Debt Finance's Stage 2 story names —
// "find prior deals by sponsor, deal size, industry, and lender" — not just
// industry/covenant. Lender isn't scored here: a brand-new matter has no lender set
// yet (NEW_MATTER.lenderSet is empty), so lender-facet matching lives in Moment A2a's
// flexible search instead, where a lender can be searched for explicitly.
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
    score += 40;
    matchedOn.push(`industry (${deal.industry})`);
  }
  if (deal.sponsorTier === chars.sponsorTier) {
    score += 25;
    matchedOn.push(`sponsor profile (${SPONSOR_TIER_LABEL[deal.sponsorTier]})`);
  }
  if (deal.covenantFlavor === chars.covenantFlavor) {
    score += 20;
    matchedOn.push(`covenant flavor (${deal.covenantFlavor})`);
  }
  // "Similar size" — within roughly half to double the new matter's facility size —
  // not an exact match, since two deals are rarely the same dollar amount.
  if (deal.dealSizeUsd >= chars.dealSizeUsd * 0.5 && deal.dealSizeUsd <= chars.dealSizeUsd * 2) {
    score += 10;
    matchedOn.push(`similar facility size (~$${(deal.dealSizeUsd / 1_000_000).toFixed(0)}M)`);
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
    sponsor: SPONSOR_TIER_LABEL[deal.sponsorTier],
    industry: deal.industry,
    matchScore: Math.min(100, score),
    matchedOn,
    summary: `${deal.name} — ${deal.industry}, ${deal.covenantFlavor}.`,
  };
}
