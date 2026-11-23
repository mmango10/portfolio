# Security model — mmango10/portfolio

Written from the code; owner decisions are marked "(user)". Update this file when the architecture, hosting or trust assumptions change.

## System overview
A static React 19 site built with Vite (`index.html`, `src/main.jsx`). The build generates per-route HTML and a sitemap (`scripts/generate-site.mjs`); React replaces the static content when JavaScript loads. There is no backend, no API, no login, no forms and no stored user data. At runtime the browser:
- fetches public Cloudinary list JSON `https://res.cloudinary.com/iidtgaz3/image/list/<tag>.json` (`src/cloudinary.js`), and renders the titles, descriptions and alt text (`context.custom`) and image URLs built from `public_id`/`format`/`version`;
- caches successful public Cloudinary list responses in browser localStorage for seven days per tag (`src/mediaCache.js`), only to handle later request failures;
- embeds YouTube (`youtube-nocookie.com`) and Google Drive iframes and Instagram links built from URLs hard-coded in `src/videoData.js`;
- routes on `window.location.pathname` (`/`, `/collections`, `/collections/:id`, `/film`, `/about`), and only looks `:id` up against `collectionDefinitions` in `src/data.js`.

Hosting and response headers (CSP, HSTS, framing) are not in the repo; no infrastructure repository was found or provided.

## Components
| Component | Code |
|---|---|
| Web client | `src/main.jsx`, `src/styles.css`, `index.html`, `public/` |
| Media data | `src/cloudinary.js`, `src/data.js` |
| Video embeds | `src/videoData.js` |
| Build & dependencies | `package.json`, `package-lock.json`, `scripts/generate-site.mjs`, `.github/workflows/check.yml`, `.github/dependabot.yml`, `.env.example` |

## Trust boundaries and entry points
- **Visitor → site:** anyone on the internet; the only input is the URL path (and the `popstate` history). No accounts exist.
- **Cloudinary → site:** list JSON is fetched unauthenticated and rendered through React (auto-escaped text and attribute values). Whoever can upload or edit assets/metadata in the Cloudinary account controls this content.
- **Third-party embeds:** YouTube/Drive iframes with an `allow` list and `strict-origin-when-cross-origin` referrer; Instagram opens in a new tab with `rel="noreferrer"`. URLs come from source code, not runtime input.
- **Build/supply chain:** `package.json` pins every dependency to an exact version that matches `package-lock.json` (which records sha512 integrity hashes); builds use `npm ci`; optional `fsevents` install scripts are denied; CI checks build, generated pages, sitemap, tests and dependency advisories; Dependabot opens daily update PRs with a 7-day cooldown; PRs are merged by the owner.

## Assets
- Site integrity and the owner's reputation (no injected script, defacement or redirects to malicious sites).
- The Cloudinary account and its unpublished assets (the cloud name is public by design; no API key or secret is in the repo; `.env*` is gitignored).
- The build pipeline and dependency tree.

## Attacker profiles
- Anonymous internet visitor crafting URLs (no login exists — settled by the code).
- Supply-chain attacker publishing a malicious npm release.
- Someone with write access to the Cloudinary account (trust level not yet confirmed by the owner).

## Existing controls
- React escaping for all rendered strings; no `dangerouslySetInnerHTML`.
- Embed URLs rebuilt from parsed IDs with `encodeURIComponent` and fixed hostnames; Cloudinary `public_id` segments are URL-encoded.
- Exact dependency versions with a matching lockfile; `npm ci` installs only what the lockfile records and checks its hashes.
- Dependabot version updates with a 7-day cooldown.
- Public-only Cloudinary configuration (`VITE_` variables documented as never holding secrets).
- Expiring localStorage cache holds public media metadata only, not visitor information.

## Out of scope / accepted risk
- None stated by the owner yet.

## Open questions
- Where is the site hosted, and are security headers set there?
- Is Cloudinary content (tags, captions) only ever written by the owner?
- Which assets matter most; anything out of scope or accepted?
