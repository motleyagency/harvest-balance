module.exports = (req, res) => {
  res.json({
    url: `https://id.getharvest.com/oauth2/authorize?client_id=${
      process.env.HARVEST_CLIENT_ID
    }&response_type=code`,
  });
};
