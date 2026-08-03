import { Check } from "lucide-react";
import type { NextActionItem } from "@/state/types";

const STAGE_LABEL: Record<NextActionItem["stage"], string> = {
  precedent: "Precedent",
  grid: "Grid",
  "term-sheet-commitment": "Term Sheet / Commitment",
  "credit-agreement": "Credit Agreement",
  "post-close": "Post-Close",
};

export function NextActionCard({
  item,
  rank,
  onResolve,
}: {
  item: NextActionItem;
  rank: number;
  onResolve?: (id: string) => void;
}) {
  const isTop = rank === 1 && item.status === "open";
  if (item.status === "resolved") {
    return (
      <div className="flex items-center gap-2 rounded-lg px-3 py-2 opacity-50">
        <Check className="h-3.5 w-3.5 flex-none text-[#16a34a]" />
        <span className="flex-1 truncate text-xs text-[#9a9a9a] line-through">{item.title}</span>
      </div>
    );
  }
  return (
    <div className={`rounded-xl border p-3 ${isTop ? "border-[#2354e8] bg-[#ecf4ff]" : "border-[rgba(0,0,0,0.08)] bg-white"}`}>
      <div className="flex items-center gap-1.5">
        {isTop && <span className="rounded-[4px] bg-[#2354e8] px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">#1</span>}
        <span className="font-mono text-[9px] font-semibold uppercase tracking-wide text-[#9a9a9a]">
          {STAGE_LABEL[item.stage]}
        </span>
      </div>
      <div className="mt-1 text-sm font-semibold text-[#1c1e1a]">{item.title}</div>
      <p className="mt-0.5 text-xs leading-relaxed text-[#7a7a7a]">{item.why}</p>
      <div className="mt-2 flex items-center justify-between">
        <span className="rounded-[4px] bg-[#f3f4f6] px-1.5 py-0.5 text-[9px] font-bold uppercase text-[#6b7280]">
          → {item.routedTo}
        </span>
        {onResolve && (
          <button
            type="button"
            onClick={() => onResolve(item.id)}
            className="rounded-[6px] border-2 border-[#d9d9d9] px-2 py-0.5 text-[10px] font-bold text-[#7a7a7a] hover:border-[#bbbbbb] hover:text-[#1c1e1a]"
          >
            Resolve
          </button>
        )}
      </div>
    </div>
  );
}
