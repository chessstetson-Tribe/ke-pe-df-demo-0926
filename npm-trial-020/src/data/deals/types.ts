import type { GridTerm, SensitiveValue } from "@/state/types";

export interface DealEntity {
  borrower: string;
  holdings: string;
  intermediateHoldings?: string;
  adminAgent: string;
  lenderGroup: string[];
}

export interface DealDocument {
  name: string;
  date: string;
  type: "credit-agreement-amendment" | "credit-agreement" | "term-sheet";
}

export interface DealRecord {
  id: string;
  name: string;
  sponsor: SensitiveValue<string>;
  industry: string;
  dealSizeUsd: SensitiveValue<number>;
  covenantFlavor: string;
  entity?: DealEntity;
  document?: DealDocument;
  credibilityNote?: string;
  gridTerms: GridTerm[];
}
