// The full 15-deal Covenant Extraction Spike pool. Only KinderCare (and, as an
// alternate anchor, Medline) carry full grid/entity detail in data/deals/ — the
// rest exist here as lightweight rows so A0's auto-match and A2a's flexible search
// have real breadth to work against.
//
// Per Product: Debt Finance (Stage 2 user story): "As an attorney, I can find prior
// deals by sponsor, deal size, industry, and lender." sponsorTier and dealSizeUsd
// exist specifically to make that facet-matching real, not just industry/covenant.
// sponsorTier is a coarse, generically-defensible category (public-market structure
// is well known; we deliberately don't assert precise, unverified fund-level facts
// for demo-matching purposes). dealSizeUsd is an illustrative facility-size estimate
// for proximity matching, not a sourced figure.
export type SponsorTier = "large-cap-pe" | "middle-market-pe" | "public-no-sponsor" | "founder-family";

export const SPONSOR_TIER_LABEL: Record<SponsorTier, string> = {
  "large-cap-pe": "Large-cap PE-backed",
  "middle-market-pe": "Middle-market PE-backed",
  "public-no-sponsor": "Public — no controlling sponsor",
  "founder-family": "Founder/family-owned",
};

export interface CorpusDeal {
  id: string;
  name: string;
  industry: string;
  covenantFlavor: string;
  lenderNames: string[];
  sponsorTier: SponsorTier;
  dealSizeUsd: number; // illustrative facility-size estimate, for proximity matching only
}

export const PRECEDENT_CORPUS: CorpusDeal[] = [
  { id: "kindercare", name: "KinderCare", industry: "Childcare / early-education services", covenantFlavor: "Springing maintenance covenant", lenderNames: ["Deutsche Bank", "UBS", "Bank of America", "Jefferies", "KKR", "Citizens"], sponsorTier: "public-no-sponsor", dealSizeUsd: 240_000_000 },
  { id: "medline", name: "Medline", industry: "Healthcare products manufacturing & distribution", covenantFlavor: "Covenant-lite, large-cap sponsor-backed", lenderNames: ["JPMorgan", "Bank of America", "Citi"], sponsorTier: "large-cap-pe", dealSizeUsd: 2_500_000_000 },
  { id: "adt", name: "ADT", industry: "Security & alarm monitoring services", covenantFlavor: "Covenant-lite", lenderNames: ["JPMorgan", "Wells Fargo"], sponsorTier: "large-cap-pe", dealSizeUsd: 500_000_000 },
  { id: "brightview", name: "BrightView", industry: "Commercial landscaping services", covenantFlavor: "Springing maintenance covenant", lenderNames: ["Bank of America", "Truist"], sponsorTier: "public-no-sponsor", dealSizeUsd: 600_000_000 },
  { id: "clearwater-analytics", name: "Clearwater Analytics", industry: "Investment accounting & portfolio analytics SaaS", covenantFlavor: "Covenant-lite", lenderNames: ["Goldman Sachs", "Morgan Stanley"], sponsorTier: "public-no-sponsor", dealSizeUsd: 150_000_000 },
  { id: "first-watch", name: "First Watch", industry: "Restaurant chain (daytime dining)", covenantFlavor: "Maintenance leverage covenant", lenderNames: ["Regions Bank", "Fifth Third"], sponsorTier: "public-no-sponsor", dealSizeUsd: 200_000_000 },
  { id: "ingram-micro", name: "Ingram Micro", industry: "Technology distribution / supply chain", covenantFlavor: "Asset-based, borrowing-base structure", lenderNames: ["Bank of America", "Citizens", "PNC"], sponsorTier: "large-cap-pe", dealSizeUsd: 1_500_000_000 },
  { id: "karman-holdings", name: "Karman Holdings", industry: "Aerospace & defense components", covenantFlavor: "Springing maintenance covenant", lenderNames: ["Jefferies", "Truist"], sponsorTier: "middle-market-pe", dealSizeUsd: 400_000_000 },
  { id: "ping-identity", name: "Ping Identity", industry: "Identity & access management software", covenantFlavor: "Covenant-lite", lenderNames: ["Morgan Stanley", "UBS"], sponsorTier: "large-cap-pe", dealSizeUsd: 300_000_000 },
  { id: "sailpoint", name: "SailPoint", industry: "Identity governance software", covenantFlavor: "Covenant-lite, sponsor-backed", lenderNames: ["Morgan Stanley", "KKR Capital Markets"], sponsorTier: "large-cap-pe", dealSizeUsd: 350_000_000 },
  { id: "standardaero", name: "StandardAero", industry: "Aircraft engine MRO", covenantFlavor: "Springing maintenance covenant", lenderNames: ["Citigroup", "RBC"], sponsorTier: "large-cap-pe", dealSizeUsd: 1_200_000_000 },
  { id: "surgery-partners", name: "Surgery Partners", industry: "Ambulatory surgical facilities", covenantFlavor: "Springing maintenance covenant", lenderNames: ["Jefferies", "SunTrust"], sponsorTier: "large-cap-pe", dealSizeUsd: 800_000_000 },
  { id: "thoughtworks", name: "Thoughtworks", industry: "Technology consulting", covenantFlavor: "Covenant-lite", lenderNames: ["Goldman Sachs", "JPMorgan"], sponsorTier: "public-no-sponsor", dealSizeUsd: 250_000_000 },
  { id: "traeger", name: "Traeger", industry: "Consumer products (outdoor cooking)", covenantFlavor: "Maintenance leverage covenant", lenderNames: ["Jefferies", "Nomura"], sponsorTier: "public-no-sponsor", dealSizeUsd: 180_000_000 },
  { id: "zoominfo", name: "ZoomInfo", industry: "Sales & marketing intelligence SaaS", covenantFlavor: "Covenant-lite", lenderNames: ["Goldman Sachs", "Morgan Stanley"], sponsorTier: "public-no-sponsor", dealSizeUsd: 300_000_000 },
];

// The fictional new matter opened in Moment A0 — deliberately in the same industry as
// KinderCare so the "why this was suggested" reasoning is unambiguous for a demo audience.
export const NEW_MATTER = {
  dealId: "meadowbrook",
  dealName: "Meadowbrook Early Learning Holdings",
  sponsor: "Ridgeline Capital Partners", // fictional — not a real firm
  sponsorTier: "middle-market-pe" as SponsorTier,
  industry: "Childcare / early-education services",
  dealSizeUsd: 190_000_000,
  lenderSet: [] as string[],
  covenantFlavor: "Springing leverage-based maintenance covenant",
  existingDocuments: [{ name: "Meadowbrook Term Sheet (draft)", type: "term-sheet" as const }],
};
