import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight, ArrowRight, Sparkles,
  Check, AlertTriangle, Clock, Circle, History, MessageSquare, Bot, Users,
  Upload, Plug, Shield, Coins, Settings, KeyRound, Webhook, Plus, Send, Link2,
} from "lucide-react";

/*
  Docket — multi-deal legal deal-flow shell with import + live chat.
  • Deal selector (header): Meridian (populated) and Atlas (new, blank).
  • Blank deal → paste a data-room UUID / MCP endpoint → progress bar → the whole workspace populates.
  • Advance loop, token/cost readout, draggable split, activity feed, and a working chat (per-deal model).
  Style: shadcn-canonical zinc + a single violet accent.
*/

const RAIL = 52;
const BARH = 64;
const FOCUS = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950";

const STATUS = {
  complete:    { Icon: Check,         color: "text-emerald-400" },
  conflicting: { Icon: AlertTriangle, color: "text-amber-400",  badge: "Conflict",  badgeCls: "border-amber-900 bg-amber-950 text-amber-300" },
  missing:     { Icon: Circle,        color: "text-rose-400",   badge: "Missing",   badgeCls: "border-rose-900 bg-rose-950 text-rose-300" },
  awaiting:    { Icon: Clock,         color: "text-sky-400",    badge: "Awaiting",  badgeCls: "border-sky-900 bg-sky-950 text-sky-300" },
  partial:     { Icon: Clock,         color: "text-amber-400",  badge: "Partial",   badgeCls: "border-amber-900 bg-amber-950 text-amber-300" },
  derived:     { dot: true,           color: "text-zinc-500",   badge: "Derived",   badgeCls: "border-zinc-700 bg-zinc-800 text-zinc-300" },
};
const TONE = { amber: "bg-amber-400", emerald: "bg-emerald-400", zinc: "bg-zinc-600" };
const OPTS = [
  ["prioritize", "Prioritize critical documents"],
  ["summarize", "Summarize non-critical documents"],
  ["compress", "Compress context aggressively"],
  ["reuse", "Reuse prior analysis"],
  ["ocr", "Full OCR on scanned documents"],
];
const FULL_TOKENS = 112;
function computeTokens(o) { let t = FULL_TOKENS; if (o.prioritize) t *= 0.72; if (o.summarize) t *= 0.66; if (o.compress) t *= 0.8; if (o.reuse) t *= 0.85; if (o.ocr) t *= 1.22; return t; }

/* ─────────────── deals ─────────────── */
const SYS_MERIDIAN = `You are deal counsel for a direct lender's legal team, working the $75,000,000 senior secured term loan to Meridian Industrial Corp. beside the deal attorney. Answer ONLY from the file; never invent facts; cite sources inline as [S1]-[S8] or [P]. Be concise (2-5 sentences), lead with the bottom line, end with a clear next step.
FILE: [S1] Term Sheet: $75M senior secured term loan, 5-yr, SOFR+450, leverage covenant 4.0x net debt/EBITDA, executed. [S2] Commitment Letter: executed, expires in 30 days. [S3] Credit Agreement (draft v3): financial covenant in §7.2 defines net debt/EBITDA using a trailing-8-quarter average, conflicting with the term sheet's trailing-4-quarter test. [S4] Security Agreement: executed by borrower; first-lien blanket security interest in all assets. [S5] UCC-1 Financing Statements: filed in Delaware and New York; California and Ohio filings not yet made. [S6] Subsidiary Guaranty: not yet circulated to guarantor's counsel. [S7] Legal Opinion (borrower's counsel): requested, outstanding. [S8] Officer's Certificate: not yet prepared.
COMPUTED: conditions precedent open 4 of 11; redlines outstanding 2 (Credit Agreement, Subsidiary Guaranty); signature pages executed 6 of 9; target closing in 12 days.
POLICY [P]: all conditions precedent must be satisfied before funding; UCC-1 filings must be perfected in every applicable jurisdiction prior to closing; a legal opinion is required from borrower's counsel and each guarantor's counsel; the covenant definition in the Credit Agreement must match the term sheet before circulating for signature.`;

const SYS_ATLAS = `You are deal counsel for a direct lender's legal team, working a proposed $150,000,000 asset-based revolving credit facility to Atlas Distribution Holdings, secured by inventory and receivables. Answer ONLY from the file; cite sources inline as [S1]-[S9] or [P]; be concise (2-5 sentences), lead with the bottom line, end with a next step. These figures are an APPROXIMATE term-sheet baseline — if asked for exact current numbers, say they should be confirmed against the latest draft.
FILE: [S1] Term Sheet: $150M ABL revolver, 4-yr, borrowing base of eligible inventory and receivables, springing financial covenant (fixed-charge coverage 1.0x) below 90% availability. [S2] Commitment Letter: not yet circulated. [S3] Credit Agreement: not yet drafted. [S4] Security Agreement: not yet drafted. [S5] Intercreditor Agreement: needed — borrower has an existing equipment term loan with a separate lender. [S6] Guaranty (parent and subsidiaries): not yet drafted. [S7] Legal Opinions: not yet requested. [S8] UCC Financing Statements: not yet ordered. [S9] Field Exam / Appraisal (borrowing base assets): not yet ordered.
COMPUTED: deal stage — Term Sheet; conditions precedent open 9 of 9; documents drafted 0 of 7.
POLICY [P] (covenants): springing fixed-charge coverage 1.0x below 90% availability; required file: term sheet, commitment letter, credit agreement, security agreement, intercreditor agreement, guaranty, legal opinions, UCC filings, field exam/appraisal.
GAPS: everything past the term sheet is outstanding; intercreditor terms with the existing equipment lender are unresolved.`;

