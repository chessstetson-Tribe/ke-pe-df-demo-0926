import { Construction } from "lucide-react";

// Shared shell for moments not yet built in this build pass — clearly marked so a
// presenter jumping here via Moments knows it's intentionally not wired up yet,
// rather than looking like a bug.
export function PlaceholderScreen({ momentLabel, title, note }: { momentLabel: string; title: string; note: string }) {
  return (
    <div className="flex min-h-0 flex-1 items-center justify-center">
      <div className="max-w-md rounded-2xl border border-dashed border-[rgba(0,0,0,0.15)] p-8 text-center">
        <Construction className="mx-auto h-6 w-6 text-[#bbbbbb]" />
        <div className="mt-3 font-mono text-[10px] font-semibold uppercase tracking-wide text-[#9a9a9a]">{momentLabel}</div>
        <h2 className="mt-1 text-base font-semibold text-[#1c1e1a]">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-[#9a9a9a]">{note}</p>
      </div>
    </div>
  );
}
