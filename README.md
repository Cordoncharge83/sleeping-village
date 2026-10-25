# The Sleeping Village — traveler’s journal prototype

A local desktop browser prototype with the approved traveler and a connected woodland village. The square joins a two-way loop between Story & Supper (Smosh), the trading post (Bargainy), the map lodge (Comp Atlas), and the tournament yard (DuelSync). The original workshop sits beside the entrance; an optional future clearing holds Manart and the unnamed penguin board game.

Explore the village to collect project and experience entries in a traveler’s journal. Smosh has the first complete showcase, including its story, engineering work, screenshot, and live archive link. The other five stops have short entries adapted from the portfolio content draft; additional media, CV, and contact links are still pending.

## Play locally

Double-click **Start Village.bat**, keep its window open, and visit http://127.0.0.1:5173. If a preview is already running, just open the address. Close its terminal or press Ctrl+C to stop it.

- WASD or arrow keys: walk; Shift: run. No jumping or climbing.
- Mouse: look after entering; right-drag works if pointer capture is unavailable.
- E near a destination: discover its journal entry, or read the square’s notice.
- J: open your journal; J or Esc closes it. Arrow keys and page buttons turn entry pages. The Contents bookmark returns to the journal index.
- M or Map: an overhead view of the village. M again returns to the traveler.
- Esc: pause. The pause menu has the journal, map, settings, and return to entrance.
- Browse all projects / All projects: every entry is available without walking. This does not mark entries as discovered.

Discoveries are saved locally in this browser under `sleeping-village.journal.v1`. Refreshing preserves entries, but resets the traveler to the entrance. Different browsers or site addresses have separate saves; clearing site data clears discoveries. If saving is blocked, the journal still works for the current visit and displays a notice. No account or server storage is involved.

Current movement tuning: walk 2.9 m/s, run 5 m/s; both are twice the initial prototype speeds, with matching animation playback increases. Default mouse sensitivity is 0.7× the initial setting. All workshop wall panels have their timber-framed face pointing outward.

Visual direction: late golden hour with a warm horizon, lower amber sunlight, cool fill in the shadows, deeper forest ground and foliage, and warm lantern light at the open buildings. The woodland foliage palette is applied to shared runtime material variants; original asset textures are preserved. `src/atmosphere.ts` holds the palette. No post-processing or additional shadow-casting lights are used for the evening pass.

## Removable setup

Uses the existing Node.js installation (v22.22.0 was already present). No global tools, PATH edits, backend, database, or cloud services were installed. Libraries live in `node_modules`, npm downloads/logs in `.cache`, and production output in `dist`.

To reclaim development space, stop the server and remove **only** `node_modules`, `.cache`, and `dist` in this folder. Keep `src`, `public`, configuration, and `package-lock.json` to restore with `npm ci`. Original asset packs and approved traveler source folders remain unchanged. Deleting this whole game folder also deletes its supplied asset packs; keep those if you need them elsewhere.

## Development

### Local version history

This game folder is a local Git repository. Its first commit captures the current village and journal prototype; earlier iterations were not tracked by Git. Source code, configuration, planning notes, screenshots, fonts and licenses, and the selected playable assets under `public/` are included. Dependencies, caches, builds, original `asset-packs/`, and the obsolete transfer ZIP are ignored. Ignoring these files does not delete them.

No remote is configured and nothing has been pushed. Save future meaningful milestones with `git add -A` and `git commit -m "Describe the change"`; inspect them with `git log --oneline`. Uncommitted changes are visible with `git status` and `git diff`.

`npm run dev` starts a loopback-only preview. `npm run build` type-checks and generates a static site in `dist`. `npm test` checks physics on a continuous trip through every stop, the sprint camera, and journal persistence including duplicate discoveries, corrupt records, and unavailable storage. `npm run preview` serves the built version.

`src/village.ts` is the shared layout definition for buildings, paths, destination triggers, and collision geometry. `src/VillageScene.tsx` renders the environment from that layout. `src/Game.tsx` owns the traveler and camera; `src/App.tsx` owns the interface. New structures reuse the already imported assets, with simple local geometry for signs, fences, counters, and benches. No additional packages or asset downloads were required for the village expansion.

Runtime: React 19, React Three Fiber 9, Three.js, Rapier, TypeScript, Vite. Character physics uses a fixed 60 Hz timestep, with interpolated rendering shared by the traveler and camera. The camera follows player translation directly, smooths its orbit and return from obstacles, and retracts immediately only for actual obstructions. Static colliders approximate furniture; foliage is decorative. No FPS guarantee has been made for other hardware.

`scripts/prepare_assets.py` creates a selected runtime subset from the user-provided packs; it needs the pre-existing Python/Pillow environment. PNG runtime textures are capped at 1024px. `public/assets/receipt.json` records original and processed hashes. CC0 licenses are retained beside models. Quaternius supplies environment assets; KayKit supplies the source for the approved customized traveler. The separate game-dev CLI was unavailable, so this is a documented local import, not a claim of canonical game-dev admission.

The older CLOUD_HANDOFF.md and ZIP describe an earlier transfer plan. Current development is local; nothing has been published.

## Story & Supper

The tavern contains an open story ledger, a serving counter, shelves, mugs, candles, reading and supper tables, a side bench, terrace seating, planters, and a red awning. Approach the ledger on the left and press E to add Smosh to your journal. The same entry is available through Browse all projects. Closing returns to the originating view; movement is suspended while reading. The entry includes a real screenshot, project responsibility and engineering context, and a live archive link. Its screenshot loads only when the entry is opened.

`src/Tavern.tsx` owns the furnishings and `src/SceneObjects.tsx` reusable scene objects. `tavernLayout` in `src/village.ts` defines furniture collisions. All furnishings use existing imported models or local geometry; no dependencies were added. See `planning/STORY_AND_SUPPER_CHECKS.md` for the original tavern validation and screenshot provenance.

## Journal interface

`src/Journal.tsx` renders the book, `src/journal-data.ts` contains its entries, and `src/discoveries.ts` validates and saves discovery IDs. `src/Modal.tsx` provides a native dialog with focus containment and Escape handling. Pause, settings, the square notice, map, prompts, welcome menu, and HUD share the leather, parchment, and cloth-bookmark theme. The journal adapts to stacked pages in narrow windows, supports keyboard navigation and reduced motion, and keeps its close control visible while scrolling. No new dependency or external font request was added. See `planning/JOURNAL_CHECKS.md` for this prototype’s verification.

The selected **Worn traveler's journal** typography uses IM Fell English for titles, Alegreya for reading text, and Alegreya Sans for controls. Four compact web-font files live in `public/fonts` with their licenses and source hashes (about 127 KiB of fonts). They are served with the game, not installed on the computer. Reading and small-control sizes were adjusted for these fonts. The Contents bookmark remains the only journal-wide navigation control; entry pages use their own arrows and section label.
