import React from "react";
import { View, StyleSheet, Text } from "react-native";
const Spacer = ({ children }) => {
  return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    borderWidth: 4,
    borderColor: "red",
  },
});
export default Spacer;