const DEALS = {
  meridian: {
    id: "meridian", name: "Meridian Term Loan", sub: "$75M senior secured term loan · Industrial",
    priceLine: "$75M term loan", startImported: true, system: SYS_MERIDIAN,
    source: { mono: "SP", path: "Deal Rooms › Meridian", uri: "sharepoint://keystone-legal/meridian" },
    metrics: { r: 77, c: 0.72 },
    vitals: [
      { label: "CPs satisfied", value: "7 of 11", note: "0 to close", tone: "amber" },
      { label: "Redlines outstanding", value: "2", note: "Credit Agmt, Guaranty", tone: "amber" },
      { label: "Signature pages", value: "6 of 9", note: "executed", tone: "emerald" },
      { label: "Target closing", value: "12 days", note: "Aug 14", tone: "zinc" },
    ],
    coverage: [
      { name: "Term Sheet", status: "complete", src: "S1" },
      { name: "Commitment Letter", status: "complete", src: "S2" },
      { id: "creditagreement", name: "Credit Agreement (draft v3)", status: "conflicting", note: "§7.2's covenant definition uses a trailing-8-quarter average, conflicting with the term sheet's trailing-4-quarter test." },
      { name: "Security Agreement", status: "complete", src: "S4" },
      { id: "ucc", name: "UCC-1 Financing Statements", status: "partial", note: "Filed in Delaware and New York; California and Ohio filings remain." },
      { id: "guaranty", name: "Subsidiary Guaranty", status: "missing", note: "Not yet circulated to guarantor's counsel; required before signature pages go out." },
      { id: "opinion", name: "Legal Opinion (borrower's counsel)", status: "awaiting", note: "Requested; outside counsel targeting Thursday." },
      { id: "cert", name: "Officer's Certificate", status: "missing", note: "Required at closing; not yet prepared." },
    ],
    steps: [
      { gapId: "guaranty", action: "Circulate the subsidiary guaranty to guarantor's counsel for review", resolveLabel: "Mark sent", r1: 84, c1: 0.79, logged: "Subsidiary guaranty sent to guarantor's counsel", verb: "Sent" },
      { gapId: "opinion", action: "Follow up with borrower's counsel on the outstanding legal opinion", resolveLabel: "Mark received", r1: 90, c1: 0.86, logged: "Legal opinion received from borrower's counsel", verb: "Received" },
      { gapId: "creditagreement", action: "Reconcile the covenant definition conflict between the term sheet and the credit agreement draft", resolveLabel: "Mark reconciled", r1: 96, c1: 0.92, logged: "Covenant definition reconciled across the term sheet and credit agreement", verb: "Reconciled" },
    ],
    activity: [
      { Icon: AlertTriangle, who: "Agent", color: "text-amber-400", text: "Flagged a covenant-definition conflict between the term sheet and the credit agreement draft.", t: "2m" },
      { Icon: MessageSquare, who: "You", color: "text-violet-400", text: "Asked how many conditions precedent are still open.", t: "4m" },
      { Icon: Bot, who: "Agent", color: "text-zinc-400", text: "Answered: 4 of 11 CPs remain open, target closing in 12 days.", t: "4m" },
      { Icon: Upload, who: "SharePoint", color: "text-sky-400", text: "Credit Agreement redline v3 added to the deal room.", t: "1h" },
      { Icon: Users, who: "Teams", color: "text-violet-400", text: "@sarah (outside counsel) asked to expedite the legal opinion.", t: "2h" },
      { Icon: Plug, who: "SharePoint", color: "text-sky-400", text: "Synced 9 documents from Deal Rooms › Meridian.", t: "3h" },
    ],
    chatSeed: [{ role: "assistant", confidence: "Medium", text: "4 of 11 conditions precedent are still open, and target closing is 12 days out. The main blocker is a covenant-definition conflict [S3]: the credit agreement draft uses a trailing-8-quarter average where the term sheet [S1] specifies trailing-4-quarter. Redlines are outstanding on the Credit Agreement and Subsidiary Guaranty; UCC-1 filings are perfected in Delaware and New York but still owed in California and Ohio [S5]. Next step: reconcile the covenant language before this goes out for signature." }],
    expect: [],
  },
  atlas: {
    id: "atlas", name: "Atlas ABL Revolver", sub: "Asset-based revolver · $150M facility",
    priceLine: "$150M facility", startImported: false, system: SYS_ATLAS,
    source: { mono: "SP", path: "(not connected)", uri: "" },
    metrics: { r: 12, c: 0.28 },
    vitals: [
      { label: "Deal stage", value: "Term Sheet", note: "of 5 stages", tone: "zinc" },
      { label: "CPs satisfied", value: "0 of 9", note: "0 to close", tone: "amber" },
      { label: "Docs drafted", value: "0 of 7", note: "not yet started", tone: "amber" },
      { label: "Intercreditor", value: "Unresolved", note: "existing equipment lender", tone: "amber" },
    ],
    coverage: [
      { name: "Term Sheet", status: "complete", src: "S1" },
      { id: "commitment", name: "Commitment Letter", status: "missing", note: "Not yet circulated to the borrower." },
      { id: "creditagreement", name: "Credit Agreement", status: "missing", note: "Drafting has not started; awaiting commitment letter execution." },
      { id: "security", name: "Security Agreement", status: "missing", note: "Not yet drafted." },
      { id: "intercreditor", name: "Intercreditor Agreement", status: "missing", note: "Needed — borrower has an existing equipment term loan with a separate lender." },
      { id: "guaranty", name: "Guaranty (parent & subsidiaries)", status: "missing", note: "Not yet drafted." },
      { id: "opinion", name: "Legal Opinions", status: "missing", note: "Not yet requested from borrower's or guarantors' counsel." },
      { id: "ucc", name: "UCC Financing Statements", status: "missing", note: "Not yet ordered." },
      { id: "fieldexam", name: "Field Exam / Appraisal", status: "missing", note: "Needed to size the borrowing base; not yet ordered." },
    ],
    steps: [
      { gapId: "commitment", action: "Circulate the commitment letter to the borrower for execution", resolveLabel: "Mark sent", r1: 24, c1: 0.38, logged: "Commitment letter sent to the borrower", verb: "Sent" },
      { gapId: "intercreditor", action: "Open intercreditor negotiations with the existing equipment lender", resolveLabel: "Mark opened", r1: 34, c1: 0.46, logged: "Intercreditor negotiations opened with the equipment lender", verb: "Opened" },
      { gapId: "fieldexam", action: "Order the field exam and appraisal to size the borrowing base", resolveLabel: "Mark ordered", r1: 42, c1: 0.52, logged: "Field exam and appraisal ordered", verb: "Ordered" },
    ],
    activity: [
      { Icon: Check, who: "Agent", color: "text-emerald-400", text: "Indexed the executed term sheet and extracted the covenant structure.", t: "now" },
      { Icon: AlertTriangle, who: "Agent", color: "text-amber-400", text: "Flagged that an intercreditor agreement is required — borrower has an existing equipment lender.", t: "now" },
      { Icon: Bot, who: "Agent", color: "text-zinc-400", text: "Extracted the springing covenant and borrowing-base structure from the term sheet.", t: "1m" },
      { Icon: Upload, who: "SharePoint", color: "text-sky-400", text: "Indexed 1 document from the connected deal room.", t: "1m" },
      { Icon: Plug, who: "SharePoint", color: "text-sky-400", text: "Connected source · sharepoint://atlas-legal/abl-2025.", t: "2m" },
    ],
    chatSeed: [],
    expect: ["Term Sheet", "Commitment Letter", "Credit Agreement", "Security Agreement", "Intercreditor Agreement", "Guaranty", "Legal Opinions", "UCC Financing Statements", "Field Exam / Appraisal"],
  },
};

