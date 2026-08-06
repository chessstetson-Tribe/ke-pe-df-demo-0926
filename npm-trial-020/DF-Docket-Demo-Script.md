# DF Docket — 7-Minute Demo Script

A timed walkthrough script for a screen-recorded demo of DF Docket, the K&E Debt Finance pitch demo. The through-line: identifying precedent deals and matching them against a new one, and demonstrating a learning loop where the software and its backend data scaffold get better at its job as the team uses it — not just a UI reacting to a click.

Narration below is the actual spoken track used in the recording (as delivered, lightly cleaned up for punctuation only).

---

## 0:00 — Login → Persona Select

**Action:** Click "Continue with firm SSO." Click Associate.

**Say:**
> This is DF Docket, a Kirkland & Ellis Debt Finance demo walkthrough. Even though this is live software, remember that it's a demo meant for discussion purposes, not the final product. We envision at least three personas using this platform, and we're working as Associate for most of this walkthrough.

---

## 0:20 — Dashboard (20s)

**Action:** Cursor rests briefly on the redacted "Deal Size" chip, then clicks "Open matter."

**Say:**
> This is Meadowbrook. Notice that deal economics are already redacted for this viewer — that's enforced, not decorative. Even though this is an AI-native app, it isn't chat. Everything sits on an arc that the software guides you through, and visible at the top: Precedent, Grid, Term Sheet, Credit Agreement, and Post-Close.

---

## 0:40–2:10 — ACT 1: Moment A0, precedents already matched, zero query typed

**Action (on load):**

**Say:**
> Notice that zero queries have been typed. The system already matched Meadowbrook against the firm's whole precedent corpus the moment the matter was opened. This is the through-line for everything we'll see today: identifying precedent deals and matching them against a new one.

**Action:** Click "Why this match" on KinderCare (~55%).

**Say:**
> KinderCare is ranked first here, matched on industry, facility size, and covenant flavor.

**Action (learning loop):** Click ✕ next to "industry (Childcare / early-education services)."

**Say:**
> Let's say we notice that industry shouldn't count as heavily here, and we tell the system so. KinderCare's score drops immediately from fifty-five percent to fifteen percent, and the whole list re-sorts live. Here that's modeled as a live-learned update that is learned by the company-wide brain, which is one of our K&E learning loop options.

**Action:** Click thumbs-up on a lower-ranked candidate (e.g., Clearwater Analytics).

**Say:**
> A direct thumbs-up works the other way — it nudges a candidate's score up and reorders the list too. So there are two ways of teaching the ranking here, and both of them persist for the rest of the session.

**Action:** Click "Search the full precedent bank instead →."

---

## 2:10–3:40 — ACT 2: Moment A2a, flexible precedent search

**Say:**
> This screen is the core of the through-line — matching new deals to precedent, made explicit here instead of only auto-suggested.

**Action:** Click Sponsor-profile dropdown, select "Large-cap PE-backed."

**Say:**
> You can search by sponsor tier, industry, lender, or deal size — these are the exact facets the client's own user story calls out.

**Action:** Clear filter. Type into the NL box: "large-cap sponsor deal with KKR as a lender." Click Search.

**Say:**
> Or you can just describe what you're looking for in plain language. It's the same underlying scorer, just reached through prose instead of dropdowns.

**Action:** Expand "Why this match" on the top hit; cursor taps the struck-through industry line if KinderCare appears.

**Say:**
> And notice that the industry factor we suppressed back in the previous screen is still suppressed here. That feedback didn't reset when we changed screens — it's one shared backend scaffold, not separate state per screen.

---

## 3:40–4:20 — ACT 3: Moment A2, investigate & confirm

**Say:**
> Here we're investigating a candidate the system already surfaced for us. We rarely need a search built from scratch.

**Action:** Cursor briefly traces the entity block (Borrower, Holdings, Lender group).

**Say:**
> This is an entity detail — KUEHG Corp. as the borrower, a six-bank lender group, and Barclays as administrative agent. This is a real, richly documented deal, not a placeholder.

**Action:** Click "Populate a grid from this precedent."

---

## 4:20–5:00 — ACT 4: Moment B1, the grid

**Say:**
> Across the real extraction spike, this system was seventy-eight percent correct on first pass and ninety-nine percent correct after review. So this is not yet a uniformly confident grid.

**Action:** Scroll straight to "Auto Cure (Financial Covenant)" — purple "Undefined by firm" badge.

**Say:**
> Here's the gap — K&E has never defined a pass/fail standard for this term, across all fifteen real deals in the sample.

**Action:** Click "View firm-definition gap →."

---

## 5:00–6:40 — ACT 5: Moment B2, firm sign-off — the backend actually learns

**Action:** Switch persona to Knowledge Management.

**Say:**
> This decision belongs to Knowledge Management, so let's switch personas to make that call.

**Action (learning loop — define it once, it resolves everywhere):** Click into the definition box, type the equity-cure standard, click "Save firm definition."

**Say:**
> Knowledge Management sets a real firm-wide standard right now. This isn't scoped to just Meadowbrook — any deal's grid that hits this exact term for the rest of the session inherits this same standard. And watch the Next Action panel: it resolves live, the instant the definition is saved.

**Action:** Click "Back to grid."

**Say:**
> Back on the grid, that same term is no longer undefined. It now has real grounding and review signals, plus a note that Knowledge Management resolved it this session. This is the data scaffold itself getting better, not just the interface reacting to a click.

---

## 6:40–7:00 — Wrap

**Action:** Cursor rests on the "DEMO" ribbon (top-right), then moves to the presenter dot (bottom-right).

**Say:**
> That's the arc — precedent to grid to firm definition, one shared backend that gets sharper every time the team uses it. Again, this is a demo build for discussion purposes, not the finished product.
