import * as firebase from "firebase";
import "firebase/firestore";

require("firebase/auth");
import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_DB_URL,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESS_SENDER,
} from "react-native-dotenv";

var firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  databaseURL: FIREBASE_DB_URL,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESS_SENDER,
};

console.log(firebaseConfig);
firebase.initializeApp(firebaseConfig);
const auth = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig).auth()
  : firebase.app().auth();
const db = !firebase.apps.length
  ? firebase.initializeApp(config).firestore()
  : firebase.app().firestore();

export { auth, db };

// firebase.initializeApp(firebaseConfig);
// export const auth = firebase.auth();
// const database = !firebase.apps.length
//   ? firebase.initializeApp(firebaseConfig).firestore()
//   : firebase.app().firestore();
//
export const signOut = () => auth.signOut();
export default firebase;
