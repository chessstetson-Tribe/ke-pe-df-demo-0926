import { MA_EVENT_FEED } from "@/data/maEventFeed";
import type { CrossPracticeEvent } from "@/state/types";

// Phase 2 (Moment E2). Stubbed — reads the external M&A event feed (modeled as a
// source distinct from Debt Finance's own document set) and returns events relevant
// to the given deal's obligor/guarantor structure. Empty until Phase 2 populates
// data/maEventFeed.ts.
export async function watchCrossPracticeFeed(_dealId: string): Promise<CrossPracticeEvent[]> {
  return MA_EVENT_FEED;
}
