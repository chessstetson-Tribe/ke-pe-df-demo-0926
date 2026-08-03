// The full 15-deal Covenant Extraction Spike pool. Only KinderCare (and, as an
// alternate anchor, Medline) carry full grid/entity detail in data/deals/ — the
// rest exist here as lightweight rows so A0's ranked-candidate list and A2's
// "narrow the shortlist" filter have real breadth to work against.
export interface CorpusDeal {
  id: string;
  name: string;
  industry: string;
  covenantFlavor: string;
  lenderNames: string[];
}

export const PRECEDENT_CORPUS: CorpusDeal[] = [
  { id: "kindercare", name: "KinderCare", industry: "Childcare / early-education services", covenantFlavor: "Springing maintenance covenant", lenderNames: ["Deutsche Bank", "UBS", "Bank of America", "Jefferies", "KKR", "Citizens"] },
  { id: "medline", name: "Medline", industry: "Healthcare products manufacturing & distribution", covenantFlavor: "Covenant-lite, large-cap sponsor-backed", lenderNames: ["JPMorgan", "Bank of America", "Citi"] },
  { id: "adt", name: "ADT", industry: "Security & alarm monitoring services", covenantFlavor: "Covenant-lite", lenderNames: ["JPMorgan", "Wells Fargo"] },
  { id: "brightview", name: "BrightView", industry: "Commercial landscaping services", covenantFlavor: "Springing maintenance covenant", lenderNames: ["Bank of America", "Truist"] },
  { id: "clearwater-analytics", name: "Clearwater Analytics", industry: "Investment accounting & portfolio analytics SaaS", covenantFlavor: "Covenant-lite", lenderNames: ["Goldman Sachs", "Morgan Stanley"] },
  { id: "first-watch", name: "First Watch", industry: "Restaurant chain (daytime dining)", covenantFlavor: "Maintenance leverage covenant", lenderNames: ["Regions Bank", "Fifth Third"] },
  { id: "ingram-micro", name: "Ingram Micro", industry: "Technology distribution / supply chain", covenantFlavor: "Asset-based, borrowing-base structure", lenderNames: ["Bank of America", "Citizens", "PNC"] },
  { id: "karman-holdings", name: "Karman Holdings", industry: "Aerospace & defense components", covenantFlavor: "Springing maintenance covenant", lenderNames: ["Jefferies", "Truist"] },
  { id: "ping-identity", name: "Ping Identity", industry: "Identity & access management software", covenantFlavor: "Covenant-lite", lenderNames: ["Morgan Stanley", "UBS"] },
  { id: "sailpoint", name: "SailPoint", industry: "Identity governance software", covenantFlavor: "Covenant-lite, sponsor-backed", lenderNames: ["Morgan Stanley", "KKR Capital Markets"] },
  { id: "standardaero", name: "StandardAero", industry: "Aircraft engine MRO", covenantFlavor: "Springing maintenance covenant", lenderNames: ["Citigroup", "RBC"] },
  { id: "surgery-partners", name: "Surgery Partners", industry: "Ambulatory surgical facilities", covenantFlavor: "Springing maintenance covenant", lenderNames: ["Jefferies", "SunTrust"] },
  { id: "thoughtworks", name: "Thoughtworks", industry: "Technology consulting", covenantFlavor: "Covenant-lite", lenderNames: ["Goldman Sachs", "JPMorgan"] },
  { id: "traeger", name: "Traeger", industry: "Consumer products (outdoor cooking)", covenantFlavor: "Maintenance leverage covenant", lenderNames: ["Jefferies", "Nomura"] },
  { id: "zoominfo", name: "ZoomInfo", industry: "Sales & marketing intelligence SaaS", covenantFlavor: "Covenant-lite", lenderNames: ["Goldman Sachs", "Morgan Stanley"] },
];

// The fictional new matter opened in Moment A0 — deliberately in the same industry as
// KinderCare so the "why this was suggested" reasoning is unambiguous for a demo audience.
export const NEW_MATTER = {
  dealId: "meadowbrook",
  dealName: "Meadowbrook Early Learning Holdings",
  sponsor: "Ridgeline Capital Partners", // fictional — not a real firm
  industry: "Childcare / early-education services",
  dealSizeUsd: 190_000_000,
  lenderSet: [] as string[],
  covenantFlavor: "Springing leverage-based maintenance covenant",
  existingDocuments: [{ name: "Meadowbrook Term Sheet (draft)", type: "term-sheet" as const }],
};
