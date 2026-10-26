# Traveler’s journal prototype — 25 October 2026

## Implemented

- Six discoverable entries: Smosh, Comp Atlas, DuelSync, Bargainy, professional experience, and future ideas. Inspecting a destination unlocks its entry; the square explains the controls.
- J opens the personal journal. Undiscovered entries offer clues. Smosh has Story / My work / Gallery pages and the verified public archive link. Other entries use the existing portfolio content draft, with private/planned status preserved and no unverified public links.
- Discovery notice appears inside the book once per new entry. Local versioned storage preserves discoveries across reloads. Invalid IDs and duplicate records are filtered. Unavailable storage falls back to the current visit with explanatory text.
- Direct browsing opens all entries without changing discovery progress.
- Leather cover, parchment pages, cloth bookmarks, stamps, pinned screenshot, and matching pause/settings/map/welcome/HUD/inspection UI. No new packages, remote fonts, or additional scene assets.
- Native modal dialogs, explicit Tab cycling, keyboard page navigation, Escape/J dismissal, reduced-motion styling, responsive stacked pages, and a sticky close control.

## Verified

- `npm test`: existing continuous village route, furniture and movement checks; sprint camera at multiple frame rates; journal save/reload, idempotence, multiple discoveries, malformed/unsupported storage, invalid IDs, denied storage, and session fallback.
- `npm run build`: TypeScript and production bundle.
- In-app browser at 1280 × 720: fresh 0/6 journal, six locked clues; direct collection has all entries and leaves count unchanged.
- Walked from the entrance to the tavern ledger. E opened Smosh and announced a new entry. Holding W while reading left the traveler at the same coordinates. J then E reopened it without another discovery notice.
- Arrow keys and bookmarks switched Story / My work / Gallery; previous/next buttons respect page bounds. Selecting from Contents preserves keyboard navigation.
- Reload retained Smosh. Separately visited and inspected the workshop; its two experience pages worked and increased count to 2/6. Another reload retained both.
- Pause, sensitivity adjustment (70% → 80% → 70%), settings-back, journal-from-pause, map toggle, square notice, and direct-journal-from-notice return paths checked.
- Tab and Shift+Tab remain in the open journal, including wraparound at the last control. Native modality makes background controls inactive.
- Narrow 420 × 650 game iframe: pages stack with no horizontal overflow; the close control remains visible while scrolling. Temporary check fixture removed.
- No browser runtime errors observed. Existing Rapier initialization deprecation warning remains unchanged.

## Evidence and limits

- `journal-prototype.png`: final Smosh spread in the actual running game.
- `journal-discovery.png`: initial tavern discovery and entry notice.
- `journal-contents.png`: one discovered entry alongside locked clues.
- `journal-pause.png`: matching pause menu.
- Browser test profile now has Smosh and professional experience discovered. Other browsers have independent saves.
- Saves cover discoveries only, not position or settings. Clearing browser/site data removes discoveries. No cloud account or synchronization.
- This is an interface prototype. Comp Atlas media/video, additional project galleries, CV/contact actions, sound effects, and elaborate page-turn animation are not included. Existing approved camera, movement, village layout, and sunset palette were preserved.

## Smosh copy and gallery refresh · 26 October 2026

- Replaced the three Smosh pages with the owner-supplied copy, including 170+ episodes and 1,000+ stories. These are owner-provided figures, not live counters.
- Added the supplied 1736 × 832 screenshot unchanged at `public/images/smosh/story-grid.png`, used for the pinned photograph and gallery.
- Gallery photographs occupy the full journal spread; selecting the screenshot opens the original in a new tab. Story and My work retain the two-page layout. Contents remains the only global bookmark.
- Checked all three pages, arrow-key navigation in both directions, disabled final Next button, Contents return, and the full-resolution image link in the in-app browser. Checked the desktop 1280 × 900 layout and normal narrow window; reset the temporary viewport afterward.
- Production build and existing movement, camera, and journal tests passed. Existing Rapier initialization deprecation warnings remain.
- Visual evidence: `smosh-journal-gallery.png`.
