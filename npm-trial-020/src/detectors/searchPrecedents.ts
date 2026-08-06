import { PRECEDENT_CORPUS, SPONSOR_TIER_LABEL, type CorpusDeal, type SponsorTier } from "@/data/precedentCorpus";
import type { MatchReason, PrecedentCandidate } from "@/state/types";

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

function toCandidate(deal: CorpusDeal, matchedOn: MatchReason[]): PrecedentCandidate {
  const sizeLabel = `~$${(deal.dealSizeUsd / 1_000_000).toFixed(0)}M`;
  const score = Math.min(100, matchedOn.reduce((sum, m) => sum + m.points, 0));
  return {
    precedentDealId: deal.id,
    dealName: deal.name,
    sponsor: SPONSOR_TIER_LABEL[deal.sponsorTier],
    industry: deal.industry,
    matchScore: score,
    matchedOn: matchedOn.length ? matchedOn : [{ factor: "other", label: "part of the firm's broader precedent pool", points: 0 }],
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
      const matchedOn: MatchReason[] = [];

      if (filters.sponsorTier && deal.sponsorTier === filters.sponsorTier) {
        matchedOn.push({ factor: "sponsorTier", label: `sponsor profile (${SPONSOR_TIER_LABEL[deal.sponsorTier]})`, points: 30 });
      }
      if (filters.industry && deal.industry === filters.industry) {
        matchedOn.push({ factor: "industry", label: `industry (${deal.industry})`, points: 30 });
      }
      if (filters.lender && deal.lenderNames.includes(filters.lender)) {
        matchedOn.push({ factor: "lender", label: `lender (${filters.lender})`, points: 30 });
      }
      if (filters.sizeMin !== undefined || filters.sizeMax !== undefined) {
        const min = filters.sizeMin ?? 0;
        const max = filters.sizeMax ?? Infinity;
        if (deal.dealSizeUsd >= min && deal.dealSizeUsd <= max) {
          matchedOn.push({ factor: "size", label: `facility size ~$${(deal.dealSizeUsd / 1_000_000).toFixed(0)}M`, points: 10 });
        }
      }

      return { deal, matchedOn };
    })
    .filter((r) => noFilters || r.matchedOn.length > 0)
    .map(({ deal, matchedOn }) => toCandidate(deal, matchedOn))
    .sort((a, b) => b.matchScore - a.matchScore);
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
      const matchedOn: MatchReason[] = [];
      const industryText = deal.industry.toLowerCase();
      const lenderText = deal.lenderNames.join(" ").toLowerCase();
      const tierText = SPONSOR_TIER_LABEL[deal.sponsorTier].toLowerCase();
      const covenantText = deal.covenantFlavor.toLowerCase();

      for (const w of words) {
        if (hasWord(industryText, w) && !matchedOn.some((m) => m.factor === "industry")) {
          matchedOn.push({ factor: "industry", label: `industry (${deal.industry})`, points: 15 });
        }
        if (hasWord(lenderText, w)) {
          matchedOn.push({ factor: "lender", label: `lender match ("${w}")`, points: 20 });
        }
        if (hasWord(tierText, w) && !matchedOn.some((m) => m.factor === "sponsorTier")) {
          matchedOn.push({ factor: "sponsorTier", label: `sponsor profile (${SPONSOR_TIER_LABEL[deal.sponsorTier]})`, points: 15 });
        }
        if (hasWord(covenantText, w) && !matchedOn.some((m) => m.factor === "covenantFlavor")) {
          matchedOn.push({ factor: "covenantFlavor", label: `covenant flavor (${deal.covenantFlavor})`, points: 10 });
        }
      }
      if (sizeHint && deal.dealSizeUsd >= sizeHint.min && deal.dealSizeUsd <= sizeHint.max) {
        matchedOn.push({ factor: "size", label: `similar facility size (~$${(deal.dealSizeUsd / 1_000_000).toFixed(0)}M)`, points: 10 });
      }

      return { deal, matchedOn };
    })
    .filter((r) => r.matchedOn.length > 0)
    .map(({ deal, matchedOn }) => toCandidate(deal, matchedOn))
    .sort((a, b) => b.matchScore - a.matchScore);
}
