# Cloudflare deployment

## First deployment

Use Cloudflare Workers (static assets), matching the regular portfolio’s existing approach. Nothing has been deployed by this configuration change.

1. Open Workers & Pages in the Cloudflare dashboard, then Create application and Import a repository (Get started).
2. Connect GitHub if needed and select Cordoncharge83/sleeping-village.
3. Use Worker name sleeping-village (must match wrangler.jsonc) and production branch main.
4. Root directory: repository root (/). Build command: npm run build:cloudflare. Deploy command: npx wrangler deploy.
5. No custom environment variables or secrets are required for the game. Existing project assets are included in the repo.
6. Save and Deploy. Open the workers.dev address Cloudflare provides, followed by /village/. Its root also redirects there.
7. Check the traveler, movement, building interactions, all four project galleries, journal navigation and a refresh. Discoveries on a new hostname start independently of localhost.

Do not select a separate Pages setup or supply dist as an output directory: the Worker configuration supplies cloudflare-dist as the asset directory.

## Packaging

npm run build:cloudflare first builds the game, then mirrors dist into cloudflare-dist/village/. A root _redirects file sends / to /village/ (302) for the temporary hostname and normalizes /village to /village/ (301). No Worker JavaScript, game server, database or new local packages are needed. The asset-only Worker serves the files directly. Missing assets return 404 rather than a successful HTML fallback.

cloudflare-dist is generated and ignored, along with local .wrangler state. The repository’s Vite base remains /village/.

## Final domain, after the regular portfolio is deployed

Keep the portfolio Worker on the Custom Domain portfolio.moudka.com. Add two Routes to the sleeping-village Worker: portfolio.moudka.com/village/* and portfolio.moudka.com/village. The hostname must be in the Cloudflare-managed zone with its DNS proxied, and the routes must not be attached to the regular portfolio Worker. Path routes take precedence over the portfolio Custom Domain while preserving its other URLs. No custom-domain route is hard-coded in this game repo yet.

Do not attach the entire portfolio.moudka.com Custom Domain to the village Worker; that would take over the portfolio root. The / redirect in this package only affects requests reaching this Worker, so the final path routes leave the regular homepage untouched.

## Verification of this preparation

- Production packaging succeeds with no changes to the game or dependency set.
- The packaged tree is served locally at the host root with /village/ as a real nested directory; npm run check:paths validates the production HTML, bundles, fonts, all 18 models and dependencies, and four screenshots (71 unique resources).
- Local preview does not emulate Cloudflare’s _redirects parser; live root redirects are checked after the first Cloudflare deployment.
- Temporary asset preview stopped after verification.

## Official documentation

- https://developers.cloudflare.com/workers/ci-cd/builds/
- https://developers.cloudflare.com/workers/static-assets/routing/advanced/serving-a-subdirectory/
- https://developers.cloudflare.com/workers/static-assets/redirects/
- https://developers.cloudflare.com/workers/configuration/routing/routes/
