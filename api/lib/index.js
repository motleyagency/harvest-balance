const fetch = require('node-fetch');

const handleError = (err, res) => {
  if (err instanceof Error) {
    res.status(500).json({ error: err.name, error_description: err.message });
    return;
  }

  if (['invalid_token', 'invalid_grant'].includes(err.error)) {
    res.status(401).json(err);
    return;
  }

  res.status(500).json(err);
};

const getToken = (code, scope) =>
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

const getAccount = (token, ...opts) =>
  fetch('https://api.harvestapp.com/v2/users/me', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'Harvest-Account-Id': process.env.HARVEST_ACCOUNT_ID,
      'User-Agent': 'Harvest Balance (fredrik.bostrom@motley.fi)',
    },
  }).then(response => response.json());

module.exports = {
  handleError,
  getToken,
  getAccount,
};
