import type { ReactNode } from "react";

// The OOB/Tribe pairing is chrome, not pane content — it stays visible in the
// header through every phase (splash, ask modal, split screen) so the two-sided
// frame is set before the user ever asks a question, not introduced only once the
// split screen appears.
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="relative grid h-12 flex-none grid-cols-[1fr_1fr] items-center border-b border-[rgba(0,0,0,0.08)] px-6">
        <span className="grid h-6 w-6 place-items-center rounded-full text-xs font-bold text-white" style={{ background: "var(--tribe-accent)" }}>
          T
        </span>

        <span className="justify-self-end font-mono text-[10px] font-semibold uppercase tracking-wide text-[#9a9a9a]">
          Live explainer
        </span>

        {/* "vs" is anchored to the header's exact horizontal center — not centered
            as a group with the two labels — so it lines up with the split screen's
            column boundary below regardless of "OOB Agentic SaaS" vs "Tribe" being
            different lengths. Centering the group instead would drag "vs" toward
            whichever label is shorter. */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-full">
          <span className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-xs font-bold uppercase tracking-wide text-[#d9d9d9]">
            vs
          </span>
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-xs font-bold uppercase tracking-wide"
            style={{ color: "var(--vanilla-accent)" }}
          >
            OOB Agentic SaaS
          </span>
          <span
            className="absolute left-3 top-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-xs font-bold uppercase tracking-wide"
            style={{ color: "var(--tribe-accent)" }}
          >
            Tribe
          </span>
        </div>
      </header>
      <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
