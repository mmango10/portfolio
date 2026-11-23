import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { collectionDefinitions } from '../src/data.js';

const dist = new URL('../dist/', import.meta.url);

test('built collection routes expose unique metadata and crawlable content', async () => {
  const sitemap = await readFile(new URL('sitemap.xml', dist), 'utf8');
  const index = await readFile(new URL('collections.html', dist), 'utf8');
  assert.match(index, /<title>Collections — Dennis Frenkel<\/title>/);

  for (const collection of collectionDefinitions) {
    const path = `/collections/${collection.id}`;
    const html = await readFile(new URL(`collections/${collection.id}.html`, dist), 'utf8');
    assert.ok(html.includes(`<h1>${collection.label}</h1>`));
    assert.ok(html.includes(`<link rel="canonical" href="https://dennisfrenkel.com${path}" />`));
    assert.ok(html.includes(`content="${collection.label} — Dennis Frenkel"`));
    assert.ok(sitemap.includes(`<loc>https://dennisfrenkel.com${path}</loc>`));
  }
  assert.doesNotMatch(sitemap, /<lastmod>/);
});

test('built film and home pages contain crawlable text before JavaScript', async () => {
  const film = await readFile(new URL('film.html', dist), 'utf8');
  const home = await readFile(new URL('index.html', dist), 'utf8');
  assert.match(film, /Bells Books Documentary/);
  assert.match(home, /<h1>Dennis Frenkel<\/h1>/);
  assert.match(home, /href="\/collections\/tahoe-trip"/);
});
