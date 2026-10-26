# Village layout from the owner's sketch

## Design

Based on the owner's hand-drawn map supplied in the conversation. North is negative Z in the scene. This pass establishes the walkable layout; detailed furnishing of the remaining buildings is still future work.

- Start: southern woodland approach, bending toward the square after the welcome sign.
- Centre: old tree, two benches, directions, and a compact junction.
- Lower eastern street: Story & Supper (Smosh), then the trading post (Bargainy).
- Upper eastern street: map lodge (Comp Atlas), then tournament yard (DuelSync).
- Southwest lane: professional-experience workshop.
- Western lane: education/skills schoolhouse. Copy comes from `PORTFOLIO_CONTENT_DRAFT.md`, previously prepared from the owner's CV.
- North: garden gate, then the Manart and penguin-game clearing.
- Eight closed cottages, garden fences, hedge banks, and staggered woodland frame the streets. Existing local models are reused; no additional asset downloads or dependencies.

## Progression

The six required entries are Smosh, Bargainy, Comp Atlas, DuelSync, work experience, and education. The future chapter is a bonus, excluded from the six-entry count. The sixth discovery announces that the gate is open. The gate's visible doors and physical collider use the same progress state.

Direct browsing exposes all seven entries without changing discoveries or opening the gate. Version-1 saves remain compatible. A legacy future discovery remains readable but does not substitute for the new education entry. When storage is unavailable, the gate still works for the current visit.

## Checks

- Production build and TypeScript pass.
- Continuous physics route visits all six main entries through their entrances, returns to the square, tests the gate closed, opens it, visits the future clearing, and returns to spawn.
- Collision checks cover workshop and tavern furniture, rotated side/rear walls, closed cottages, the gate, adjacent fence/hedge bypass attempts, and world bounds.
- Camera regression tests pass at 30/60/90/144 FPS and uneven frame timings. Approved movement speed and sensitivity are unchanged.
- Discovery tests cover all six requirements, duplicate entries, bonus exclusion, old saves, saved unlock state, and existing corrupt/denied-storage cases.
- Browser: walked the welcome route, read its tutorial, visited the schoolhouse and eastern project streets, and collected the sixth entry. Gate blocked passage at 5/6 and opened at 6/6; walked through to inspect the future chapter. Direct browsing exposed future projects at 3/6 and left progress unchanged.
- Reload retained 6/6 and the map reported the garden gate open. No browser runtime errors observed; the existing Rapier initialization deprecation warning remains.

## Evidence and next review

- `village-sketch-layout.png`: overhead village layout.
- `village-old-tree-square.png`: square at traveler height.
- `village-garden-gate-open.png`: open gate after six discoveries.
- Browser test profile has all six main discoveries and the bonus chapter. Ordinary visitors' progress depends on their own browser storage.
- Next user review: street spacing, walking distances, enclosure, and the feel of approaching each destination. The cottages and hedge banks are simple layout geometry; remaining interiors and richer environmental details are not finished.

## Entrance and roof clearance follow-up

- Connected every open-front building to its approach with a shallow ground apron, and curved the workshop lane into its doorway. Rounded exposed path ends remove abrupt cutoffs.
- Moved the map lodge back 1.25 metres from the upper street, the cottage behind the tavern back 2.5 metres, and the cottage beside the trading post away from its overlapping roof corner.
- Checked conservative roof footprints using the actual roof asset bounds and each building's rotation/scale: no building-to-building roof overlaps remain.
- Full movement, camera, discovery, and gate regression checks and the production build pass. Walked the workshop approach in the browser; visual evidence is `workshop-path-connected.png`.
