# Docket — Product

> A K&E Debt Finance pitch demo.
> The persistent object is **the deal spine** (Precedent → Grid → Term Sheet/Commitment → Credit Agreement → Post-Close), not the conversation — and every AI interaction has to visibly move a deal forward on it.

This document is the north star. It captures what the product is, why it's shaped this way, and where it's going. Read it before making product or design decisions. For implementation rules, see `AGENTS.md`. For the full requirements this was built against, see `KE-Debt-Finance-Demo-Software-Build-Brief.md` and `KE-Debt-Finance-Demo-Moments.md`.

---

## 1. What this is

Docket is a live-presenter demo proving a specific point of view to a room of debt-finance attorneys: that AI can take retrieval and first-pass extraction off an associate's plate, compress a partner's review to a short triaged list, and give practice leadership a real access-control lever — without ever behaving like an open-ended chatbot.

It is **not a chat app**. Chat exists (and is real — it calls the live Anthropic API), but it is constrained: every answer has to cite a specific grid term/clause, and every answer has to end in a deal-forward action (confirm a term, flag something, or state a scope boundary) rather than just informing.

The thing that persists across every screen is the **deal spine** and a **ranked Next-Actions panel** — both are global chrome, not page features. Every workflow (precedent matching, grid population, an undefined-term flag) resolves into one of those two places.

---

## 2. The three personas

Selected once, reshapes everything downstream:

- **Associate** (junior/mid) — does the mechanical work: retrieval, grid population, term verification. Sees full reasoning and source material — this view should teach, not just output an answer.
- **Partner** — consumes triaged output only. Short, sorted, high-signal lists; almost never sees a raw flag.
- **Knowledge Management / Practice Leadership** — owns firm-definition gaps and access-model sign-off. Receives items no associate or partner can resolve alone.

Persona is central state (`state.persona`), so switching it live re-renders every screen already mounted — that's the whole point of the redaction mechanism (§6).

---

## 3. The deal spine (persistent, global)

Five stages, rendered as chrome on every authenticated screen, never per-screen:

`Precedent → Grid → Term Sheet/Commitment Letter → Credit Agreement → Post-Close`

Each stage has a status (`not-started | in-progress | needs-review | complete`) and the model is explicitly a **loop**, not a line — Post-Close can send a deal back to Precedent on refinancing (shown as a connecting arrow, not implemented as forced re-entry yet). Where a stage's progress can be tied to something concrete, it is: the Grid stage's percentage is `confirmedTerms / (confirmed + flagged + undefined)`, computed live in `state/selectors.ts` — never a hand-set number.

---

## 4. Next-Actions (persistent, global, persona-filtered)

A ranked, always-visible panel — not a menu, not a badge count. Every moment that produces new work pushes an item here (`{ title, why, stage, routedTo, priority, sourceModule }`) rather than surfacing silently inside a sub-screen. The panel is filtered to the acting persona's routing, so switching personas visibly changes its contents — that filtering **is** the demonstration that persona selection reshapes the app, not an incidental detail.

---

## 5. The moments

The app is a set of independently-reachable screens (`state.screen`), not one monolithic view. A presenter needs to jump to any of them live, in any order — so navigating to a screen and seeding the state it assumes are the same operation (`useNavigate()` → `momentSeeds.seedScreen()`), never two different code paths for "sequential" vs. "direct jump."

Built so far (**Phase 1**): Login → Persona Select → Dashboard → **A0** (open the deal, blocker + ranked precedent candidates already waiting, zero query typed) → **A2** (investigate/confirm a candidate, manual shortlist refinement, entity detail) → **B1** (grid population with a dual grounding/review signal per term, never one blended confidence score) → **B2** (a term the firm has never defined — a distinct, reusable state, never merged with "missing").

