import { Cacheable, type CacheableOptions } from "cacheable";

const GLOBAL_CACHE_TTL = "5m";

let faultyCache: Cacheable | null = null;

/**
 * Initialize cache with Redis as secondary storage if available
 * Falls back to in-memory cache if Redis is not available
 */
async function initializeCache(): Promise<Cacheable> {

  const cacheOptions: CacheableOptions = {
    ttl: GLOBAL_CACHE_TTL,
    stats: true,
  };

  return new Cacheable(cacheOptions);
}

// Initialize cache instance
if (!faultyCache) {
  faultyCache = await initializeCache();
}

setInterval(() => {
  console.log(JSON.stringify(faultyCache?.stats, null, 2));
  console.log(JSON.stringify(process.memoryUsage(), null, 2));
}, 1000);

console.log("Cache initialized");

export default faultyCache;