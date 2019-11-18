const { handleError } = require('../lib');
const { getBalance } = require('../lib/balance');
const { getAccount } = require('../lib/account');

module.exports = async (req, res) => {
  const { startDate, includeToday } = req.query;
  const token = req.headers.harvest_token;

  const { id: userId } = await getAccount(token);

  getBalance(token, {
    userId,
    startDate,
    includeToday: includeToday === 'true',
  })
    .then(report => {
      res.json(report);
    })
    .catch(err => {
      console.error(err);
      handleError(err, res);
    });
};
