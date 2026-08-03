import type { ActingPersona, PersonaId } from "@/state/types";

export interface PersonaDef {
  id: PersonaId;
  name: string;
  title: string;
  blurb: string;
  defaultSeniority: "junior" | "senior";
  defaultOnDealTeam: boolean;
}

export const PERSONAS: PersonaDef[] = [
  {
    id: "associate",
    name: "Associate",
    title: "Junior / mid-level associate",
    blurb: "Mechanical work — retrieval, grid population, term sheet vs. credit agreement verification. Needs fast confirm/correct interactions and visible source material.",
    defaultSeniority: "junior",
    defaultOnDealTeam: true,
  },
  {
    id: "partner",
    name: "Partner",
    title: "Deal partner",
    blurb: "Consumes triaged output, makes judgment calls on ambiguous or high-stakes items only. Short, sorted, high-signal lists — almost never raw flags.",
    defaultSeniority: "senior",
    defaultOnDealTeam: true,
  },
  {
    id: "km",
    name: "Knowledge Management",
    title: "Practice leadership / KM",
    blurb: "Owns search-as-structured-queries and access-model sign-off. Receives firm-definition gaps for resolution.",
    defaultSeniority: "senior",
    defaultOnDealTeam: false,
  },
];

export function personaDef(id: PersonaId): PersonaDef {
  const found = PERSONAS.find((p) => p.id === id);
  if (!found) throw new Error(`Unknown persona: ${id}`);
  return found;
}

export function actingPersonaFromDef(def: PersonaDef): ActingPersona {
  return { personaId: def.id, seniority: def.defaultSeniority, onDealTeam: def.defaultOnDealTeam };
}
