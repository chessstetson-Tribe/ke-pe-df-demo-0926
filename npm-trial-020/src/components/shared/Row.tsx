import { STATUS, type RowStatus } from "./status";

export interface RowData {
  name: string;
  status: RowStatus;
  note?: string | null;
  src?: string | null;
  done?: boolean;
  doneVerb?: string;
}

export function Row({ row }: { row: RowData }) {
  const s = STATUS[row.status];
  const right = row.done ? (
    <span className="text-xs font-medium text-[#9a9a9a]">{row.doneVerb || "Resolved"}</span>
  ) : row.src ? (
    <span className="font-mono text-[10px] font-semibold text-[#9a9a9a]">{row.src}</span>
  ) : s.badge ? (
    <span className={`rounded-[4px] border px-2 py-0.5 text-[10px] font-bold ${s.badgeCls}`}>{s.badge}</span>
  ) : null;

  return (
    <div className="rounded-lg px-3 py-2.5 transition-colors hover:bg-[#f5f6f9]">
      <div className="flex items-center gap-2.5">
        {s.dot ? (
          <span className="h-2 w-2 flex-none rounded-full bg-[#9a9a9a]" />
        ) : (
          s.Icon && <s.Icon className={`h-4 w-4 flex-none ${s.color}`} strokeWidth={2} />
        )}
        <span className="flex-1 truncate text-sm font-medium text-[#1c1e1a]">{row.name}</span>
        {right}
      </div>
      {row.note && (
        <p className="mt-1 text-xs leading-relaxed text-[#7a7a7a]" style={{ paddingLeft: 26 }}>
          {row.note}
        </p>
      )}
    </div>
  );
}
