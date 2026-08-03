export function Metric({
  label,
  value,
  suffix,
  sub,
  pct,
}: {
  label: string;
  value: string | number;
  suffix?: string;
  sub?: string;
  pct: number;
}) {
  return (
    <div className="w-40 flex-none">
      <div className="flex items-baseline gap-2">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-wide text-[#9a9a9a]">{label}</span>
        <span className="font-serif text-xl font-semibold tabular-nums tracking-tight text-[#1c1e1a]">
          {value}
          <span className="text-sm font-normal text-[#9a9a9a]">{suffix}</span>
        </span>
        {sub && <span className="text-xs font-medium text-[#7a7a7a]">{sub}</span>}
      </div>
      <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-[#f3f4f6]">
        <div className="h-full rounded-full bg-[#2354e8]" style={{ width: pct + "%" }} />
      </div>
    </div>
  );
}
