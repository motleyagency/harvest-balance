const { getAccount, handleError } = require('../lib');

module.exports = (req, res) => {
  const token = req.headers['harvest_token'];

  getAccount(token, {})
    .then(account => {
      res.json(account);
    })
    .catch(err => {
      console.error(err);
      handleError(err, res);
    });
};
