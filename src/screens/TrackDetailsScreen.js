import React, { useState, useContext } from "react";
import Constants from "expo-constants";
const statusBarHeight = Constants.statusBarHeight;
import SafeViewAndroid from "../style/GlobalSafeArea";
import { CommonActions } from "@react-navigation/native";

import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import MapView, { AnimatedRegion, Marker, Polyline } from "react-native-maps";
import Timer from "../compoonents/Timer";
import Alert from "../compoonents/Alert";
import { secondsToTime } from "../utils/secondsToTime";
import { speedToPace } from "../utils/speedToPace";
import { convertDate } from "../utils/utcToDate";
import { Feather } from "@expo/vector-icons";
import { db } from "../firebase/Firebase";
import { Context as ActivityDetailsContext } from "../context/ActivityDetailsContext";
const TrackDetailsScreen = ({ route, navigation }) => {
  const [map, setMap] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const { removeActivity } = useContext(ActivityDetailsContext);
  const run = route.params.run;
  const timer = secondsToTime(run.duration);

  const deleteRun = () => {
    var selectedRun = db.collection("runs").where("date", "==", run.date);
    selectedRun.get().then((snapshot) => {
      snapshot.forEach((data) => {
        data.ref.delete();
        removeActivity(run);
        navigation.navigate("List", {
          screen: "List",
        });
      });
    });
  };

  const speed = ((run.distance * 1000) / run.duration).toFixed(2);
  return (
    <SafeAreaView
      style={styles.mainContainer}
      forceInset={{ top: "always", bottom: "always" }}
    >
      {showAlert ? (
        <Alert
          confirmButtonText="Yes, delete it!"
          dismissButtonText="No, keep it!"
          alertMessage="Are you sure you want to delete the activity?"
          dismissAction={() => setShowAlert(false)}
          confirmAction={deleteRun}
        />
      ) : null}
      <View style={styles.upperScreen}>
        <TouchableOpacity
          style={styles.trashIcon}
          onPress={() => {
            setShowAlert(true);
          }}
        >
          <Feather name="trash" size={16} color="gray" />
        </TouchableOpacity>
        {run.date ? (
          <View style={styles.dateBox}>
            <Text style={styles.dateText}>{convertDate(run.date)}</Text>
          </View>
        ) : null}
        <Timer duration={timer} />
        <View style={styles.runInfoBox}>
          <View style={styles.runInfoBoxNumber}>
            <Text style={styles.runInfoBoxText}>{run.distance}</Text>
            <Text style={styles.runInfoBoxTextSmall}>Km</Text>
          </View>
          <View style={styles.runInfoBoxNumber}>
            <Text style={styles.runInfoBoxText}>{speedToPace(speed)}</Text>
            <Text style={styles.runInfoBoxTextSmall}>min/km</Text>
          </View>
        </View>
      </View>
      {run.route.length > 1 ? (
        <MapView
          ref={(map) => setMap(map)}
          onLayout={() => {
            map.fitToCoordinates(run.route, {
              edgePadding: { top: 20, right: 20, bottom: 20, left: 20 },
              animated: false,
            });
          }}
          provider={MapView.PROVIDER_GOOGLE}
          style={styles.mapStyle}
          showsMyLocationButton={true}
        >
          <Polyline
            coordinates={run.route}
            strokeColor="blue" // fallback for when `strokeColors` is not supported by the map-provider
            strokeColors={["#05C6FF"]}
            strokeWidth={3}
          />
        </MapView>
      ) : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    display: "flex",
    backgroundColor: "white",
    paddingTop: 0,
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
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    position: "absolute",
    bottom: 50,
    zIndex: 10,
    width: "100%",
  },
  upperScreen: {
    backgroundColor: "#282C34",
    paddingTop: 20,
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
    flex: 1,
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

export default TrackDetailsScreen;
