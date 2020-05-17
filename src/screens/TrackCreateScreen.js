import React, { useState, useEffect, useContext } from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  Text,
  Platform,
  AsyncStorage,
  AppState,
  Image,
  TouchableOpacity,
} from "react-native";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { MaterialIcons } from "@expo/vector-icons";

import Map from "../compoonents/map/Map";
import Timer from "../compoonents/Timer";
import ActionButton from "../compoonents/map/ActionButton";
const haversine = require("haversine");
import { Context as TimerContext } from "../context/TimerContext";
import * as BackgroundFetch from "expo-background-fetch";
import GpsStatus from "../compoonents/GpsStatus";
import { speedToPace } from "../utils/speedToPace";
import { secondsToTime } from "../utils/secondsToTime";
let routeArray = [];
const routeDistance = 0;
const BACKGROUND_LOCATION = "background-location-task";
let setLiveDataFn = (data) => data;
let setTrackRouteFn = (data) => data;
let setLastSegmentFn = (data) => data;

const TrackCreateScreen = ({ route, navigation }) => {
  const [distance, setDistance] = useState(0);
  const [Km, setKm] = useState(1);
  const [KmSegments, setKmSegments] = useState([]);
  const [KmStartedAt, setKmStartedAt] = useState(null);
  const [altitudeProfile, setAltitudeProfile] = useState([]);
  const [altitude, setAltitude] = useState(null);
  const [lastSegment, setLastSegment] = useState(0);
  const [liveData, setLiveData] = useState({});
  const [mapCenter, setMapCenter] = useState(null);
  const [startedAt, setStartedAt] = useState(null);
  const [currentSpeed, setCurrentSpeed] = useState();
  const [accuracy, setAccuracy] = useState(20);
  const [trackRoute, setTrackRoute] = useState([]);
  const [recording, setRecording] = useState("off");
  const [clockInterval, setClockInterval] = useState(null);
  const [clockActive, setClockActive] = useState(false);
  const [map, setMap] = useState(null);
  setLiveDataFn = setLiveData;
  setTrackRouteFn = setTrackRoute;
  setLastSegmentFn = setLastSegment;
  const { addSecond, resetTimer, reStartTimer } = useContext(TimerContext);
  const { duration } = useContext(TimerContext).state;
  const resetDatas = () => {
    routeArray = [];
    setAltitudeProfile([]);
    setTrackRoute([]);
    setDistance(0);
    resetTimer();
    setKmSegments([]);
    setKm(1);
    setLastSegment(0);
    setStartedAt(0);
  };

  //reomve the bottom bar when navigation is on
  useEffect(() => {
    navigation.setOptions({
      tabBarVisible: recording === "off",
    });
  }, [recording]);

  //Save the route when the user wants to close it
  const storeAsyncRoute = async () => {
    await AsyncStorage.multiSet(
      [
        ["route", JSON.stringify(trackRoute)],
        ["distance", distance.toString()],
        ["duration", duration.toString()],
        ["date", startedAt.toString()],
        ["kmPartials", JSON.stringify(KmSegments)],
        ["unsavedTrack", "true"],
      ],
      () => {
        navigation.navigate("EndTrack", {
          screen: "EndTrack",
          activity: { distance, duration, path: trackRoute },
        });
      }
    );
  };

  //Listen to the app state changes -Foreground/Background
  useEffect(() => {
    AppState.addEventListener("change", handleAppStateChange);
  }, []);

  const handleAppStateChange = async (state) => {
    if ((await AsyncStorage.getItem("recording")) !== "off") {
      if (state === "active") {
        await AsyncStorage.setItem("appActive", "true");
        const backgroundAt = parseInt(
          await AsyncStorage.getItem("backgroundAt")
        );
        const timeInBackground = Math.floor(Date.now() / 1000) - backgroundAt;
        reStartTimer(timeInBackground);
      } else {
        await AsyncStorage.setItem("appActive", "false");
        await AsyncStorage.setItem(
          "backgroundAt",
          Math.floor(Date.now() / 1000).toString()
        );
      }
    } else {
      if (state === "active") {
        startGpsTracker();
      } else {
        await Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION);
      }
    }
  };

  //Start listening User Location - No recording
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      startGpsTracker();
      if (route.params && route.params.resetRecording) {
        await resetDatas();
      }
    });
    return unsubscribe;
  }, [navigation]);

  //Update state based on the location info from the background worker
  useEffect(() => {
    const { latitude, longitude, accuracy, speed, altitude } = liveData;
    console.log(altitude);
    setAltitude(altitude);
    setCurrentSpeed(speedToPace(speed));
    setAccuracy(accuracy);
    if (latitude) {
      setMapCenter({ latitude, longitude });
    }
  }, [liveData]);

  //every time the distance goes up, calculate the pace/km
  useEffect(() => {
    const newDistance = distance + lastSegment;
    const deltaDistance = newDistance - distance;
    console.log(deltaDistance);
    setDistance(newDistance);
    if (deltaDistance > 0.002) {
      const newProfile = [newDistance, altitude];
      setAltitudeProfile((altitudeProfile) => [...altitudeProfile, newProfile]);
    }
    if (newDistance > Km) {
      const kmDuration = Math.floor(Date.now() / 1000) - KmStartedAt;
      setKmStartedAt(Math.floor(Date.now() / 1000));
      setKm(Km + 1);
      setKmSegments((KmSegments) => KmSegments.concat(kmDuration));
    }
  }, [lastSegment]);

  //Function Started automatically on compoonent mount
  const startGpsTracker = async () => {
    if ((await AsyncStorage.getItem("unsavedTrack")) === "true") {
      navigation.navigate("EndTrack", {
        screen: "EndTrack",
      });
    }
    const { status } = await Location.requestPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access location was denied");
    } else {
      let location = await Location.getCurrentPositionAsync({});
      await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION, {
        accuracy: Location.Accuracy.BestForNavigation,
        showsBackgroundLocationIndicator: true,
        deferredUpdatesDistance: 2,
        timeInterval: 2000,
        foregroundService: {
          notificationTitle: "RunTrack is Recording!",
          notificationBody: `Distance: ${distance}km`,
        },
      });
      const { latitude, longitude } = location.coords;
      setMapCenter({
        latitude,
        longitude,
      });
    }
  };

  //Timer Management Functions
  const startClock = () => {
    setClockInterval(
      setInterval(async () => {
        addSecond();
      }, 1000)
    );
    setClockActive(true);
  };

  const stopClock = () => {
    clearInterval(clockInterval);
    setClockActive(false);
  };

  const changePause = () => {
    if (clockActive) {
      stopClock();
    } else {
      startClock();
    }
  };

  //Start to record a new track. It reset all the states
  const startRecording = async () => {
    console.log("a");
    resetDatas();
    console.log("b");
    setRecording("on");
    setStartedAt(Math.floor(Date.now() / 1000));
    setKmStartedAt(Math.floor(Date.now() / 1000));
    startClock();
    await AsyncStorage.setItem("recording", "on");
  };

  const pauseRecording = async () => {
    setRecording("pause");
    changePause();
    await AsyncStorage.setItem("recording", "pause");
  };

  const resumeRecording = async () => {
    setRecording("on");
    changePause();
    await AsyncStorage.setItem("recording", "on");
  };

  const endRecording = async () => {
    await AsyncStorage.setItem("recording", "off");
    await Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION);
    setRecording("off");
    stopClock();
    storeAsyncRoute();
  };

  const setMapRef = (map) => {
    setMap(map);
  };

  const timer = secondsToTime(duration);
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#282C34", paddingTop: 20 }}
    >
      <GpsStatus accuracy={accuracy} />
      <View
        style={{ ...styles.actionButton, bottom: recording == "on" ? 100 : 70 }}
      >
        <ActionButton
          recording={recording}
          pauseRecording={pauseRecording}
          startRecording={startRecording}
          resumeRecording={resumeRecording}
          endRecording={endRecording}
        />
      </View>
      <View style={styles.runDetailsContainer}>
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={require("../../assets/logo.png")}
          ></Image>
        </View>

        <View style={styles.timerContainer}>
          <Timer duration={timer} />
          <Text style={styles.timerContainerTitle}>Duration</Text>
        </View>
        <View style={styles.runInfoBox}>
          <View style={styles.runInfoBoxNumber}>
            <Text style={styles.runInfoBoxText}>
              {distance === 0 ? "0.00" : distance.toFixed(2)}
            </Text>
            <Text
              style={{
                ...styles.runInfoBoxText,
                ...styles.runInfoBoxTextSmall,
              }}
            >
              Km
            </Text>
          </View>
          <View style={styles.runInfoBoxNumber}>
            <Text style={styles.runInfoBoxText}>{currentSpeed}</Text>
            <Text
              style={{
                ...styles.runInfoBoxText,
                ...styles.runInfoBoxTextSmall,
              }}
            >
              min/km
            </Text>
          </View>
        </View>
      </View>
      {Platform.OS === "ios" ? (
        <TouchableOpacity
          onPress={() => {
            map.animateToRegion(
              {
                ...mapCenter,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
              },
              500
            );
          }}
          style={styles.centerMapBtn}
        >
          <MaterialIcons name="gps-fixed" size={36} color="#05C6FF" />
        </TouchableOpacity>
      ) : null}
      {mapCenter ? (
        <Map
          setMapRef={setMapRef}
          center={mapCenter}
          length={trackRoute.length}
          trackRoute={trackRoute}
        />
      ) : null}
    </SafeAreaView>
  );
};

