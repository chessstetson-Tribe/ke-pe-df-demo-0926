# The Live Interactive Explainer

A working demo that lands the big idea in seconds — and that customers understand as an *illustration of a capability*, not a preview of their exact screen.

**Two problems being solved:**
1. The idea takes too long to arrive. It should land in seconds, not minutes.
2. Customers over-index on the visuals and assume they're getting precisely what they saw.

**Constraint:** live, not recorded. Tab-switching is the only "edit" available.

---

## Tier 1 — Highest leverage

### Show it twice, in two guises
Same capability, two visibly different contexts: different data, different theme, different entry point. Ideally one that resembles the customer's world.

One instance reads as a spec. Two instances read as a range — and the customer starts imagining a third unprompted. This is the single best fix for over-indexing, and it costs about fifteen seconds of tab-switching. It *demonstrates* that the visual is a variable and the capability is the constant, so you never have to deliver the "final product may differ" line that people discount anyway.

### Narrate outcomes, not clicks
"The contract's reviewed." Not "then I hit this button and open this panel."

Over-indexing is usually something the demo teaches. Tour the interface and you've told them the interface is the product. Narrate transformations and the screen becomes evidence rather than subject. Also kills the interface-tour reflex that makes demos drag.

### Open at the climax
Tab 1 is the finished, impressive output — the thing they'd normally reach at minute six. Show it, let it land, then: "here's how that got made," and jump to tab 2.

The payoff arrives first; the explanation becomes optional detail rather than a prerequisite.

### Engineer one disproportionate moment
Find the point where a tiny input produces a huge output — one sentence typed, four hundred rows transformed; one click, a whole report. That ratio is what gets remembered and re-told. Put it in the first ten seconds, not at the end.

---

## Tier 2 — Strong supporting moves

### Lead with contrast, not capability
Three seconds of the old painful way (spreadsheet, email thread, twelve tabs) beside the new way. The idea lands as a *gap*, which is faster than explaining what the product does.

Live version: put old and new in adjacent tabs and toggle between them a couple of times. Toggling is far more persuasive than describing, and costs nothing.

### Never show an empty state
Open with the account already full of realistic data, mid-workflow. Most demos waste their first thirty seconds building up to the interesting part.

### Leave one visible seam
A config panel, a theme toggle, an obviously placeholder label. Quietly signals "this is one configuration" without you having to claim anything.

---

## Tier 3 — Optional

### Tab 0: the animated pitch view
A single looping page that resolves into the real UI, then you switch into the actual product. No build cost inside the app.

**Caveats.** If it's just a title slide with motion, people file it as "marketing, skip." It only works if built from live product elements that resolve into the real interface, so it reads as a zoomed-out view of the thing itself rather than a preamble.

Note also that a polished animated pitch view *raises* fidelity expectations — it signals "this is finished and designed." It doesn't solve problem #2; the two-guises approach does.

---

## Live-demo mechanics

Tabs are your cut. Treat each one as a shot in an edit, not a place to work.

- **Pre-stage everything.** Every tab already at the exact scroll position and state you need. No loading, no logins, no navigating. If a step takes eight seconds, that tab is already past it.
- **Fake the slow path honestly.** If a job takes forty seconds, kick it off in one tab and switch to a tab where it's already done. "I started this earlier" — nobody objects, and momentum survives. Optionally switch back at the end to show the real one finished, which quietly proves it wasn't staged.
- **Separate browser window,** not tabs in a crowded window. No tab bar full of your inbox. Hide bookmarks.
- **Rehearse the switch order** until your hand does it without looking. The failure mode of tab-based demos is fumbling for the right tab mid-sentence — it reads as unpreparedness and undoes all the polish.

---

## Test before it ships

Write the one sentence you want them repeating to a colleague afterward. Cut anything that doesn't serve it.

Then: have someone watch, wait five minutes, ask them to describe it. If they describe the screen, you have more work to do. If they describe what it *did*, you're there.
