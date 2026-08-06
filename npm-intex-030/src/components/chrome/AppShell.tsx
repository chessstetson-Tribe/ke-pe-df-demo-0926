import type { ReactNode } from "react";

// The OOB/Tribe pairing is chrome, not pane content — it stays visible in the
// header through every phase (splash, ask modal, split screen) so the two-sided
// frame is set before the user ever asks a question, not introduced only once the
// split screen appears.
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="grid h-12 flex-none grid-cols-[1fr_auto_1fr] items-center border-b border-[rgba(0,0,0,0.08)] px-6">
        <span className="grid h-6 w-6 place-items-center rounded-full text-xs font-bold text-white" style={{ background: "var(--tribe-accent)" }}>
          T
        </span>

        <div className="flex items-center gap-2.5 justify-self-center font-mono text-xs font-bold uppercase tracking-wide">
          <span style={{ color: "var(--vanilla-accent)" }}>OOB Agentic SaaS</span>
          <span className="text-[#d9d9d9]">vs</span>
          <span style={{ color: "var(--tribe-accent)" }}>Tribe</span>
        </div>

        <span className="justify-self-end font-mono text-[10px] font-semibold uppercase tracking-wide text-[#9a9a9a]">
          Live explainer
        </span>
      </header>
      <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
