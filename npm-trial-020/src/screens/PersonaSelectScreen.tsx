import { PERSONAS, actingPersonaFromDef } from "@/data/personas";
import { useDemoDispatch, useNavigate } from "@/state/DemoStateContext";
import { FOCUS } from "@/components/shared/focus";

// Persona choice persists and visibly reshapes every screen that follows — Next
// Actions routing, field-level redaction, and which routing actions appear.
export function PersonaSelectScreen() {
  const dispatch = useDemoDispatch();
  const navigate = useNavigate();

  function choose(personaId: (typeof PERSONAS)[number]["id"]) {
    const def = PERSONAS.find((p) => p.id === personaId)!;
    dispatch({ type: "SET_PERSONA", persona: actingPersonaFromDef(def) });
    navigate("dashboard");
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-[#f5f6f9] px-6">
      <div className="mb-6 text-center">
        <div className="font-mono text-[10px] font-semibold uppercase tracking-wide text-[#9a9a9a]">DF Docket</div>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#1c1e1a]">Who's working this matter?</h1>
        <p className="mt-1 text-sm text-[#7a7a7a]">Your choice reshapes what you see and what routes to you.</p>
      </div>
      <div className="grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
        {PERSONAS.map((p) => (
          <button
            key={p.id}
            onClick={() => choose(p.id)}
            className={`flex flex-col items-start rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white p-5 text-left shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] ${FOCUS}`}
          >
            <span className="text-base font-semibold text-[#1c1e1a]">{p.name}</span>
            <span className="mt-0.5 text-xs font-medium text-[#9a9a9a]">{p.title}</span>
            <p className="mt-3 text-sm leading-relaxed text-[#7a7a7a]">{p.blurb}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
