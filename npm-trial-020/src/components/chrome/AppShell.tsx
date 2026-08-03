import { useEffect } from "react";
import { useDemoState, useNavigate } from "@/state/DemoStateContext";
import { nextMomentFrom } from "@/state/momentSequence";
import { LoginScreen } from "@/screens/LoginScreen";
import { PersonaSelectScreen } from "@/screens/PersonaSelectScreen";
import { ScreenRouter } from "@/screens/ScreenRouter";
import { ChatDock } from "@/chat/ChatDock";
import { GlobalHeader } from "./GlobalHeader";
import { SpineBar } from "./SpineBar";
import { NextActionsPanel } from "./NextActionsPanel";
import { PresenterDock } from "./PresenterDock";

const TEXT_INPUT_TAGS = new Set(["INPUT", "TEXTAREA", "SELECT"]);

// Persistent chrome mounts once, here — never re-implemented per screen. Login and
// persona-select intentionally render outside the spine bar / next-actions chrome,
// since the brief scopes that chrome to "every AUTHENTICATED screen."
export function AppShell() {
  const state = useDemoState();
  const navigate = useNavigate();

  // ArrowRight advances to the next moment — a presenter shortcut, not a product
  // feature, so it's suppressed whenever focus is in a text field (chat composer,
  // A1's search box, a grid correction field) to avoid hijacking normal typing/cursor
  // movement. Shares MOMENT_SEQUENCE with PresenterDock's click — one canonical order.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "ArrowRight") return;
      const el = document.activeElement;
      if (el && (TEXT_INPUT_TAGS.has(el.tagName) || (el as HTMLElement).isContentEditable)) return;
      navigate(nextMomentFrom(state.screen));
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [state.screen, navigate]);

  // Gate on screen id, not `authenticated` — LOGIN sets both authenticated=true and
  // screen="persona-select" in the same dispatch, so checking `authenticated` alone
  // would skip persona-select straight to chrome before a persona is ever chosen.
  if (state.screen === "login" || state.screen === "persona-select") {
    return state.screen === "login" ? <LoginScreen /> : <PersonaSelectScreen />;
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white text-[#1c1e1a]" style={{ fontFamily: "var(--font-body)" }}>
      <GlobalHeader />
      <SpineBar />
      <div className="flex min-h-0 flex-1">
        <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <ScreenRouter />
          <ChatDock />
        </main>
        <NextActionsPanel />
      </div>
      <PresenterDock />
    </div>
  );
}
