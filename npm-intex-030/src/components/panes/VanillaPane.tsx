import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Chip } from "@/components/shared/Chip";

type Step = "scanning" | "lines" | "answer";

// Deliberately never shows an error state, a confidence caveat, or a citation of
// what it missed — the doc's "the failure is silent" point only lands if this side
// looks calm and finished, not broken. The Tribe pane is where the gap gets named;
// this one just answers.
export function VanillaPane({
  dealName,
  pageCount,
  chunkCount,
  scanLines,
  answer,
  isStub,
  onAnswered,
}: {
  dealName: string;
  pageCount: number;
  chunkCount: number;
  scanLines: string[];
  answer: string;
  isStub?: boolean;
  onAnswered?: () => void;
}) {
  const [step, setStep] = useState<Step>("scanning");

  useEffect(() => {
    setStep("scanning");
    const t1 = setTimeout(() => setStep("lines"), 500);
    const t2 = setTimeout(() => {
      setStep("answer");
      onAnswered?.();
    }, 1500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dealName]);

  return (
    <div className="flex h-full flex-col rounded-xl border p-5" style={{ borderColor: "var(--vanilla-border)", background: "var(--vanilla-bg)" }}>
      <div className="flex items-center justify-between">
        <div className="font-mono text-[10px] font-semibold uppercase tracking-wide" style={{ color: "var(--vanilla-accent)" }}>
          OOB Agentic SaaS
        </div>
        <Chip variant="neutral">{isStub ? "stub" : "top-k retrieval"}</Chip>
      </div>
      <div className="mt-1 text-sm font-semibold text-[#1c1e1a]">{dealName}</div>

      <div className="mt-3 flex items-center gap-1.5 text-xs" style={{ color: "var(--vanilla-text)" }}>
        <Search className="h-3.5 w-3.5" />
        {step === "scanning" ? (
          <span>Scanning {pageCount.toLocaleString()} pages…</span>
        ) : (
          <span>
            Retrieved {chunkCount} chunks — showing top {Math.min(scanLines.length, 6)}
          </span>
        )}
      </div>

      {step !== "scanning" && (
        <div className="mt-2.5 space-y-1">
          {scanLines.map((line, i) => (
            <div
              key={line}
              className="rounded-[4px] border px-2 py-1 font-mono text-[10px]"
              style={{
                borderColor: "var(--vanilla-border)",
                color: "var(--vanilla-text)",
                animation: `chunk-flood-in 0.3s ease-out ${i * 0.08}s backwards`,
              }}
            >
              {line}
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 flex-1">
        {step === "answer" && (
          <div className="rounded-lg border bg-white p-3" style={{ borderColor: "var(--vanilla-border)" }}>
            <div className="mb-1.5 flex items-center gap-1.5">
              <Chip variant="green">High confidence</Chip>
            </div>
            <p className="text-sm leading-relaxed text-[#1c1e1a]">{answer}</p>
          </div>
        )}
      </div>
    </div>
  );
}
