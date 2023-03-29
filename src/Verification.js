import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import Service from "../service/index";
import Toast from "react-native-simple-toast";
import { useDispatch, useSelector } from "react-redux";
import { selectToken, setUserType } from "../slices/authSlice";

export default function Verification({ navigation, route }) {
  const { user_type } = route?.params;
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const [otp, setOtp] = useState("");

  const verify = async () => {
    try {
      // Send verification request to server
      const verifyResponse = await Service.post(
        "/api/verify/",
        { otp },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // Extract data from server response
      const verifyData = verifyResponse?.data;
      console.log("verifyData", verifyData);
      // Check if verification was successful
      if (verifyData?.verified) {
        // Show success message
        Toast.show("Login successful", Toast.SHORT);
        // Dispatch user type and navigate to homepage
        dispatch(setUserType(user_type));
        navigation.replace("HomePage");
      } else {
        // Show error message
        Toast.show(verifyData?.error || "Unknown error", Toast.SHORT);
      }
    } catch (error) {
      console.log(error);
      // Show error message
      Toast.show("Error verifying OTP", Toast.SHORT);
    }
  };

  return (
    <View style={styles.verificationContainer}>
      <Image
        source={require("../assets/image/Verify.png")}
        style={[styles.image, { resizeMode: "contain" }]}
      />
      <Text style={styles.title}>वेरिफिकेशन</Text>

      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          हमने आपके फ़ोन पर एक ओटीपी भेजा है
        </Text>
      </View>

      <View style={styles.textInputContainer}>
        <TextInput
          style={[styles.TextInput, styles.inputView]}
          placeholder="ओटीपी डालें "
          placeholderTextColor={"#848484"}
          secureTextEntry={true}
          onChangeText={(text) => setOtp(text, "otp")}
         
        />
      </View>

      <View style={styles.otpText}>
        <Text style={{ color: "#0099FF" }}>1:30</Text>
      </View>

      <TouchableOpacity
        onPress={() => {
          verify();
        }}
        style={styles.loginBtn}
      >
        <Text style={styles.verifyText}>वेरीफाई एंड लॉगिन </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  verificationContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ffff",
    alignItems: "center",
  },
  container: {
    alignItems: "center",
    padding: 20,
  },
  image: {
    width: 160,
    height: 200,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
  },
  textInputContainer: {
    width: "100%",
    borderColor: "#0070C0",
    borderRadius: 7,
    // borderBottomRightRadius: 7,
    width: "80%",
    height: 45,
    borderWidth: 1,
    textAlign: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  textInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    color: "#000",
  },
  otpText: {
    marginTop: 10,
    color: "#0099FF",
  },
  loginBtn: {
    backgroundColor: "#0099FF",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    width: "80%",
  },
  verifyText: {
    color: "#fff",
    fontSize: 16,
  },
});
