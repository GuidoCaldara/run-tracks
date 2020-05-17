import React from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import { View, StyleSheet, Text } from "react-native";
const GpsStatus = ({ accuracy }) => {
  return (
    <View style={styles.gpsStatusContainer}>
      <View
        style={{
          ...styles.gpsBar,
          ...(accuracy < 16
            ? { backgroundColor: "#19f709" }
            : { backgroundColor: "#f7091d" }),
        }}
      ></View>
      <View
        style={{
          ...styles.gpsBar,
          ...(accuracy < 11
            ? { backgroundColor: "#19f709" }
            : { backgroundColor: "#f7091d" }),
        }}
      ></View>
      <View
        style={{
          ...styles.gpsBar,
          ...(accuracy < 9
            ? { backgroundColor: "#19f709" }
            : { backgroundColor: "#f7091d" }),
        }}
      ></View>
      <FontAwesome5
        style={styles.icon}
        name="satellite-dish"
        size={10}
        color="white"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  gpsStatusContainer: {
    position: "absolute",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    top: 25,
    right: 14,
    paddingVertical: 20,
    zIndex: 100,
  },
  gpsBar: {
    height: 10,
    borderRadius: 12,
    width: 3,
    marginRight: 3,
    backgroundColor: "red",
    zIndex: 100,
  },
  icon: {
    marginLeft: 5,
  },
});
export default GpsStatus;
