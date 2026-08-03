import type { SpineStageStatus } from "@/state/types";

const STATUS_META: Record<SpineStageStatus, { label: string; cls: string; barCls: string }> = {
  "not-started": { label: "Not started", cls: "bg-[#f3f4f6] text-[#6b7280]", barCls: "bg-[#d1d5db]" },
  "in-progress": { label: "In progress", cls: "bg-[#ecf4ff] text-[#2354e8]", barCls: "bg-[#2354e8]" },
  "needs-review": { label: "Needs review", cls: "bg-[#fef8e7] text-[#b67c2a]", barCls: "bg-[#d97706]" },
  complete: { label: "Complete", cls: "bg-[#f1ffed] text-[#10793d]", barCls: "bg-[#16a34a]" },
};

export function SpineStage({
  label,
  status,
  percent,
  active,
}: {
  label: string;
  status: SpineStageStatus;
  percent: number;
  active?: boolean;
}) {
  const meta = STATUS_META[status];
  return (
    <div className={`min-w-0 flex-1 rounded-lg px-2.5 py-2 ${active ? "bg-[#f5f6f9]" : ""}`}>
      <div className="flex items-center justify-between gap-2">
        <span className={`truncate text-xs font-semibold ${active ? "text-[#1c1e1a]" : "text-[#7a7a7a]"}`}>{label}</span>
        <span className={`flex-none rounded-[4px] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ${meta.cls}`}>
          {meta.label}
        </span>
      </div>
      <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-[#f3f4f6]">
        <div className={`h-full rounded-full ${meta.barCls}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
