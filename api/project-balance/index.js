const { handleError } = require('../lib');
const { getProjectBalance } = require('../lib/projectBalance');

module.exports = (req, res) => {
  const { startDate, endDate, harvestUserId } = req.query;
  const token = req.headers.harvest_token;

  getProjectBalance(token, { startDate, endDate, harvestUserId })
    .then(report => {
      res.json(report);
    })
    .catch(err => {
      console.error(err);
      handleError(err, res);
    });
};
