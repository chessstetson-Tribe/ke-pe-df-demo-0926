import type { Scenario } from "@/state/types";

// The one worked example, straight from tribe-vs-vanilla-agentic-framing.md: the
// question fails vanilla retrieval three ways at once (no single provision answers
// it, "J.Crew blocker" is firm knowledge nobody wrote down, and the failure is
// silent). Real deal-defect vocabulary (KinderCare/Karman are the demo's own
// precedent pool), not invented filler.
export const JCREW_TRAPDOOR_SCENARIO: Scenario = {
  id: "jcrew-trapdoor",
  kind: "gap",
  shortLabel: "J.Crew-style trapdoor",
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
      scope: "org-wide — every future deal",
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

