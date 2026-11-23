import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { about, collectionDefinitions, filmArchive, site } from '../src/data.js';
import { filmVideos } from '../src/videoData.js';

const root = fileURLToPath(new URL('..', import.meta.url));
const origin = 'https://dennisfrenkel.com';
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[character]);
const collectionLinks = collectionDefinitions.map(({ id, label, descriptor }) => (
  `<li><a href="/collections/${encodeURIComponent(id)}">${escapeHtml(label)}</a> — ${escapeHtml(descriptor)}</li>`
)).join('');
const navigation = site.nav.map(({ id, label }) => {
  const href = id === 'home' ? '/' : id === 'about' ? '/#about' : `/${id}`;
  return `<a href="${href}">${escapeHtml(label)}</a>`;
}).join('');

const pages = [
  {
    path: '/',
    title: `${site.name} — Media Portfolio`,
    description: `Photography, videography, and cinematography by ${site.name} in ${site.location}.`,
    heading: site.name,
    content: `<p>${escapeHtml(site.intro)}</p><p>${escapeHtml(about.text)}</p><h2>Collections</h2><ul class="prerender-links">${collectionLinks}</ul><p><a href="/film">View film work</a></p>`,
  },
  {
    path: '/collections',
    title: `Collections — ${site.name}`,
    description: `Travel and sports photography collections by ${site.name}. Browse trips, events, and stories.`,
    heading: 'Collections',
    content: `<p>Trips / events / stories</p><ul class="prerender-links">${collectionLinks}</ul>`,
  },
  {
    path: '/film',
    title: `${filmArchive.label} — ${site.name}`,
    description: `Films, documentaries, and event videos by ${site.name}.`,
    heading: filmArchive.label,
    content: `<p>${escapeHtml(filmArchive.descriptor)}</p><ul class="prerender-links">${filmVideos.map((video) => {
      const href = video.youtubeUrl || video.instagramUrl || video.googleDriveUrl;
      return `<li><a href="${escapeHtml(href)}">${escapeHtml(video.title)}</a> — ${escapeHtml(video.description)}</li>`;
    }).join('')}</ul>`,
  },
  ...collectionDefinitions.map((collection) => ({
    path: `/collections/${encodeURIComponent(collection.id)}`,
    title: `${collection.label} — ${site.name}`,
    description: `${collection.descriptor} photography by ${site.name}. Explore the ${collection.label} collection.`,
    heading: collection.label,
    content: `<p>${escapeHtml(collection.descriptor)} photography by ${escapeHtml(site.name)}.</p><p><a href="/collections">Browse all collections</a></p>`,
  })),
];

function sitemap() {
  // No lastmod: build time does not prove content changed, and Cloudinary media can change independently.
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map(({ path }) => `  <url><loc>${escapeHtml(origin + path)}</loc></url>`).join('\n')}\n</urlset>\n`;
}

function renderPage(template, page) {
  const url = origin + page.path;
  const body = `<div class="app-shell">
      <a class="skip-link" href="#main-content">Skip to content</a>
      <header class="top-nav">
        <a class="top-nav__brand" href="/">${escapeHtml(site.name)}</a>
        <span class="top-nav__meta">${escapeHtml(site.location)} / ${escapeHtml(site.year)}</span>
        <nav class="top-nav__links" aria-label="Portfolio sections">${navigation}</nav>
      </header>
      <main class="archive-page prerender-page" id="main-content">
        <div class="section-heading archive-page__heading"><h1>${escapeHtml(page.heading)}</h1></div>
        ${page.content}
      </main>
      <footer class="footer"><div class="footer__top">${escapeHtml(site.name)}</div></footer>
    </div>`;
  const metadata = [
    `<link rel="canonical" href="${escapeHtml(url)}" />`,
    '<meta property="og:type" content="website" />',
    `<meta property="og:title" content="${escapeHtml(page.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(page.description)}" />`,
    `<meta property="og:url" content="${escapeHtml(url)}" />`,
    '<meta name="twitter:card" content="summary" />',
  ].join('\n    ');

  return template
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${escapeHtml(page.description)}" />`)
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(page.title)}</title>`)
    .replace('  </head>', `    ${metadata}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`);
}

if (process.argv[2] === 'sitemap') {
  await writeFile(join(root, 'public/sitemap.xml'), sitemap());
} else if (process.argv[2] === 'pages') {
  const dist = join(root, 'dist');
  const template = await readFile(join(dist, 'index.html'), 'utf8');
  for (const page of pages) {
    const filenames = page.path === '/'
      ? [join(dist, 'index.html')]
      : [join(dist, `${page.path.slice(1)}.html`), join(dist, page.path.slice(1), 'index.html')];
    for (const filename of filenames) {
      await mkdir(dirname(filename), { recursive: true });
      await writeFile(filename, renderPage(template, page));
    }
  }
} else {
  throw new Error('Expected sitemap or pages');
}
