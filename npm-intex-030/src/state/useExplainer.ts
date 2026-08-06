import { useState } from "react";
import type { ExplainerPhase, Scenario, TribeBeat } from "./types";

export function useExplainer() {
  const [phase, setPhase] = useState<ExplainerPhase>("idle");
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [askedText, setAskedText] = useState("");
  const [beat, setBeat] = useState<TribeBeat>("traversing");

  function openModal() {
    setPhase("asking");
  }

  function closeModal() {
    setPhase(scenario ? "split" : "idle");
  }

  function ask(resolved: Scenario, rawText: string) {
    setScenario(resolved);
    setAskedText(rawText);
    setBeat("traversing");
    setPhase("split");
  }

  function markAnswered() {
    setBeat((b) => (b === "traversing" ? "answered" : b));
  }

  function confirmGap() {
    setBeat("corrected");
  }

  function rerun() {
    setBeat("reran");
  }

  function reset() {
    setPhase("idle");
    setScenario(null);
    setAskedText("");
    setBeat("traversing");
  }

  function askAgain() {
    setPhase("asking");
  }

  return {
    phase,
    scenario,
    askedText,
    beat,
    openModal,
    closeModal,
    ask,
    markAnswered,
    confirmGap,
    rerun,
    reset,
    askAgain,
  };
}
