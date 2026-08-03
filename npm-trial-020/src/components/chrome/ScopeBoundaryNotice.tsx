import { Info } from "lucide-react";

// Generic, reusable "explicit scope boundary" state (§1.6) — any screen can invoke
// this when a user's action would otherwise imply a capability that doesn't exist
// yet. Framed as an honest, calm statement, not an error: a system that names its own
// gaps is a trust signal, not a failure state.
export function ScopeBoundaryNotice({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-[#d9e6ff] bg-[#f6f9ff] p-4">
      <Info className="mt-0.5 h-4 w-4 flex-none text-[#2354e8]" />
      <div>
        <div className="text-sm font-semibold text-[#1c1e1a]">{title}</div>
        <p className="mt-1 text-sm leading-relaxed text-[#3a3a3a]">{body}</p>
      </div>
    </div>
  );
}