TaskManager.defineTask(BACKGROUND_LOCATION, async ({ data, error }) => {
  const recording = await AsyncStorage.getItem("recording");
  const { latitude, longitude, speed, accuracy, altitude } = {
    ...data.locations[0].coords,
  };
  setLiveDataFn({ latitude, longitude, accuracy, speed, altitude });
  if (recording === "on") {
    routeArray = [...routeArray, { latitude, longitude }];
    setTrackRouteFn(routeArray);
    if (routeArray.length > 1) {
      const last = routeArray[routeArray.length - 1];
      const secondLast = routeArray[routeArray.length - 2];
      const lastSegment = haversine(last, secondLast) || 0;
      const newDistance = routeDistance + lastSegment;
      setLastSegmentFn(newDistance);
    }
  }
});

const styles = StyleSheet.create({
  timerContainer: {
    display: "flex",
    alignItems: "center",
  },
  timerContainerTitle: {
    color: "white",
    fontFamily: "Muli-Medium",
    opacity: 0.7,
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
  },
  logo: {
    width: 30,
    height: 30,
  },
  runDetailsContainer: {
    height: 250,
    backgroundColor: "#282C34",
    display: "flex",
    justifyContent: "space-around",
    paddingVertical: 18,
  },
  runInfoBox: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  runInfoBoxNumber: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Muli-ExtraBold",
  },
  runInfoBoxText: {
    fontSize: 60,
    fontFamily: "Muli-Bold",
    color: "#05C6FF",
    fontWeight: "500",
  },
  runInfoBoxTextSmall: {
    opacity: 0.6,
    fontSize: 16,
    fontWeight: "normal",
    fontFamily: "Muli-Medium",
  },
  actionButton: {
    position: "absolute",
    fontFamily: "Muli-Medium",
    bottom: 40,
    width: "90%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    left: "5%",
    zIndex: 10,
  },
  centerMapBtn: {
    position: "absolute",
    backgroundColor: "white",
    borderColor: "#05C6FF",
    borderWidth: 1,
    padding: 5,
    borderRadius: 10,
    top: 330,
    zIndex: 999,
    right: 20,
  },
});
export default TrackCreateScreen;
