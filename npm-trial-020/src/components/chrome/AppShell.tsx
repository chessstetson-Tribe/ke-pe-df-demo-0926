import { useDemoState } from "@/state/DemoStateContext";
import { LoginScreen } from "@/screens/LoginScreen";
import { PersonaSelectScreen } from "@/screens/PersonaSelectScreen";
import { ScreenRouter } from "@/screens/ScreenRouter";
import { ChatDock } from "@/chat/ChatDock";
import { GlobalHeader } from "./GlobalHeader";
import { SpineBar } from "./SpineBar";
import { NextActionsPanel } from "./NextActionsPanel";

// Persistent chrome mounts once, here — never re-implemented per screen. Login and
// persona-select intentionally render outside the spine bar / next-actions chrome,
// since the brief scopes that chrome to "every AUTHENTICATED screen."
export function AppShell() {
  const state = useDemoState();

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
    </div>
  );
}
