import { DOCUMENT_CORPUS, scoreDocument, type DocumentRecord } from "@/data/documentCorpus";

export interface DocumentSearchResult {
  doc: DocumentRecord;
  score: number;
  matchedOn: string[];
}

// TODAY: deterministic keyword scoring against a fixed corpus.
// LATER: replace only this function's body with a real semantic/NL retrieval call —
// the Promise<DocumentSearchResult[]> shape is unchanged.
export async function searchDocuments(query: string, corpus: DocumentRecord[] = DOCUMENT_CORPUS): Promise<DocumentSearchResult[]> {
  if (!query.trim()) return [];
  return corpus
    .map((doc) => {
      const { score, matchedOn } = scoreDocument(query, doc);
      return { doc, score, matchedOn };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);
}
