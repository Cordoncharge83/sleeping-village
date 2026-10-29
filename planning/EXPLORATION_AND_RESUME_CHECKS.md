# Exploration-only journal and immediate resume

- Direct browsing is removed from the welcome menu, pause menu, all village notices and footer. Entries remain locked until discovered; saved discoveries, the six-entry gate condition and Back to portfolio remain available.
- Removed the intermediate resume screen and right-drag choice. Closing pause, journal, map or a notice immediately resumes mouse-look and hides the cursor. Native capture is requested in the same user action.
- Browsers can require an engagement gesture after Escape unlocks the pointer. Movement keys and canvas clicks retry native capture without another prompt. Ordinary mouse movement drives the camera during that retry; until capture succeeds, the system pointer is bounded by the browser window.
- Opening menus shows the cursor and disables both walking and mouse-look. Losing native capture or window focus pauses the game. Late capture results cannot reopen a closed menu.
- Capture regressions cover denial followed by retry, promise and event-only APIs, concurrent request deduplication, cancellation, stale rejection and unsupported browsers. Full native capture cannot be verified in the in-app browser, which refuses pointer lock.
- Browser QA: direct entry without an extra prompt; repeated Escape and button resume; cursor auto while paused and none during play; camera delta unchanged while paused and responsive after resume; journal and map close directly into play; no console errors. Production build and all regression checks pass.
