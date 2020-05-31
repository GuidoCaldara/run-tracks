import { YellowBox } from "react-native";
YellowBox.ignoreWarnings(["Setting a timer"]);

import React, { useState, useContext, useEffect } from "react";
import { useFonts } from "@use-expo/font";
import { AppLoading } from "expo";
import { NavigationContainer } from "@react-navigation/native";
import { StyleSheet, Text, View } from "react-native";
import { Provider as AuthProvider } from "./src/context/AuthContext";
import { Provider as RouteProvider } from "./src/context/RouteContext";
import { Provider as TimerProvider } from "./src/context/TimerContext";
import { Provider as ActivityDetailsProvider } from "./src/context/ActivityDetailsContext";
import { MainNavigator } from "./src/navigators/Navigators";
import { navigationRef } from "./src/RootNavigation";
import { Context as AuthContext } from "./src/context/AuthContext";
import { Context as RouteContext } from "./src/context/RouteContext";
import { Context as ActivityDetailsContext } from "./src/context/ActivityDetailsContext";
import { Context as TrackingContext } from "./src/context/TrackingContext";
import firebase from "./src/firebase/Firebase";

export default function App() {
  let [fontsLoaded] = useFonts({
    "Muli-Medium": require("./assets/fonts/Muli-Medium.ttf"),
    "Muli-Bold": require("./assets/fonts/Muli-Bold.ttf"),
    "Muli-ExtraBold": require("./assets/fonts/Muli-ExtraBold.ttf"),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <AuthProvider value={AuthContext}>
        <RouteProvider value={RouteContext}>
          <TimerProvider>
            <ActivityDetailsProvider>
              <NavigationContainer ref={navigationRef}>
                <MainNavigator />
              </NavigationContainer>
            </ActivityDetailsProvider>
          </TimerProvider>
        </RouteProvider>
      </AuthProvider>
    );
  }
}
