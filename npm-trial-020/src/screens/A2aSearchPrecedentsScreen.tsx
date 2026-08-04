import { useEffect, useState } from "react";
import { ArrowRight, ChevronDown, ChevronUp, Search, X } from "lucide-react";
import { useDemoDispatch, useDemoState, useNavigate } from "@/state/DemoStateContext";
import { PRECEDENT_CORPUS, SPONSOR_TIER_LABEL, type SponsorTier } from "@/data/precedentCorpus";
import { searchPrecedentsByFacets, searchPrecedentsByQuery, type PrecedentSearchFilters } from "@/detectors/searchPrecedents";
import type { PrecedentCandidate } from "@/state/types";
import { FOCUS } from "@/components/shared/focus";
import { FeedbackButtons } from "@/components/shared/FeedbackButtons";
import { FeedbackReasonPicker } from "@/components/shared/FeedbackReasonPicker";

const SIZE_BUCKETS: { label: string; sizeMin?: number; sizeMax?: number }[] = [
  { label: "Any size" },
  { label: "Under $300M", sizeMax: 300_000_000 },
  { label: "$300M – $1B", sizeMin: 300_000_000, sizeMax: 1_000_000_000 },
  { label: "Over $1B", sizeMin: 1_000_000_000 },
];

const SPONSOR_TIERS: SponsorTier[] = ["large-cap-pe", "middle-market-pe", "public-no-sponsor", "founder-family"];
const INDUSTRIES = Array.from(new Set(PRECEDENT_CORPUS.map((d) => d.industry))).sort();
const LENDERS = Array.from(new Set(PRECEDENT_CORPUS.flatMap((d) => d.lenderNames))).sort();

