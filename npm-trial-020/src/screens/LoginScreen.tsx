import { ShieldCheck } from "lucide-react";
import { useDemoDispatch } from "@/state/DemoStateContext";
import { FOCUS } from "@/components/shared/focus";

// Mocked auth — no real security requirement, just a believable entry point implying
// an enterprise auth stack (K&E's actual stack uses Azure AD/Intapp ethical-wall
// gating) without needing to implement it.
export function LoginScreen() {
  const dispatch = useDemoDispatch();
  return (
    <div className="flex h-screen items-center justify-center bg-[#f5f6f9]">
      <div className="w-full max-w-sm rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white p-8 shadow-[0_14px_34px_rgba(0,0,0,0.1)]">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-[#444444] text-sm font-bold text-white">D</span>
          <span className="text-base font-bold tracking-tight text-[#1c1e1a]">DF Docket</span>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-[#7a7a7a]">
          Sign in with your firm identity to continue. DF Docket authenticates through your existing enterprise
          directory and ethical-wall configuration.
        </p>
        <button
          onClick={() => dispatch({ type: "LOGIN" })}
          className={`mt-6 flex w-full items-center justify-center gap-2 rounded-[10px] bg-[#2354e8] px-4 py-2.5 text-sm font-bold text-white transition-transform transition-colors hover:bg-[#1a45c0] active:scale-[0.97] ${FOCUS}`}
        >
          <ShieldCheck className="h-4 w-4" />
          Continue with firm SSO
        </button>
        <p className="mt-3 text-center text-xs text-[#bbbbbb]">Mocked for this demo — no credentials required.</p>
      </div>
    </div>
  );
}
