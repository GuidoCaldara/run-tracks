import firebase from "../firebase/Firebase";
import CreateDataContext from "./createDataContext";
import { AsyncStorage } from "react-native";

import * as Google from "expo-google-app-auth";
import {
  IOS_CLIENT_ID,
  ANDROID_CLIENT_ID,
  ANDROID_STANDALONE_ID,
} from "react-native-dotenv";

console.log(ANDROID_CLIENT_ID);
const authReducer = (state, action) => {
  switch (action.type) {
    case "set_current_user":
      let currentUser;
      if (action.payload) {
        currentUser = action.payload.providerData[0];
      } else {
        currentUser = false;
      }
      return {
        user: currentUser,
      };
    case "signout":
      return {
        user: false,
      };

    default:
      return state;
  }
};

const setCurrentUser = (dispatch) => {
  return async (user) => {
    await AsyncStorage.setItem("currentUser", JSON.stringify(user));
    dispatch({ type: "set_current_user", payload: user });
  };
};
const signout = (dispatch) => {
  return async (user) => {
    await AsyncStorage.removeItem("currentUser");
    dispatch({ type: "signout" });
  };
};

function isUserEqual(googleUser, firebaseUser) {
  if (firebaseUser) {
    var providerData = firebaseUser.providerData;
    for (var i = 0; i < providerData.length; i++) {
      if (
        providerData[i].providerId ===
          firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
        providerData[i].uid === googleUser.user.id
      ) {
        return true;
      }
    }
  }
  return false;
}

function onSignIn(googleUser) {
  var unsubscribe = firebase.auth().onAuthStateChanged(function (firebaseUser) {
    unsubscribe();
    if (!isUserEqual(googleUser, firebaseUser)) {
      var credential = firebase.auth.GoogleAuthProvider.credential(
        googleUser.idToken
      );
      firebase
        .auth()
        .signInWithCredential(credential)
        .catch(function (error) {
          var errorCode = error.code;
          var errorMessage = error.message;
          var email = error.email;
          var credential = error.credential;
          console.log("Errors", errorCode, errorMessage, email, credential);
        });
    } else {
      console.log("User already signed-in Firebase.");
    }
  });
}

const signIn = (dispatch) => {
  return async () => {
    try {
      const result = await Google.logInAsync({
        androidClientId: ANDROID_CLIENT_ID,
        iosClientId: IOS_CLIENT_ID,
        androidStandaloneAppClientId: ANDROID_STANDALONE_ID,
        scopes: ["profile", "email"],
      });

      if (result.type === "success") {
        console.log("here");
        onSignIn(result);
        dispatch({ type: "set_current_user", payload: null });
      } else {
        console.log("bad");
        return { cancelled: true };
      }
    } catch (e) {
      console.log(e);
      return { error: true };
    }
  };
};

export const { Provider, Context } = CreateDataContext(
  authReducer,
  { signIn, setCurrentUser, signout },
  { user: undefined }
);
