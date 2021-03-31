import firebase from 'firebase-admin';

if (!firebase.apps.length) {
  firebase.initializeApp({
    credential: firebase.credential.cert({
      type: 'service_account',
      project_id: 'harvest-balance',
      private_key_id: process.env.FIREBASE_PRIV_KEY_ID,
      private_key: process.env.FIREBASE_PRIV_KEY,
      client_email:
        'firebase-adminsdk-hz7v3@harvest-balance.iam.gserviceaccount.com',
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url:
        'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-hz7v3%40harvest-balance.iam.gserviceaccount.com',
    }),
  });
}

const db = firebase.firestore();

export const setToken = (slackUserId, data) =>
  db
    .collection('tokens')
    .doc(slackUserId)
    .set(data);

export const getToken = async slackUserId => {
  const tokenRef = db.collection('tokens').doc(slackUserId);
  const doc = await tokenRef.get();
  if (doc.exists) {
    return doc.data();
  }
  return undefined;
};
