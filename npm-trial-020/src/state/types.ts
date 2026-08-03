// Central type definitions for the demo's cross-cutting state.
// Phase 2/3 shapes (DiffFlag, CrossPracticeEvent) are declared now, populated later —
// cheap to type once, expensive to retrofit into an already-wired reducer.

export type ScreenId =
  | "login"
  | "persona-select"
  | "dashboard"
  | "a0"
  | "a1"
  | "a2"
  | "b1"
  | "b2"
  | "c1"
  | "e2"
  | "closing-f1"
  | "closing-f3";

export type PersonaId = "associate" | "partner" | "km";
export type Seniority = "junior" | "senior";

export interface ActingPersona {
  personaId: PersonaId;
  seniority: Seniority; // meaningful only when personaId === "associate"
  onDealTeam: boolean;
}

export type SpineStageId =
  | "precedent"
  | "grid"
  | "term-sheet-commitment"
  | "credit-agreement"
  | "post-close";

export type SpineStageStatus = "not-started" | "in-progress" | "needs-review" | "complete";

export interface DocumentRef {
  name: string;
  type: "term-sheet" | "credit-agreement" | "commitment-letter" | "engagement-letter" | "fee-letter" | "other";
}

export interface PrecedentCandidate {
  precedentDealId: string;
  dealName: string;
  sponsor: string;
  industry: string;
  matchScore: number; // 0-100
  matchedOn: string[];
  summary: string;
  sourceDocRef?: DocumentRef;
}

export type FieldSensitivity = "sponsor-identity" | "deal-economics" | "internal-legal-comment" | "public";

export interface SensitiveValue<T> {
  value: T;
  sensitivity: FieldSensitivity;
}

// Dual/triple signal grid term — mirrors the "grounded vs reviewed" split the brief requires,
// never blended into one confidence score.
export type GroundingSignal = "not_extracted" | "inferred" | "grounded_in_source";
export type ReviewSignal = "unreviewed" | "confirmed" | "corrected";
export type FirmDefinitionStatus = "defined" | "undefined_by_firm";

export interface GridTerm {
  id: string;
  dealId: string;
  label: string;
  value: string | null;
  citation: { doc: string; clause: string; page?: number } | null;
  grounding: GroundingSignal;
  review: ReviewSignal;
  firmDefinition: FirmDefinitionStatus;
  firmDefinitionNote?: string; // populated when firmDefinition === "undefined_by_firm"
  sensitivity?: FieldSensitivity; // e.g. facility amount is deal-economics; most terms are public
}

export interface NextActionItem {
  id: string;
  title: string;
  why: string;
  stage: SpineStageId;
  routedTo: PersonaId;
  priority: number; // lower = more urgent
  sourceModule: string; // e.g. "a0.blocker", "b2.undefinedTerm", "e2.crossPractice"
  status: "open" | "resolved";
}

export interface CorrectionRecord {
  id: string;
  dealId: string;
  gridTermLabel: string; // for cross-deal term-similarity lookup in F1
  originalValue: string | null;
  correctedValue: string;
  reasoning: string;
  authorPersona: PersonaId;
}

// Phase 2 — typed now so the reducer/UI never need restructuring later.
export interface DiffFlag {
  id: string;
  dealId: string;
  clause: string;
  termSheetLanguage: string;
  creditAgreementLanguage: string;
  triage: "business-issue" | "legal-comment";
}

export interface CrossPracticeEvent {
  id: string;
  dealId: string;
  sourcePractice: string; // e.g. "M&A"
  description: string;
  routedToAttorney: string;
  createdNextActionId: string | null;
}

export interface DemoState {
  screen: ScreenId;
  authenticated: boolean;
  persona: ActingPersona;
  activeDealId: string;
  spine: Record<SpineStageId, SpineStageStatus>;
  nextActions: NextActionItem[];
  precedentCandidates: PrecedentCandidate[];
  precedentFilter: { lender?: string; industry?: string } | null;
  selectedPrecedentId: string | null;
  grid: GridTerm[];
  focusedGridTermId: string | null; // which term B2 spotlights
  diffFlags: DiffFlag[];
  corrections: CorrectionRecord[];
  crossPracticeEvents: CrossPracticeEvent[];
  pendingCrossPracticeEvents: CrossPracticeEvent[];
  dirty: Partial<Record<ScreenId, boolean>>;
}
