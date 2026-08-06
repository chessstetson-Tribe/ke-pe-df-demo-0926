import type { ReactNode } from "react";

// Ported palette from npm-trial-020's components/shared/status.ts — same
// confidence/status vocabulary (green = grounded, amber = needs review, purple =
// firm-knowledge gap), reused here so "grounded" and "undefined by firm" read
// identically to the DF Docket demo instead of inventing a second color language.
const VARIANT_CLS: Record<string, string> = {
  neutral: "bg-[#f3f4f6] text-[#6b7280]",
  green: "bg-[#f1ffed] text-[#10793d]",
  amber: "bg-[#fef8e7] text-[#b67c2a]",
  red: "bg-[rgba(220,38,38,0.06)] text-[#dc2626]",
  purple: "bg-[#f4eaff] text-[#9e46ff]",
  blue: "bg-[#ecf4ff] text-[#2354e8]",
};

export function Chip({ variant = "neutral", icon, children }: { variant?: keyof typeof VARIANT_CLS; icon?: ReactNode; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-[4px] px-2 py-0.5 text-[10px] font-bold ${VARIANT_CLS[variant]}`}>
      {icon}
      {children}
    </span>
  );
}
