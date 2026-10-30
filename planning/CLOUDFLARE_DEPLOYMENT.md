# Cloudflare deployment

## First deployment

The game and regular portfolio use separate Cloudflare Workers with static assets. The game is published at https://portfolio.moudka.com/village/; the original workers.dev address remains available. The following describes the original deployment setup.

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

## Custom domain routing

The hostname uses a proxied AAAA record named portfolio with value 100:: and TTL Auto. This Cloudflare-documented placeholder supports Worker routes without a real origin; it replaces the old CNAME to mouadhb.pages.dev. Keep the record proxied. The portfolio Worker owns the route portfolio.moudka.com/*, while sleeping-village owns the more specific portfolio.moudka.com/village and portfolio.moudka.com/village/* routes. Both repositories record their routes in wrangler.jsonc so later deployments preserve the split. Other hostnames and DNS records are unchanged.

The portfolio's production build variable NEXT_PUBLIC_VILLAGE_URL is https://portfolio.moudka.com/village/, enabling its navigation and village card. Its public/_redirects also normalizes /village to /village/ while preserving the existing /cv redirect. This handles bare game links with query strings, which do not match the exact game route.

Do not attach the entire portfolio.moudka.com hostname to the village Worker. The / redirect in this package only affects requests reaching this Worker, so the path routes leave the regular homepage and project pages with the portfolio Worker. No Worker script, proxy layer, additional DNS record, or local package install is required.

## Verification of this preparation

- Production packaging succeeds with no changes to the game or dependency set.
- The packaged tree is served locally at the host root with /village/ as a real nested directory; npm run check:paths validates the production HTML, bundles, fonts, all 18 models and dependencies, and four screenshots (71 unique resources).
- Local preview does not emulate Cloudflare’s _redirects parser; live root redirects are checked after the first Cloudflare deployment.
- Temporary asset preview stopped after verification.

## Custom-domain verification (30 October 2026)

- Both repositories record their routes. The portfolio's production build setting NEXT_PUBLIC_VILLAGE_URL enables its header link, Now strip and village card. The initial verification used the existing proxied portfolio CNAME; the cleanup below subsequently removed that dependency.
- `npm run check:paths -- https://portfolio.moudka.com/` passes for all 80 game resources, including the 18 models and their dependencies, fonts, screenshots, favicon and recorded footsteps.
- `npm run check:domain` passes ten checks: portfolio homepage and village link, project and experience pages, shared content JSON/CORS, both bare village URL redirects (with and without a query string), the game entry and asset prefix, missing game assets, an unrelated portfolio path and the original CV redirect. Portfolio project/experience URLs use their canonical form without a trailing slash.
- Browser check: the homepage's Village link opens the game at /village/. Entering starts the real scene and loads all three footstep banks; a short walk moves the traveler and produces recorded footsteps, with no browser errors. Escape opens pause and Back to portfolio returns to the homepage.
- No local preview servers or new local dependencies were needed. The regular portfolio's dependency install/build ran on its existing Cloudflare pipeline.

## Old portfolio cleanup (30 October 2026)

- Replaced only portfolio.moudka.com's proxied CNAME to mouadhb.pages.dev with a proxied AAAA placeholder, 100:: (TTL Auto). The Cloudflare UI confirmed the replacement.
- Removed portfolio.moudka.com from the old mouadhb Pages project's custom domains. The project now has no custom domain, and the new sites no longer depend on its deployment.
- After these changes, all ten check:domain checks and all 80 check:paths resources passed on the custom domain. Both original workers.dev addresses also returned the correct applications. During the DNS change, an immediate probe briefly received the old Pages HTML; subsequent verification passed after Cloudflare applied the change.
- The old Pages project's permanent deletion is staged, awaiting the required final confirmation. It still serves mouadhb.pages.dev until deleted. Its GitHub repository, Cordoncharge83/dev-journey-archives, is retained.
- No local preview server was started and no packages were installed.

## Official documentation

- https://developers.cloudflare.com/workers/ci-cd/builds/
- https://developers.cloudflare.com/workers/static-assets/routing/advanced/serving-a-subdirectory/
- https://developers.cloudflare.com/workers/static-assets/redirects/
- https://developers.cloudflare.com/workers/configuration/routing/routes/
- https://developers.cloudflare.com/workers/best-practices/workers-best-practices/
- https://developers.cloudflare.com/pages/configuration/custom-domains/
