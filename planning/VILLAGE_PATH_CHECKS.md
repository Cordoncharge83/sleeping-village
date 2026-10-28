# Serving the game under /village/

## Local and production addresses

- Development: http://127.0.0.1:5173/village/ (`npm run dev`).
- Built preview: http://127.0.0.1:5173/village/ (`npm run preview -- --port 5173 --strictPort`, after `npm run build`).
- Intended public address: https://portfolio.moudka.com/village/.

## Asset handling

Vite base is `/village/`. Compiled scripts, stylesheets and CSS font URLs are rewritten by Vite. Runtime model and journal image URLs pass through `publicAssetUrl`, which prefixes the configured base. Model catalogue and journal records remain independent of hosting paths, and glTF dependencies resolve relative to their model files. Screenshot enlargement uses the same resolved URL as the displayed image. The portfolio and external project links keep their existing destinations. Discovery keys and save format are unchanged.

## Hosting handoff

The build produces `dist/index.html` and its `assets/`, `fonts/`, and `images/` directories. Deploy that complete output with its root mounted at `/village/`; a request to `/village/assets/example` must serve `dist/assets/example`. Route `/village` to `/village/` with a redirect, and reserve `/village/*` for this app while the regular portfolio handles the rest of the hostname. A Worker or host routing configuration still needs to implement that mapping. This change does not publish the app or alter Cloudflare configuration.

Do not mount only the HTML document or route the game's missing assets to the regular site's HTML fallback. Keep the existing encoded spaces and relative glTF texture/buffer locations intact.

## Verification

- Production build and existing movement, collision, camera, journal and gate checks passed.
- `npm run check:paths` against the production preview passed: HTML entry, compiled scripts and CSS, WOFF2 signatures, all 18 models and relative dependencies, and all four PNG screenshots (71 unique resources).
- Browser entered the built village at `/village/`, showing the traveler, textured scene, and preserved 6/6 discoveries.
- All four Gallery images loaded, with both image and enlarge URLs starting `/village/images/`.
- Scene screenshot: village-subpath-scene.png.
- Temporary production preview stopped after checks.
