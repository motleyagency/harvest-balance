import express from 'express';
import path from 'path';
import { getToken } from './auth';
import { get as getReport } from './report';
import { get as getAccount } from './account';

require('dotenv-extended').load();

const app = express();
// const ROOT_FOLDER = path.resolve(__dirname, '..', 'dist');
const PORT = process.env.SERVER_PORT || 5000;

const handleError = (err, res) => {
  if (err instanceof Error) {
    res.status(500).json({ error: err.name, error_description: err.message });
  }

  if (['invalid_token', 'invalid_grant'].includes(err.error)) {
    res.status(401).json(err);
  } else {
    res.status(500).json(err);
  }
};

app.get('/api/auth', (req, res) => {
  res.json({
    url: `https://id.getharvest.com/oauth2/authorize?client_id=${process.env.HARVEST_CLIENT_ID}&response_type=code`,
  });
});

app.get('/api/oauth-success', (req, res) => {
  const { code, scope } = req.query;

  getToken(code, scope)
    .then(response => {
      res.json({
        harvest_token: response.access_token,
        expires_in: response.expires_in,
      });
    })
    .catch(err => {
      console.error(err);
      handleError(err, res);
    });
});

app.get('/api/account', (req, res) => {
  const token = req.get('harvest_token');

  getAccount(token, {})
    .then(account => {
      res.json(account);
    })
    .catch(err => {
      console.error(err);
      handleError(err, res);
    });
});

app.get('/api/balance', (req, res) => {
  const { startDate, includeToday } = req.query;
  const token = req.get('harvest_token');

  getReport(token, { startDate, includeToday: includeToday === 'true' })
    .then(report => {
      res.json(report);
    })
    .catch(err => {
      console.error(err);
      handleError(err, res);
    });
});

// all other requests gets forwarded to react
// app.use('/', express.static(ROOT_FOLDER));

app.use((req, res) => {
  res.status(404).json({ error: 'Unknown request' });
  // res.sendFile('index.html', { root: ROOT_FOLDER });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Harvest Balance app running on port ${PORT}!`);
});
