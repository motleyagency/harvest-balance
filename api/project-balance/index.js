const { handleError } = require('../lib');
const { getAccount } = require('../lib/account');
const { getProjectBalance } = require('../lib/projectBalance');

module.exports = async (req, res) => {
  const { startDate, endDate } = req.query;
  const token = req.headers.harvest_token;

  const { id: harvestUserId } = await getAccount(token);

  getProjectBalance(token, {
    startDate,
    endDate,
    harvestUserId,
  })
    .then(report => {
      res.json(report);
    })
    .catch(err => {
      console.error(err);
      handleError(err, res);
    });
};
