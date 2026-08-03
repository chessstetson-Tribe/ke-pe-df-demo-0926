import type { ActingPersona, FieldSensitivity, PersonaId } from "@/state/types";

// A deny-list lookup + one pure function — not a permissions engine.
const PERSONA_DENY: Record<PersonaId, FieldSensitivity[]> = {
  associate: [],
  partner: ["internal-legal-comment"], // Partner never sees raw legal-comment flags (C1, phase 2)
  km: [],
};

export function canSeeField(acting: ActingPersona, sensitivity: FieldSensitivity): boolean {
  if (sensitivity === "public") return true;

  if (!acting.onDealTeam && (sensitivity === "sponsor-identity" || sensitivity === "deal-economics")) {
    // Sponsor identity and deal economics are never both shown to anyone outside the deal team —
    // one or the other, never both. Policy default: show identity, redact economics.
    return sensitivity === "sponsor-identity";
  }

  if (acting.personaId === "associate" && acting.seniority === "junior" && sensitivity === "deal-economics") {
    return false; // junior associate access is a visible subset of full associate access
  }

  return !PERSONA_DENY[acting.personaId].includes(sensitivity);
}
