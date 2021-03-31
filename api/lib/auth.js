export const oauthEndpoint = `https://id.getharvest.com/oauth2/authorize?client_id=${process.env.HARVEST_CLIENT_ID}&response_type=code`;

export default {
  oauthEndpoint,
};
