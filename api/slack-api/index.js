import fetch from 'node-fetch';
import { stripIndents } from 'common-tags';
import { oauthEndpoint } from '../lib/auth';
import { respond } from '../lib/slack';

function getUrl() {
  if (process.env.VERCEL_URL && process.env.VERCEL_ENV !== 'development') {
    return `https://${process.env.VERCEL_URL}`;
  }

  return 'http://localhost:3000';
}

async function waitInMilliseconds(ms) {
  return new Promise(yay => {
    setTimeout(() => yay(), ms);
  });
}

export default async (req, res) => {
  const timestamp = req.headers['X-Slack-Request-Timestamp'.toLowerCase()];
  const signature = req.headers['X-Slack-Signature'.toLowerCase()];
  const { text, command, user_id: userId } = req.body;

  const [action] = text.split(' ');

  switch (action) {
    case 'login':
      return res.json({
        response_type: 'ephemeral',
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `<${oauthEndpoint}&redirect_uri=${getUrl()}/api/slack-api/auth_success&state=${userId}|Click to login>`,
            },
          },
        ],
      });
    case 'w':
    case 'weekly': {
      const { response_url: responseUrl } = req.body;

      fetch(`${getUrl()}/api/slack-api/weekly`, {
        method: 'POST',
        body: JSON.stringify(req.body),
        headers: {
          'Content-Type': 'application/json',
          'X-Slack-Request-Timestamp': timestamp,
          'X-Slack-Signature': signature,
        },
      });

      await respond(responseUrl, {
        text: 'Calculating...',
      });

      await waitInMilliseconds(1000);

      return res.send();
    }
    default:
      return res.json({
        response_type: 'ephemeral',
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: 'Harvest Balance for Slack - Available Commands',
              emoji: true,
            },
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: stripIndents`
                ${command} *login*: Authorize Harvest Balance for Slack to read your logged hours\n
                ${command} *weekly* or *w*: Get your weekly balance for this week\n
                \n
                Need something else? Try the <https://harvest-balance.motley.fi/projects|web version>.
              `,
            },
          },
        ],
      });
  }
};
