// A brief, deliberate beat before any action that writes a durable fact to the
// scaffold (confirming a gap, adding a term, rerunning against a set standard) —
// so "this is being written somewhere real" reads as a small cost, not an
// instant, weightless toggle.
export function Spinner({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return <span className={`inline-block flex-none animate-spin rounded-full border-2 border-current border-t-transparent ${className}`} />;
}
