import type { DiffFlag } from "@/state/types";

export interface DiffTermSheetRequest {
  dealId: string;
  termSheetDocId: string;
  creditAgreementDocId: string;
}

// Phase 2 (Moment C1). Stubbed — the type is real now (DiffFlag, in state/types.ts) so
// the reducer/UI never need restructuring when this ships. Target triage shape once
// implemented: ~300 raw flags -> 50 attorney-relevant -> 10 client-shown (Jason Kanner's
// real pilot ratio). Working document pair: SunGard (placeholder — none of the 15 real
// Covenant Extraction Spike deals have a paired term sheet in the source material).
export async function diffTermSheet(_req: DiffTermSheetRequest): Promise<DiffFlag[]> {
  return [];
}
