# First public playtest polish

- Gallery spreads retain the fixed journal frame. Screenshots use a larger image column, with the heading and description beside them; DuelSync has a portrait layout. The photograph frame follows the image instead of adding full-width blank bands. Narrow screens stack the image and notes.
- The old-tree square sign has separate left/right labels and large vector arrows at the outer edges. Its board is wider for readability.
- The transition from five to six main discoveries queues a gate announcement. It appears only after leaving the journal, directs the player north past the old tree, fades in/out over 3.2 seconds, and does not repeat when revisiting entries or loading an already completed save.
- Dialogs consume Escape before game shortcuts can see it and guard against duplicate dismissal. Menu transitions synchronously invalidate mouse capture, so a delayed unlock event cannot pause a newly resumed journey.

## Verification

- Production packaging and all physics, camera, journal/gate and mouse-capture regressions passed. New discovery assertions cover every possible sixth entry, duplicate visits, the bonus entry and completed saves.
- Visually reviewed all four galleries at the normal 1280×720 viewport. Their journal frame remained 1080×688, with no content overflow; screenshot sizes were substantially increased. Also checked the portrait gallery at the 640px breakpoint and reset the viewport afterward.
- Twelve journal open/Escape-close cycles, including a held Escape press, returned to gameplay with the cursor hidden and no pause dialog. The in-app browser refuses native pointer lock, so its native-capture timing cannot be verified there.
- Walked a fresh journey from spawn through all six actual displays on a separate local origin, without seeding discoveries or changing existing saves. No gate notice appeared while reading the final entry. Closing it showed the announcement; it later disappeared and did not repeat after re-reading. No console errors.
- Walked to the square and visually checked the new direction labels and arrows.
