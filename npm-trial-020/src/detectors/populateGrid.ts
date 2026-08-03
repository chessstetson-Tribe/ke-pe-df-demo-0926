import { DEALS } from "@/data/deals";
import type { GridTerm } from "@/state/types";

export interface PopulateGridRequest {
  precedentDealId: string;
  targetDealId?: string; // defaults to precedentDealId — B1 demonstrates extraction on the precedent itself
}

// TODAY: returns the precedent deal's own documented extraction results (a copy, so
// later corrections in state never mutate the source data module).
// LATER: replace only this function's body with a real extraction call over the
// precedent's actual document text — the Promise<GridTerm[]> shape is unchanged.
export async function populateGrid(req: PopulateGridRequest): Promise<GridTerm[]> {
  const deal = DEALS[req.precedentDealId];
  if (!deal) return [];
  const targetDealId = req.targetDealId ?? req.precedentDealId;
  return deal.gridTerms.map((term) => ({ ...term, dealId: targetDealId }));
}
