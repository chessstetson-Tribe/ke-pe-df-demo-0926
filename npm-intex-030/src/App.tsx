import { AppShell } from "@/components/chrome/AppShell";
import { SplashModal } from "@/components/SplashModal";
import { AtomicAskModal } from "@/components/AtomicAskModal";
import { SplitScreen } from "@/components/SplitScreen";
import { useExplainer } from "@/state/useExplainer";

/*
  OOB Agentic SaaS vs. Tribe — live interactive explainer.
  One atomic input (AtomicAskModal) resolves a Scenario; everything after that is
  the split screen (SplitScreen -> VanillaPane / TribePane / RerunRow). See
  live-interactive-explainer.md and tribe-vs-vanilla-agentic-framing.md for the
  intent this is scaffolding toward.
*/
export default function App() {
  const explainer = useExplainer();

  return (
    <AppShell>
      {explainer.phase === "idle" && <SplashModal onStart={explainer.openModal} />}

      {explainer.phase === "asking" && (
        <AtomicAskModal onAsk={explainer.ask} onClose={explainer.closeModal} />
      )}

      {explainer.phase === "split" && explainer.scenario && (
        <SplitScreen
          scenario={explainer.scenario}
          askedText={explainer.askedText}
          beat={explainer.beat}
          onTribeAnswered={explainer.markAnswered}
          onConfirmGap={explainer.confirmGap}
          onRerun={explainer.rerun}
          onReset={explainer.reset}
        />
      )}
    </AppShell>
  );
}
