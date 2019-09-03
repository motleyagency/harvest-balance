const { getToken, handleError } = require('../lib');

module.exports = (req, res) => {
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
};
