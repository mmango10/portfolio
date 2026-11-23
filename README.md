# Dennis Frenkel — Media Portfolio

A photography, videography, and cinematography portfolio by Dennis Frenkel.

## Development

Use Node.js 22 or newer. Copy `.env.example` to `.env.local` to load public
Cloudinary images locally. Never put secrets in `VITE_` variables.

```sh
npm ci
npm run dev
```

`npm run build` regenerates `public/sitemap.xml` from `src/data.js` and creates
static HTML for home, film, and each collection in `dist/`. Each route gets
its own title, description, canonical URL, and crawlable text; React replaces
this initial HTML when JavaScript loads. Deploy the full `dist/` directory
with clean HTML URLs enabled. Run `npm test` after `npm run build` to check
the generated pages.

When Cloudinary is temporarily unavailable, visitors who previously loaded
the site see cached public media metadata for up to seven days. Otherwise,
collection pages show an availability message instead of claiming they are empty.
