const storage = window.localStorage;
const PREFIX = 'harvestBalance';

export const storageTokenKey = 'harvest_token';
export const storageUserKey = 'harvest_user';
export const storageDateKey = 'harvest_start_date';

/**
 * A wrapper for localstorage providing a
 * simplified API for the application.
 * Basically abstracting away
 * JSON parsing/stringifying.
 *
 * @exports {Object}             An object with get/set functions for reading and writing to
 *                               the storage.
 */
export default {
  get(k, defaultValue) {
    try {
      return JSON.parse(storage.getItem(`${PREFIX}_${k}`)) || defaultValue;
    } catch (e) {
      return null;
    }
  },
  set(k, v) {
    storage.setItem(`${PREFIX}_${k}`, JSON.stringify(v));
    return v;
  },
};
