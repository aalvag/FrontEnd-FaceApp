import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import React from "react";
import Constants from "expo-constants";

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [accessToken, setAccessToken] = React.useState();
  const [userInfo, setUserInfo] = React.useState();
  const [message, setMessage] = React.useState();

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: Constants?.manifest?.extra?.androidClientId,
    iosClientId: Constants?.manifest?.extra?.iosClientId,
    expoClientId: Constants?.manifest?.extra?.expoClientId,
  });

  const getUserData = async () => {
    let userInfoResponse = await fetch(
      Constants?.manifest?.extra?.googleApiUrl,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    userInfoResponse.json().then((data) => {
      setUserInfo(data);
    });
  };

  React.useEffect(() => {
    setMessage(JSON.stringify(response));
    if (response?.type === "success") {
      setAccessToken(response.authentication.accessToken);
    }
  }, [response]);

  React.useEffect(() => {
    if (accessToken) {
      getUserData();
    }
  }, [accessToken]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Find Me App</Text>
      <View style={styles.buttonContainer}>
        <Pressable onPress={() => promptAsync()} style={styles.googleButton}>
          <Image
            style={styles.buttonImage}
            source={require("./assets/images/google-button.png")}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    flex: 1,
    backgroundColor: "white",
  },
  title: {
    fontSize: 21,
    fontWeight: "bold",
    marginTop: 50,
    marginBottom: 15,
    color: "#333",
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: "auto",
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  googleButton: {
    width: "70%",
    height: 70,
  },
  buttonImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
});
