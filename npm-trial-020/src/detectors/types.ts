import type { DocumentRef, GridTerm } from "@/state/types";

// Shapes shared by every detector — designed so a real LLM call can replace a
// detector's body later without the caller (momentSeeds.ts, or a screen's action
// handler) ever changing.
export interface DealCharacteristics {
  dealId: string;
  dealName: string;
  sponsor: string;
  industry: string;
  dealSizeUsd: number;
  lenderSet: string[];
  covenantFlavor: string;
  existingDocuments: DocumentRef[];
}

export interface GridTermSchema {
  label: string;
  citationHint?: string;
}

export interface FirmDefinitionRegistry {
  undefinedLabels: string[]; // term labels the firm has never defined a pass/fail standard for
}

export type { GridTerm };
