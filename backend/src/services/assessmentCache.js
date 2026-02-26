const cache = new Map();
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

export function getCacheKey(userId, domain, level) {
  return `${userId}:${domain}:${level}`;
}

export function getCached(userId, domain, level) {
  const key = getCacheKey(userId, domain, level);
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  console.log(`[CACHE_HIT] key=${key}`);
  return entry.data;
}

export function setCached(userId, domain, level, data) {
  const key = getCacheKey(userId, domain, level);
  cache.set(key, { data, ts: Date.now() });
  console.log(`[CACHE_SET] key=${key}`);
}
