const PREFIX = "harvestBalance"

/**
 * A wrapper for localstorage (or sessionstorage), providing a
 * simplified API for the application. Basically abstracting away
 * JSON parsing/stringifying.
 *
 * @param  {Object} storage     The storage to use (browser's localstorage or sessionstorage)
 * @return {Object}             An object with get/set functions for reading and writing to
 *                              the storage.
 */
const Storage = storage => ({
  get(k, defaultValue) {
    try {
      return JSON.parse(storage.getItem(`${PREFIX}_${k}`)) || defaultValue
    } catch (e) {
      return null
    }
  },
  set(k, v) {
    storage.setItem(`${PREFIX}_${k}`, JSON.stringify(v))
    return v
  },
})

export default Storage
