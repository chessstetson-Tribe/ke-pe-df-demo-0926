# Design Principles for an Agentic-Age Shared Corpus

## The store

**S = ⟨Λ, α⟩**

- **Λ** — the totally ordered log of assertions. The only thing written.
- **α** — the authority map: which agents may commit what, over which region. Exogenous by construction.

Everything else is derived from Λ. α alone is given.

**The axis:** commit as late as possible. Principles 1–4 are instances. Principle 5 is the exception, and it is the exception because deriving authority from the store requires trusting the store, which requires the authority. Regress.

## Principles

| # | Principle | What agents do better | Buys |
|---|---|---|---|
| 1 | The assertion is the only write primitive | Hold contradictions without needing them resolved | R1 |
| 2 | Identity is claimed, not performed — `same-as(a,b)` is an assertion | Re-resolve per query, rather than once and forever | R2 |
| 3 | Structure is a view, not a container | Learn a new projection at no cost; a human can hold one | R1, R2 |
| 4 | Permissions attach to assertions, not containers | Re-evaluate a predicate per read, at machine cost | R4 |
| 5 | Authority is exogenous | Nothing — this is the human residue | R3 |

## Derived quantities

- **L(Λ,t)** — the ontology, as a function of the log. Never stored, so never migrated.
- **ρ(i,t) ⊆ Λ** — visibility is a subset, not a prefix. Granular permission, and its cost, in one expression.
- **C_G^ε φ** — ε-common knowledge in group G. Not a component of S; the property S must satisfy.

## Capabilities

- **R1 — ontology changes as easily as data.** Schema is an assertion (1) and containers do not exist (3), so there is nothing to migrate. L is recomputed, not rewritten.
- **R2 — connections nobody anticipated.** A new view (3) over revisable identity claims (2), rather than an edge someone had to foresee at write time.
- **R3 — fast, unambiguous update, respected org-wide.** Well-defined exactly where one authority governs the region (5). Ambiguity is a governance fact, not a technical one.
- **R4 — flexible, granular permission.** Forced by (4): with no containers, there is nothing coarser to attach to.

## Costs, stated plainly

- **(1)** No write-time constraint enforcement. A constraint is itself an assertion something can contradict.
- **(2)** Resolution cost moves to read time; contradictory identity claims can coexist.
- **(3)** Two agents on different views may act on different pictures of the same facts.
- **(4)** ρ returns a subset, so "what the org knows" is well-defined only relative to a clearance class.
- **(5)** The one thing that cannot be deferred, automated, or asserted.

## Open problem

Principle 3 is in tension with R3. Concurrent views mean concurrent pictures, which is what a shared store exists to prevent.

The needed admissibility condition on views V₁, V₂ over the same Λ:

> for φ in a region governed by α: V₁ ⊨ φ iff V₂ ⊨ φ

Views may differ in shape; they must agree on committed content. Formalising and enforcing this is unfinished.

## Premise, and how it dies

Structure was never the human concession — **canonicity** was. Humans can internalise one shape and pay heavily for a second. Agents cannot be assumed to share that limit. The design keeps structure and drops the requirement that there be exactly one.

Falsified if multiple concurrent views over the same assertions degrade agent accuracy relative to a single canonical schema — through retrieval collision, or agents selecting inconsistent views across turns.

An earlier and weaker version of the premise — that agents make read-side structure unnecessary — was tested and rejected: structured retrieval outperforms flat retrieval on multi-hop questions, and schema linking dominates text-to-SQL error. Agents need structure roughly as much as humans do.
