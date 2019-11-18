const fetch = require('node-fetch');

const getAccount = token =>
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
  getAccount,
};
