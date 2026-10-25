# The Sleeping Village: cloud handoff

## Current stage and user constraint

This is a desktop-first browser 3D portfolio adventure. Planning is ongoing; no game implementation has been started. Do not start building merely because this package has been uploaded. Continue the asset review and technical planning with the user first.

The user wants development in the cloud and does not want additional software installed on their computer. Install development dependencies only in the selected cloud environment. Do not treat a local file bundle as evidence that a cloud environment or preview is already available.

## Agreed design

- Build for the browser directly, rather than exporting from a desktop game engine.
- Third-person, over-the-shoulder camera, showing the whole traveler and surrounding ground.
- Mouse rotates the camera, including looking around while stationary.
- WASD movement relative to the camera; traveler turns toward movement.
- Hold Shift to run. No jumping or climbing.
- Grounded traversal with gentle slopes and small steps; collisions for buildings and props.
- One compact continuous outdoor village, with selected open-front workshops/shops. Visitors can see inside from the street and walk straight in, without a separate interior loading screen.
- Wide openings, spacious interiors, and camera obstruction handling.
- Include a direct "View portfolio" alternative for visitors who do not want to play.
- User supplies assets; the assistant assembles a cohesive world.
- Only the free/Standard asset editions may be used. Do not assume that Pro/Source-only models, scenes, shaders, or collisions are included.

## Proposed technical foundation

The user accepted the recommended TypeScript, React, Three.js with React Three Fiber, Rapier physics, and Vite stack. No backend or database is currently required. Dependencies should be installed in the cloud project, with compatible versions verified against current documentation.

Discussed performance targets (not measured guarantees): aim for 60 FPS at 1080p on a chosen ordinary reference laptop, with a lower quality setting targeting 30 FPS on weaker devices. Test desktop Chrome, Edge, Firefox, and Safari. Prioritize essential starting-area loading and defer optional content. Set a download budget after inspecting the actual assets. Cloud development does not remove the visitor's local GPU requirements.

## Included files

- `asset-packs/`: the user's extracted free Quaternius environment packs, copied as provided.
- `kaykit_traveler_v02/`: approved final animated character, seven clips, editable Blender files, GLB, licenses, viewer, previews, and source scripts.
- `kaykit_traveler_v01/`: approved appearance source needed by the v02 rebuild scripts. Keep this folder beside v02.
- `TRANSFER_MANIFEST.json`: transfer inventory with SHA-256 hashes for the supplied files.

Use `kaykit_traveler_v02/Traveler_animated.glb` for game integration. This is the latest approved KayKit adaptation, not the deleted earlier original Traveler v04/v07 iterations. The user approved its appearance and browser animation playback in the earlier character chat.

The character's seven clips are Idle, Walk, Run, Turn, Inspect, Interact, and Celebrate. Walk and Run are in place. Turn includes a 90-degree local root yaw that requires controller handling. Review the character README and validation reports before integration; camera control, locomotion tuning, and game integration remain to be implemented. Source artwork and license receipts must be retained.

The viewer helper was updated to use v02's bundled viewer files without depending on the deleted v07 folder. Some historical review scripts use Windows fonts or reference the original Downloads archive path; these are historical provenance, not cloud-ready paths. Adapt such paths deliberately if regenerating reviews. The game does not need Blender to display the existing GLB.

## Next work

1. Verify the transfer manifest and inspect actual pack contents, formats, licenses, dimensions, materials, and texture sizes. The extracted folders were packaged without an asset-quality audit; review them before use.
2. Confirm which free modules and furnishings support the open-front building plan.
3. Complete planning for interactions, portfolio panels, world assembly, loading/performance budgets, and implementation milestones.
4. Once the user agrees to begin implementation, make a small test area with the traveler and one open-front workshop. Verify movement, animation transitions, camera clearance, collision, and representative performance before expanding the village.

## Reference pack pages

- https://quaternius.com/packs/medievalvillagemegakit.html
- https://quaternius.com/packs/ultimatestylizednature.html
- https://quaternius.com/packs/fantasypropsmegakit.html

## Documentation instruction

Use Context7 to resolve and fetch current library documentation before library-specific implementation, configuration, setup, or debugging. Do not rely solely on remembered API syntax.
