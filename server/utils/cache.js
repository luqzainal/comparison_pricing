import { createClient } from 'redis';

let client = null;

// Initialize Redis client
async function initRedisClient() {
  if (!client) {
    client = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      socket: {
        connectTimeout: 5000,
        lazyConnect: true,
      }
    });

    client.on('error', (err) => {
      console.error('[CACHE] Redis Client Error:', err);
    });

    client.on('connect', () => {
      console.log('[CACHE] Redis connected successfully');
    });

    try {
      await client.connect();
    } catch (error) {
      console.error('[CACHE] Failed to connect to Redis:', error);
      client = null;
    }
  }
  return client;
}

// Get data from cache
export async function getCache(key) {
  try {
    const redisClient = await initRedisClient();
    if (!redisClient) return null;

    const data = await redisClient.get(key);
    if (data) {
      console.log(`[CACHE] Cache hit for key: ${key}`);
      return JSON.parse(data);
    }
    
    console.log(`[CACHE] Cache miss for key: ${key}`);
    return null;
  } catch (error) {
    console.error(`[CACHE] Error getting cache for key ${key}:`, error);
    return null;
  }
}

// Set data to cache with TTL (Time To Live)
export async function setCache(key, data, ttlSeconds = 300) {
  try {
    const redisClient = await initRedisClient();
    if (!redisClient) return false;

    await redisClient.setEx(key, ttlSeconds, JSON.stringify(data));
    console.log(`[CACHE] Cache set for key: ${key}, TTL: ${ttlSeconds}s`);
    return true;
  } catch (error) {
    console.error(`[CACHE] Error setting cache for key ${key}:`, error);
    return false;
  }
}

// Delete specific cache key
export async function deleteCache(key) {
  try {
    const redisClient = await initRedisClient();
    if (!redisClient) return false;

    await redisClient.del(key);
    console.log(`[CACHE] Cache deleted for key: ${key}`);
    return true;
  } catch (error) {
    console.error(`[CACHE] Error deleting cache for key ${key}:`, error);
    return false;
  }
}

// Clear all cache
export async function clearCache() {
  try {
    const redisClient = await initRedisClient();
    if (!redisClient) return false;

    await redisClient.flushAll();
    console.log('[CACHE] All cache cleared');
    return true;
  } catch (error) {
    console.error('[CACHE] Error clearing cache:', error);
    return false;
  }
} 