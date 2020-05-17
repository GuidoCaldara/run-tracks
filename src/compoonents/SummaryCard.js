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
const SummaryCard = ({ datas }) => {
  return (
    <View style={styles.summaryCard}>
      <View style={styles.summaryCardRow}>
        <View style={styles.summaryCardCell}>
          <Text style={styles.summaryCardNumber}>
            {prettyPrintDurationWithUnits(datas.totalDuration)}
          </Text>
          <Text style={styles.summaryCardLabel}>Total Time</Text>
        </View>
      </View>
      <View style={styles.summaryCardRow}>
        <View style={styles.summaryCardCell}>
          <Text style={styles.summaryCardNumber}>
            {datas.totalDistance}
            <Text style={styles.unitText}>km</Text>
          </Text>
          <Text style={styles.summaryCardLabel}>Total Distance</Text>
        </View>
        <View style={styles.summaryCardCell}>
          <Text style={styles.summaryCardNumber}>
            {datas.speed}
            <Text style={styles.unitText}>m/km</Text>
          </Text>
          <Text style={styles.summaryCardLabel}>Average Speed</Text>
        </View>
      </View>
    </View>
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
});

export default SummaryCard;
