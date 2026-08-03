// Small document corpus for Moment A1 — the fallback natural-language search path,
// used when nothing auto-matched (A0's job). The Kirkland/Goldman engagement letter
// is the literally-quoted K&E anecdote ("findable in 10 seconds" vs. 2-3 hours);
// the rest are decoys so the search has real breadth to rank against.
export interface DocumentRecord {
  id: string;
  title: string;
  docType: string;
  dealTeam: string;
  date: string;
  tags: string[];
}

export const DOCUMENT_CORPUS: DocumentRecord[] = [
  {
    id: "engagement-letter-goldman-syndicated",
    title: "Engagement Letter — Syndicated Term Loan (Arranger: Goldman Sachs)",
    docType: "Engagement Letter",
    dealTeam: "Kirkland & Ellis (lead) · Davis Polk (borrower's counsel)",
    date: "2023-03-14",
    tags: ["engagement letter", "kirkland", "lead-negotiated", "goldman", "goldman sachs", "arranger", "syndicated", "syndicate", "term loan"],
  },
  {
    id: "engagement-letter-jpm-bilateral",
    title: "Engagement Letter — Bilateral Facility (Lender: JPMorgan)",
    docType: "Engagement Letter",
    dealTeam: "Kirkland & Ellis (lead) · Latham & Watkins (lender's counsel)",
    date: "2022-11-02",
    tags: ["engagement letter", "kirkland", "jpmorgan", "jpm", "bilateral", "term loan"],
  },
  {
    id: "commitment-letter-barclays-abl",
    title: "Commitment Letter — ABL Revolver (Admin Agent: Barclays)",
    docType: "Commitment Letter",
    dealTeam: "Kirkland & Ellis (lead) · Simpson Thacher (agent's counsel)",
    date: "2024-01-19",
    tags: ["commitment letter", "barclays", "abl", "revolver", "admin agent"],
  },
  {
    id: "engagement-letter-morgan-stanley-highyield",
    title: "Engagement Letter — High-Yield Notes Offering (Arranger: Morgan Stanley)",
    docType: "Engagement Letter",
    dealTeam: "Kirkland & Ellis (lead) · Weil Gotshal (borrower's counsel)",
    date: "2023-08-07",
    tags: ["engagement letter", "kirkland", "morgan stanley", "high-yield", "notes", "offering"],
  },
];

export function scoreDocument(query: string, doc: DocumentRecord): { score: number; matchedOn: string[] } {
  const words = query.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  const matched = new Set<string>();
  for (const tag of doc.tags) {
    if (words.some((w) => w.length > 2 && tag.includes(w))) matched.add(tag);
  }
  return { score: matched.size, matchedOn: Array.from(matched) };
}
