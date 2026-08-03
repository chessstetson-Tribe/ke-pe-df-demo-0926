import { AlertTriangle, Check, Circle, Clock, type LucideIcon } from "lucide-react";

export type RowStatus =
  | "complete"
  | "conflicting"
  | "missing"
  | "awaiting"
  | "partial"
  | "derived"
  | "undefined_by_firm";

interface StatusMeta {
  Icon?: LucideIcon;
  dot?: boolean;
  color: string;
  badge?: string;
  badgeCls?: string;
}

export const STATUS: Record<RowStatus, StatusMeta> = {
  complete: { Icon: Check, color: "text-[#16a34a]" },
  conflicting: { Icon: AlertTriangle, color: "text-[#b67c2a]", badge: "Conflict", badgeCls: "border-transparent bg-[#fef8e7] text-[#b67c2a]" },
  missing: { Icon: Circle, color: "text-[#dc2626]", badge: "Missing", badgeCls: "border-transparent bg-[rgba(220,38,38,0.06)] text-[#dc2626]" },
  awaiting: { Icon: Clock, color: "text-[#2354e8]", badge: "Awaiting", badgeCls: "border-transparent bg-[#ecf4ff] text-[#2354e8]" },
  partial: { Icon: Clock, color: "text-[#2354e8]", badge: "Partial", badgeCls: "border-transparent bg-[#ecf4ff] text-[#2354e8]" },
  derived: { dot: true, color: "text-[#9a9a9a]", badge: "Derived", badgeCls: "border-transparent bg-[#f3f4f6] text-[#6b7280]" },
  // Deliberately distinct from `missing` — this is "the firm has never defined this,"
  // not "we couldn't find it." Reuses the same purple AI-provenance tint used for the
  // chat's assistant avatar, since this is also a firm-knowledge-gap signal, not a
  // retrieval failure. Never merge this with `missing` visually or semantically.
  undefined_by_firm: { Icon: AlertTriangle, color: "text-[#9e46ff]", badge: "Undefined by firm", badgeCls: "border-transparent bg-[#f4eaff] text-[#9e46ff]" },
};

export const TONE: Record<"amber" | "emerald" | "zinc", string> = {
  amber: "bg-[#d97706]",
  emerald: "bg-[#16a34a]",
  zinc: "bg-[#9a9a9a]",
};
