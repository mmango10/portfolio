const cloudName = String(import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '').trim();

export const cloudinaryConfig = {
  cloudName,
  tags: {
    grandImage: 'grand_image',
  },
};

export function isCloudinaryConfigured() {
  return Boolean(cloudName);
}

export function cloudinaryListUrl(tag) {
  if (!cloudName) return '';
  return `https://res.cloudinary.com/${cloudName}/image/list/${encodeURIComponent(tag)}.json`;
}

function encodePublicId(publicId) {
  return publicId.split('/').map((segment) => encodeURIComponent(segment)).join('/');
}

function firstCustomValue(custom, keys) {
  for (const key of keys) {
    const value = custom[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }

  return Object.values(custom).find((value) => typeof value === 'string' && value.trim())?.trim() || '';
}

function fallbackName(publicId) {
  return publicId.split('/').pop()?.replace(/[-_]+/g, ' ') || 'Untitled image';
}

function shuffleAssets(items) {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled;
}

function spanForAspect(width, height, fallbackSpan = 6, fallbackRatio = '') {
  let aspect = width > 0 && height > 0 ? width / height : 0;

  if (!(aspect > 0) && fallbackRatio) {
    const [fallbackWidth, fallbackHeight] = String(fallbackRatio).split('/').map(Number);
    if (fallbackWidth > 0 && fallbackHeight > 0) aspect = fallbackWidth / fallbackHeight;
  }

  if (!(aspect > 0)) return fallbackSpan;
  if (aspect < 0.9) return 4;
  if (aspect > 1.25) return 8;
  return 6;
}

export function cloudinaryImageUrl(asset) {
  if (!cloudName || !asset?.public_id) return '';

  const version = asset.version ? `v${asset.version}/` : '';
  const extension = asset.format ? `.${asset.format}` : '';
  return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,c_limit,w_1800,h_1800/${version}${encodePublicId(asset.public_id)}${extension}`;
}

export function normalizeCloudinaryAsset(asset, section, index, fallbackItem = {}) {
  const custom = asset.context?.custom || {};
  const publicId = asset.public_id || asset.asset_id || `${section.id}-${index + 1}`;
  const title = firstCustomValue(custom, ['title', 'Title', 'caption', 'Caption', 'description', 'Description']) || asset.display_name || fallbackName(publicId);
  const description = firstCustomValue(custom, ['description', 'Description', 'caption', 'Caption']);
  const width = Number(asset.width);
  const height = Number(asset.height);

  return {
    id: `cloudinary-${asset.asset_id || publicId}`,
    title,
    description,
    meta: String(index + 1).padStart(2, '0'),
    ratio: width > 0 && height > 0 ? `${width} / ${height}` : fallbackItem.ratio || '4 / 3',
    span: spanForAspect(width, height, fallbackItem.span || 6, fallbackItem.ratio),
    color: fallbackItem.color || '#b8a18e',
    src: cloudinaryImageUrl(asset),
    alt: custom.alt || custom.Alt || description || `${title} — ${section.label}`,
    source: 'cloudinary',
  };
}

async function fetchTag(tag, signal) {
  const response = await fetch(cloudinaryListUrl(tag), { signal });
  if (!response.ok) {
    const error = new Error(`Cloudinary list request failed (${response.status})`);
    error.status = response.status;
    throw error;
  }

  const payload = await response.json();
  return Array.isArray(payload.resources) ? shuffleAssets(payload.resources) : [];
}

async function fetchTagGroup(tags, signal) {
  const tagResults = await Promise.all(
    tags.filter(Boolean).map(async (tag) => {
      try {
        return await fetchTag(tag, signal);
      } catch (error) {
        if (error.name === 'AbortError') throw error;
        console.warn(`Cloudinary tag "${tag}" unavailable; continuing with the other media tags.`, error);
        return null;
      }
    }),
  );

  // A null result means every request failed. An empty array means the tag
  // endpoint responded successfully but currently has no matching assets.
  if (!tagResults.some((result) => Array.isArray(result))) return null;

  const seen = new Set();
  return shuffleAssets(tagResults.flatMap((result) => result || []).filter((asset) => {
    const key = asset.asset_id || asset.public_id;
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  }));
}

export async function fetchCloudinarySections(signal) {
  const sectionEntries = await Promise.all(
    Object.entries(cloudinaryConfig.tags).map(async ([sectionId, configuredTags]) => {
      const tags = Array.isArray(configuredTags) ? configuredTags : [configuredTags];
      return [sectionId, await fetchTagGroup(tags, signal)];
    }),
  );

  return Object.fromEntries(sectionEntries);
}

export async function fetchCloudinaryCollections(collections, signal) {
  return Promise.all((collections || []).map(async (collection) => {
    try {
      return { ...collection, assets: await fetchTag(collection.tag, signal) };
    } catch (error) {
      if (error.name === 'AbortError') throw error;
      console.warn(`Cloudinary collection tag "${collection.tag}" unavailable.`, error);
      return { ...collection, assets: null };
    }
  }));
}
