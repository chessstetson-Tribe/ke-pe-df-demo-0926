import { PRECEDENT_CORPUS, SPONSOR_TIER_LABEL, type CorpusDeal, type SponsorTier } from "@/data/precedentCorpus";
import type { PrecedentCandidate } from "@/state/types";

// Moment A2a — flexible precedent search. Per Product: Debt Finance's Stage 2 story:
// "As an attorney, I can find prior deals by sponsor, deal size, industry, and
// lender" — this is that capability, plus a natural-language entry point onto the
// SAME scorer, since the underlying capability is one thing reachable two ways, not
// two separate features.
export interface PrecedentSearchFilters {
  sponsorTier?: SponsorTier;
  industry?: string;
  lender?: string;
  sizeMin?: number;
  sizeMax?: number;
}

function toCandidate(deal: CorpusDeal, score: number, matchedOn: string[]): PrecedentCandidate {
  const sizeLabel = `~$${(deal.dealSizeUsd / 1_000_000).toFixed(0)}M`;
  return {
    precedentDealId: deal.id,
    dealName: deal.name,
    sponsor: SPONSOR_TIER_LABEL[deal.sponsorTier],
    industry: deal.industry,
    matchScore: Math.min(100, score),
    matchedOn: matchedOn.length ? matchedOn : ["part of the firm's broader precedent pool"],
    summary: `${deal.name} — ${deal.industry}, ${SPONSOR_TIER_LABEL[deal.sponsorTier]}, ${sizeLabel} facility.`,
  };
}

// TODAY: deterministic facet scoring against the static corpus.
// LATER: replace only this function's body with a real semantic/LLM-backed
// precedent-matching call — the Promise<PrecedentCandidate[]> shape is unchanged.
export async function searchPrecedentsByFacets(
  filters: PrecedentSearchFilters,
  corpus: CorpusDeal[] = PRECEDENT_CORPUS,
): Promise<PrecedentCandidate[]> {
  const noFilters = !filters.sponsorTier && !filters.industry && !filters.lender && filters.sizeMin === undefined && filters.sizeMax === undefined;

  return corpus
    .map((deal) => {
      const matchedOn: string[] = [];
      let score = 0;

      if (filters.sponsorTier && deal.sponsorTier === filters.sponsorTier) {
        score += 30;
        matchedOn.push(`sponsor profile (${SPONSOR_TIER_LABEL[deal.sponsorTier]})`);
      }
      if (filters.industry && deal.industry === filters.industry) {
        score += 30;
        matchedOn.push(`industry (${deal.industry})`);
      }
      if (filters.lender && deal.lenderNames.includes(filters.lender)) {
        score += 30;
        matchedOn.push(`lender (${filters.lender})`);
      }
      if (filters.sizeMin !== undefined || filters.sizeMax !== undefined) {
        const min = filters.sizeMin ?? 0;
        const max = filters.sizeMax ?? Infinity;
        if (deal.dealSizeUsd >= min && deal.dealSizeUsd <= max) {
          score += 10;
          matchedOn.push(`facility size ~$${(deal.dealSizeUsd / 1_000_000).toFixed(0)}M`);
        }
      }

      return { deal, score, matchedOn };
    })
    .filter((r) => noFilters || r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ deal, score, matchedOn }) => toCandidate(deal, score, matchedOn));
}

function parseSizeHint(query: string): { min: number; max: number } | null {
  const q = query.toLowerCase();
  const dollarMatch = q.match(/\$?\s*([\d,.]+)\s*(billion|bn|b\b|million|mm|m\b)/);
  if (dollarMatch) {
    const num = parseFloat(dollarMatch[1].replace(/,/g, ""));
    const usd = dollarMatch[2].startsWith("b") ? num * 1_000_000_000 : num * 1_000_000;
    return { min: usd * 0.5, max: usd * 2 };
  }
  if (/\blarge|mega|big\b/.test(q)) return { min: 1_000_000_000, max: Infinity };
  if (/\bsmall|smaller|modest\b/.test(q)) return { min: 0, max: 300_000_000 };
  return null;
}

// TODAY: deterministic keyword-overlap parsing into the same facet scorer above.
// LATER: replace only this function's body with a real NL-understanding call that
// extracts the same PrecedentSearchFilters shape — the Promise<PrecedentCandidate[]>
// shape callers depend on is unchanged.
export async function searchPrecedentsByQuery(
  query: string,
  corpus: CorpusDeal[] = PRECEDENT_CORPUS,
): Promise<PrecedentCandidate[]> {
  if (!query.trim()) return [];
  const words = query.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 2);
  const sizeHint = parseSizeHint(query);

  // Word-boundary matching, not substring — a plain .includes(w) would let a query
  // word like "cap" (from "large-cap") false-positive-match inside "Capital" in
  // "KKR Capital Markets", surfacing a bogus "lender match" reason.
  const hasWord = (text: string, w: string) => new RegExp(`\\b${w}\\b`).test(text);

  return corpus
    .map((deal) => {
      const matchedOn: string[] = [];
      let score = 0;
      const industryText = deal.industry.toLowerCase();
      const lenderText = deal.lenderNames.join(" ").toLowerCase();
      const tierText = SPONSOR_TIER_LABEL[deal.sponsorTier].toLowerCase();
      const covenantText = deal.covenantFlavor.toLowerCase();

      for (const w of words) {
        if (hasWord(industryText, w) && !matchedOn.some((m) => m.startsWith("industry"))) {
          score += 15;
          matchedOn.push(`industry (${deal.industry})`);
        }
        if (hasWord(lenderText, w)) {
          score += 20;
          matchedOn.push(`lender match ("${w}")`);
        }
        if (hasWord(tierText, w) && !matchedOn.some((m) => m.startsWith("sponsor"))) {
          score += 15;
          matchedOn.push(`sponsor profile (${SPONSOR_TIER_LABEL[deal.sponsorTier]})`);
        }
        if (hasWord(covenantText, w) && !matchedOn.some((m) => m.startsWith("covenant"))) {
          score += 10;
          matchedOn.push(`covenant flavor (${deal.covenantFlavor})`);
        }
      }
      if (sizeHint && deal.dealSizeUsd >= sizeHint.min && deal.dealSizeUsd <= sizeHint.max) {
        score += 10;
        matchedOn.push(`similar facility size (~$${(deal.dealSizeUsd / 1_000_000).toFixed(0)}M)`);
      }

      return { deal, score, matchedOn };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ deal, score, matchedOn }) => toCandidate(deal, score, matchedOn));
}
