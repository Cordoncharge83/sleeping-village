# Journal frame and entrance cottage polish

- Nearest left cottage at (-7, 20) now faces east toward the entrance street. Its visual and collision rotation share the same configuration.
- Journal frame has a consistent width and viewport-limited height across Contents, text and Gallery pages. Discovery messages have a reserved footer area.
- Screenshots fit within the page with object-fit containment and retain click-to-enlarge. Long copy scrolls inside the book; page navigation stays visible. Text starts at the top after turning.
- Compact windows use a single reading page. Larger windows retain the two-page layout, with a full spread for Gallery.
- Pause menu includes Back to portfolio, linking to https://portfolio.moudka.com/. No case-study links were added.
- Browser checks: all 19 entry pages at 1280x800; 17 main entry pages at 1280x720 and the compact default viewport. Dimensions stayed constant within each viewport and all page-turn controls remained visible. All four Gallery images loaded.
- Production build and existing physics, camera, journal and gate checks pass, including the continuous tour past the rotated cottage.
- Temporary preview server stopped after verification.
