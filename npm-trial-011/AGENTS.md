# Underwriter — Agent Guide

Instructions for any AI assistant (Cursor, Claude Code, etc.) working in this repo. Read `PRODUCT.md` first for the vision; this file is the *how*. When a decision isn't covered here, bias toward the product's first principle below and ask rather than inventing enterprise conventions.

---

## First principle

**This is an underwriting workspace, not a chat app.** The persistent object is **Deal Readiness** (a data-completeness % and a confidence score, always on screen). Chat is one interaction among several. Every interaction — connecting a source, resolving a gap, answering a question — should visibly **reduce uncertainty**, and every animation should communicate **increasing confidence**.

If a change makes the app feel more like a generic chatbot or a dashboard of widgets, it's wrong.

---

## Design rules (non-negotiable)

- Prefer **whitespace over borders**. Define surfaces with elevation (`bg-zinc-900` on a `bg-zinc-950` canvas); reserve borders for hairlines and for controls (buttons, inputs).
- Prefer **typography over color** for hierarchy. Tight headings, muted **sentence-case** labels. **Never all-caps mono labels** — that reads as a terminal.
- **One accent color: violet.** Do not introduce a second brand accent. Status colors (emerald / amber / sky / rose) are allowed but only when they carry meaning, used at the `-400` weight with soft `-950` badges.
- Numbers use **`tabular-nums`**; they should not jitter while animating.
- **Motion is subtle and meaningful.** Readiness eases up, bars fill, confidence counts toward its value. Always respect `prefers-reduced-motion`.
- Keyboard focus is always visible (a violet focus ring). Don't strip focus states.
- **No enterprise-dashboard aesthetics.** No widget walls, no chartjunk, no gradient cards.

**Visual references:** Linear (structure, restraint), Vercel Dashboard (calm density), Granola (focus), Raycast (responsiveness), Notion (hierarchy). When unsure how something should feel, look at these.

---

## Tech stack

- **Vite + React + TypeScript.** TypeScript is required; type the data model properly (`lib/types.ts`).
- **Tailwind CSS v4** via `@tailwindcss/vite`. This is **CSS-first** — there is no `tailwind.config.js` with a `content` array and no `@tailwind base/components/utilities` directives. Configure with `@import "tailwindcss";` and a `@theme { … }` block in the global stylesheet. **Do not follow Tailwind v3 tutorials** — they will mislead you. Verify shadcn/Tailwind steps against the *current* docs.
- **shadcn/ui** (Default style, **Zinc** base, CSS variables: yes). Components in use: `button`, `card`, `input`, `separator`, `badge`, `progress`, `scroll-area`, `dropdown-menu` (for the deal selector). `sheet` may be installed but **the side panels are custom** (see seams) — they push/resize, they are not overlay sheets.
- **lucide-react** for icons.
- **framer-motion** (also importable as `motion`) for the readiness/confidence easing and import progress. Replaces the hand-rolled `requestAnimationFrame` easing from the prototype.
- **clsx** + **tailwind-merge** → a single `cn()` helper in `lib/cn.ts`.

Keep the stack small. Don't add a state library, a component kit, or a CSS-in-JS runtime without a strong reason.

---

## Project structure

```
src/
  components/
    layout/
      Header.tsx          # brand · deal selector · deal meta · user
      DealSelector.tsx     # dropdown-menu; switches the active deal
      SplitView.tsx        # the draggable vertical splitter (deal state / chat)
      ActivityPanel.tsx    # LEFT panel — event timeline; collapses to a rail
      ConnectionsPanel.tsx # RIGHT panel — sources, compute, security, API/MCP
    deal/
      DealStateBar.tsx     # the always-visible readiness + confidence bar
      KeyMetrics.tsx       # the vitals grid, each metric vs policy
      NextAction.tsx       # single highest-leverage action + projected lift
      Coverage.tsx         # document/figure list
      CoverageRow.tsx      # one row: status icon, name, source/badge
    chat/
      ChatPanel.tsx        # message list + composer
      ChatMessage.tsx      # user bubble / analyst answer + confidence badge
      Composer.tsx         # input; Enter to send
      Citation.tsx         # inline [S#]/[P] chip
    connect/
      ImportFlow.tsx       # blank-deal connect → progress → populate
    strategy/
      ComputeCost.tsx      # token-reduction toggles + live context/cost readout
  data/
    deals/
      maplewood.ts         # populated multifamily deal
      tanger.ts            # blank REIT facility (imports on connect)
      index.ts             # the deal registry
  lib/
    types.ts               # Deal, Coverage, Metric, Step, Message, Source, …
    fakeApi.ts             # SIMULATED SharePoint/MCP import (the swap seam)
    chat.ts                # the REAL model call (goes through the proxy)
    cn.ts                  # clsx + tailwind-merge
    useReadiness.ts        # readiness/confidence easing hook (framer-motion)
  App.tsx                  # holds the active deal; renders the shell
  index.css                # @import "tailwindcss"; @theme { … }
```

