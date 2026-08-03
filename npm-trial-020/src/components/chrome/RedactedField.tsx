import type { ReactNode } from "react";
import { Lock } from "lucide-react";
import { useDemoState } from "@/state/DemoStateContext";
import { canSeeField } from "@/data/fieldSensitivity";
import type { FieldSensitivity } from "@/state/types";

// Generic redaction wrapper — renders children if the acting persona can see this
// sensitivity tag, otherwise a blurred placeholder. This is what makes "same screen,
// different seniority/access" demonstrable from one lookup table (see
// data/fieldSensitivity.ts), since persona lives in central state and every screen
// using this re-renders automatically when it changes.
export function RedactedField({
  sensitivity,
  children,
}: {
  sensitivity: FieldSensitivity;
  children: ReactNode;
}) {
  const state = useDemoState();
  if (canSeeField(state.persona, sensitivity)) return <>{children}</>;
  return (
    <span className="inline-flex items-center gap-1 rounded-[4px] bg-[#f3f4f6] px-1.5 py-0.5 text-xs font-medium text-[#9a9a9a]">
      <Lock className="h-3 w-3" />
      Redacted — outside your access
    </span>
  );
}
