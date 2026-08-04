// A small, always-present flag marking this as a demo — mounted once in AppShell,
// above the login/persona-select vs. authenticated-chrome branch, so it's on every
// screen without needing to be added to each one individually. Deliberately just
// hovers over whatever's underneath (pointer-events-none, no layout clearance carved
// out for it elsewhere) rather than displacing chrome. Shaped like a small pennant —
// forked/swallowtail bottom (a triangular notch cut out, not a single point) — sitting
// just left of the persona selector. Position is an approximate placeholder; nudge the
// `right` value here as the surrounding header layout changes.
export function DemoFlag() {
  // The text sits in the solid rectangle above the notch line only — it must never
  // be vertically centered across the full height, or its bottom (the "O") ends up
  // inside the forked/clipped region and gets cut off.
  return (
    <div
      className="pointer-events-none fixed right-[210px] top-0 z-50 flex justify-center bg-[#b67c2a] text-white shadow-[0_2px_6px_rgba(0,0,0,0.2)]"
      style={{
        width: 20,
        height: 50,
        paddingTop: 4,
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 92%, 0 100%)",
      }}
    >
      <span
        className="text-[9px] font-bold uppercase tracking-[-0.02em]"
        style={{ writingMode: "vertical-rl", textOrientation: "upright" }}
      >
        Demo
      </span>
    </div>
  );
}
