import { ArrowLeft, ShieldAlert } from "lucide-react";
import { useDemoState, useNavigate } from "@/state/DemoStateContext";
import { rankedNextActions } from "@/state/selectors";
import { NextActionCard } from "@/components/chrome/NextActionCard";

// A distinct, reusable state — not a one-off screen. Any extraction anywhere in the
// system can reach this: "the firm has never told us" is a firm-definition gap, never
// rendered as a system failure or blended with a plain "not found."
export function B2UndefinedTermScreen() {
  const state = useDemoState();
  const navigate = useNavigate();
  const term =
    state.grid.find((t) => t.id === state.focusedGridTermId && t.firmDefinition === "undefined_by_firm") ??
    state.grid.find((t) => t.firmDefinition === "undefined_by_firm");
  const routedItem = term ? rankedNextActions(state).find((i) => i.sourceModule === "b2.undefinedTerm" && i.title.includes(term.label)) : undefined;

  if (!term) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center text-sm text-[#9a9a9a]">
        No undefined term is in focus — visit B1 first, or jump here from Moments.
      </div>
    );
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
