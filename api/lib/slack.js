import fetch from 'node-fetch';

export const respond = (responseUrl, body) =>
  fetch(responseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      response_type: 'ephemeral',
      ...body,
    }),
  });

export default {
  respond,
};
