import firebase from 'firebase-admin';
import serviceAccount from './harvest-balance-firebase-adminsdk-hz7v3-1dc4fb1154.json';

if (!firebase.apps.length) {
  firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
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
