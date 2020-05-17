import React from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { Text, Input } from "react-native-elements";
import Spacer from "../compoonents/Spacer";
import BackGround from "../../assets/landing.jpg";
import { Context as AuthContext } from "../context/AuthContext";

const LandingScreen = ({ navigation }) => {
  navigation.setOptions({
    headerShown: false,
  });

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/landing.jpg")}
        style={styles.background}
      >
        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              navigation.navigate("SignIn");
            }}
          >
            <Text style={styles.buttonText}>Let's start</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  buttons: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 200,
  },
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#05C6FF",
    width: "80%",
    alignSelf: "center",
    paddingVertical: 12,
    borderRadius: 60,
  },
  buttonText: {
    fontSize: 16,
    textAlign: "center",
    color: "white",
  },
});

export default LandingScreen;