/* ─────────────── atoms ─────────────── */
function Cite({ id }) {
  return <button className="mx-0.5 inline-flex items-baseline rounded border border-violet-900 bg-violet-950 px-1 align-baseline text-xs font-medium text-violet-300 transition-colors hover:bg-violet-900">{id}</button>;
}
const renderCites = (t) => t.split(/(\[(?:S\d+|P)\])/g).map((p, i) => { const m = p.match(/^\[(S\d+|P)\]$/); return m ? <Cite key={i} id={m[1]} /> : <span key={i}>{p}</span>; });
const confFromText = (t) => { const n = new Set(t.match(/\[S\d+\]/g) || []).size; return n >= 3 ? "High" : n >= 1 ? "Medium" : "Low"; };
const confColor = (c) => (c === "High" ? "border-emerald-900 bg-emerald-950 text-emerald-300" : c === "Low" ? "border-rose-900 bg-rose-950 text-rose-300" : "border-amber-900 bg-amber-950 text-amber-300");

function Metric({ label, value, suffix, sub, pct }) {
  return (
    <div className="w-40 flex-none">
      <div className="flex items-baseline gap-2">
        <span className="text-xs font-medium text-zinc-400">{label}</span>
        <span className="text-lg font-semibold tabular-nums tracking-tight text-zinc-50">{value}<span className="text-sm font-normal text-zinc-500">{suffix}</span></span>
        {sub && <span className="text-xs text-zinc-500">{sub}</span>}
      </div>
      <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-zinc-800"><div className="h-full rounded-full bg-violet-500" style={{ width: pct + "%" }} /></div>
    </div>
  );
}
function Delta({ label, from, to }) {
  return (<div><div className="text-xs text-zinc-500">{label}</div><div className="mt-1 flex items-center gap-1.5 text-sm tabular-nums"><span className="text-zinc-400">{from}</span><ArrowRight className="h-3 w-3 text-zinc-600" /><span className="font-semibold text-violet-300">{to}</span></div></div>);
}
function Row({ row }) {
  const s = STATUS[row.status];
  const right = row.done ? <span className="text-xs text-zinc-500">{row.doneVerb || "Resolved"}</span>
    : row.src ? <span className="font-mono text-xs text-zinc-500">{row.src}</span>
    : s.badge ? <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${s.badgeCls}`}>{s.badge}</span> : null;
  return (
    <div className="rounded-lg px-3 py-2.5 transition-colors hover:bg-zinc-900">
      <div className="flex items-center gap-2.5">
        {s.dot ? <span className="h-2 w-2 flex-none rounded-full bg-zinc-500" /> : <s.Icon className={`h-4 w-4 flex-none ${s.color}`} strokeWidth={2} />}
        <span className="flex-1 truncate text-sm text-zinc-200">{row.name}</span>
        {right}
      </div>
      {row.note && <p className="mt-1 text-xs leading-relaxed text-zinc-500" style={{ paddingLeft: 26 }}>{row.note}</p>}
    </div>
  );
}
function Group({ label, children }) {
  return (<div className="border-b border-zinc-900 px-4 py-4"><div className="mb-2.5 text-xs font-medium tracking-wide text-zinc-500">{label}</div>{children}</div>);
}

/* ─────────────── app (deal registry + selector) ─────────────── */
export default function App() {
  const [dealId, setDealId] = useState("meridian");
  const [selOpen, setSelOpen] = useState(false);
  const deal = DEALS[dealId];
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-zinc-950 text-zinc-100" style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');`}</style>

      <header className="z-30 flex flex-none items-center justify-between border-b border-zinc-900 bg-zinc-950 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="grid h-6 w-6 place-items-center rounded-md bg-violet-600 text-xs font-bold text-white">D</span>
          <span className="text-sm font-semibold tracking-tight text-zinc-50">Docket</span>
          <ChevronRight className="h-3.5 w-3.5 text-zinc-700" />
          <div className="relative">
            <button onClick={() => setSelOpen((v) => !v)} className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-sm text-zinc-200 transition-colors hover:bg-zinc-900 ${FOCUS}`}>
              {deal.name}{!deal.startImported && <span className="rounded border border-violet-900 bg-violet-950 px-1 text-xs font-medium text-violet-300">new</span>}
              <ChevronDown className="h-3.5 w-3.5 text-zinc-500" />
            </button>
            {selOpen && (<>
              <div className="fixed inset-0 z-30" onClick={() => setSelOpen(false)} />
              <div className="absolute left-0 top-9 z-40 w-64 rounded-lg border border-zinc-800 bg-zinc-900 p-1 shadow-xl">
                {Object.values(DEALS).map((d) => (
                  <button key={d.id} onClick={() => { setDealId(d.id); setSelOpen(false); }} className={`flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left transition-colors hover:bg-zinc-800 ${FOCUS}`}>
                    <span className={`h-1.5 w-1.5 flex-none rounded-full ${d.startImported ? "bg-emerald-400" : "bg-zinc-600"}`} />
                    <span className="min-w-0 flex-1"><span className="block truncate text-sm text-zinc-100">{d.name}</span><span className="block truncate text-xs text-zinc-500">{d.sub}</span></span>
                    {dealId === d.id && <Check className="h-4 w-4 flex-none text-violet-400" />}
                  </button>
                ))}
                <div className="mt-1 border-t border-zinc-800 px-2.5 pt-2 pb-1 text-xs text-zinc-600">Select a deal to switch workspaces</div>
              </div>
            </>)}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm tabular-nums text-zinc-500 md:inline">{deal.priceLine}</span>
          <span className="grid h-7 w-7 place-items-center rounded-full bg-zinc-800 text-xs font-medium text-zinc-300">JA</span>
        </div>
      </header>

      <Workspace key={dealId} deal={deal} />
    </div>
  );
}

/* ─────────────── workspace (per-deal, fully resets on switch) ─────────────── */
function Workspace({ deal }) {
  const reduce = useMemo(() => typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);
  const [accuracy, setAccuracy] = useState(62);
  const [opts, setOpts] = useState({ prioritize: true, summarize: true, compress: true, reuse: true, ocr: false });

  // import
  const [imported, setImported] = useState(deal.startImported);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uri, setUri] = useState("");

  // advance loop + metrics
  const [step, setStep] = useState(0);
  const [metrics, setMetrics] = useState(deal.startImported ? deal.metrics : { r: 0, c: 0 });
  const [activity, setActivity] = useState(deal.startImported ? deal.activity : []);
  const dispRef = useRef({ r: 0, c: 0 });
  const [disp, setDisp] = useState({ r: 0, c: 0 });
  const resolvedIds = STEPS_DONE(deal, step);
  const currentStep = deal.steps[step] || null;

  // chat
  const [messages, setMessages] = useState(deal.chatSeed);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  // split
  const centerRef = useRef(null);
  const dragRef = useRef({ startY: 0, startPx: 0 });
  const [centerH, setCenterH] = useState(0);
  const [dealPx, setDealPx] = useState(BARH);
  const [lastExpanded, setLastExpanded] = useState(0);
  const [dragging, setDragging] = useState(false);
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const CHATMIN = 64;
  const dealOpen = dealPx > BARH + 12;

  // ease readiness/confidence toward target (resolve loop + final import set)
  useEffect(() => {
    if (reduce) { dispRef.current = metrics; setDisp(metrics); return; }
    let raf; const start = performance.now(); const from = dispRef.current; const to = metrics;
    const tick = (t) => { const k = Math.min(1, (t - start) / 750); const e = 1 - Math.pow(1 - k, 3); const v = { r: from.r + (to.r - from.r) * e, c: from.c + (to.c - from.c) * e }; dispRef.current = v; setDisp(v); if (k < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf);
  }, [metrics.r, metrics.c]); // eslint-disable-line

  useEffect(() => { const el = centerRef.current; if (!el || typeof ResizeObserver === "undefined") return; const ro = new ResizeObserver(() => setCenterH(el.clientHeight)); ro.observe(el); setCenterH(el.clientHeight); return () => ro.disconnect(); }, [imported]);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages, sending]);
  useEffect(() => {
    if (!dragging) return;
    const move = (e) => { const h = (centerRef.current && centerRef.current.clientHeight) || centerH; setDealPx(clamp(dragRef.current.startPx + (e.clientY - dragRef.current.startY), BARH, Math.max(BARH, h - CHATMIN))); };
    const up = () => setDragging(false);
    window.addEventListener("pointermove", move); window.addEventListener("pointerup", up);
    return () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
  }, [dragging, centerH]);

  function startDrag(e) { e.preventDefault(); dragRef.current = { startY: e.clientY, startPx: dealPx }; setDragging(true); }
  function toggleDeal() {
    if (dealOpen) { setLastExpanded(dealPx); setDealPx(BARH); }
    else { const h = (centerRef.current && centerRef.current.clientHeight) || centerH || 480; const target = lastExpanded > BARH + 40 ? lastExpanded : Math.round(h * 0.6); setDealPx(clamp(target, BARH, Math.max(BARH, h - CHATMIN))); }
  }
  function resolveStep() {
    const cur = deal.steps[step]; if (!cur) return;
    setMetrics({ r: cur.r1, c: cur.c1 });
    setActivity((a) => [{ Icon: Check, who: "You", color: "text-emerald-400", text: `${cur.logged} — data readiness now ${cur.r1}%.`, t: "now" }, ...a]);
    setStep((s) => s + 1);
    if (!dealOpen) toggleDeal();
  }
  function runImport() {
    if (importing || imported) return;
    setImporting(true); setProgress(0);
    if (reduce) { setProgress(100); finishImport(); return; }
    let p = 0;
    const iv = setInterval(() => {
      p = Math.min(100, p + 2 + Math.random() * 3); setProgress(p);
      const v = { r: deal.metrics.r * p / 100, c: deal.metrics.c * p / 100 }; dispRef.current = v; setDisp(v);
      if (p >= 100) { clearInterval(iv); setTimeout(finishImport, 280); }
    }, 60);
  }
  function finishImport() { setImported(true); setImporting(false); setActivity(deal.activity); setMetrics(deal.metrics); }

  async function send() {
    const q = input.trim(); if (!q || sending || !imported) return;
    setMessages((m) => [...m, { role: "user", text: q }]); setInput(""); setSending(true);
    let hist = messages.map((m) => ({ role: m.role, content: m.text }));
    while (hist.length && hist[0].role === "assistant") hist = hist.slice(1);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "Content-Type": "application/json", "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" }, body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1024, system: deal.system, messages: [...hist, { role: "user", content: q }] }) });
      if (!res.ok) throw new Error("status " + res.status);
      const data = await res.json();
      const text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
      setMessages((m) => [...m, { role: "assistant", text: text || "(The model returned an empty response.)" }]);
    } catch (e) {
      setMessages((m) => [...m, { role: "assistant", text: "I couldn’t reach the model just now. In the local build this routes to your API key; here it uses the in-app model — try again in a moment." }]);
    } finally { setSending(false); }
  }

  const tokensK = Math.round(computeTokens(opts));
  const cost = (tokensK * 0.012).toFixed(2);
  const saved = Math.round((1 - tokensK / FULL_TOKENS) * 100);
  const band = disp.c >= 0.8 ? "High" : disp.c >= 0.6 ? "Medium" : "Low";
  const trans = reduce ? "" : "transition-all duration-300 ease-out";
  const coverageRows = deal.coverage.map((r) => {
    if (r.id && resolvedIds.includes(r.id)) { const stp = deal.steps.find((s) => s.gapId === r.id); return { ...r, status: "complete", note: null, src: null, done: true, doneVerb: stp ? stp.verb : "Resolved" }; }
    return r;
  });

  return (
    <div className="flex min-h-0 flex-1">

      {/* LEFT — Activity */}
      <aside className={`flex-none overflow-hidden border-r border-zinc-900 bg-zinc-950 ${trans}`} style={{ width: leftOpen ? 300 : RAIL }}>
        {leftOpen ? (
          <div className="flex h-full flex-col" style={{ width: 300 }}>
            <div className="flex flex-none items-center gap-2 border-b border-zinc-900 px-4 py-3"><History className="h-4 w-4 text-zinc-400" /><span className="flex-1 text-sm font-medium text-zinc-200">Activity</span><button onClick={() => setLeftOpen(false)} className={`rounded-md p-1 text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300 ${FOCUS}`}><ChevronLeft className="h-4 w-4" /></button></div>
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
              {activity.length === 0 ? (
                <div className="px-1 py-8 text-center text-xs leading-relaxed text-zinc-600">No activity yet.<br />Connect a source to begin.</div>
              ) : (
                <div className="relative pl-5">
                  <div className="absolute left-1.5 top-1 bottom-1 w-px bg-zinc-900" />
                  {activity.map((e, i) => (
                    <div key={i} className="relative mb-4 last:mb-0">
                      <span className="absolute top-0.5 grid h-3.5 w-3.5 place-items-center rounded-full bg-zinc-950" style={{ left: -18 }}><e.Icon className={`h-3.5 w-3.5 ${e.color}`} strokeWidth={2} /></span>
                      <div className="flex items-baseline justify-between gap-2"><span className="text-xs font-medium text-zinc-300">{e.who}</span><span className="font-mono text-xs text-zinc-600">{e.t}</span></div>
                      <p className="mt-0.5 text-xs leading-relaxed text-zinc-400">{e.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <button onClick={() => setLeftOpen(true)} className={`flex h-full w-full flex-col items-center gap-3 py-4 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 ${FOCUS}`}><ChevronRight className="h-4 w-4" /><History className="h-5 w-5" /><span className="text-xs font-medium tracking-wide text-zinc-500" style={{ writingMode: "vertical-rl" }}>Activity</span></button>
        )}
      </aside>

      {/* CENTER */}
      <div ref={centerRef} className="flex min-w-0 flex-1 flex-col" style={{ userSelect: dragging ? "none" : "auto", cursor: dragging ? "row-resize" : "auto" }}>
        {imported ? (<>
          {/* DEAL STATE */}
          <section className="flex flex-none flex-col overflow-hidden" style={{ height: dealPx, transition: dragging || reduce ? "none" : "height .3s ease-out" }}>
            <button type="button" onClick={toggleDeal} aria-label={dealOpen ? "Collapse deal state" : "Expand deal state"} className={`flex flex-none items-center gap-6 px-5 text-left transition-colors hover:bg-zinc-900 ${FOCUS}`} style={{ height: BARH }}>
              <Metric label="Data readiness" value={Math.round(disp.r)} suffix="%" pct={disp.r} />
              <Metric label="Confidence" value={disp.c.toFixed(2)} sub={band} pct={disp.c * 100} />
              <div className="flex-1" />
              <span className="text-sm font-medium text-zinc-300">Deal state</span>
              {dealOpen ? <ChevronUp className="h-4 w-4 text-zinc-400" /> : <ChevronDown className="h-4 w-4 text-zinc-400" />}
            </button>
            <div className="min-h-0 flex-1 overflow-y-auto border-t border-zinc-900">
              <div className="mx-auto max-w-5xl px-5 py-6">
                <div className="mb-3 text-sm font-medium text-zinc-300">Key metrics</div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {deal.vitals.map((v) => (<div key={v.label} className="rounded-xl bg-zinc-900 p-4"><div className="text-xs text-zinc-500">{v.label}</div><div className="mt-1 text-xl font-semibold tabular-nums tracking-tight text-zinc-50">{v.value}</div><div className="mt-1.5 flex items-center gap-1.5 text-xs text-zinc-500"><span className={`h-1.5 w-1.5 rounded-full ${TONE[v.tone]}`} />{v.note}</div></div>))}
                </div>
                {currentStep ? (
                  <div className="mt-6 rounded-xl bg-zinc-900 p-5">
                    <div className="flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5 text-violet-400" /><span className="text-xs font-medium text-zinc-400">Recommended next action</span></div>
                    <p className="mt-2.5 text-base font-medium leading-snug text-zinc-50">{currentStep.action}</p>
                    <div className="mt-4 flex items-center gap-8"><Delta label="Data readiness" from={metrics.r + "%"} to={currentStep.r1 + "%"} /><Delta label="Confidence" from={metrics.c.toFixed(2)} to={currentStep.c1.toFixed(2)} /></div>
                    <div className="mt-5 flex items-center gap-2.5"><button onClick={resolveStep} className={`rounded-lg bg-violet-600 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-500 ${FOCUS}`}>{currentStep.resolveLabel}</button><button onClick={() => { setInput("What would most reduce uncertainty on this deal right now?"); }} className={`rounded-lg border border-zinc-800 px-3.5 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800 ${FOCUS}`}>Ask counsel</button></div>
                  </div>
                ) : (
                  <div className="mt-6 flex items-center gap-2 rounded-xl bg-zinc-900 p-5"><Check className="h-4 w-4 flex-none text-emerald-400" /><span className="text-sm font-medium text-zinc-100">Every gap is resolved — this deal is ready for senior review.</span></div>
                )}
                <div className="mt-6">
                  <div className="mb-3 flex items-baseline justify-between"><h2 className="text-sm font-medium text-zinc-300">Closing checklist</h2><span className="text-xs text-zinc-500">{deal.id === "atlas" ? "1 document · 9 required" : "9 documents tracked"}</span></div>
                  <div className="-mx-3">{coverageRows.map((r) => <Row key={r.name} row={r} />)}</div>
                </div>
              </div>
            </div>
          </section>

          {/* DIVIDER */}
          <div onPointerDown={startDrag} role="separator" aria-orientation="horizontal" className="group flex h-3 flex-none cursor-row-resize items-center justify-center border-y border-zinc-900 bg-zinc-950 transition-colors hover:bg-zinc-900"><div className={`h-1 w-12 rounded-full transition-colors ${dragging ? "bg-violet-500" : "bg-zinc-700 group-hover:bg-violet-500"}`} /></div>

          {/* CHAT */}
          <div className="flex min-h-0 flex-1 flex-col">
            <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
              <div className="mx-auto max-w-3xl px-5 py-6">
                {messages.length === 0 && <div className="text-sm leading-relaxed text-zinc-500">Ask anything about {deal.name} — answers cite the file. Try “What conditions precedent are still open?” or “What's blocking closing?”</div>}
                {messages.map((m, i) => m.role === "user" ? (
                  <div key={i} className="mb-5 flex justify-end"><div className="max-w-md rounded-2xl rounded-br-sm bg-violet-600 px-3.5 py-2 text-sm leading-relaxed text-white">{m.text}</div></div>
                ) : (
                  <div key={i} className="mb-6">
                    <div className="flex items-center gap-2.5"><span className="grid h-7 w-7 flex-none place-items-center rounded-full bg-zinc-800 text-xs font-semibold text-violet-300">D</span><span className="text-xs text-zinc-400">Deal counsel</span><span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${confColor(m.confidence || confFromText(m.text))}`}>{(m.confidence || confFromText(m.text))} confidence</span></div>
                    <div className="mt-2 pl-10 text-base leading-relaxed text-zinc-200">{renderCites(m.text)}</div>
                  </div>
                ))}
                {sending && <div className="mb-6 flex items-center gap-2.5"><span className="grid h-7 w-7 flex-none place-items-center rounded-full bg-zinc-800 text-xs font-semibold text-violet-300">D</span><span className="text-sm text-zinc-500">Thinking…</span></div>}
              </div>
            </div>
            <div className="flex-none border-t border-zinc-900 px-5 py-3">
              <div className="mx-auto flex max-w-3xl items-center gap-2">
                <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") send(); }} placeholder={`Ask about ${deal.name}…`} className={`flex-1 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 ${FOCUS}`} />
                <button onClick={send} disabled={sending || !input.trim()} className={`grid h-9 w-9 place-items-center rounded-lg bg-violet-600 text-white transition-colors hover:bg-violet-500 ${FOCUS}`} style={{ opacity: sending || !input.trim() ? 0.5 : 1 }}><Send className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        </>) : (
          /* IMPORT FLOW */
          <>
            <div className="flex flex-none items-center gap-6 border-b border-zinc-900 px-5" style={{ height: BARH }}>
              <Metric label="Data readiness" value={Math.round(disp.r)} suffix="%" pct={disp.r} />
              <Metric label="Confidence" value={disp.c.toFixed(2)} sub={band} pct={disp.c * 100} />
              <div className="flex-1" />
              <span className="text-sm font-medium text-zinc-500">Deal state</span>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">
              <div className="mx-auto flex max-w-xl flex-col px-6 py-12">
                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
                  <div className="flex items-center gap-2"><Link2 className="h-4 w-4 text-violet-400" /><span className="text-sm font-medium text-zinc-100">Connect a data source</span></div>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">Paste a SharePoint folder UUID or an MCP endpoint to start tracking legal deal flow for {deal.name}. Documents are indexed and scored automatically.</p>
                  {!importing ? (<>
                    <div className="mt-4 flex items-center gap-2">
                      <input value={uri} onChange={(e) => setUri(e.target.value)} onPaste={() => {}} placeholder="sharepoint://… or mcp://…" className={`flex-1 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 font-mono text-xs text-zinc-200 placeholder:text-zinc-600 ${FOCUS}`} />
                      <button onClick={runImport} className={`rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-500 ${FOCUS}`}>Connect</button>
                    </div>
                    <div className="mt-3 rounded-lg border border-dashed border-zinc-800 px-3 py-6 text-center text-xs text-zinc-500">…or drop a connection file here</div>
                  </>) : (
                    <div className="mt-5">
                      <div className="flex items-center justify-between text-xs"><span className="font-medium text-zinc-300">{progress < 25 ? "Connecting to the source…" : progress < 50 ? "Indexing documents…" : progress < 75 ? "Extracting deal terms…" : progress < 100 ? "Computing deal-flow metrics…" : "Finalizing…"}</span><span className="font-mono text-zinc-500">{Math.round(progress)}%</span></div>
                      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-800"><div className="h-full rounded-full bg-violet-500" style={{ width: progress + "%" }} /></div>
                      <div className="mt-2 font-mono text-xs text-zinc-600">Indexed {Math.min(deal.expect.length, Math.round(progress / 100 * deal.expect.length))} of {deal.expect.length} documents</div>
                    </div>
                  )}
                </div>
                <div className="mt-5">
                  <div className="mb-2 text-xs font-medium tracking-wide text-zinc-500">We’ll look for</div>
                  <div className="-mx-1 flex flex-wrap gap-1.5">
                    {deal.expect.map((d, i) => (<span key={i} className="rounded-md bg-zinc-900 px-2 py-1 text-xs text-zinc-400">{d}</span>))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* RIGHT — Connections */}
      <aside className={`flex-none overflow-hidden border-l border-zinc-900 bg-zinc-950 ${trans}`} style={{ width: rightOpen ? 340 : RAIL }}>
        {rightOpen ? (
          <div className="flex h-full flex-col" style={{ width: 340 }}>
            <div className="flex flex-none items-center gap-2 border-b border-zinc-900 px-4 py-3"><Plug className="h-4 w-4 text-zinc-400" /><span className="flex-1 text-sm font-medium text-zinc-200">Connections</span><button onClick={() => setRightOpen(false)} className={`rounded-md p-1 text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300 ${FOCUS}`}><ChevronRight className="h-4 w-4" /></button></div>
            <div className="min-h-0 flex-1 overflow-y-auto">
              <Group label="Sources">
                {imported ? (
                  <div className="flex items-center gap-3 rounded-lg bg-zinc-900 px-3 py-2.5"><span className="grid h-7 w-7 flex-none place-items-center rounded-md bg-sky-950 font-mono text-xs font-semibold text-sky-300">SP</span><div className="min-w-0 flex-1"><div className="text-sm font-medium text-zinc-200">SharePoint</div><div className="truncate text-xs text-zinc-500">{deal.source.path}</div></div><span className="flex items-center gap-1 text-xs font-medium text-emerald-400"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Live</span></div>
                ) : (
                  <div className="rounded-lg border border-dashed border-zinc-800 px-3 py-4 text-center text-xs text-zinc-500">No source connected.<br />Use the panel to connect.</div>
                )}
                <button className={`mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-zinc-800 px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 ${FOCUS}`}><Plus className="h-4 w-4" />Add source</button>
              </Group>

              <Group label="Compute & cost">
                {OPTS.map(([k, lbl]) => (
                  <button key={k} onClick={() => setOpts((o) => ({ ...o, [k]: !o[k] }))} className={`flex w-full items-center gap-2.5 rounded-md py-1.5 text-left transition-colors hover:bg-zinc-900 ${FOCUS}`}>
                    <span className={`grid h-4 w-4 flex-none place-items-center rounded ${opts[k] ? "bg-violet-600" : "border border-zinc-700"}`}>{opts[k] && <Check className="h-3 w-3 text-white" strokeWidth={3} />}</span>
                    <span className={`text-sm ${opts[k] ? "text-zinc-200" : "text-zinc-500"}`}>{lbl}</span>
                  </button>
                ))}
                <div className="mb-1 mt-3 flex items-center justify-between text-xs text-zinc-500"><span>Speed</span><span>Accuracy</span></div>
                <input type="range" min={0} max={100} value={accuracy} onChange={(e) => setAccuracy(+e.target.value)} className="w-full accent-violet-500" />
                <div className="mt-3 rounded-lg bg-zinc-900 p-3">
                  <div className="flex items-baseline gap-2"><Coins className="h-3.5 w-3.5 flex-none text-zinc-500" /><span className="text-xl font-semibold tabular-nums tracking-tight text-zinc-50">{tokensK}k</span><span className="text-xs text-zinc-500">tokens / request · ≈ ${cost}</span></div>
                  <div className="mt-1 text-xs text-zinc-500">{saved >= 0 ? `${saved}% less than the full ${FULL_TOKENS}k document set` : `${-saved}% above the ${FULL_TOKENS}k baseline`}</div>
                </div>
              </Group>

              <Group label="Security">
                {[["Data residency", "US-East"], ["Reviewers with access", "3"], ["Audit log", "On"]].map(([k, v]) => (<div key={k} className="flex items-center gap-2 py-1"><Shield className="h-3.5 w-3.5 text-zinc-500" /><span className="flex-1 text-sm text-zinc-300">{k}</span><span className="text-xs text-zinc-400">{v}</span></div>))}
              </Group>

              <Group label="API & MCP">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 rounded-lg bg-zinc-900 px-3 py-2"><Webhook className="h-3.5 w-3.5 flex-none text-zinc-500" /><span className="truncate font-mono text-xs text-zinc-300">api.docket.dev/v1</span></div>
                  <div className="flex items-center gap-2 rounded-lg bg-zinc-900 px-3 py-2"><KeyRound className="h-3.5 w-3.5 flex-none text-zinc-500" /><span className="truncate font-mono text-xs text-zinc-300">sk-dk-••••••••3f2a</span></div>
                  <div className="pt-1 text-xs text-zinc-500">MCP servers</div>
                  {["sharepoint-mcp", "teams-mcp"].map((m) => (<div key={m} className="flex items-center gap-2 rounded-lg bg-zinc-900 px-3 py-2"><span className={`h-1.5 w-1.5 flex-none rounded-full ${imported ? "bg-emerald-400" : "bg-zinc-600"}`} /><span className="flex-1 truncate font-mono text-xs text-zinc-300">{m}</span><Settings className="h-3.5 w-3.5 text-zinc-500" /></div>))}
                </div>
              </Group>
            </div>
          </div>
        ) : (
          <button onClick={() => setRightOpen(true)} className={`flex h-full w-full flex-col items-center gap-3 py-4 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 ${FOCUS}`}><ChevronLeft className="h-4 w-4" /><Plug className="h-5 w-5" /><span className="text-xs font-medium tracking-wide text-zinc-500" style={{ writingMode: "vertical-rl" }}>Connections</span></button>
        )}
      </aside>
    </div>
  );
}

function STEPS_DONE(deal, step) { return deal.steps.slice(0, step).map((s) => s.gapId); }
