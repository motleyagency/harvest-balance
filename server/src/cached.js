import cache from 'memory-cache';
import hash from 'object-hash';

const CACHE_TIMEOUT_MS = 60 * 60 * 1000; // 1 hour in ms

/**
 * Wrapper for making a cached async function. The function returns a function
 * that will call the passed function but with memory caching, i.e. if the value
 * is already present in the cache, then the function will not be called, instead
 * the cached value is returned as a resolved promise. If the value is not available
 * in the cache, then the function will be called and the response will be
 * cached.
 *
 * Works only for async functions that returns promises,
 * not with functions accepting callbacks.
 *
 * @param  {Function} fn      The function to call if no cached value is available.
 * @param  {String}   key     The cache key to use for storing/retrieving.
 * @param  {Number}   timeout The cache lifespan in milliseconds, defaults to 1 hour.
 * @return {Function}         A cache-enabled version of the passed function,
 *                            call it as you would call the original function.
 *
 * @example
 *
 * // Foo.getAccount is async and returns a promise
 * const cachedGetAccount = cahced(Foo.getAccount, 'accounts')
 * return cachedGetAccount(account_id).then(...)
 *
 */
const cached = (fn, key, timeout = CACHE_TIMEOUT_MS) => (...args) => {
  const compositeKey = `${key}_${hash(args)}`;

  const cachedValue = cache.get(compositeKey);
  if (cachedValue) {
    // console.log(`Hitting cache for ${compositeKey}`)
    return Promise.resolve(cachedValue);
  }

  return fn(...args).then(value => {
    // console.log(`Caching value for ${compositeKey}`)
    cache.put(compositeKey, value, timeout);
    return value;
  });
};

export default cached;
