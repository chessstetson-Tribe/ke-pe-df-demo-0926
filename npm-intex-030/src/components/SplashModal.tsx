import { ArrowRight } from "lucide-react";

// The splash is a modal, not inline page content — same centered-card pattern as
// AtomicAskModal, so the app never has a bare, un-framed background state. No
// backdrop-click-to-dismiss here: unlike the ask modal, there's nothing behind it
// worth revealing early, so "Try it out" is the only way through.
export function SplashModal({ onStart }: { onStart: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-xl">
        <h1 className="text-2xl font-semibold tracking-tight text-[#1c1e1a]">
          Investigate precedent — watch side-by-side OOB vs Tribe
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[#7a7a7a]">
          Left: what an OOB agentic SaaS tool surfaces. Right: what Tribe's scaffold catches — and what happens when you
          teach it something the firm has never written down.
        </p>
        <button
          type="button"
          onClick={onStart}
          className="mx-auto mt-5 flex items-center gap-2 rounded-[8px] px-4 py-2.5 text-sm font-bold text-white"
          style={{ background: "var(--accent-blue)" }}
        >
          Try it out
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
