import React, { useContext, useState, useEffect } from "react";
import firebase from "../firebase/Firebase";
import { fetchActivities, listenChanges } from "../firebase/fetchDb";
import { speedToPace } from "../utils/speedToPace";
import { prettyPrintDurationWithUnits } from "../utils/PrettyPrintDuration";
import {
  SafeAreaView,
  StyleSheet,
  Image,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import { Context as AuthContext } from "../context/AuthContext";
import { Context as ActivityDetailsContext } from "../context/ActivityDetailsContext";
import SafeViewAndroid from "../style/GlobalSafeArea";
import SummaryCard from "../compoonents/SummaryCard.js";
import { MaterialCommunityIcons } from "@expo/vector-icons";
const AccountScreen = ({ navigation }) => {
  const { signout } = useContext(AuthContext);
  const { state, setActivityList } = useContext(ActivityDetailsContext);
  const [runsData, setRunsData] = useState(null);
  const session = useContext(AuthContext).state;
  const runs = state.activities;

  useEffect(() => {
    if (session) {
      console.log("fetching");
      fetchActivities(session).then((runs) => {
        setActivityList(runs);
        setRunsData(calculateRunsData(runs));
      });
    }
  }, [session]);

  navigation.setOptions({
    headerShown: false,
  });

  const calculateRunsData = (runs) => {
    if (runs.length === 0) return {};
    const totalDistance = runs.reduce(
      (prevDistance, run) => prevDistance + parseFloat(run.distance),
      0
    );
    const totalDuration = runs.reduce(
      (prevDistance, run) => prevDistance + parseFloat(run.duration),
      0
    );
    const avgSpeed = ((totalDistance * 1000) / totalDuration).toFixed(2);
    return {
      speed: speedToPace(avgSpeed),
      totalDistance,
      totalDuration,
    };
  };

  return (
    <SafeAreaView
      style={{
        ...SafeViewAndroid.AndroidSafeArea,
        backgroundColor: "#282C34",
      }}
    >
      <MaterialCommunityIcons
        style={styles.logoutBtn}
        name="logout"
        size={24}
        color="black"
        onPress={() => {
          firebase
            .auth()
            .signOut()
            .then(() => {
              signout();
            });
        }}
      />
      <View style={styles.upperScreen}>
        <Text style={styles.upperScreenText}>Your Profile</Text>
      </View>
      <Image style={styles.avatar} source={{ uri: session.user.photoURL }} />
      <Text style={styles.userName}>{session.user.displayName}</Text>
      <Text style={styles.runsLength}>{runs.length} Activities Recorded</Text>

      {(() => {
        switch (runsData) {
          case null:
            return (
              <ActivityIndicator
                style={styles.spinner}
                size="large"
                color="#05C6FF"
              />
            );
          case {}:
            return (
              <Text style={styles.noActivitiesText}>
                No activities recorded
              </Text>
            );
          default:
            return <SummaryCard datas={runsData} />;
        }
      })()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  upperScreen: {
    textAlign: "center",
    backgroundColor: "#05C6FF",
    height: 70,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  spinner: {
    marginTop: 60,
  },
  upperScreenText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  summaryCard: {
    padding: 12,
    marginVertical: 16,
    backgroundColor: "white",
    width: "90%",
    borderRadius: 10,
    alignSelf: "center",
  },
  noActivitiesText: {
    fontFamily: "Muli-Bold",
    fontSize: 24,
    alignSelf: "center",
    marginTop: 40,
    color: "white",
  },
  runsLength: {
    alignSelf: "center",
    marginTop: 8,
    color: "white",
    opacity: 0.7,
  },
  summaryCardNumber: {
    color: "#2b2b2b",
    fontSize: 28,
    fontFamily: "Muli-Bold",
  },
  summaryCardRow: {
    display: "flex",
    flexDirection: "row",
    marginVertical: 6,
    justifyContent: "space-around",
  },
  summaryCardCell: {
    display: "flex",
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    marginVertical: 40,
  },
  unitText: {
    fontSize: 18,
    opacity: 0.7,
    fontFamily: "Muli-Medium",
  },
  userName: {
    color: "white",
    textAlign: "center",
    fontSize: 24,
    fontFamily: "Muli-Bold",
  },
  summaryCardLabel: {
    fontFamily: "Muli-Bold",
    opacity: 0.5,
  },
  logoutBtn: {
    position: "absolute",
    top: 140,
    right: 20,
    color: "#CCCCCC",
    opacity: 0.3,
    zIndex: 100,
  },
});

export default AccountScreen;
