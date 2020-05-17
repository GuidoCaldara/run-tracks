import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
const Tab = createBottomTabNavigator();
import TrackListScreen from "../screens/TrackListScreen";
import TrackCreateScreen from "../screens/TrackCreateScreen";
import AccountScreen from "../screens/AccountScreen";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const TrackNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Create"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Create") {
            iconName = "run-fast";
          } else if (route.name === "List") {
            iconName = "history";
          } else if (route.name === "Account") {
            iconName = "face-profile";
          }
          return (
            <MaterialCommunityIcons name={iconName} size={24} color={color} />
          );
        },
      })}
      tabBarOptions={{
        activeTintColor: "#05C6FF",
        safeAreaInset: { bottom: "never", top: "never" },
      }}
    >
      <Tab.Screen
        options={{ headerShown: false }}
        name="Create"
        component={TrackCreateScreen}
        options={{
          tabBarLabel: "Run",
        }}
      />
      <Tab.Screen
        options={{ headerShown: false }}
        name="Account"
        component={AccountScreen}
      />
      <Tab.Screen
        options={{ headerShown: false }}
        name="List"
        component={TrackListScreen}
      />
    </Tab.Navigator>
  );
};

export default TrackNavigator;
