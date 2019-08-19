import fetch from 'node-fetch';

export const getToken = (code, scope) =>
  fetch('https://id.getharvest.com/api/v2/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Harvest Balance (fredrik.bostrom@motley.fi)',
    },
    body: JSON.stringify({
      code,
      scope,
      client_id: process.env.HARVEST_CLIENT_ID,
      client_secret: process.env.HARVEST_SECRET,
      grant_type: 'authorization_code',
    }),
  })
    .then(response => response.json())
    .then(response => {
      if (response.error) {
        throw response;
      }
      return response;
    });

export default {
  getToken,
};
