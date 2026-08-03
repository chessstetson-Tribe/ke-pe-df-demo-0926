import { useState } from "react";
import { Check, FileText, Search, Zap } from "lucide-react";
import { searchDocuments, type DocumentSearchResult } from "@/detectors/searchDocuments";
import { FOCUS } from "@/components/shared/focus";

// The fallback path — used when nothing auto-matched (A0 is the primary interaction
// mode). The point of this moment is the pre-open confirmation: deal team and date
// are shown BEFORE the user opens the file, so they can confirm relevance without
// opening it. Restaging the literal K&E anecdote: "findable in 10 seconds" vs. the
// 2-3 hours it actually took.
export function A1SearchScreen() {
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<DocumentSearchResult[] | null>(null);
  const [confirmedId, setConfirmedId] = useState<string | null>(null);
  const [elapsedMs, setElapsedMs] = useState<number | null>(null);

  async function runSearch() {
    if (!query.trim() || searching) return;
    setSearching(true);
    setResults(null);
    setConfirmedId(null);
    const start = performance.now();
    const found = await searchDocuments(query);
    setElapsedMs(performance.now() - start);
    setResults(found);
    setSearching(false);
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto max-w-2xl px-6 py-8">
        <div className="font-mono text-[10px] font-semibold uppercase tracking-wide text-[#9a9a9a]">
          Moment A1 — Search (fallback path)
        </div>
        <h1 className="mt-1 text-xl font-semibold tracking-tight text-[#1c1e1a]">Describe the document you need</h1>
        <p className="mt-2 text-sm leading-relaxed text-[#7a7a7a]">
          Not a filename search — describe the deal by characteristics. This is what a request used to cost 2–3
          hours by hand; the point of this moment is the speed contrast.
        </p>

        <div className="mt-4 flex items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") runSearch();
            }}
            placeholder="engagement letter, Kirkland lead-negotiated with Goldman as arranger, syndicated deal"
            className={`flex-1 rounded-[6px] border border-[rgba(0,0,0,0.08)] bg-white px-3 py-2 text-sm text-[#1c1e1a] placeholder:text-[#bbbbbb] ${FOCUS}`}
          />
          <button
            onClick={runSearch}
            disabled={searching || !query.trim()}
            className={`flex items-center gap-1.5 rounded-[10px] bg-[#2354e8] px-3.5 py-2 text-sm font-bold text-white transition-transform transition-colors hover:bg-[#1a45c0] active:scale-[0.97] ${FOCUS}`}
            style={{ opacity: searching || !query.trim() ? 0.5 : 1 }}
          >
            <Search className="h-3.5 w-3.5" />
            {searching ? "Searching…" : "Search"}
          </button>
        </div>

        {results && (
          <div className="mt-6">
            {elapsedMs !== null && (
              <div className="mb-3 flex items-center gap-1.5 text-xs font-medium text-[#16a34a]">
                <Zap className="h-3.5 w-3.5" />
                Found in {(elapsedMs / 1000).toFixed(2)}s — a request like this used to take 2–3 hours by hand.
              </div>
            )}
            {results.length === 0 ? (
              <p className="text-sm text-[#9a9a9a]">No document matched that description.</p>
            ) : (
              <div className="space-y-2">
                {results.map((r) => (
                  <div key={r.doc.id} className="rounded-xl border border-[rgba(0,0,0,0.08)] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                    <div className="flex items-start gap-2.5">
                      <FileText className="mt-0.5 h-4 w-4 flex-none text-[#2354e8]" />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold text-[#1c1e1a]">{r.doc.title}</div>
                        <div className="mt-1 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-[#7a7a7a]">
                          <div><span className="text-[#9a9a9a]">Deal team </span>{r.doc.dealTeam}</div>
                          <div><span className="text-[#9a9a9a]">Date </span>{r.doc.date}</div>
                        </div>
                        <p className="mt-1 text-xs text-[#bbbbbb]">Matched on: {r.matchedOn.join(", ")}</p>
                      </div>
                    </div>
                    <div className="mt-3 pl-[26px]">
                      {confirmedId === r.doc.id ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-[#16a34a]">
                          <Check className="h-3.5 w-3.5" /> Confirmed relevant — without opening the file
                        </span>
                      ) : (
                        <button
                          onClick={() => setConfirmedId(r.doc.id)}
                          className="rounded-[6px] border-2 border-[#d9d9d9] px-2.5 py-1 text-xs font-bold text-[#7a7a7a] hover:border-[#bbbbbb] hover:text-[#1c1e1a]"
                        >
                          This is the right document
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
