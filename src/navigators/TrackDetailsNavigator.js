import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
const Tab = createBottomTabNavigator();
import { MaterialCommunityIcons } from "@expo/vector-icons";
import TrackDetailsScreen from "../screens/TrackDetailsScreen";
import TrackSplitScreen from "../screens/TrackSplitScreen";

export default () => {
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: "#05C6FF",
        safeAreaInset: { bottom: "never", top: "never" },
      }}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Details") {
            iconName = "map-search";
          } else if (route.name === "Splits") {
            iconName = "chart-histogram";
          }

          // You can return any component that you like here!
          return (
            <MaterialCommunityIcons name={iconName} size={24} color={color} />
          );
        },
      })}
      initialRouteKey="Details"
      initialRouteName="Details"
    >
      <Tab.Screen name="Details" component={TrackDetailsScreen} />
      <Tab.Screen
        options={{ headerShown: false }}
        name="Splits"
        component={TrackSplitScreen}
      />
    </Tab.Navigator>
  );
};
