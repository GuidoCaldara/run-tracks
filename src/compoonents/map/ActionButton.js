import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
const ActionButton = ({
  recording,
  startRecording,
  resumeRecording,
  endRecording,
  pauseRecording,
  endRun,
}) => {
  let actionBtn;
  if (recording == "off") {
    actionBtn = (
      <View style={styles.actionBtnContainer}>
        <TouchableOpacity
          onPress={startRecording}
          style={styles.startRecordBtn}
        >
          <Text style={styles.buttonText}>Let's Run!</Text>
        </TouchableOpacity>
      </View>
    );
  } else if (recording === "on") {
    actionBtn = (
      <View style={styles.actionBtnContainer}>
        <TouchableOpacity
          onPress={pauseRecording}
          style={styles.startRecordBtn}
        >
          <Text style={styles.buttonText}>Pause</Text>
        </TouchableOpacity>
      </View>
    );
  } else {
    actionBtn = (
      <View style={styles.actionBtnContainer}>
        <TouchableOpacity
          onPress={resumeRecording}
          style={{ ...styles.startRecordBtn, marginBottom: 16 }}
        >
          <Text style={styles.buttonText}>ReStart</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={endRecording} style={styles.startRecordBtn}>
          <Text style={styles.buttonText}>End the Run</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return <View>{actionBtn}</View>;
};

const styles = StyleSheet.create({
  startRecordBtn: {
    backgroundColor: "#05C6FF",
    paddingVertical: 12,
    borderRadius: 60,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "Muli-Bold",
    textAlign: "center",
    color: "white",
  },
});
export default ActionButton;
