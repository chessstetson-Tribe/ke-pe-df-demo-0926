import { useState } from "react";
import { ArrowLeft, CheckCircle2, ShieldAlert } from "lucide-react";
import { useDemoDispatch, useDemoState, useNavigate } from "@/state/DemoStateContext";
import { isFirmDefined, rankedNextActions } from "@/state/selectors";
import { NextActionCard } from "@/components/chrome/NextActionCard";

// A distinct, reusable state — not a one-off screen. Any extraction anywhere in the
// system can reach this: "the firm has never told us" is a firm-definition gap, never
// rendered as a system failure or blended with a plain "not found."
export function B2UndefinedTermScreen() {
  const state = useDemoState();
  const dispatch = useDemoDispatch();
  const navigate = useNavigate();
  const [draft, setDraft] = useState("");
  const term =
    state.grid.find((t) => t.id === state.focusedGridTermId && t.firmDefinition === "undefined_by_firm") ??
    state.grid.find((t) => t.firmDefinition === "undefined_by_firm");
  const routedItem = term ? rankedNextActions(state).find((i) => i.sourceModule === "b2.undefinedTerm" && i.title.includes(term.label)) : undefined;
  const definition = term ? isFirmDefined(state, term.label) : undefined;

  if (!term) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center text-sm text-[#9a9a9a]">
        No undefined term is in focus — visit B1 first, or jump here from Moments.
      </div>
    );
  }

  function submitDefinition() {
    if (!term || !draft.trim()) return;
    dispatch({
      type: "ADD_FIRM_DEFINITION",
      definition: { label: term.label, definition: draft.trim(), authorPersona: state.persona.personaId },
    });
    setDraft("");
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto max-w-2xl px-6 py-8">
        <button onClick={() => navigate("b1")} className="flex items-center gap-1 text-xs font-medium text-[#7a7a7a] hover:text-[#1c1e1a]">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to grid
        </button>

        <div className="mt-4 font-mono text-[10px] font-semibold uppercase tracking-wide text-[#9a9a9a]">
          Moment B2 — Undefined term
        </div>

        <div className="mt-2 flex items-start gap-3 rounded-2xl border border-[#e6d1ff] bg-[#faf5ff] p-5">
          <ShieldAlert className="mt-0.5 h-5 w-5 flex-none text-[#9e46ff]" />
          <div>
            <h1 className="text-lg font-semibold text-[#1c1e1a]">{term.label}</h1>
            <p className="mt-2 text-sm leading-relaxed text-[#3a3a3a]">
              K&E has never defined a firm-wide pass/fail standard for this term. That's not a system failure — it's
              a gap in the firm's own definitions, and the tool says so plainly instead of guessing.
            </p>
            {term.firmDefinitionNote && (
              <p className="mt-2 text-sm leading-relaxed text-[#6b46a3]">{term.firmDefinitionNote}</p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-wide text-[#9a9a9a]">
            Firm-wide definition
          </div>
          {definition ? (
            <div className="flex items-start gap-3 rounded-2xl border border-[#d3f2df] bg-[#f1ffed] p-5">
              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-[#10793d]" />
              <div>
                <div className="text-sm font-semibold text-[#1c1e1a]">Defined this session — applies to every deal</div>
                <p className="mt-1 text-sm leading-relaxed text-[#3a3a3a]">{definition.definition}</p>
                <p className="mt-2 text-xs text-[#7a7a7a]">Set by {definition.authorPersona}. Any grid — this deal or another — now treats this term as firm-defined.</p>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white p-5">
              <p className="text-sm leading-relaxed text-[#7a7a7a]">
                Give this term a firm-wide pass/fail standard. It resolves this flag immediately — and every other
                deal's grid that hits "{term.label}" for the rest of this session, not just this one.
              </p>
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="e.g. “An equity cure counted no more than twice per four-quarter period, capped at the lesser of 20% of EBITDA or the covenant shortfall”"
                rows={3}
                className="mt-3 w-full rounded-[6px] border border-[rgba(0,0,0,0.08)] px-3 py-2 text-sm text-[#1c1e1a]"
              />
              <button
                type="button"
                onClick={submitDefinition}
                disabled={!draft.trim()}
                className="mt-2 rounded-[8px] bg-[#2354e8] px-3.5 py-2 text-sm font-bold text-white hover:bg-[#1a45c0]"
                style={{ opacity: draft.trim() ? 1 : 0.5 }}
              >
                Save firm definition
              </button>
            </div>
          )}
        </div>

        <div className="mt-6">
          <div className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-wide text-[#9a9a9a]">
            Routed for firm sign-off
          </div>
          {routedItem ? (
            <NextActionCard item={routedItem} rank={1} />
          ) : (
            <p className="text-sm text-[#9a9a9a]">This will appear in Knowledge Management's Next Actions once flagged.</p>
          )}
        </div>
      </div>
    </div>
  );
}
