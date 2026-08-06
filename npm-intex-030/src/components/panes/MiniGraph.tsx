import { Fragment } from "react";
import { ArrowRight } from "lucide-react";
import type { GraphNode } from "@/state/types";

// A traversal, not a chunk dump: nodes light up in sequence (staggered CSS
// animation, not JS timers) to read as "the scaffold walked a path across
// documents" rather than "we searched and got lucky." Deliberately not a real
// force-directed graph — a stepper reads clearer at demo size and never needs a
// layout engine. Flat list of siblings (node, arrow, node, arrow...) rather than a
// wrapper div per node — nesting a flex-item-that-is-itself-a-flex-container here
// let text overflow its own box into the next one at this width.
export function MiniGraph({ nodes, active }: { nodes: GraphNode[]; active: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {nodes.map((node, i) => (
        <Fragment key={node.id}>
          <div
            className="shrink-0 whitespace-nowrap rounded-lg border px-2.5 py-2 transition-opacity duration-300"
            style={{
              borderColor: "var(--tribe-border)",
              background: "var(--tribe-bg)",
              opacity: active ? 1 : 0.25,
              animation: active ? `node-light-up 0.4s ease-out ${i * 0.35}s backwards` : undefined,
            }}
          >
            <div className="text-xs font-semibold" style={{ color: "var(--tribe-text)" }}>
              {node.label}
            </div>
            <div className="font-mono text-[10px] text-[#9a9a9a]">{node.doc}</div>
          </div>
          {i < nodes.length - 1 && (
            <ArrowRight className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--tribe-accent)" }} />
          )}
        </Fragment>
      ))}
    </div>
  );
}
