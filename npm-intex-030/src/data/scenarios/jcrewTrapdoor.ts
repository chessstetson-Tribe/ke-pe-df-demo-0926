import type { Facet, Scenario } from "@/state/types";

// The one worked example, straight from tribe-vs-vanilla-agentic-framing.md: the
// question fails vanilla retrieval three ways at once (no single provision answers
// it, "J.Crew blocker" is firm knowledge nobody wrote down, and the failure is
// silent). Real deal-defect vocabulary (KinderCare/Karman are the demo's own
// precedent pool), not invented filler.
export const JCREW_TRAPDOOR_SCENARIO: Scenario = {
  id: "jcrew-trapdoor",
  question: "Does this credit agreement permit a J.Crew-style trapdoor?",
  dealName: "KinderCare — Amendment No. 3 to Credit Agreement",
  vanilla: {
    pageCount: 900,
    chunkCount: 47,
    scanLines: [
      "§7.02(c) — Permitted Investments — Investment Basket L (general)",
      "§1.01 — Definitions — \"Unrestricted Subsidiary\" designation mechanic",
      "§7.05(f) — Asset Sales — IP transfer carve-out",
      "§7.02(j) — Permitted Investments — Investment Basket J (IP-related)",
      "Schedule 7.02 — Existing Investments",
      "§1.01 — Definitions — \"Restricted Subsidiary\"",
    ],
    answer:
      "Yes — the credit agreement permits standard investment baskets and an unrestricted-subsidiary designation mechanic, consistent with market terms. No unusual IP-transfer risk is indicated in the reviewed sections.",
  },
  tribe: {
    nodes: [
      { id: "basket-l", label: "Investment Basket L", doc: "§7.02(c)" },
      { id: "unrestricted-sub", label: "Unrestricted Sub. designation", doc: "§1.01" },
      { id: "ip-carveout", label: "IP transfer carve-out", doc: "§7.05(f)" },
      { id: "basket-j", label: "Investment Basket J (IP)", doc: "§7.02(j)" },
    ],
    edges: [
      ["basket-l", "unrestricted-sub"],
      ["unrestricted-sub", "ip-carveout"],
      ["ip-carveout", "basket-j"],
    ],
    assertions: [
      "Basket L permits investment in unrestricted subsidiaries — §7.02(c)",
      "Unrestricted-sub designation removes it from covenant scope — §1.01",
      "IP transfer carve-out permits moving IP to any restricted or unrestricted sub — §7.05(f)",
      "Basket J stacks with Basket L up to the combined cap — §7.02(j)",
      "\"J.Crew-style trapdoor\" — not a defined term in this document (firm knowledge, unasserted)",
    ],
    answer:
      "The two baskets stack, and the unrestricted-sub mechanic plus the IP carve-out together create a path to move IP outside the credit group — the same structure at issue in the 2014 J.Crew transaction. That combination is real in this document; whether it counts as a firm-flagged \"J.Crew-style trapdoor\" is not yet asserted.",
    gapLabel: "Undefined by firm",
    gapDetail:
      "\"J.Crew-style trapdoor\" is not a term in this credit agreement — it's firm knowledge. K&E has never asserted a standing definition for it, so the scaffold can traverse the mechanism but can't yet label it.",
    confirmCta: "Confirm this is a J.Crew-style blocker →",
    fact: {
      id: "fact-jcrew-blocker",
      term: "J.Crew-style trapdoor",
      definition:
        "A stacked-investment-basket path (general basket + IP-related basket) combined with an unrestricted-subsidiary designation mechanic and an IP-transfer carve-out, that together permit moving IP collateral outside the credit group without a separate consent right.",
      author: "you",
      scope: "org-wide — every deal, for the rest of this session",
      sourceAnchor: "KinderCare — Amendment No. 3, §§7.02(c), 7.02(j), 7.05(f), 1.01",
    },
  },
  rerun: {
    dealName: "Karman Holdings — Credit Agreement",
    vanillaAnswer:
      "Yes — standard investment baskets and designation provisions are present. No unusual structural risk is indicated in the reviewed sections.",
    tribeAnswerTemplate:
      "Flagged immediately: this deal's Basket 3 + Basket 7 stack with an unrestricted-sub mechanic — the same shape as the \"{{fact}}\" the firm defined on KinderCare. No re-analysis needed; the scaffold already knew what to look for.",
  },
};

export const SCENARIOS: Scenario[] = [JCREW_TRAPDOOR_SCENARIO];

export function findScenario(id: string): Scenario | undefined {
  return SCENARIOS.find((s) => s.id === id);
}

