// One atomic question -> one Scenario. The modal only ever collects enough to
// resolve a scenario id; every screen after that is driven off this shape, never
// off free-form model output — this is a scripted explainer, not a live retrieval
// system (see detectors/ pattern in npm-trial-020: deterministic now, same shape a
// real call would need later).

export interface GraphNode {
  id: string;
  label: string;
  doc: string;
}

export interface ScaffoldFact {
  id: string;
  term: string;
  definition: string;
  author: string;
  scope: string;
  sourceAnchor: string;
}

export interface FacetOption {
  label: string;
  value: string;
}

export interface Facet {
  id: string;
  label: string;
  options: FacetOption[];
}

export interface Scenario {
  id: string;
  /** Shown as the canonical/suggested question in the modal. */
  question: string;
  dealName: string;
  /** True for a generated placeholder — every facet combination resolves to
   *  SOME outcome, but only one combination is a real, fully-sourced worked
   *  example. Split screen surfaces this rather than hiding it. */
  isStub?: boolean;
  vanilla: {
    pageCount: number;
    chunkCount: number;
    scanLines: string[];
    answer: string;
  };
  tribe: {
    nodes: GraphNode[];
    edges: [string, string][];
    assertions: string[];
    answer: string;
    gapLabel: string;
    gapDetail: string;
    confirmCta: string;
    fact: ScaffoldFact;
  };
  rerun: {
    dealName: string;
    vanillaAnswer: string;
    tribeAnswerTemplate: string; // {{fact}} is substituted with the fact's term
  };
}

export type ExplainerPhase = "idle" | "asking" | "split";

export type TribeBeat = "traversing" | "answered" | "corrected" | "reran";
