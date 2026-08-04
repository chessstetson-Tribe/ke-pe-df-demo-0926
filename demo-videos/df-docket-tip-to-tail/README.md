# DF Docket — tip-to-tail demo recording

- `df-docket-demo.webm` — the recording (login → F1 closing moment, ~1:19). A small elapsed-time readout is burned into the bottom-left corner of every frame — use it (not your player's scrubber) to align a voiceover track, since screen-recording encoders don't always preserve exact wall-clock timing.
- `DF-Docket-Demo-Script.md` — the timed narration script, keyed to that same on-screen readout, with citations back into `npm-trial-020`'s `PRODUCT.md` / `KE-Debt-Finance-Demo-Moments.md` / `KE-Debt-Finance-Software-POV-Resources.md` for every factual claim.
- `record.js` — the Playwright recorder that produced it: eased/curved/jittered mouse movement (with an on-page cursor + click-ripple overlay, since a video capture never shows the real OS cursor), a burned-in timecode, and a `beat()` log of every narratable moment.
- `events.json` — the raw beat log `record.js` emitted for this run (label + elapsed ms), which `DF-Docket-Demo-Script.md` was built from.

## Reproducing it

1. `cd npm-trial-020 && npm install && npm run dev -- --port 5183 --strictPort`
2. From this directory: `APP_URL=http://localhost:5183/ node record.js` (needs Playwright + a Chromium build on `PLAYWRIGHT_BROWSERS_PATH`; no local `package.json` here on purpose — this folder is video output, not a project).
3. Output lands in `./video/*.webm` and `./events.json` next to wherever `record.js` is run from.

The through-line is precedent-matching (Moments A0 → A2a → A2) into grid population and a live correction (B1 → B2), closing on the "learning loop" payoff (F1) where that live correction resurfaces as a worked example next to a prior one on the same term.
