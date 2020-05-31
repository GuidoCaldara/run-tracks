import React, { useState, useEffect, useContext } from "react";
import Constants from "expo-constants";
const statusBarHeight = Constants.statusBarHeight;
import SafeViewAndroid from "../style/GlobalSafeArea";
import Alert from "../compoonents/Alert";

import {
  AsyncStorage,
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  StatusBar,
} from "react-native";
import MapView, { AnimatedRegion, Marker, Polyline } from "react-native-maps";
import Timer from "../compoonents/Timer";
import { secondsToTime } from "../utils/secondsToTime";
import { speedToPace } from "../utils/speedToPace";
import { convertDate } from "../utils/utcToDate";
import { db } from "../firebase/Firebase";
import { Feather } from "@expo/vector-icons";
import { Context as AuthContext } from "../context/AuthContext";
import { Context as ActivityDetailsContext } from "../context/ActivityDetailsContext";
import { Context as TrackingContext } from "../context/TrackingContext";
import { Context as TimerContext } from "../context/TimerContext";

const EndTrackScreen = ({ navigation }) => {
  const user = useContext(AuthContext).state.user;
  const { addActivity } = useContext(ActivityDetailsContext);
  const [route, setRoute] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [date, setDate] = useState("");
  const [map, setMap] = useState();
  const [kmPartials, setKmPartials] = useState();
  const latitudeDelta = 0.01;
  const longitudeDelta = 0.01;
  const { resetTrack } = useContext(TrackingContext);
  const { resetTimer } = useContext(TimerContext);

  console.log(kmPartials);
  navigation.setOptions({
    headerShown: false,
  });
  useEffect(() => {
    loadInfo().then((route) => {
      setRoute(route[0]);
      setDistance(route[1]);
      setDuration(route[2]);
      setSpeed(route[3]);
      setDate(route[4]);
      setKmPartials(route[5]);
    });
  }, []);

  const loadInfo = async () => {
    const route = JSON.parse(await AsyncStorage.getItem("route"));
    const distance = parseFloat(await AsyncStorage.getItem("distance")).toFixed(
      2
    );
    const duration = parseInt(await AsyncStorage.getItem("duration"));
    const date = parseInt(await AsyncStorage.getItem("date"));
    const kmPartials = JSON.parse(await AsyncStorage.getItem("kmPartials"));
    return [
      route,
      distance,
      duration,
      ((distance * 1000) / duration).toFixed(2),
      date,
      kmPartials,
    ];
  };
  const saveRun = () => {
    const newRun = {
      distance: distance,
      duration: duration,
      date: parseInt(date),
      route: route,
      partials: kmPartials,
      user: user.uid,
    };
    db.collection("runs")
      .add(newRun)
      .then((ref) => {
        addActivity(newRun);
        deleteRunFromStorage(() => {
          resetTrack();
          resetTimer();
          navigation.navigate("List", {
            screen: "List",
          });
        });
      });
  };

  const deleteRunFromStorage = async (callback) => {
    resetTrack();
    resetTimer();
    await AsyncStorage.multiSet(
      [
        ["route", JSON.stringify([])],
        ["distance", "0"],
        ["duration", "0"],
        ["date", ""],
        ["kmPartials", JSON.stringify([])],
        ["unsavedTrack", "false"],
      ],
      callback()
    );
  };
  const timer = secondsToTime(duration);
  return (
    <SafeAreaView style={SafeViewAndroid.AndroidSafeArea}>
      {showAlert ? (
        <Alert
          confirmButtonText="Yes, delete it!"
          dismissButtonText="Nope!"
          alertMessage="Are you sure you want to delete the activity?"
          dismissAction={() => setShowAlert(false)}
          confirmAction={() => {
            deleteRunFromStorage(() => {
              navigation.navigate("Create", {
                screen: "Create",
              });
            });
          }}
        />
      ) : null}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.startRecordBtn}
          onPress={() => saveRun()}
        >
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.upperScreen}>
        <TouchableOpacity
          style={styles.trashIcon}
          onPress={() => setShowAlert(true)}
          // onPress={}
        >
          <Feather name="trash" size={16} color="gray" />
        </TouchableOpacity>
        <View style={styles.pageTitleContainer}>
          <Text style={styles.pageTitle}>Run Details</Text>
        </View>
        {date ? (
          <View style={styles.dateBox}>
            <Text style={styles.dateText}>{convertDate(date)}</Text>
          </View>
        ) : null}
        <Timer duration={timer} />
        <View style={styles.runInfoBox}>
          <View style={styles.runInfoBoxNumber}>
            <Text style={styles.runInfoBoxText}>{distance}</Text>
            <Text style={styles.runInfoBoxTextSmall}>Km</Text>
          </View>
          <View style={styles.runInfoBoxNumber}>
            <Text style={styles.runInfoBoxText}>{speedToPace(speed)}</Text>
            <Text style={styles.runInfoBoxTextSmall}>min/km</Text>
          </View>
        </View>
      </View>
      {route.length > 1 ? (
        <MapView
          ref={(map) => setMap(map)}
          onLayout={() => {
            map.fitToCoordinates(route, {
              edgePadding: { top: 20, right: 20, bottom: 20, left: 20 },
              animated: false,
            });
          }}
          provider={MapView.PROVIDER_GOOGLE}
          style={styles.mapStyle}
          showsMyLocationButton={true}
        >
          <Polyline
            coordinates={route}
            strokeColor="blue" // fallback for when `strokeColors` is not supported by the map-provider
            strokeColors={["#05C6FF"]}
            strokeWidth={6}
          />
        </MapView>
      ) : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  trashIcon: {
    position: "absolute",
    right: 20,
    top: 20,
    zIndex: 100,
  },
  pageTitleContainer: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
    paddingVertical: 10,
  },
  pageTitle: {
    color: "#05C6FF",
    fontSize: 24,
    fontFamily: "Muli-ExtraBold",
    marginBottom: 10,
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    position: "absolute",
    bottom: 90,
    zIndex: 10,
    width: "100%",
  },
  upperScreen: {
    backgroundColor: "#282C34",
  },
  startRecordBtn: {
    backgroundColor: "#05C6FF",
    paddingVertical: 12,
    borderRadius: 60,
    width: "90%",
    marginHorizontal: "auto",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
    textAlign: "center",
    color: "white",
  },
  dateBox: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },

  dateText: {
    color: "white",
    fontFamily: "Muli-Medium",
    fontSize: 16,
    opacity: 0.7,
  },

  watchContainer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    paddingTop: 10,
    paddingBottom: 10,
  },
  watchNumber: {
    fontSize: 50,
    color: "white",
    fontWeight: "500",
    width: "20%",
  },
  runInfoBox: {
    paddingBottom: 20,
    paddingTop: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },

  mapStyle: {
    height: 500,
  },
  runInfoBoxText: {
    fontSize: 24,
    color: "white",
    fontFamily: "Muli-Bold",
  },
  runInfoBoxTextSmall: {
    fontSize: 16,
    color: "white",
    opacity: 0.7,
    fontFamily: "Muli-Medium",
  },
  runInfoBoxNumber: {
    display: "flex",
    fontFamily: "Muli-Medium",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default EndTrackScreen;
