import moment from 'moment';
import { setToken } from '../lib/firebase';
import { getAccount, getToken } from '../lib/account';

export default async (req, res) => {
  const { code, state: slackUserId } = req.query;
  const { access_token: accessToken, expires_in: expiresIn } = await getToken(
    code,
  );
  const { id: harvestUserId } = await getAccount(accessToken);

  const expires = moment()
    .add(expiresIn, 'seconds')
    .format();

  await setToken(slackUserId, { accessToken, harvestUserId, expires });

  res.send(`
    <html>
      <head>
        <script>
          function redirect() {
            window.location.assign('slack://open');
          }
        </script>
      </head>
      <body>
        <p>You're logged in! <button type="button" onclick="redirect();">Return to slack</button></p>
      </body>
    </html>
  `);
};
