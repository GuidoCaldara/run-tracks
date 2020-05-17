import React, { useState, useEffect, useContext } from "react";
import { AppState, View, StyleSheet, Text, AsyncStorage } from "react-native";
import { Context as TimerContext } from "../context/TimerContext";
import { secondsToTime } from "../utils/secondsToTime";

const Timer = ({ duration }) => {
  return (
    <View style={styles.watchContainer}>
      <Text style={styles.watchNumber}>
        {duration[0].toString().padStart(2, "0")}:
      </Text>
      <Text style={styles.watchNumber}>
        {duration[1].toString().padStart(2, "0")}:
      </Text>
      <Text style={styles.watchNumber}>
        {duration[2].toString().padStart(2, "0")}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  watchContainer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
  },
  watchNumber: {
    color: "white",
    fontWeight: "500",
    fontSize: 42,
    fontFamily: "Muli-Bold",
  },
});

export default Timer;
