import { Cacheable, type CacheableOptions } from "cacheable";
import "./metrics";

const GLOBAL_CACHE_TTL = "5m";

/**
 * Initialize cache with Redis as secondary storage if available
 * Falls back to in-memory cache if Redis is not available
 */
async function initializeCache(): Promise<Cacheable> {
  const cacheOptions: CacheableOptions = {
    ttl: GLOBAL_CACHE_TTL,
  };

  return new Cacheable(cacheOptions);
}

// Initialize cache instance
const cache = await initializeCache();

export default cache;