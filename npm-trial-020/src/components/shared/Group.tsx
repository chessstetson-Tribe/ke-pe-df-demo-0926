import type { ReactNode } from "react";

export function Group({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="border-b border-[rgba(0,0,0,0.08)] px-4 py-4">
      <div className="mb-2.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-[#9a9a9a]">
        {label}
      </div>
      {children}
    </div>
  );
}
