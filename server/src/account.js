import fetch from 'node-fetch';
import cached from './cached';

const CACHE_KEY = 'account_get';

export const get = (token, ...opts) => {
  const fetchMe = () =>
    fetch('https://api.harvestapp.com/v2/users/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'Harvest-Account-Id': process.env.HARVEST_ACCOUNT_ID,
        'User-Agent': 'Harvest Balance (fredrik.bostrom@motley.fi)',
      },
    }).then(response => response.json());

  const getCached = cached(fetchMe, `${CACHE_KEY}_${token}`);

  return getCached(...opts);
};

export default {
  get,
};
