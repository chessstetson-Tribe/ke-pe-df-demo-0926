# Underwriter — Product

> An AI underwriting workspace for commercial real-estate lending.
> The persistent object is **Deal Readiness**, not the conversation.

This document is the north star. It captures what the product is, why it's shaped this way, and where it's going. Read it before making product or design decisions. For implementation rules, see `AGENTS.md`.

---

## 1. What this is

Underwriter connects to a lender's deal documents (SharePoint today, any MCP source over time), reads a deal, and helps a credit analyst move from a pile of files to a decision they can defend in committee.

It is **not a chat app**. Chat is one interaction inside a workspace. The thing that persists — the thing the whole interface is organized around — is how *ready* a deal is to be underwritten, and how *confident* the system is in its own read.

The one-line framing we use internally, and the one worth saying out loud:

> **Every interaction reduces uncertainty.**

Connecting a source, resolving a missing document, asking a question, reconciling a conflict — each one should visibly move the deal toward a decision. The UI's job is to make that progress legible.

---

## 2. The persistent object: Deal Readiness

Two numbers are always on screen, never buried in a tab:

- **Data readiness** (0–100%) — how complete the document picture is. Missing rent roll, missing SREO, partial appraisals all hold it down.
- **Confidence** (0.00–1.00) — how sure the system is in its derived figures, given conflicts and staleness. Crosses a band threshold (Low → Medium → High) at 0.80.

They live in a bar that stays pinned even while the analyst is chatting, so the deal's status never leaves the frame. Every meaningful action animates these upward — and **the animation is the point**: motion communicates increasing confidence, not decoration.

Around readiness sit the supporting views:

- **Key metrics** — the deal's vitals (DSCR, debt yield, LTV, cap for multifamily; net debt/EBITDA, fixed-charge coverage, occupancy, debt yield for a REIT facility), each measured against policy.
- **Coverage** — every document and derived figure, with status: complete, derived, conflicting, partial, missing, awaiting.
- **Next action** — the single highest-leverage thing to do next, with the readiness/confidence lift it would produce.

---

## 3. Interaction model

The workspace, not the conversation, is home. Layout in three regions:

```
┌────────────────────────── Header: brand · deal selector · deal meta · user ──────────────────────────┐
│            │                                                                          │              │
│  Activity  │   Deal state  (readiness bar · key metrics · next action · coverage)     │ Connections  │
│  (left     │   ─────────────────────── draggable divider ───────────────────────      │ (right       │
│   panel)   │   Chat  (grounded, cited answers · always-present composer)              │  panel)      │
│            │                                                                          │              │
└───────────────────────────────────────────────────────────────────────────────────────────────────┘
```

- **Deal state (top) + Chat (bottom)** share the center, split by a divider the analyst can drag. The readiness bar has a minimum height, so it persists even when chat is expanded.
- **Activity (left panel)** is the deal's event timeline: document ingestion, agent actions, the analyst's own questions, Teams messages, import results. It collapses to a rail.
- **Connections (right panel)** is the deal's plumbing: the connected source, compute & cost controls, security posture, and the API/MCP surface. It collapses to a rail.

Vocabulary we use consistently (see `AGENTS.md`): the whole frame is the **shell**; docked collapsible regions are **panels**; their collapsed strips are **rails**; the resizer is the **splitter**; the pinned readiness strip is the **deal-state bar**.

---

## 4. The deal lifecycle

What an analyst actually does, start to finish:

1. **Select or create a deal** from the header selector.
2. **Connect a source** — paste a SharePoint folder UUID or an MCP endpoint. Documents are indexed and scored automatically; a progress pass walks through connecting → indexing → extracting → computing, and the workspace **populates** as readiness climbs from zero.
3. **Review** coverage, key metrics, and gaps. Conflicts (e.g. an appraisal cap rate that disagrees with the T-12 NOI) are surfaced, not hidden.
4. **Act on the next action** — mark a document received, order an appraisal, reconcile a figure. Readiness and confidence rise; the gap closes; the next action appears; the event is logged to Activity.
5. **Ask questions** — chat answers from the deal's document packet with inline citations (`[S2]`, `[P]`) and a confidence badge. Chat is an instrument on the deal, not a separate surface.
6. **Reach senior review** once gaps are cleared.

