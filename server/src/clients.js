import keyBy from 'lodash.keyby';
import { promisify } from 'util';
import cached from './cached';

const CACHE_KEY_LIST = 'clients_list';
const CACHE_KEY_LIST_BY_KEY = 'clients_list_by_key';

export const list = (harvestClient, ...opts) => {
  if (!harvestClient || !harvestClient.Account) {
    throw new Error('No or bad harvestClient supplied');
  }
  const Clients = harvestClient.Clients;
  const listAsync = promisify(Clients.list, { context: Clients });
  const listCached = cached(
    listAsync,
    `${CACHE_KEY_LIST}_${harvestClient.balanceAccessToken}`,
  );

  return listCached(...opts);
};

export const listByKey = (harvestClient, ...opts) => {
  const lbk = (...args) =>
    list(harvestClient, ...args).then(clients => keyBy(clients, 'client.id'));
  const cachedLbk = cached(
    lbk,
    `${CACHE_KEY_LIST_BY_KEY}_${harvestClient.balanceAccessToken}`,
  );

  return cachedLbk(...opts);
};

export default {
  list,
  listByKey,
};