// Facet mode: the "atomic GUI-style search" alternative to typing. Every
// combination resolves to SOME outcome — the atomic interaction always produces
// a split screen — but only one combination (RESOLVED_FACET_COMBO) is the real,
// fully-sourced worked example. The rest synthesize a labeled stub from the
// picked terms so the seam stays visible (per live-interactive-explainer.md)
// without ever leaving the user with a dead end.
export const QUESTION_FACETS: Facet[] = [
  {
    id: "deal",
    label: "Deal",
    options: [
      { label: "KinderCare — Amendment No. 3", value: "kindercare" },
      { label: "Karman Holdings", value: "karman" },
      { label: "Clearwater Analytics", value: "clearwater" },
    ],
  },
  {
    id: "provision",
    label: "Provision area",
    options: [
      { label: "Investment baskets", value: "baskets" },
      { label: "Financial covenants", value: "covenants" },
      { label: "Change of control", value: "coc" },
    ],
  },
  {
    id: "concern",
    label: "Concern",
    options: [
      { label: "IP / collateral leakage", value: "ip-leakage" },
      { label: "Covenant cure mechanics", value: "cure" },
      { label: "Sponsor control shift", value: "sponsor" },
    ],
  },
];

export const RESOLVED_FACET_COMBO = { deal: "kindercare", provision: "baskets", concern: "ip-leakage" };

function facetLabel(facetId: string, value: string): string {
  const facet = QUESTION_FACETS.find((f) => f.id === facetId);
  return facet?.options.find((o) => o.value === value)?.label ?? value;
}

// Generated on the fly from whatever the user picked — never authored per
// combination. Deliberately generic language ("the flagged mechanism", "the
// relevant provision") rather than invented deal-specific facts, since a stub
// has no real source document behind it.
function buildStubScenario(facets: { deal: string; provision: string; concern: string }): Scenario {
  const dealLabel = facetLabel("deal", facets.deal);
  const provisionLabel = facetLabel("provision", facets.provision);
  const concernLabel = facetLabel("concern", facets.concern);
  const question = `Does ${dealLabel} raise a ${concernLabel.toLowerCase()} issue in its ${provisionLabel.toLowerCase()}?`;

  return {
    id: `stub-${facets.deal}-${facets.provision}-${facets.concern}`,
    question,
    dealName: dealLabel,
    isStub: true,
    vanilla: {
      pageCount: 400,
      chunkCount: 22,
      scanLines: [
        `${provisionLabel} — general provisions`,
        `${provisionLabel} — defined terms`,
        `${concernLabel} — related covenant language`,
      ],
      answer: `Yes — standard ${provisionLabel.toLowerCase()} language is present, consistent with market terms. No unusual ${concernLabel.toLowerCase()} risk is indicated in the reviewed sections.`,
    },
    tribe: {
      nodes: [
        { id: "stub-a", label: provisionLabel, doc: "§ (placeholder)" },
        { id: "stub-b", label: concernLabel, doc: "§ (placeholder)" },
      ],
      edges: [["stub-a", "stub-b"]],
      assertions: [
        `${provisionLabel} is present in ${dealLabel} — illustrative only, not sourced`,
        `${concernLabel} — not yet traced against this deal's actual documents`,
      ],
      answer: `${provisionLabel} and ${concernLabel.toLowerCase()} plausibly interact here, the way they do in the built KinderCare example — but this exact combination hasn't been walked against a real document yet.`,
      gapLabel: "Illustrative stub",
      gapDetail: `This combination isn't a fully-sourced worked example — it's a placeholder shaped like one. Pick "${facetLabel(
        "deal",
        RESOLVED_FACET_COMBO.deal,
      )}" / "${facetLabel("provision", RESOLVED_FACET_COMBO.provision)}" / "${facetLabel(
        "concern",
        RESOLVED_FACET_COMBO.concern,
      )}" for the real, fully-sourced walkthrough.`,
      confirmCta: "Confirm this pattern (stub) →",
      fact: {
        id: `stub-fact-${facets.provision}-${facets.concern}`,
        term: `${provisionLabel} / ${concernLabel}`,
        definition: `Placeholder definition for the ${provisionLabel.toLowerCase()} + ${concernLabel.toLowerCase()} pattern — illustrative only.`,
        author: "you",
        scope: "org-wide — every deal, for the rest of this session",
        sourceAnchor: "(stub — no source document behind this combination)",
      },
    },
    rerun: {
      dealName: "a second deal (stub)",
      vanillaAnswer: `Yes — standard ${provisionLabel.toLowerCase()} language is present. No unusual risk indicated.`,
      tribeAnswerTemplate: `Flagged immediately using the "{{fact}}" pattern defined earlier — same stub logic, no re-analysis needed.`,
    },
  };
}

export function resolveFacetScenario(facets: { deal: string; provision: string; concern: string }): Scenario {
  const isResolved =
    facets.deal === RESOLVED_FACET_COMBO.deal &&
    facets.provision === RESOLVED_FACET_COMBO.provision &&
    facets.concern === RESOLVED_FACET_COMBO.concern;
  return isResolved ? JCREW_TRAPDOOR_SCENARIO : buildStubScenario(facets);
}
