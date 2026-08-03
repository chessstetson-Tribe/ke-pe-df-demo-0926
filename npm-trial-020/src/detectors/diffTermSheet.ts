import { SUNGARD_DIFF_FLAGS } from "@/data/sunGardDiff";
import type { DiffFlag } from "@/state/types";

export interface DiffTermSheetRequest {
  dealId: string;
  termSheetDocId: string;
  creditAgreementDocId: string;
}

// TODAY: returns the documented SunGard placeholder flags (a copy). Working document
// pair: SunGard — none of the 15 real Covenant Extraction Spike deals have a paired
// term sheet in the source material, so this is illustrative rather than K&E-named.
// LATER: replace only this function's body with a real diff over the two documents'
// actual text — the Promise<DiffFlag[]> shape (and the triage split it already
// carries) is unchanged.
export async function diffTermSheet(req: DiffTermSheetRequest): Promise<DiffFlag[]> {
  return SUNGARD_DIFF_FLAGS.map((f) => ({ ...f, dealId: req.dealId }));
}
