import { PRECEDENT_CORPUS, SPONSOR_TIER_LABEL, type CorpusDeal } from "@/data/precedentCorpus";
import { anchorDeal } from "@/data/deals";
import type { MatchReason, PrecedentCandidate } from "@/state/types";
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
//
// Every reason carries its own point value and a categorical `factor` tag (not just
// display text) — this is what lets a rejected match-reason (state/selectors.ts'
// rejectedFactors) recompute a candidate's live score, and ripple to every other
// candidate scored on that same factor, instead of just being a cosmetic strikethrough.
export async function matchPrecedents(
  characteristics: DealCharacteristics,
  corpus: CorpusDeal[] = PRECEDENT_CORPUS,
): Promise<PrecedentCandidate[]> {
  const anchor = anchorDeal();
  const scored = corpus.map((deal) => scoreDeal(characteristics, deal, anchor.id));
  return scored.sort((a, b) => b.matchScore - a.matchScore).slice(0, 6);
}

function scoreDeal(chars: DealCharacteristics, deal: CorpusDeal, anchorId: string): PrecedentCandidate {
  const matchedOn: MatchReason[] = [];

  if (deal.industry === chars.industry) {
    matchedOn.push({ factor: "industry", label: `industry (${deal.industry})`, points: 40 });
  }
  if (deal.sponsorTier === chars.sponsorTier) {
    matchedOn.push({ factor: "sponsorTier", label: `sponsor profile (${SPONSOR_TIER_LABEL[deal.sponsorTier]})`, points: 25 });
  }
  if (deal.covenantFlavor === chars.covenantFlavor) {
    matchedOn.push({ factor: "covenantFlavor", label: `covenant flavor (${deal.covenantFlavor})`, points: 20 });
  }
  // "Similar size" — within roughly half to double the new matter's facility size —
  // not an exact match, since two deals are rarely the same dollar amount.
  if (deal.dealSizeUsd >= chars.dealSizeUsd * 0.5 && deal.dealSizeUsd <= chars.dealSizeUsd * 2) {
    matchedOn.push({ factor: "size", label: `similar facility size (~$${(deal.dealSizeUsd / 1_000_000).toFixed(0)}M)`, points: 10 });
  }
  // Anchor deal gets a small credibility bump — it's the one with a proven grid-population
  // prototype already built, which is itself a legitimate reason to rank it first in a tie.
  // "other" — this is a one-off fact about this specific deal, not a general matching
  // criterion, so it's never rejectable/de-emphasizable the way the factors above are.
  if (deal.id === anchorId) {
    matchedOn.push({ factor: "other", label: "proven grid-population prototype already built on this deal", points: 5 });
  }
  if (matchedOn.length === 0) {
    matchedOn.push({ factor: "other", label: "part of the firm's broader precedent pool", points: 0 });
  }

  const baseScore = Math.min(100, matchedOn.reduce((sum, m) => sum + m.points, 0));

  return {
    precedentDealId: deal.id,
    dealName: deal.name,
    sponsor: SPONSOR_TIER_LABEL[deal.sponsorTier],
    industry: deal.industry,
    matchScore: baseScore,
    matchedOn,
    summary: `${deal.name} — ${deal.industry}, ${deal.covenantFlavor}.`,
  };
}
