import storage, { storageTokenKey } from './storage';

const BACKEND_ENDPOINT = '/api';

const jsonHeaders = () => {
  console.log(storage.get(storageTokenKey));
  return new Headers({
    'Content-Type': 'application/json',
    harvest_token: storage.get(storageTokenKey),
  });
};

const errorChecker = response => {
  if (response.status >= 400 && response.status < 600) {
    throw response;
  }
  return response;
};

export const getAuthUrl = () =>
  fetch(`${BACKEND_ENDPOINT}/auth`, {
    headers: jsonHeaders(),
  })
    .then(errorChecker)
    .then(res => res.json());

export const handleAuth = (authCode, scope) =>
  fetch(`${BACKEND_ENDPOINT}/oauth-success?code=${authCode}&scope=${scope}`, {
    headers: jsonHeaders(),
  })
    .then(errorChecker)
    .then(res => res.json());

export const account = () =>
  fetch(`${BACKEND_ENDPOINT}/account`, {
    headers: jsonHeaders(),
  })
    .then(errorChecker)
    .then(res => res.json());

export const balanceReport = startDate =>
  fetch(`${BACKEND_ENDPOINT}/balance?startDate=${startDate}`, {
    headers: jsonHeaders(),
  })
    .then(errorChecker)
    .then(res => res.json());

export default {
  getAuthUrl,
  handleAuth,
  account,
  balanceReport,
};
