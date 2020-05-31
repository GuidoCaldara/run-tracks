import React, { useContext, useEffect } from "react";
import { AsyncStorage } from "react-native";
//screens
import TrackNavigator from "./TrackNavigator";
import TrackDetailsNavigator from "./TrackDetailsNavigator";
import EndTrackScreen from "../screens/EndTrackScreen";
import LandingScreen from "../screens/LandingScreen.js";
import SignInScreen from "../screens/SignInScreen.js";
import LoadingScreen from "../screens/LoadingScreen";
//Context
import { Context as ActivityDetailsContext } from "../context/ActivityDetailsContext";
import { Context as AuthContext } from "../context/AuthContext";
//utils
import firebase, { db } from "../firebase/Firebase";
import { createStackNavigator } from "@react-navigation/stack";
const Stack = createStackNavigator();
import { Provider as TrackingProvider } from "../context/TrackingContext";

const MainNavigator = () => {
  const { setCurrentUser } = useContext(AuthContext);
  const session = useContext(AuthContext).state;
  useEffect(() => {
    userStored().then((user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        firebase.auth().onAuthStateChanged(function (user) {
          if (user) {
            setCurrentUser(user);
          } else {
            setCurrentUser(false);
          }
        });
      }
    });
  }, []);

  const userStored = async () => {
    const user = await AsyncStorage.getItem("currentUser");
    return JSON.parse(user);
  };

  if (session.user && session.user.uid) {
    return (
      <TrackingProvider>
        <Stack.Navigator>
          <Stack.Screen
            options={{ headerShown: false }}
            name="List"
            component={TrackNavigator}
          />
          <Stack.Screen name="Details" component={TrackDetailsNavigator} />
          <Stack.Screen name="EndTrack" component={EndTrackScreen} />
        </Stack.Navigator>
      </TrackingProvider>
    );
  } else if (session.user == false) {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Home" component={LandingScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
      </Stack.Navigator>
    );
  } else if (session.user == undefined) {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Loading" component={LoadingScreen} />
      </Stack.Navigator>
    );
  }
};

export { MainNavigator };
