import type { CorrectionRecord } from "@/state/types";

// Seeded historical correction for Moment F1 — stands in for "a senior associate's
// correction from earlier in the demo." Deliberately tied to a generic prior deal
// (not KinderCare itself) so the F1 screen's "same term, different deal" match
// against state.grid is the real term-similarity lookup the brief describes, not a
// coincidence of reusing one deal's own data twice. Any correction made live during
// this session (via B1's "Correct" action) is appended alongside this one in
// state.corrections — same shape, same screen.
export const PRIOR_CORRECTIONS: CorrectionRecord[] = [
  {
    id: "prior-correction-change-of-control",
    dealId: "prior-deal-generic",
    gridTermLabel: "Change of Control Definition",
    originalValue: "Ceasing to hold a majority of voting power",
    correctedValue: "Ceasing to hold at least 35% of voting power, subject to standard carve-outs",
    reasoning:
      "The model inferred a bare-majority (50%+1) threshold — the generic market default. But the credit agreement's actual defined term set the trigger at 35%, consistent with this sponsor's other facilities. Always check the specific percentage against the defined term itself; don't assume the majority-threshold default applies just because it's the most common shape.",
    authorPersona: "associate",
  },
];
