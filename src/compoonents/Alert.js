import React, { useContext } from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";

const Alert = ({
  onConfirm,
  alertMessage,
  confirmButtonText,
  dismissButtonText,
  dismissAction,
  confirmAction,
}) => {
  return (
    <View style={styles.alertBackground}>
      <View style={styles.alertBody}>
        <Text style={styles.alertText}>{alertMessage}</Text>
        <TouchableOpacity
          onPress={confirmAction}
          style={{ ...styles.confirmButton, marginBottom: 15 }}
        >
          <Text style={styles.confirmButtonText}>{confirmButtonText}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={dismissAction} style={styles.dismissButton}>
          <Text style={styles.dismissButtonText}>{dismissButtonText}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  alertBackground: {
    position: "absolute",
    zIndex: 999,
    width: "100%",
    height: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingTop: "40%",
    flexGrow: 1,
    backgroundColor: "rgba(40, 44, 52, 0.7)",
  },
  alertBody: {
    display: "flex",
    justifyContent: "center",
    paddingHorizontal: 20,
    width: "90%",
    height: 250,
    backgroundColor: "white",
    marginHorizontal: "auto",
    borderRadius: 8,
  },
  confirmButton: {
    backgroundColor: "#05C6FF",
    paddingVertical: 12,
    borderRadius: 60,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  confirmButtonText: {
    fontSize: 16,
    fontFamily: "Muli-Bold",
    textAlign: "center",
    color: "white",
  },
  dismissButton: {
    backgroundColor: "white",
    borderColor: "#05C6FF",
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 60,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  dismissButtonText: {
    fontSize: 16,
    fontFamily: "Muli-Bold",
    textAlign: "center",
    color: "#05C6FF",
  },
  alertText: {
    fontSize: 16,
    marginBottom: 30,
    fontFamily: "Muli-Medium",
    textAlign: "center",
  },
  closeModalButton: {
    position: "absolute",
    top: 20,
    right: 20,
  },
});
export default Alert;