---

## 5. Two deals today (and why)

The product is **data-driven**: the rendering is generic, and a deal is just data. Two are shipped to prove the architecture across very different asset classes:

- **Maplewood Apartments** — a 120-unit multifamily acquisition loan. Ships populated. Carries deliberate, realistic flaws: a stale appraisal whose cap rate conflicts with the T-12 NOI, a missing Schedule of Real Estate Owned, an in-place DSCR (0.95×) below policy. It demonstrates the steady state.

- **Tanger Outlet Centers** — a ~$300M senior secured facility to an investment-grade outlet REIT (NYSE: SKT), collateralized by a pool of centers. Ships **blank** (0% readiness) to demonstrate the connect → import → populate flow end to end. Tanger's figures are an **approximate public baseline** (≈38 centers, ~97.8% occupancy, net debt/EBITDA ~5.1×), used because the data is public; it may be given a fictional name later. Banks routinely extend exactly this kind of facility to public REITs, so the scenario is sound.

Adding a third deal is adding one data file — no new rendering code.

---

## 6. What's real vs. mocked (today)

This separation is deliberate and is the spine of the architecture:

| Capability | Status | Notes |
|---|---|---|
| Chat / Q&A | **Real** | Calls a model with the deal's document packet as context; real grounded answers with citations. |
| Readiness, confidence, coverage, next-action dynamics | **Real (client-side)** | Genuine state, genuine animation. |
| Token / cost controls | **Real (client-side)** | Toggles recompute a live context-budget readout. |
| SharePoint / MCP connection | **Mocked** | The paste-to-connect import is simulated. |
| The documents themselves | **Mocked** | Synthesized as structured data in a separate workstream. |

The mocked pieces sit behind a single seam (`lib/fakeApi.ts`). Replacing the simulated import with a real MCP/SharePoint fetch **does not change the UI** — same shapes in, same views out. That is the evolution property we're optimizing for: every mock interaction can later be backed by a real API without touching the components.

---

## 7. Design language

Calm, dense, and decisive — a tool that reduces uncertainty should not itself feel uncertain.

- **Palette:** near-black `zinc-950` canvas, raised `zinc-900` surfaces, a single **violet** accent. Status colors (emerald / amber / sky / rose) used sparingly and only to mean something.
- **Hierarchy through typography and space, not chrome.** Borders are demoted to hairlines; cards are defined by elevation. Headings are tight; labels are muted, sentence-case (never all-caps mono — that reads as a terminal, not a workspace).
- **Numbers** use `tabular-nums` so they don't jitter as they animate.
- **Motion** is subtle and meaningful: readiness eases up, bars fill, confidence counts toward its new value. `prefers-reduced-motion` is respected.
- **References:** Linear (structure, restraint), Vercel Dashboard (calm density), Granola (focus), Raycast (responsiveness), Notion (hierarchy).

---

## 8. Roadmap

- **Stage 0 — today.** The workspace, fully realized as a local app. Chat is real; the SharePoint connection, import, and documents are mocked behind `fakeApi.ts`.
- **Bridge.** Real MCP/SharePoint fetch swapped in behind the same seam. Chat routed through a key-holding proxy. Components split out, types firmed up. UI unchanged.
- **Stage 1.** Real document ingestion: drag-and-drop, PDF/DOCX/XLSX parsing + OCR, real citation extraction tied to source spans, a real workflow engine behind the advance loop.
- **Stage 2.** A document graph and semantic retrieval; persistent prior across sessions; multi-user review, Teams integration, approvals, and an audit trail; model routing by task.

---

## 9. Non-goals

- **Not an enterprise dashboard.** No widget walls, no chartjunk, no border grids.
- **Not a generic chatbot.** Chat serves the deal; it is not the center of gravity.
- **Not a throwaway demo.** This is the first commit of the application architecture.