function CandidateCard({ candidate, onInvestigate }: { candidate: PrecedentCandidate; onInvestigate: (id: string) => void }) {
  const dispatch = useDemoDispatch();
  const state = useDemoState();
  const [expanded, setExpanded] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [rejectedReasons, setRejectedReasons] = useState<Set<string>>(new Set());

  return (
    <div className="rounded-xl border border-[rgba(0,0,0,0.08)] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-[#1c1e1a]">{candidate.dealName}</div>
          <div className="text-xs text-[#7a7a7a]">{candidate.summary}</div>
        </div>
        <div className="flex flex-none items-center gap-1.5">
          {candidate.matchScore > 0 && (
            <span className="rounded-[4px] bg-[#ecf4ff] px-2 py-0.5 text-xs font-bold text-[#2354e8]">
              {candidate.matchScore}% match
            </span>
          )}
          <div className="relative">
            <FeedbackButtons
              onUp={() =>
                dispatch({
                  type: "RECORD_FEEDBACK",
                  record: { id: `candidate-${candidate.precedentDealId}-up-${state.feedback.length}`, targetType: "precedent-candidate", targetId: candidate.precedentDealId, sentiment: "up" },
                })
              }
              onDown={() => setPickerOpen(true)}
            />
            <FeedbackReasonPicker
              open={pickerOpen}
              onClose={() => setPickerOpen(false)}
              onSubmit={(reason) => {
                dispatch({
                  type: "RECORD_FEEDBACK",
                  record: { id: `candidate-${candidate.precedentDealId}-down-${state.feedback.length}`, targetType: "precedent-candidate", targetId: candidate.precedentDealId, sentiment: "down", note: reason },
                });
                setPickerOpen(false);
              }}
            />
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={() => setExpanded((v) => !v)}
          className={`flex items-center gap-1 rounded-[6px] border-2 border-[#d9d9d9] px-2.5 py-1 text-xs font-bold text-[#7a7a7a] hover:border-[#bbbbbb] hover:text-[#1c1e1a] ${FOCUS}`}
        >
          Why this match
          {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>
        <button
          onClick={() => onInvestigate(candidate.precedentDealId)}
          className={`flex items-center gap-1 rounded-[6px] bg-[#2354e8] px-2.5 py-1 text-xs font-bold text-white hover:bg-[#1a45c0] ${FOCUS}`}
        >
          Investigate
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>
      {expanded && (
        <ul className="mt-3 space-y-1 text-xs leading-relaxed text-[#7a7a7a]">
          {candidate.matchedOn.map((reason) => {
            const rejected = rejectedReasons.has(reason);
            return (
              <li key={reason} className="flex items-center gap-1.5">
                <span className={rejected ? "text-[#bbbbbb] line-through" : ""}>• {reason}</span>
                {rejected ? (
                  <span className="text-[10px] font-medium text-[#9a9a9a]">noted — de-emphasizing this</span>
                ) : (
                  <button
                    type="button"
                    title="Not relevant"
                    onClick={() => {
                      setRejectedReasons((prev) => new Set(prev).add(reason));
                      dispatch({
                        type: "RECORD_FEEDBACK",
                        record: { id: `match-reason-${candidate.precedentDealId}-${reason}-${state.feedback.length}`, targetType: "match-reason", targetId: `${candidate.precedentDealId}::${reason}`, sentiment: "down", note: reason },
                      });
                    }}
                    className="rounded-[4px] p-0.5 text-[#d9d9d9] hover:bg-[#f5f6f9] hover:text-[#c0392b]"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// Moment A2a — the fuller version of A2's own "manual refinement" idea. Per Product:
// Debt Finance's Stage 2 story: "As an attorney, I can find prior deals by sponsor,
// deal size, industry, and lender." Facet dropdowns and the natural-language box both
// call the SAME scorer (detectors/searchPrecedents.ts) — one capability, two entry
// points, not two features — and "Investigate" hands off into the existing A2 -> B1
// pipeline unchanged.
export function A2aSearchPrecedentsScreen() {
  const dispatch = useDemoDispatch();
  const navigate = useNavigate();

  const [filters, setFilters] = useState<PrecedentSearchFilters>({});
  const [facetResults, setFacetResults] = useState<PrecedentCandidate[]>([]);
  const [nlQuery, setNlQuery] = useState("");
  const [nlResults, setNlResults] = useState<PrecedentCandidate[] | null>(null);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    let cancelled = false;
    searchPrecedentsByFacets(filters).then((r) => {
      if (!cancelled) setFacetResults(r);
    });
    return () => {
      cancelled = true;
    };
  }, [filters]);

  async function runNlSearch() {
    if (!nlQuery.trim() || searching) return;
    setSearching(true);
    const r = await searchPrecedentsByQuery(nlQuery);
    setNlResults(r);
    setSearching(false);
  }

  function clearNl() {
    setNlQuery("");
    setNlResults(null);
  }

  function investigate(precedentDealId: string) {
    dispatch({ type: "SELECT_PRECEDENT", precedentId: precedentDealId });
    navigate("a2");
  }

  const results = nlResults !== null ? nlResults : facetResults;
  const usingNl = nlResults !== null;

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto max-w-3xl px-6 py-8">
        <div className="font-mono text-[10px] font-semibold uppercase tracking-wide text-[#9a9a9a]">
          Moment A2a — Flexible precedent search
        </div>
        <h1 className="mt-1 text-xl font-semibold tracking-tight text-[#1c1e1a]">Search the precedent bank</h1>
        <p className="mt-2 text-sm leading-relaxed text-[#7a7a7a]">
          Find prior deals by sponsor profile, facility size, industry, and lender — or just describe what you're
          looking for. A search that used to take hours takes seconds either way.
        </p>

        <div className="mt-4 flex items-center gap-2">
          <input
            value={nlQuery}
            onChange={(e) => setNlQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") runNlSearch();
            }}
            placeholder="e.g. “large-cap sponsor deal with KKR as a lender” or “small childcare facility”"
            className={`flex-1 rounded-[6px] border border-[rgba(0,0,0,0.08)] bg-white px-3 py-2 text-sm text-[#1c1e1a] placeholder:text-[#bbbbbb] ${FOCUS}`}
          />
          <button
            onClick={runNlSearch}
            disabled={searching || !nlQuery.trim()}
            className={`flex items-center gap-1.5 rounded-[10px] bg-[#2354e8] px-3.5 py-2 text-sm font-bold text-white transition-transform transition-colors hover:bg-[#1a45c0] active:scale-[0.97] ${FOCUS}`}
            style={{ opacity: searching || !nlQuery.trim() ? 0.5 : 1 }}
          >
            <Search className="h-3.5 w-3.5" />
            {searching ? "Searching…" : "Search"}
          </button>
        </div>
        {usingNl && (
          <button onClick={clearNl} className="mt-2 text-xs font-medium text-[#2354e8] hover:underline">
            Clear — back to facet filters
          </button>
        )}

        <div className={`mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4 ${usingNl ? "pointer-events-none opacity-40" : ""}`}>
          <select
            value={filters.sponsorTier ?? ""}
            onChange={(e) => setFilters((f) => ({ ...f, sponsorTier: (e.target.value || undefined) as SponsorTier | undefined }))}
            className="rounded-[6px] border border-[rgba(0,0,0,0.08)] bg-white px-2 py-1.5 text-xs text-[#1c1e1a]"
          >
            <option value="">Any sponsor profile</option>
            {SPONSOR_TIERS.map((t) => (
              <option key={t} value={t}>{SPONSOR_TIER_LABEL[t]}</option>
            ))}
          </select>
          <select
            value={filters.industry ?? ""}
            onChange={(e) => setFilters((f) => ({ ...f, industry: e.target.value || undefined }))}
            className="rounded-[6px] border border-[rgba(0,0,0,0.08)] bg-white px-2 py-1.5 text-xs text-[#1c1e1a]"
          >
            <option value="">Any industry</option>
            {INDUSTRIES.map((i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
          <select
            value={filters.lender ?? ""}
            onChange={(e) => setFilters((f) => ({ ...f, lender: e.target.value || undefined }))}
            className="rounded-[6px] border border-[rgba(0,0,0,0.08)] bg-white px-2 py-1.5 text-xs text-[#1c1e1a]"
          >
            <option value="">Any lender</option>
            {LENDERS.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
          <select
            onChange={(e) => {
              const bucket = SIZE_BUCKETS[Number(e.target.value)];
              setFilters((f) => ({ ...f, sizeMin: bucket.sizeMin, sizeMax: bucket.sizeMax }));
            }}
            className="rounded-[6px] border border-[rgba(0,0,0,0.08)] bg-white px-2 py-1.5 text-xs text-[#1c1e1a]"
          >
            {SIZE_BUCKETS.map((b, i) => (
              <option key={b.label} value={i}>{b.label}</option>
            ))}
          </select>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-baseline justify-between">
            <h2 className="text-sm font-bold text-[#1c1e1a]">Results</h2>
            <span className="text-xs font-medium text-[#9a9a9a]">{results.length} deal{results.length === 1 ? "" : "s"}</span>
          </div>
          <div className="space-y-2">
            {results.length === 0 ? (
              <p className="text-sm text-[#9a9a9a]">No precedents match that description yet — try broadening it.</p>
            ) : (
              results.map((c) => <CandidateCard key={c.precedentDealId} candidate={c} onInvestigate={investigate} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
