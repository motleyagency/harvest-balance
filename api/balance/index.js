const { handleError } = require('../lib');
const { getBalance } = require('../lib/balance');
const { getAccount } = require('../lib/account');

module.exports = async (req, res) => {
  const { startDate, endDate } = req.query;
  const token = req.headers.harvest_token;

  const { id: userId } = await getAccount(token);

  getBalance(token, {
    userId,
    startDate,
    endDate,
  })
    .then(report => {
      res.json(report);
    })
    .catch(err => {
      console.error(err);
      handleError(err, res);
    });
};
