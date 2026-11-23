import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { normalizeCloudinaryAsset } from '../src/cloudinary.js';
import { readCachedMedia, writeCachedMedia } from '../src/mediaCache.js';

afterEach(() => {
  delete globalThis.window;
});

test('cached media survives outages, but expires and respects empty successful lists', () => {
  const entries = new Map();
  globalThis.window = {
    localStorage: {
      getItem: (key) => entries.get(key) ?? null,
      setItem: (key, value) => entries.set(key, value),
    },
  };

  const resources = [{ public_id: 'trip/photo' }];
  writeCachedMedia('trip', resources, 1000);
  assert.deepEqual(readCachedMedia('trip', 1001), resources);
  assert.equal(readCachedMedia('trip', 1000 + 7 * 24 * 60 * 60 * 1000), null);
  writeCachedMedia('trip', [], 2000);
  assert.deepEqual(readCachedMedia('trip', 2001), []);
  entries.set('trip', '{broken');
  assert.equal(readCachedMedia('trip', 2001), null);
});

test('unavailable storage never blocks fresh media', () => {
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: {
      get localStorage() { throw new Error('Storage blocked'); },
    },
  });
  assert.doesNotThrow(() => writeCachedMedia('trip', [{ public_id: 'photo' }]));
  assert.equal(readCachedMedia('trip'), null);
});

test('Cloudinary metadata normalizes captions, dimensions and fallback text', () => {
  const item = normalizeCloudinaryAsset({
    asset_id: 'asset-1',
    public_id: 'trip/photo',
    width: 1600,
    height: 900,
    context: { custom: { title: 'Mountain sunrise', alt: 'Lake at dawn' } },
  }, { id: 'trip', label: 'Tahoe' }, 0);

  assert.equal(item.title, 'Mountain sunrise');
  assert.equal(item.alt, 'Lake at dawn');
  assert.equal(item.span, 8);
  assert.equal(item.ratio, '1600 / 900');
});
