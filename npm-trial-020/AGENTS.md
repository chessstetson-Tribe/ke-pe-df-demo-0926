# DF Docket — Agent Guide

Instructions for any AI assistant (Cursor, Claude Code, etc.) working in this repo. Read `PRODUCT.md` first for the vision; this file is the *how*. When a decision isn't covered here, check `KE-Debt-Finance-Demo-Software-Build-Brief.md` and `KE-Debt-Finance-Demo-Moments.md` before inventing behavior — this build exists to satisfy that brief.

---

## First principle

**This is a multi-screen, persona-aware demo, not a single workspace.** The persistent objects are the **deal spine** (5-stage progress) and the **Next-Actions panel** — both global chrome, rendered once in `AppShell`, never re-implemented per screen. Every "moment" (A0, A2, B1, B2, ...) is an independently-reachable screen a presenter can jump to directly; sequential flow and direct jump are the *same* code path (`useNavigate()`), never two.

If a change makes a screen need its own copy of the spine bar, its own Next-Actions list, or makes direct-jump navigation behave differently from clicking "Next →", it's wrong.

---

## Design rules

- **Light theme, mirroring the real DealOS design system** — not the zinc-950/violet "Underwriter" prototype this repo was forked from. White/`#f5f6f9` surfaces, `#1c1e1a` text, hairline `rgba(0,0,0,.08)` borders.
- **Multiple accent colors, each with a fixed meaning** (see `components/shared/status.ts` and `PRODUCT.md` §8): blue = primary CTA / user action, purple = AI or firm-knowledge-gap signal, neutral gray ("gold") = selected/focus chrome, green/amber/red = status. Don't introduce a new color without a reason attached to meaning.
- **Mono uppercase micro-labels are the convention** for section labels, badges, and stage tags (`font-mono text-[10px] font-semibold uppercase tracking-wide`) — this is deliberate, not a mistake to "fix."
- **Serif font for headline numbers** (`Metric`, key-metric tiles) — `font-serif`, falls back to Georgia. Everything else is the body sans stack.
- Numbers use `tabular-nums`.
- Keyboard focus uses the shared `FOCUS` constant (`components/shared/focus.ts`) — don't hand-roll a different ring style.
- Fonts: `index.css` declares `@font-face` for `Area Normal`/`Fautive` pointing at `/fonts/...` paths with no files committed (license unconfirmed) — safe system-font fallback either way. If real font files become available, drop them in `public/fonts/` and nothing else needs to change.

---

## Tech stack

- **Vite + React + TypeScript**, Tailwind v4 (CSS-first — `@import "tailwindcss"` + `@theme` in `index.css`, no `tailwind.config.js`).
- **No routing library, no state-management library.** 11 fixed, non-parameterized screens don't need one — see "Navigation" below. Don't add either without a strong reason.
- **lucide-react** for icons.
- Path alias `@/*` → `src/*` (see `tsconfig.app.json`) — use it for anything outside the current file's own directory.

---

## Project structure

```
src/
  state/
    types.ts            # ALL cross-cutting types, including Phase 3 shapes (CorrectionRecord retrieval) — typed now, populated later
    initialState.ts      # pristine DemoState
    reducer.ts            # DemoAction union + demoReducer — pure, synchronous, no async
    momentSeeds.ts        # seedScreen(screen, state, dispatch) — the ONLY caller of detectors/
    selectors.ts           # derived values (spine %, ranked next actions) — NEVER stored in state
    DemoStateContext.tsx  # Context + useReducer + useNavigate()

  detectors/              # the scripted-now/live-later swap seam — see below
    matchPrecedents.ts  populateGrid.ts  detectUndefinedTerms.ts
    diffTermSheet.ts  watchCrossPracticeFeed.ts  searchDocuments.ts

  data/
    deals/                # kinderCare.ts, medline.ts, index.ts (ANCHOR_DEAL_ID)
    precedentCorpus.ts     # 15-deal pool + the fictional new matter (Meadowbrook)
    personas.ts  fieldSensitivity.ts  maEventFeed.ts  sunGardDiff.ts  documentCorpus.ts

  chat/                   # the REAL model call, separate from detectors/
    chatApi.ts  systemPrompt.ts  ChatContext.tsx  ChatDock.tsx  MessageBubble.tsx  Composer.tsx

  components/
    chrome/                # global, mounted once by AppShell
      AppShell.tsx  GlobalHeader.tsx  PresenterDock.tsx
      SpineBar.tsx  SpineStage.tsx
      NextActionsPanel.tsx  NextActionCard.tsx
      ScopeBoundaryNotice.tsx  RedactedField.tsx
    shared/                 # generic atoms, reused across screens
      Cite.tsx  Metric.tsx  Delta.tsx  Row.tsx  Group.tsx  status.ts  focus.ts
      GridTermRow.tsx        # dual grounding+review chips — deliberately NOT built on Row

  screens/                 # one file per moment; ScreenRouter is a plain switch
    LoginScreen.tsx  PersonaSelectScreen.tsx  DashboardScreen.tsx
    A0OpenMatterScreen.tsx  A2aSearchPrecedentsScreen.tsx  A2ConfirmPrecedentScreen.tsx
    B1GridScreen.tsx  B2UndefinedTermScreen.tsx
    A1SearchScreen.tsx  C1DiffScreen.tsx  E2CrossPracticeScreen.tsx
    ClosingF1Screen.tsx  ClosingF3Screen.tsx
    ScreenRouter.tsx

  App.tsx                  # thin: DemoStateProvider > ChatProvider > AppShell
```