Anchored on **KinderCare** (Amendment No. 3 to Credit Agreement) — one of 15 real credit agreements from K&E's own Covenant Extraction Spike, chosen because it's real, richly documented, and because a standalone grid-population prototype was already proven on this exact deal before the July 14 onsite. The anchor is swappable config (`ANCHOR_DEAL_ID` in `data/deals/index.ts`), not hardcoded — Medline is the strongest alternate.

**Also built (Phase 2):** **A1** (fallback NL document search — the Kirkland/Goldman engagement-letter example, pre-open deal-team/date metadata), **C1** (SunGard term sheet ↔ credit agreement diff, triaged into business issues vs. legal comments with a raw→attorney-relevant→client-shown funnel — Partner's view is filtered, not redacted-in-place, reusing the same `fieldSensitivity` mechanism from Phase 1), **E2** (a mock M&A event feed tied to KinderCare's obligor structure, routed live into the associate's Next-Actions panel on demand).

**Placeholder for now** (Phase 3): the two closing-moment variants — F1 (correction-as-teaching-artifact — partially built: corrections already record reasoning in `state.corrections`, no retrieval-by-similarity screen yet) and F3 (fee-letter scope boundary — fully built, since it only needed the already-built `ScopeBoundaryNotice`). Full persona-based field redaction beyond C1/Dashboard's current coverage.

---

## 6. Access model

A deny-list lookup, not a permissions engine (`data/fieldSensitivity.ts`): sponsor identity and deal economics are never both shown to a non-deal-team viewer (policy default: show identity, redact economics), and a junior associate's view is a visible subset of a full associate's (deal economics redacted). Sensitive fields are tagged once, in data, and rendered through a generic `<RedactedField sensitivity="...">` wrapper — any screen gets this for free.

---

## 7. What's real vs. scripted (today)

| Capability | Status | Notes |
|---|---|---|
| Constrained chat | **Real** | Calls the Anthropic API directly with a system prompt built live from the active deal's grid state — every citable fact is a real `GridTerm`. |
| Precedent matching, grid population, undefined-term detection, document search, term sheet diff, M&A event feed | **Scripted, swap-ready** | Deterministic functions in `src/detectors/`, each with the exact async signature a live LLM call would need. Swapping later means editing only that one file — see `AGENTS.md` §"The detector seam." |
| Spine status/percentage, Next-Actions routing, redaction | **Real (client-side)** | Genuine derived state, no mock behind it. |

---

## 8. Design language

Mirrors the real DealOS design system (see `baby-dealos` if available), not the original "Underwriter" violet-on-dark prototype this repo was forked from:

- **Light theme.** White/`#f5f6f9` surfaces, `#1c1e1a` primary text, hairline `rgba(0,0,0,.08)` borders — not zinc-950/violet.
- **Multiple accent colors, each meaning something.** Blue (`#2354e8`) for primary CTAs and user-driven activity; purple (`#9e46ff`) specifically for AI/firm-knowledge-gap signals (the assistant avatar, the `undefined_by_firm` badge); neutral dark gray (`#444444`, "gold") for selected/focus chrome; green/amber/red for status. This deliberately contradicts the old `AGENTS.md`'s "one accent color" rule — that rule was written for a different product.
- **Mono uppercase micro-labels ARE used** (section labels, badges, stage tags) — also a deliberate reversal of the old "never all-caps mono" rule, matching DealOS's real convention.
- **Serif numbers.** Big stat values (`Metric`, key metrics tiles) render in a serif font stack — a DealOS convention for "this number is the headline."
- Fonts reference `Area Normal` / `Fautive` by name with safe system-font fallbacks (`index.css`) — no proprietary font files are committed; license status unconfirmed.

---

## 9. Non-goals (for this build pass)

- Real authentication, real Azure AD/Intapp integration — mocked, and should stay mocked.
- Fee-letter extraction itself — the correct behavior is stating the boundary (F3), not implementing extraction.
- A single self-reported "confidence: High" score as the only signal — known unreliable; always at least two distinct signals (grounding + review).
- Forcing users through the moment sequence linearly — the presenter must be able to jump anywhere, always.
