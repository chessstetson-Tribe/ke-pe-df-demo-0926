import { useDemoState } from "@/state/DemoStateContext";
import { DashboardScreen } from "./DashboardScreen";
import { A0OpenMatterScreen } from "./A0OpenMatterScreen";
import { A1SearchScreen } from "./A1SearchScreen";
import { A2aSearchPrecedentsScreen } from "./A2aSearchPrecedentsScreen";
import { A2ConfirmPrecedentScreen } from "./A2ConfirmPrecedentScreen";
import { B1GridScreen } from "./B1GridScreen";
import { B2UndefinedTermScreen } from "./B2UndefinedTermScreen";
import { C1DiffScreen } from "./C1DiffScreen";
import { E2CrossPracticeScreen } from "./E2CrossPracticeScreen";
import { ClosingF1Screen } from "./ClosingF1Screen";
import { ClosingF3Screen } from "./ClosingF3Screen";

// A plain switch — no route matching needed for 11 fixed, non-parameterized screens.
export function ScreenRouter() {
  const { screen } = useDemoState();
  switch (screen) {
    case "dashboard":
      return <DashboardScreen />;
    case "a0":
      return <A0OpenMatterScreen />;
    case "a1":
      return <A1SearchScreen />;
    case "a2a":
      return <A2aSearchPrecedentsScreen />;
    case "a2":
      return <A2ConfirmPrecedentScreen />;
    case "b1":
      return <B1GridScreen />;
    case "b2":
      return <B2UndefinedTermScreen />;
    case "c1":
      return <C1DiffScreen />;
    case "e2":
      return <E2CrossPracticeScreen />;
    case "closing-f1":
      return <ClosingF1Screen />;
    case "closing-f3":
      return <ClosingF3Screen />;
    default:
      return <DashboardScreen />;
  }
}
