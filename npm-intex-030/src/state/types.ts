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

// Two shapes of "why Tribe is better," not one:
// - "gap": nobody has settled a standard yet (document AND firm both silent).
//   Tribe names the gap; a human (KM) closes it; the fact persists and fires on
//   a rerun. This is the learning-loop story.
// - "miss": the answer was always IN the document, just scattered across
//   locations a keyword search won't co-locate. Tribe's traversal finds it and
//   lands a complete answer directly — there's nothing for a human to define,
//   so no confirm step and no rerun; the payoff is completeness, not teaching.
export type ScenarioKind = "gap" | "miss";

export interface Scenario {
  id: string;
  kind: ScenarioKind;
  /** Short label for the suggestion chips in the ask modal, e.g. "Financing EBITDA". */
  shortLabel: string;
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
    /** "gap" kind only */
    gapLabel?: string;
    gapDetail?: string;
    confirmCta?: string;
    fact?: ScaffoldFact;
    /** "miss" kind only */
    correctionLabel?: string;
    correctionDetail?: string;
    /** Either kind, optional — a scale/frequency note shown below the answer
     *  instead of (miss) or alongside (gap) the main mechanic. */
    scaleNote?: string;
  };
  /** "gap" kind only — there is nothing to rerun for a "miss," since there was
   *  no standing fact created to test persistence of. */
  rerun?: {
    dealName: string;
    vanillaAnswer: string;
    tribeAnswerTemplate: string; // {{fact}} is substituted with the fact's term
  };
}

export type ExplainerPhase = "idle" | "asking" | "split";

export type TribeBeat = "traversing" | "answered" | "corrected" | "reran";
