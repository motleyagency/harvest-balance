import moment from 'moment';
import { getProjectBalance } from '../lib/projectBalance';
import { getToken } from '../lib/firebase';
import { respond } from '../lib/slack';

export default async req => {
  const { command, user_id: userId, response_url: responseUrl } = req.body;

  try {
    const session = await getToken(userId);

    if (!session || moment().isAfter(session.expires)) {
      respond(responseUrl, {
        text: `Start by signing in using ${command} login`,
      });
      return;
    }

    const { accessToken, harvestUserId } = session;
    const startDate = moment()
      .locale('fi')
      .startOf('week');
    const endDate = moment()
      .locale('fi')
      .endOf('week');

    const { timeSummary } = await getProjectBalance(accessToken, {
      startDate: startDate.format('YYYY-MM-DD'),
      endDate: endDate.format('YYYY-MM-DD'),
      harvestUserId,
    });

    const sections = timeSummary.map(
      ({
        project_name: project,
        logged_hours: logged = 0,
        period_allocation_hours: allocated,
      }) => ({
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*${project}:*\n${Math.round(logged * 100) /
              100} hours logged of ${allocated} allocated (${Math.round(
              (logged / allocated) * 100,
            )}%).`,
          },
        ],
      }),
    );

    const response = {
      replace_original: true,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `Your weekly balance for this week`,
          },
        },
        ...sections,
        {
          type: 'divider',
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text:
                "Need some other week's balance? Try the <https://harvest-balance.motley.fi/projects|web version>.",
            },
          ],
        },
      ],
    };

    respond(responseUrl, response);
  } catch (e) {
    console.error(e);
    respond(responseUrl, {
      type: 'mrkdwn',
      text: `Sorry, I could not get your balance this time :cry:\n\n_${e}_`,
    });
  }
};
