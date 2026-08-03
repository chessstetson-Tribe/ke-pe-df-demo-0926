import type { ReactNode } from "react";

export function Cite({ id }: { id: string }) {
  return (
    <button className="mx-0.5 inline-flex items-baseline rounded-[4px] border border-[rgba(0,0,0,0.1)] bg-[rgba(0,0,0,0.04)] px-1 align-baseline font-mono text-[10px] font-semibold text-[#444444] transition-colors hover:bg-[rgba(0,0,0,0.08)]">
      {id}
    </button>
  );
}

export function renderCites(t: string): ReactNode[] {
  return t.split(/(\[(?:S\d+|P)\])/g).map((p, i) => {
    const m = p.match(/^\[(S\d+|P)\]$/);
    return m ? <Cite key={i} id={m[1]} /> : <span key={i}>{p}</span>;
  });
}

export function confFromText(t: string): "High" | "Medium" | "Low" {
  const n = new Set(t.match(/\[S\d+\]/g) || []).size;
  return n >= 3 ? "High" : n >= 1 ? "Medium" : "Low";
}

export function confColor(c: string): string {
  return c === "High"
    ? "border-transparent bg-[#f1ffed] text-[#10793d]"
    : c === "Low"
      ? "border-transparent bg-[rgba(220,38,38,0.06)] text-[#dc2626]"
      : "border-transparent bg-[#fef8e7] text-[#b67c2a]";
}
