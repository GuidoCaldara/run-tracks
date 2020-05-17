import React, { useEffect, useContext, useState } from "react";
import SafeViewAndroid from "../style/GlobalSafeArea";
var _ = require("lodash");
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  FlatList,
  SectionList,
  SafeAreaView,
} from "react-native";
import { fetchActivities, listenChanges } from "../firebase/fetchDb";
import { Context as ActivityDetailsContext } from "../context/ActivityDetailsContext";
import { Context as AuthContext } from "../context/AuthContext";
import RunCard from "../compoonents/RunCard";
const TrackListScreen = ({ route, navigation }) => {
  console.log("r", route.params);
  const [loading, setLoading] = useState(false);
  const [groupedActivities, setGroupedActivities] = useState([]);
  const session = useContext(AuthContext).state;
  const { state, setActivityList, addActivity } = useContext(
    ActivityDetailsContext
  );
  const runs = state.activities;
  navigation.setOptions({
    headerShown: false,
  });

  useEffect(() => {
    setLoading(true);
    setGroupedActivities(groupRuns(runs));
    setLoading(false);
  }, [runs]);

  useEffect(() => {
    if (session) {
      setLoading(true);
      fetchActivities(session).then((runs) => {
        setActivityList(runs);
      });
    }
  }, [session]);

  const groupRuns = (runs) => {
    const runsGrouped = [];
    runs.forEach((run) => {
      const r = runsGrouped.find(
        (r) =>
          r.title ===
          `${months[new Date(run.date * 1000).getMonth()]} ${new Date(
            run.date * 1000
          ).getFullYear()}`
      );
      if (!r) {
        runsGrouped.push({
          title: `${months[new Date(run.date * 1000).getMonth()]} ${new Date(
            run.date * 1000
          ).getFullYear()}`,
          data: [],
        });
      }
    });
    runs.forEach((run) => {
      const month = new Date(run.date * 1000).getMonth();
      const group = runsGrouped.find(
        (r) =>
          r.title ===
          `${months[new Date(run.date * 1000).getMonth()]} ${new Date(
            run.date * 1000
          ).getFullYear()}`
      );
      group.data = [...group.data, run];
    });
    return runsGrouped;
  };

  return (
    <SafeAreaView
      style={{ ...SafeViewAndroid.AndroidSafeArea, backgroundColor: "#282C34" }}
    >
      <View style={styles.upperScreen}>
        <Text style={styles.upperScreenText}>Your activities</Text>
      </View>
      <View style={{ ...styles.cardsContainer }}>
        {groupedActivities.length === 0 ? (
          <ActivityIndicator
            style={styles.spinner}
            size="large"
            color="#05C6FF"
          />
        ) : (
          <SectionList
            stickySectionHeadersEnabled={false}
            keyExtractor={(item, index) => index}
            sections={groupedActivities}
            renderItem={({ item }) => (
              <RunCard navigation={navigation} run={item} />
            )}
            renderSectionHeader={({ section }) => (
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>{section.title}</Text>
              </View>
            )}
            keyExtractor={(item, index) => index}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionHeaderText: {
    fontSize: 16,
    fontFamily: "Muli-Bold",
    color: "white",
  },
  sectionHeader: {
    backgroundColor: "#05C6FF",
    marginVertical: 16,
    display: "flex",
    alignItems: "center",
    paddingHorizontal: 16,
    flexDirection: "row",
    paddingVertical: 6,
    borderRadius: 4,
  },
  spinner: {
    alignSelf: "center",
    marginTop: 100,
  },
  cardsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  upperScreen: {
    textAlign: "center",
    backgroundColor: "#05C6FF",
    height: 70,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  upperScreenText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
export default TrackListScreen;

// <Button
//   title="See details"
//   onPress={() => {
//     navigation.navigate("Details");
//   }}
// />

// const events = [
//   {
//     year: 2020,
//     name: "Event one",
//     country: "UK",
//   },
//   {
//     year: 2019,
//     name: "Event two",
//     country: "IT",
//   },
//   {
//     year: 2018,
//     name: "Event three",
//     country: "UK",
//   },
//   {
//     year: 2020,
//     name: "Event four",
//     country: "DE",
//   },
//   {
//     year: 2019,
//     name: "Event five",
//     country: "AT",
//   },
// ];

// [
//   {
//     year: 2020,
//     events: [
//       {
//         year: 2020,
//         name: "Event one",
//         country: "UK",
//       },
//       {
//         year: 2020,
//         name: "Event four",
//         country: "DE",
//       },
//     ],
//   },
//   {
//     year: 2019,
//     events: [
//       {
//         year: 2019,
//         name: "Event two",
//         country: "IT",
//       },
//       {
//         year: 2019,
//         name: "Event five",
//         country: "AT",
//       },
//     ],
//   },
//   {
//     year: 2018,
//     events: [
//       {
//         year: 2018,
//         name: "Event three",
//         country: "UK",
//       },
//     ],
//   },
// ];
