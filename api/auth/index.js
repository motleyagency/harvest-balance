import { oauthEndpoint } from '../lib/auth';

module.exports = (req, res) => {
  res.json({
    url: oauthEndpoint,
  });
};
