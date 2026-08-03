import type { CrossPracticeEvent } from "@/state/types";

// Moment E2. Modeled as a feed distinct from Debt Finance's own document set, per the
// brief's explicit data-model note — this is what lets the demo show the software
// reaching OUTSIDE its home data to make the connection. Inspired by a real, named
// incident (a confidential IPO filing left a new legal entity undisclosed to Debt
// Finance for six months, forcing an emergency lender waiver) — the specific entity
// name below is illustrative, not a K&E-supplied fact.
export const MA_EVENT_FEED: CrossPracticeEvent[] = [
  {
    id: "ma-event-halcyon-s1",
    dealId: "kindercare",
    sourcePractice: "M&A",
    description:
      "Corporate/M&A filed a confidential S-1 for “Halcyon Ventures Holdco LLC,” a newly formed entity that shares beneficial ownership with KC Sub, LLC — KinderCare's intermediate holding company. This may need to be added as a subsidiary guarantor, or expressly carved out, under the credit agreement's obligor definition.",
    routedToAttorney: "The Debt Finance attorney responsible for the KinderCare credit agreement",
    createdNextActionId: null,
  },
];
