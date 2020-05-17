import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  ActivityIndicator,
} from "react-native";
const LoadingScreen = ({ navigation }) => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#282C34",
      }}
    >
      <ActivityIndicator size="large" color="#05C6FF" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});
export default LoadingScreen;
