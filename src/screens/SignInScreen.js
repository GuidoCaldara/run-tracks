import React, { useContext, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import LoadingScreen from "./LoadingScreen";
import { Context as AuthContext } from "../context/AuthContext";
import firebase from "../firebase/Firebase";
const SignInScreen = ({ navigation }) => {
  const { setCurrentUser, signIn } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  navigation.setOptions({
    headerShown: false,
  });

  if (loading) {
    return <LoadingScreen />;
  } else {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require("../../assets/signin.jpg")}
          style={styles.background}
        >
          <View style={styles.buttons}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setLoading(true);
                signIn();
              }}
            >
              <Image
                style={styles.logo}
                source={require("../../assets/g-logo.png")}
              ></Image>
              <Text style={styles.buttonText}>SignIn with Google</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    );
  }
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
    backgroundColor: "#FFFFFF",
    width: "80%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "center",
    paddingVertical: 12,
    borderRadius: 60,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    textAlign: "center",

    color: "#888382",
  },
  logo: {
    width: 30,
    height: 30,
    marginRight: 20,
  },
});

export default SignInScreen;
