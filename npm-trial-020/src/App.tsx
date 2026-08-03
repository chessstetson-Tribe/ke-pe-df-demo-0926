import { DemoStateProvider } from "@/state/DemoStateContext";
import { ChatProvider } from "@/chat/ChatContext";
import { AppShell } from "@/components/chrome/AppShell";

/*
  Docket — K&E Debt Finance demo shell.
  Login -> Persona Select -> Dashboard -> Moments (A0/A1/A2/B1/B2/C1/E2/Closing).
  Persistent chrome (spine bar, next-actions panel) lives in AppShell; screen content
  is a plain switch in screens/ScreenRouter. See KE-Debt-Finance-Demo-Software-Build-Brief.md.
*/
export default function App() {
  return (
    <DemoStateProvider>
      <ChatProvider>
        <AppShell />
      </ChatProvider>
    </DemoStateProvider>
  );
}
