import { useState } from "react";
import { ChevronDown, ChevronRight, LogOut } from "lucide-react";
import { useDemoDispatch, useDemoState } from "@/state/DemoStateContext";
import { PERSONAS, actingPersonaFromDef } from "@/data/personas";
import { activeDealName } from "@/state/selectors";
import { FOCUS } from "@/components/shared/focus";

export function GlobalHeader() {
  const state = useDemoState();
  const dispatch = useDemoDispatch();
  const [personaOpen, setPersonaOpen] = useState(false);
  const dealName = activeDealName(state);
  const currentPersona = PERSONAS.find((p) => p.id === state.persona.personaId)!;

  return (
    <header className="z-30 flex flex-none items-center justify-between border-b border-[rgba(0,0,0,0.08)] bg-white px-4 py-2.5">
      <div className="flex items-center gap-2">
        <span className="grid h-6 w-6 place-items-center rounded-md bg-[#444444] text-xs font-bold text-white">D</span>
        <span className="text-sm font-bold tracking-tight text-[#1c1e1a]">Docket</span>
        <ChevronRight className="h-3.5 w-3.5 text-[#bbbbbb]" />
        <span className="text-sm font-medium text-[#7a7a7a]">{dealName}</span>
      </div>
      <div className="relative flex items-center gap-3">
        <button
          onClick={() => setPersonaOpen((v) => !v)}
          className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-[#1c1e1a] hover:bg-[#f5f6f9] ${FOCUS}`}
        >
          <span className="rounded-[4px] bg-[#f5f6f9] px-1.5 py-0.5 text-[10px] font-bold uppercase text-[#444444]">
            {currentPersona.name}
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-[#9a9a9a]" />
        </button>
        {personaOpen && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setPersonaOpen(false)} />
            <div className="dropdown-animate absolute right-0 top-9 z-40 w-72 rounded-xl border border-[rgba(0,0,0,0.08)] bg-white p-1 shadow-[0_14px_34px_rgba(0,0,0,0.15)]">
              {PERSONAS.map((def) => (
                <button
                  key={def.id}
                  onClick={() => {
                    dispatch({ type: "SET_PERSONA", persona: actingPersonaFromDef(def) });
                    setPersonaOpen(false);
                  }}
                  className={`flex w-full flex-col items-start gap-0.5 rounded-md px-2.5 py-2 text-left transition-colors hover:bg-[#f5f6f9] ${FOCUS}`}
                >
                  <span className={`text-sm font-medium ${def.id === state.persona.personaId ? "text-[#2354e8]" : "text-[#1c1e1a]"}`}>
                    {def.name} <span className="font-normal text-[#9a9a9a]">— {def.title}</span>
                  </span>
                  <span className="text-xs leading-relaxed text-[#7a7a7a]">{def.blurb}</span>
                </button>
              ))}
              <div className="mt-1 space-y-1 border-t border-[rgba(0,0,0,0.08)] px-2.5 pt-2 pb-2">
                <div className="font-mono text-[9px] font-semibold uppercase tracking-wide text-[#bbbbbb]">
                  Access model (same screens, different visibility)
                </div>
                <button
                  onClick={() =>
                    dispatch({
                      type: "SET_PERSONA",
                      persona: { ...state.persona, onDealTeam: !state.persona.onDealTeam },
                    })
                  }
                  className="flex w-full items-center justify-between rounded-md px-1 py-1 text-left hover:bg-[#f5f6f9]"
                >
                  <span className="text-xs font-medium text-[#1c1e1a]">Deal team member</span>
                  <span className={`rounded-[4px] px-1.5 py-0.5 text-[9px] font-bold uppercase ${state.persona.onDealTeam ? "bg-[#f1ffed] text-[#10793d]" : "bg-[#f3f4f6] text-[#6b7280]"}`}>
                    {state.persona.onDealTeam ? "Yes" : "No"}
                  </span>
                </button>
                {state.persona.personaId === "associate" && (
                  <button
                    onClick={() =>
                      dispatch({
                        type: "SET_PERSONA",
                        persona: { ...state.persona, seniority: state.persona.seniority === "junior" ? "senior" : "junior" },
                      })
                    }
                    className="flex w-full items-center justify-between rounded-md px-1 py-1 text-left hover:bg-[#f5f6f9]"
                  >
                    <span className="text-xs font-medium text-[#1c1e1a]">Seniority</span>
                    <span className="rounded-[4px] bg-[#f5f6f9] px-1.5 py-0.5 text-[9px] font-bold uppercase text-[#444444]">
                      {state.persona.seniority}
                    </span>
                  </button>
                )}
              </div>
              <div className="mt-1 border-t border-[rgba(0,0,0,0.08)] px-2.5 pt-2 pb-1 text-xs text-[#bbbbbb]">
                Switching persona reshapes Next Actions and field visibility on every screen.
              </div>
            </div>
          </>
        )}
        <span className="grid h-7 w-7 place-items-center rounded-full bg-[#f5f6f9] text-xs font-bold text-[#444444]">JA</span>
        <button
          onClick={() => dispatch({ type: "LOGOUT" })}
          title="Log out"
          className={`grid h-7 w-7 place-items-center rounded-md text-[#9a9a9a] hover:bg-[#f5f6f9] hover:text-[#1c1e1a] ${FOCUS}`}
        >
          <LogOut className="h-3.5 w-3.5" />
        </button>
      </div>
    </header>
  );
}
