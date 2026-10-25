# Village layout — 24 October 2026

## Implemented

- Entrance at (0, 27); workshop at (-11, 14), open to the path.
- Square centered at (0, 0), with a landmark maple and two benches.
- Story & Supper at (-13, 1), with terrace seating.
- Bargainy trading post at (13, 1), with a back counter.
- Comp Atlas map lodge at (-11, -14), with a planning table.
- DuelSync covered tournament yard at (11, -14), open on three sides.
- Optional future clearing at (0, -28), with Manart and early-concept penguin game signs.
- Connected outer loop, crossings through the square, and open-front entrances; no jumping or climbing required.
- Destination labels, contextual E interactions, overhead village view, pause/settings, and reset to entrance.
- Existing movement speed, 0.7 mouse sensitivity, interpolated motion, and sprint camera preserved.

## Verification

- Production build and TypeScript check passed.
- Physics test drives a single continuous visit to all seven interaction points, then returns to the entrance.
- Physics checks cover walk/run distances, floor steps, furniture, rotated side/rear walls, camera obstruction, boundary, and reset.
- Camera regression checks cover sprinting at 30/60/90/144 FPS, uneven frame times, real physics integration, obstacle recovery, and reset.
- Browser preview loads in a fresh in-app tab. The older tab retained a connection-error page after the initial sandboxed server failed to connect.
- Visual check covered the entrance, overhead view, and sprint into the square; square and workshop E interactions worked. Browser walk-through reached the relocated workshop; pause, resume, and reset to the entrance worked. Overhead fog was adjusted after the first visual review.
- Final build and both test suites passed after the visual corrections. The fresh page produced no new runtime errors; Rapier retains its existing initialization deprecation warning. An earlier development hot-reload root warning was addressed by separating the App component from the root entry point.
- Captures: `village-layout-preview.png` and `village-entrance-preview.png` beside this checklist.

## Scope and next review

This is the first playable spatial layout, not the final decoration/content pass. Ask the user to judge distances, navigation, room space, camera clearance, and whether the village feels cohesive. Full project text, media, CV/contact actions, and richer furnishing remain separate work. Comp Atlas stays private; Manart is planned; the penguin board game is an early concept.

No new dependencies, global tools, asset downloads, or public deployment. The original asset packs and synced sources were not changed.

## Sunset and forest palette pass

- Lower amber sunlight and longer shadows; cool fill keeps the traveler and rooms readable.
- A procedural sky grades from a warm horizon into muted blue. Deep woodland greens replace the autumn foliage colors at runtime; texture detail and alpha remain intact.
- Forest-green ground and a quieter earth path palette; warm lanterns at the five destinations. Extra lantern lights do not cast shadows. No post-processing or new dependencies.
- TypeScript and production build passed. Browser checks covered the entrance, workshop, overhead view, and low-graphics mode, with no runtime errors reported.
- Normal graphics restored after review. Captures: `village-sunset-entrance.png` and `village-sunset-overview.png`.
- Movement, layout, and collision logic were not edited in this visual pass.
