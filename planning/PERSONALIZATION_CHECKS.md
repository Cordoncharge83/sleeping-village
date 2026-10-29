# Project previews and Story & Supper personalization

- Copied the four supplied screenshots as separate project previews: Smosh homepage, DuelSync desktop dashboard, Bargainy homepage and Comp Atlas homepage. Each uses the existing taped-photograph treatment. Third-page gallery image files and URLs remain unchanged.
- Added an SVG favicon depicting the teal-hooded traveler with cream eyes and a warm scarf. Vite rewrites its link to `/village/favicon.svg`.
- Replaced the tavern's side bench with a compact cream couch and patterned mustard pillows, strengthened crimson accents in the rug and awning, and moved the adjacent table slightly inward. The couch uses lightweight geometry from the existing Three.js dependency; no new model package or library was installed.
- Updated the shared furniture collision layout. A new physics check verifies that the couch arm blocks movement while the entry and ledger routes remain accessible. Existing camera, movement and journal/gate checks pass.
- Reviewed the four project preview and gallery URLs through the actual journal, plus the couch and furniture arrangement in a close local scene view. The temporary inspection camera was restored; `src/Game.tsx` has no change and spawn remains `[4, .74, 28]`.
- Production build passed. The packaged URL check passes for the favicon, fonts, bundles, 18 models with their dependencies and eight distinct journal screenshots (76 resources).