**There is no `backend/` folder yet.** Don't create one. The only server-side code needed is the chat proxy (see below), which can live as a single Vite dev-server middleware or serverless function.

---

## Data & state conventions

- **Deals are data; rendering is generic.** A new deal is a new file under `data/deals/` plus a registry entry — never new rendering logic. If you find yourself special-casing a deal in a component, push the difference into the deal's data instead.
- **Types live in `lib/types.ts`.** Define and reuse `Deal`, `Coverage`, `Metric`, `Step`, `Message`, `Source`. Coverage status is a union: `'complete' | 'derived' | 'conflicting' | 'partial' | 'missing' | 'awaiting'`.
- **The per-deal workspace fully resets on switch.** Mount it with `key={dealId}` so all per-deal state (readiness, current step, activity, messages) reinitializes cleanly.
- **Readiness/confidence are eased display values** over their targets. Resolving a step sets new targets; the hook animates toward them. The same hook drives the climb during import.
- **The advance loop:** each deal has an ordered `steps[]`. Resolving the current step raises the readiness/confidence targets, flips the matching coverage row to resolved, reveals the next action (or a "ready for review" state), and prepends an Activity event.

---

## The two seams (most important section)

Everything mocked sits behind one of two seams. Keep them clean and the product evolves without UI churn.

**1. Import / data source → `lib/fakeApi.ts`.**
The paste-to-connect import is simulated here. It must expose a stable async interface (e.g. `connectSource(uri)`, `importDeal(dealId)`) returning the same shapes a real MCP/SharePoint fetch will. When the real integration lands, implement it behind these signatures. **The UI must not change when the mock is swapped for the real fetch.** Don't leak simulation details (timers, fake progress) into components — components consume the interface, not the fakery.

**2. Chat → `lib/chat.ts`, through a key-holding proxy.**
Chat is a *real* model call. In the Claude artifact sandbox it worked keyless because the sandbox injected auth — **that does not hold locally.** A model API key in browser code is exposed (and worse if committed or screen-shared). So:

- `lib/chat.ts` calls **your own endpoint**, not the model API directly.
- Stand up a thin proxy that holds the key **server-side** — a Vite dev-server route or a serverless function is enough. This is not "a backend," it's one file.
- The key comes from an env var (`.env.local`, git-ignored). **Never** put a key in client code or a commit.
- Each deal supplies its own system packet (its documents/policy as context). Keep grounding + citation behavior identical to the prototype: answers cite `[S#]`/`[P]` inline and carry a confidence badge derived from source coverage.

---

## Status, color & number tokens

- Coverage/status: `complete` → emerald check; `conflicting`/`partial` → amber; `awaiting` → sky; `missing` → rose; `derived` → neutral zinc dot. Soft badges use the `-950` background / `-300` text / `-900` border pattern.
- Metric tone dots: emerald = within policy, amber = caution/approaching limit, zinc = neutral/derived.
- Money and ratios: `tabular-nums`, consistent precision per metric.
- Citations: violet chips (`[S2]`, `[P]`).

---

## Animation

- Use framer-motion for: readiness % and confidence easing, the import progress fill, and metric count-ups. Keep durations short (~0.3–0.75s) and easings gentle (ease-out).
- **Every animation should read as "confidence increasing."** No flashy entrances, no springy bounce that implies playfulness.
- Gate all motion on `prefers-reduced-motion`; in reduced mode, jump to final values.

---

## Do / Don't

**Do**
- Keep components presentational; keep deal differences in data.
- Add new shadcn primitives as needed, themed to zinc + violet.
- Put any new mock behind `fakeApi.ts` with a real-API-shaped signature.
- Run the app after each extraction step when decomposing the prototype.

**Don't**
- Don't add a `backend/` folder or a database yet.
- Don't call the model API directly from the browser, and never commit a key.
- Don't introduce a second accent color or all-caps mono labels.
- Don't reach for arbitrary Tailwind values (`w-[317px]`, `bg-violet-500/10`) when a standard utility or an inline `style` for a genuinely dynamic value will do.
- Don't rebuild the push/resize side panels as shadcn `Sheet` overlays.
- Don't turn this into a chat app.

---

## Migrating the prototype (one-time)

1. Scaffold Vite + React + TS, install the stack, init shadcn (zinc, CSS vars), **commit the empty scaffold first**.
2. Paste the prototype JSX in and get it **rendering** — do not refactor yet.
3. Only then decompose: extract one region at a time into the structure above (Cursor is good at "move this selection into `DealStateBar.tsx`"), verifying the app still runs after each step.
4. Firm up `lib/types.ts`, split the deals into `data/deals/`, and pull the simulated import into `lib/fakeApi.ts` and the chat call into `lib/chat.ts`.

---

## How to extend

- **Add a deal:** create `data/deals/<id>.ts` conforming to `Deal`, register it in `data/deals/index.ts`. No rendering changes.
- **Back a mock with real data:** implement the real fetch behind the existing `fakeApi.ts` signature. Components are untouched.
- **Add a metric or coverage status:** extend the union in `lib/types.ts` and its token mapping; the views pick it up.
