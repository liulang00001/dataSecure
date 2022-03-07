import { getName } from '@/utils/user';

const KEY_USER_CONFIG = 'uc';
const KEY_GLOBAL_CONFIG = 'gc';

function setConfig(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getConfig(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (err) {
    console.log('Error getConfig(' + key + ')', err);
    return null;
  }
}

function removeConfig(key) {
  localStorage.removeItem(key);
}

function getUserIdentity() {
  return getName();
}

/**
 * save config for current user. saved in local storage.
 *
 * @export
 * @param {*} key
 * @param {*} value
 * @returns
 */
export function setUserConfig(key, value) {
  if (!key) { return; }

  const userIdentity = getUserIdentity();
  let config = getConfig(KEY_USER_CONFIG);
  config = config || {};
  config[userIdentity] = config[userIdentity] || {};
  config[userIdentity][key] = value;

  setConfig(KEY_USER_CONFIG, config);
}

/**
 * get current user's config by key.
 *
 * @export
 * @param {*} key
 * @returns null - if not such config.
 * @returns all current user's config, if(!key)
 * @returns value of this key, if(key)
 */
export function getUserConfig(key) {
  const allUsersConfig = getConfig(KEY_USER_CONFIG);
  if (!allUsersConfig) { return null; }

  const myConfig = allUsersConfig[getUserIdentity()];
  if (!myConfig) { return null; }

  return key ? myConfig[key] : myConfig;
}

/**
 * remove current user's config by key.
 * nothing will do, if(!key)
 *
 * @export
 * @param {*} key
 * @returns
 */
export function removeUserConfig(key) {
  if (!key) { return; }
  setUserConfig(key, null);
}

/**
 * clear current user's config.
 *
 * @export
 */
export function clearCurrentUserConfig() {
  const userIdentity = getUserIdentity();
  let config = getConfig(KEY_USER_CONFIG);
  config = config || {};
  config[userIdentity] = null;

  setConfig(KEY_USER_CONFIG, config);
}

/**
 * clear all user's config.
 *
 * @export
 */
export function clearAllUserConfig() {
  removeConfig(KEY_USER_CONFIG);
}

/**
 * save config.
 *
 * @export
 * @param {*} key
 * @param {*} value
 * @returns
 */
export function setGlobalConfig(key, value) {
  if (!key) { return; }

  let config = getConfig(KEY_GLOBAL_CONFIG);
  config = config || {};
  config[key] = value;

  setConfig(KEY_GLOBAL_CONFIG, config);
}

/**
 * get config.
 *
 * @export
 * @param {*} key
 * @returns null - if not such config.
 * @returns all global config, if(!key)
 * @returns value of this key, if(key)
 */
export function getGlobalConfig(key) {
  const config = getConfig(KEY_GLOBAL_CONFIG);
  if (!config) { return null; }

  return key ? config[key] : config;
}

/**
 * remove config by key.
 *
 * @export
 * @param {*} key
 * @returns
 */
export function removeGlobalConfig(key) {
  if (!key) { return; }
  setGlobalConfig(key, null);
}

export function clearGlobalConfig() {
  removeConfig(KEY_GLOBAL_CONFIG);
}

export function clearAllConfig() {
  localStorage.clear();
}
