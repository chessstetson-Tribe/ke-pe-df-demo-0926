import { MA_EVENT_FEED } from "@/data/maEventFeed";
import type { CrossPracticeEvent } from "@/state/types";

// TODAY: reads the external M&A event feed (modeled as a source distinct from Debt
// Finance's own document set) and returns pending events relevant to this deal's
// obligor/guarantor structure. LATER: replace only this function's body with a real
// subscription/poll against the actual M&A-side event source — the
// Promise<CrossPracticeEvent[]> shape is unchanged.
export async function watchCrossPracticeFeed(dealId: string): Promise<CrossPracticeEvent[]> {
  return MA_EVENT_FEED.filter((e) => e.dealId === dealId);
}
