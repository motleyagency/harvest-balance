const { handleError } = require('../lib');
const { getBalance } = require('../lib/balance');

module.exports = (req, res) => {
  const { startDate, includeToday } = req.query;
  const token = req.headers['harvest_token'];

  getBalance(token, { startDate, includeToday: includeToday === 'true' })
    .then(report => {
      res.json(report);
    })
    .catch(err => {
      console.error(err);
      handleError(err, res);
    });
};
