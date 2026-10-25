# First scene checks — 2026-10-21

- Production build and TypeScript check: passed.
- Actual Rapier controller tests: passed for grounding, workshop entrance, floor step, workbench collision, side wall, run speed, camera obstruction, and scene boundary.
- GLTFLoader import/geometry inspection: all selected models parsed successfully with texture loading disabled for the Node inspection. Character clips include Idle, Walk, Run, Turn, Inspect, Interact, and Celebrate.
- Source/runtime asset hashes and dependency copies recorded in public/assets/receipt.json. Sources untouched.
- Local HTTP readiness: 200 on http://127.0.0.1:5173 after running the server with the required network permission.
- Visual/browser gameplay review: passed after the user reopened the normal local URL. Inspected the default small preview and 1280×720 desktop viewport. Walked from the path into the workshop, reached the workbench, opened its panel with E, paused/resumed, and reset to spawn. Fixed downward-facing path triangles, filled the rear roof gable, and removed unwanted scrolling in short preview windows. Screenshot: first-clearing.jpg. Browser console showed no errors in the inspected log; the Rapier warning below remains.
- No measured FPS claim. Rapier emits an upstream initialization deprecation warning; simulation tests pass.

Disk snapshot excluding supplied originals: node_modules 126.9 MiB, project cache 222.3 MiB, runtime assets 21 MiB, build output 24.2 MiB. Dependencies/cache/build output can be removed after stopping the server; keep source assets and project files.

## First playtest revisions — 2026-10-23

- Walking increased from 1.45 to 2.9 m/s; running from 2.5 to 5 m/s to preserve its faster pace. Animation playback doubled to follow the new movement speeds.
- Default sensitivity reduced from 1.0 to 0.7; browser settings panel confirmed 0.7× on a fresh load.
- Rear wall panels rotated 180° so their exterior timber framing matches the side walls; added rear corner posts to close exposed joins. Confirmed the interior rear wall now has plaster facing inward. Screenshot: workshop-wall-corrected.jpg.
- Production build passed. Updated physics checks passed at the new speeds, including 5.8 metres walked in two simulated seconds, the floor threshold, furniture, walls, and boundary containment. Browser walk from spawn into the workshop passed; no console errors in the inspected log.
- Reused the user's existing local server; it remains running.

## Sprint camera correction — 2026-10-23

- Identified a false obstruction check: the old camera compared its distance from the moving player with the available boom length. At 5 m/s, ordinary follow lag exceeded its 0.4 m threshold and caused repeated position snaps in open space.
- Camera translation now follows the same interpolated position as the rendered traveler. Orbit damping and obstacle boom recovery are handled separately; only an actual obstruction can force immediate retraction.
- Added rendering interpolation between fixed 60 Hz physics snapshots to prevent stepped actor/camera movement at higher or uneven display refresh rates. Reset clears interpolation history.
- Production build and existing physics tests pass. Camera regressions pass at 30/60/90/144 FPS in forward, reverse, and sideways sprints; uneven frame timing, obstruction clearance/recovery, reset, and actual physics integration are covered.
- Browser sprint check passed: Shift+W for 2.1 seconds covered about 10.5 m and reached the workshop entrance. No console errors in the inspected log. Screenshot: sprint-camera-fixed.jpg. The existing server was reused and left running.
