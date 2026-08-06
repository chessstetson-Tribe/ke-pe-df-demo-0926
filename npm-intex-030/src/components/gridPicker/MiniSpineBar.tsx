// A static, non-interactive lift of npm-trial-020's SpineBar/SpineStage — same
// stage labels, same status palette (bg-[#f1ffed]/#10793d complete,
// bg-[#ecf4ff]/#2354e8 in-progress) — so this reads as "the associate's actual
// app," not a generic wizard. Hardcoded to "Precedent confirmed, working the
// Grid" since that's the state every case in this picker assumes.
const STAGES = [
  { label: "Precedent", status: "complete" as const, percent: 100 },
  { label: "Grid", status: "in-progress" as const, percent: 45, active: true },
  { label: "Term Sheet / Commitment", status: "not-started" as const, percent: 0 },
  { label: "Credit Agreement", status: "not-started" as const, percent: 0 },
  { label: "Post-Close", status: "not-started" as const, percent: 0 },
];

const STATUS_META: Record<string, { label: string; cls: string; barCls: string }> = {
  "not-started": { label: "Not started", cls: "bg-[#f3f4f6] text-[#6b7280]", barCls: "bg-[#d1d5db]" },
  "in-progress": { label: "In progress", cls: "bg-[#ecf4ff] text-[#2354e8]", barCls: "bg-[#2354e8]" },
  complete: { label: "Complete", cls: "bg-[#f1ffed] text-[#10793d]", barCls: "bg-[#16a34a]" },
};

export function MiniSpineBar() {
  return (
    <div className="flex flex-none items-center gap-1 rounded-lg border border-[rgba(0,0,0,0.08)] bg-white px-2 py-1.5">
      {STAGES.map((stage) => {
        const meta = STATUS_META[stage.status];
        return (
          <div key={stage.label} className={`min-w-0 flex-1 rounded-md px-1.5 py-1 ${stage.active ? "bg-[#f5f6f9]" : ""}`}>
            <div className="flex items-center justify-between gap-1">
              <span className={`truncate text-[10px] font-semibold ${stage.active ? "text-[#1c1e1a]" : "text-[#7a7a7a]"}`}>{stage.label}</span>
            </div>
            <div className="mt-1 h-[3px] w-full overflow-hidden rounded-full bg-[#f3f4f6]">
              <div className={`h-full rounded-full ${meta.barCls}`} style={{ width: `${stage.percent}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
