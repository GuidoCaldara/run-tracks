import React, { useContext } from "react";
import { prettyPrintDuration } from "../utils/PrettyPrintDuration";
import { SafeAreaView, StyleSheet, View, Text, FlatList } from "react-native";
import { Context as ActivityDetailsContext } from "../context/ActivityDetailsContext";
const TrackSplitScreen = ({}) => {
  const { date, activities } = useContext(ActivityDetailsContext).state;
  const activity = activities.find((a) => a.date === date);
  const mapPartials = (activity) => {
    let secondsSum = 0;
    let kmSum = 0;
    const partialsSegments = activity.partials.map((n, i) => {
      secondsSum += n;
      kmSum += 1;
      return {
        km: i + 1,
        pace: n,
      };
    });
    const lastSegment = {
      km: (activity.distance - kmSum).toFixed(1),
      pace:
        (activity.duration - secondsSum) /
        (activity.distance - kmSum).toFixed(1),
    };
    return [...partialsSegments, lastSegment];
  };

  const avgSpeed = (activity) => {
    console.log(activity.duration, activity.distance);
    const avg = Math.floor(activity.duration / activity.distance);
    return { avg };
  };
  console.log(avgSpeed.avg);
  const partials = activity ? mapPartials(activity) : [];
  const averageSpeed = activity ? avgSpeed(activity) : 0;
  console.log(partials);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#282C34",
      }}
    >
      <View style={styles.upperScreen}>
        <Text style={styles.upperScreenText}>Splits</Text>
      </View>

      <View style={styles.splitsContainer}>
        <FlatList
          data={partials}
          renderItem={({ item, index }) =>
            item.km > 0 ? (
              <View
                style={{
                  ...styles.splitBox,
                  backgroundColor: index % 2 === 0 ? "white" : "#DADFE7",
                }}
              >
                <View
                  style={{
                    ...styles.kmBox,
                    backgroundColor: index % 2 === 0 ? "white" : "#DADFE7",
                  }}
                >
                  <Text style={styles.kmBoxText}>{item.km}</Text>
                </View>
                <View style={styles.timeBox}>
                  <View style={styles.avgSpeedLine}></View>
                  <View
                    style={{
                      width: `${(item.pace * 50) / averageSpeed.avg}%`,
                      ...styles.paceBox,
                    }}
                  >
                    <Text style={styles.paceText}>
                      {prettyPrintDuration(item.pace)}m/km
                    </Text>
                  </View>
                </View>
              </View>
            ) : null
          }
          keyExtractor={(item) => item.km.toString()}
        />
      </View>
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
  upperScreenText: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Muli-Bold",
    color: "white",
  },
  splitsContainer: {
    paddingTop: 30,
    paddingHorizontal: 10,
    position: "relative",
  },
  splitBox: {
    overflow: "hidden",
    position: "relative",
    width: "100%",
    height: 55,
    marginBottom: 3,
    borderRadius: 3,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },

  timeBox: {
    color: "#2b2b2b",
    flexGrow: 1,
    alignSelf: "stretch",
    display: "flex",
    flexDirection: "row",
  },
  kmBox: {
    color: "#2b2b2b",
    width: 50,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    height: "100%",
    alignItems: "center",
  },
  kmBoxText: {
    color: "#2b2b2b",
    fontSize: 14,
    fontFamily: "Muli-Bold",
  },
  avgSpeedLine: {
    position: "absolute",
    width: 1,
    borderWidth: 0.5,
    borderColor: "red",
    height: 55,
    top: 0,
    right: "50%",
    zIndex: 100,
  },
  paceBox: {
    backgroundColor: "#88E4FF",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 20,
  },
  paceText: {
    color: "#2b2b2b",
    position: "absolute",
    left: 20,
    fontFamily: "Muli-Bold",
    opacity: 0.7,
  },
});
export default TrackSplitScreen;

// <Text>
//   {prettyPrintDuration(item.pace)} -{" "}
//   {prettyPrintDuration(averageSpeed.avg)}
// </Text>;
