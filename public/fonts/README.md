# Worn traveler's journal fonts

Bundled locally on 25 October 2026. No system font installation or runtime Google Fonts request is required.

- IM Fell English regular: journal, location, and menu titles.
- Alegreya regular and italic: reading text, captions, and handwritten-style notes.
- Alegreya Sans regular: buttons, labels, settings, and HUD controls.

These are Google Fonts' unmodified Latin WOFF2 subsets. The four font files total 129,628 bytes (about 127 KiB). The matching SIL Open Font License files are included alongside them. `sources.json` records the download URLs, byte sizes, and SHA-256 hashes.

Official family metadata and license sources:

- https://github.com/google/fonts/tree/main/ofl/imfellenglish
- https://github.com/google/fonts/tree/main/ofl/alegreya
- https://github.com/google/fonts/tree/main/ofl/alegreyasans

CSS includes serif/sans-serif fallbacks for characters outside these subsets and uses `font-display: swap`. Only the regular and italic styles actually used by this interface are included.
