const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function storage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function readCachedMedia(key, now = Date.now()) {
  try {
    const entry = JSON.parse(storage()?.getItem(key) || 'null');
    if (entry?.savedAt > 0 && now >= entry.savedAt && now - entry.savedAt < MAX_AGE_MS && Array.isArray(entry.resources)) {
      return entry.resources;
    }
  } catch {
    // Browsers can disable storage, or contain malformed older entries.
  }
  return null;
}

export function writeCachedMedia(key, resources, now = Date.now()) {
  try {
    storage()?.setItem(key, JSON.stringify({ savedAt: now, resources }));
  } catch {
    // A full or disabled cache should never prevent loading fresh media.
  }
}