---

## Navigation

`state.screen: ScreenId` (12-member union, `state/types.ts`) drives everything. **Do not add `react-router`.** The requirement that a presenter can jump to any moment live, in any order, is better served by a plain switch (`ScreenRouter`) plus a jump control than by URL routing. That control (`PresenterDock`, `state/momentSequence.ts`) is deliberately *not* header chrome — it's a small unlabeled floating button (bottom-right): click advances to the next moment in `MOMENT_SEQUENCE`, press-and-hold opens the full jump list. The `ArrowRight` keyboard shortcut (wired in `AppShell`, suppressed when a text input has focus) calls the same `nextMomentFrom()` helper — one canonical sequence, two triggers.

The one rule that matters: **navigating to a screen and seeding the state it assumes are the same call.** `useNavigate()` dispatches `NAVIGATE` and fires `momentSeeds.seedScreen()` in the same breath — a cold jump straight to B2 must seed a populated grid with the undefined term focused, identically to arriving there after playing A0→A2→B1. If you add a new moment that needs seed data, add its case to `momentSeeds.ts`, not to the screen component itself.

**Known sharp edge:** inside `momentSeeds.ts`, the `state` parameter is a snapshot from *before* this function's own dispatches take effect. Never re-read `state.foo` after dispatching an update to `foo` within the same seed function — thread the freshly-computed value through a return value instead (see `ensureGrid` → `seedB2Focus` for the pattern). This bit us once already; don't reintroduce it.

---

## The detector seam

`src/detectors/*.ts` is the swap boundary between today's scripted data and a future live LLM call. Every detector:

1. Is `async` and returns the *exact* domain shape the reducer already consumes (`GridTerm[]`, `PrecedentCandidate[]`) — never a raw model response.
2. Is pure with respect to app state — returns data, never `dispatch`s. The caller (`momentSeeds.ts`, or a screen's button handler) wraps the result in a dispatch.
3. Is the *only* file that changes when the swap happens. Don't let a screen component call `fetch`/an LLM directly for anything a detector already covers.

`chat/chatApi.ts` is **not** a detector — it's already a real Anthropic API call today and stays that way. Don't move it into `detectors/`.

---

## Data & state conventions

- **All cross-cutting types live in `state/types.ts`**, including shapes for moments not yet built (Phase 2/3). Type it when the *concept* is settled, even if the screen isn't built — retrofitting a shape into an already-wired reducer is more expensive than typing it up front.
- **Derived values are selectors, never stored fields.** Spine stage percentage, ranked Next-Actions — compute in `state/selectors.ts` from underlying state (grid terms, next-actions list), don't add a `percent` field to `DemoState` that something has to remember to keep in sync.
- **`GridTerm` carries three independent axes, never blended:** `grounding` (extracted vs. inferred), `review` (human-confirmed or not), `firmDefinition` (`defined` vs. `undefined_by_firm`). A term being `undefined_by_firm` is not a confidence level — it's a different kind of gap, and `GridTermRow` renders it as a completely different visual (single purple badge, not two chips). Don't merge these axes to simplify a component.
- **Deals are data, not rendering logic.** A new deal is a file under `data/deals/` plus a registry entry in `data/deals/index.ts`. Only `kindercare` and `medline` carry full `gridTerms`/`entity` detail; other precedent-corpus rows are intentionally lightweight (see `data/precedentCorpus.ts`).
- **Redaction is one lookup table, not a permissions engine.** `data/fieldSensitivity.ts`'s `canSeeField()` plus `<RedactedField sensitivity="...">` — extend the deny-list there, don't add ad hoc `if (persona === ...)` checks in screen components.

---

## Do / Don't

**Do**
- Keep screens presentational; keep moment-specific data in `data/` and moment-specific logic in `detectors/`.
- Reuse `components/shared/*` atoms (`Row`, `Metric`, `Cite`, `Group`) before writing a new one — `GridTermRow` is the one deliberate exception, and it's documented why above.
- Add a screen's seed logic to `momentSeeds.ts`, keyed by `ScreenId`.
- Run `npm run dev` after each change and click through the affected moment — a direct jump via `PresenterDock`/ArrowRight *and* the sequential flow — before considering it done.

**Don't**
- Don't add `react-router`, Redux, Zustand, or any state library — the existing Context+reducer is deliberately sufficient for 11 screens.
- Don't call the Anthropic API from anywhere except `chat/chatApi.ts`, and never commit a key (it's in `.env`, gitignored).
- Don't merge `undefined_by_firm` with `missing`/`not-found` visually or semantically, anywhere.
- Don't let a screen bypass `momentSeeds.ts` and seed its own state inline — a future direct-jump into that screen would then behave differently from the sequential flow.
- Don't hardcode `"kindercare"` as a string where `ANCHOR_DEAL_ID` (from `data/deals/index.ts`) should be used instead.

---

## How to extend

- **Add a deal:** create `data/deals/<id>.ts` conforming to `DealRecord` (`data/deals/types.ts`), register it in `data/deals/index.ts`. Give it full `gridTerms` only if it's meant to be a usable anchor.
- **Swap the anchor:** change `ANCHOR_DEAL_ID` in `data/deals/index.ts`. No component changes.
- **Back a detector with a real LLM call:** edit only that detector's file (see "The detector seam" above).
- **Build a Phase 2/3 moment:** its `ScreenId`, its slice of `DemoState`, and its placeholder screen already exist — replace the placeholder, add real detector logic if needed, add its seed case to `momentSeeds.ts`.
