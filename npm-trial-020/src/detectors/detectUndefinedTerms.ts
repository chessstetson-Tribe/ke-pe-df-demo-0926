import type { GridTerm } from "@/state/types";
import type { FirmDefinitionRegistry } from "./types";

// The six real terms that failed to grade across all 15 Covenant Extraction Spike
// deals (90 of 104 ungradeable rows trace back to these six) — not invented for the
// demo. Auto Cure and Collateral/Pledge Voting Limits are the two used in KinderCare's
// grid (Moment B2); the rest are here so the registry itself is real and reusable if
// other deals are added later.
export const FIRM_DEFINITION_REGISTRY: FirmDefinitionRegistry = {
  undefinedLabels: [
    "Xerox",
    "J. Crew Blocker",
    "At Home",
    "Anti-Cooperation",
    "Auto Cure (Financial Covenant)",
    "Collateral / Pledge Voting Limits",
  ],
};

// TODAY: deterministic lookup against a fixed registry of firm-undefined terms.
// LATER: replace only this function's body with a live check against the firm's
// actual policy/definitions store — the Promise<GridTerm[]> shape is unchanged.
export async function detectUndefinedTerms(
  terms: GridTerm[],
  registry: FirmDefinitionRegistry = FIRM_DEFINITION_REGISTRY,
): Promise<GridTerm[]> {
  return terms.map((term) => {
    const isUndefined = registry.undefinedLabels.includes(term.label);
    if (!isUndefined) return term;
    return {
      ...term,
      firmDefinition: "undefined_by_firm",
      grounding: term.grounding === "grounded_in_source" ? term.grounding : "not_extracted",
      firmDefinitionNote:
        term.firmDefinitionNote ??
        `K&E has never defined a firm-wide pass/fail standard for “${term.label}.”`,
    };
  });
}
