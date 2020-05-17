import React, { useContext } from "react";
import { convertDate } from "../utils/utcToDate";
import { speedToPace } from "../utils/speedToPace";
import { prettyPrintDurationWithUnits } from "../utils/PrettyPrintDuration";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import { Context as ActivityDetailsContext } from "../context/ActivityDetailsContext";
const RunCard = ({ run, navigation }) => {
  const { setActivityOnFocus } = useContext(ActivityDetailsContext);
  const speed = ((run.distance * 1000) / run.duration).toFixed(2);
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        setActivityOnFocus(run.date);
        navigation.navigate("Details", {
          screen: "Details",
          params: { run: run },
        });
      }}
    >
      <View style={styles.cardDateContainer}>
        <Image
          style={styles.logo}
          source={require("../../assets/logo.png")}
        ></Image>
        <Text style={styles.cardDate}>{convertDate(run.date)}</Text>
      </View>
      <View style={styles.cardDetails}>
        <View style={styles.runInfoBox}>
          <Text style={styles.runInfoBoxLabel}>Time:</Text>

          <Text style={styles.detailsText}>
            {prettyPrintDurationWithUnits(run.duration)}
          </Text>
        </View>
        <View style={styles.runInfoBox}>
          <Text style={styles.runInfoBoxLabel}>Distance:</Text>

          <Text style={styles.detailsText}>
            {run.distance}
            <Text style={styles.detailsTextUnit}>km</Text>
          </Text>
        </View>
        <View style={styles.runInfoBox}>
          <Text style={styles.runInfoBoxLabel}>Pace:</Text>

          <Text style={styles.detailsText}>
            {speedToPace(speed)}
            <Text style={styles.detailsTextUnit}>m/km</Text>
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardDateContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "baseline",
  },
  logo: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  runInfoBoxLabel: {
    color: "#2b2b2b",
    fontSize: 12,
    fontFamily: "Muli-Bold",
    textAlign: "left",
  },
  card: {
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 8,
  },
  cardDate: {
    marginBottom: 10,
    fontFamily: "Muli-Bold",
    opacity: 0.6,
  },
  cardDetails: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailsText: {
    fontSize: 18,
    fontFamily: "Muli-Medium",
    opacity: 0.6,
  },
  detailsTextUnit: {
    fontSize: 18,
    fontFamily: "Muli-Medium",
  },
});
export default RunCard;
