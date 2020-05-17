import React, { useState, useEffect, useContext } from "react";
import { AppState, View, StyleSheet, Text, AsyncStorage } from "react-native";
import { Context as TimerContext } from "../context/TimerContext";
import { secondsToTime } from "../utils/secondsToTime";
const StopWatch = ({ recording }) => {
  const { next, reStartTimer } = useContext(TimerContext);
  const { seconds } = useContext(TimerContext).state;
  const [time, setTime] = useState(null);

  useEffect(() => {
    AppState.addEventListener("change", handleAppStateChange);
  }, []);
  useEffect(() => {
    startClock();
  }, [recording]);

  const handleAppStateChange = async (state) => {
    if (state === "active") {
      const isRunning = await AsyncStorage.getItem("running");
      if (isRunning === "true") {
        const timeNow = Math.floor(Date.now() / 1000);
        const backgroundStartedAt = await AsyncStorage.getItem("backGroundAt");
        const timePassed = timeNow - parseInt(backgroundStartedAt);
        reStartTimer(timePassed);
      }
    } else {
      const timeNow = Math.floor(Date.now() / 1000);
      await AsyncStorage.setItem("backGroundAt", timeNow.toString());
      await AsyncStorage.setItem("seconds", seconds.toString());
    }
  };

  const startClock = () => {
    if (recording === "on") {
      const incrementTime = setInterval(() => {
        next(seconds);
      }, 1000);
      return setTime(incrementTime);
    } else {
      return clearInterval(time);
      setTime(null);
    }
  };

  const timer = secondsToTime(seconds);
  return (
    <View style={styles.watchContainer}>
      <Text style={styles.watchNumber}>
        {timer[0].toString().padStart(2, "0")}:
      </Text>
      <Text style={styles.watchNumber}>
        {timer[1].toString().padStart(2, "0")}:
      </Text>
      <Text style={styles.watchNumber}>
        {timer[2].toString().padStart(2, "0")}
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
    paddingTop: 60,
    paddingBottom: 30,
  },
  watchNumber: {
    fontSize: 50,
    color: "white",
    fontWeight: "500",
    width: "20%",
  },
});
export default StopWatch;
