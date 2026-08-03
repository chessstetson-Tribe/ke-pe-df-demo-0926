import { ArrowRight } from "lucide-react";

export function Delta({ label, from, to }: { label: string; from: string; to: string }) {
  return (
    <div>
      <div className="font-mono text-[10px] font-semibold uppercase tracking-wide text-[#9a9a9a]">{label}</div>
      <div className="mt-1 flex items-center gap-1.5 text-sm tabular-nums">
        <span className="text-[#7a7a7a]">{from}</span>
        <ArrowRight className="h-3 w-3 text-[#bbbbbb]" />
        <span className="font-semibold text-[#2354e8]">{to}</span>
      </div>
    </div>
  );
}
