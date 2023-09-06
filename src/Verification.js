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
import { selectIsLoggedIn, setToken, setIsLoggedIn } from "../slices/authSlice";
import Icon from "react-native-vector-icons/AntDesign";

export default function Verification({ navigation, route }) {
  const { user_type, phone } = route?.params ?? {};
  console.log("hddjdj", user_type, phone);
  const dispatch = useDispatch();
  const [otp, setOtp] = useState("");
  const [Timer, setTimer] = useState(true);
  const [counter, setCounter] = useState(90);
  const [resendCounter, setResendCounter] = useState(90);
  const [isResend, setIsResend] = useState(false);
  const [isResendDisable, setIsResendDisable] = useState(false);

  const verify = async () => {
    try {
      // Send verification request to server
      const verifyResponse = await Service.post(
        "/api/verify/",
        { otp, phone },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      const verifyData = verifyResponse?.data;
      console.log("verifyData", verifyData);
      dispatch(setToken(verifyData?.token));
      console.log("token", verifyData?.token);
      // Check if verification was successful
      if (verifyData?.verified == true) {
        // Toast.show("लॉग इन सफल", Toast.LONG);
        // Dispatch user type and navigate to homepage
        // dispatch(setToken(verifyData?.token));
        dispatch(setUserType(user_type));
        dispatch(setIsLoggedIn(true));
        setTimer(false);
        navigation.replace("HomeStack", { screen: "BottomTab" });
      } else {
        // Show error message
        Toast.show("अमान्य ओ.टी.पी", Toast.LONG);
      }
    } catch (error) {
      console.log(error);
      // Show error message
      Toast.show(
        "कुछ समस्या आ रही है, कृपया बाद में पुनः प्रयास करें!",
        Toast.LONG
      );
    }
  };
  const resendOTP = async () => {
    setIsResend(true);
    setIsResendDisable(true);
    setTimer(false);
    try {
      const response = await Service.post(
        "/api/resendotp/",
        { phone },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      const data = response.data;
      console.log("otp data", data);
      Toast.show("ओटीपी पुनः भेजा गया है!", Toast.LONG);
      // setResendCounter(90);
    } catch (error) {
      console.log(error);
      Toast.show(
        "कुछ समस्या आ रही है, कृपया बाद में पुनः प्रयास करें!",
        Toast.LONG
      );
    }
  };

  useEffect(() => {
    if (Timer) {
      const interval = setInterval(() => {
        if (counter > 0) {
          setCounter((prevCount) => prevCount - 1);
        } else {
          setTimer(false);
          clearInterval(interval);
        }
      }, 1000);
      return () => clearInterval(interval);
    }

    // Check if the resend counter is active
    if (isResend) {
      const resendInterval = setInterval(() => {
        if (resendCounter > 0) {
          setResendCounter((prevCount) => prevCount - 1);
        } else {
          clearInterval(resendInterval);
          setIsResend(false);
          Toast.show(
            "कृपया वापस जाएं और जांचें कि फ़ोन नंबर सही है या नहीं!",
            Toast.LONG
          );
        }
      }, 1000);
      return () => clearInterval(resendInterval);
    }
  }, [counter, isResend, resendCounter]);

  return (
    <View style={{ flex: 1, backgroundColor: "#ffff" }}>
      {/* <View style={{ padding: 20, marginTop: 60 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrowleft" size={25} />
        </TouchableOpacity>
      </View> */}
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
        <View>
          <TextInput
            style={[
              // styles.TextInput,
              styles.inputView,
              styles.textInputContainer,
            ]}
            placeholder="ओटीपी डालें"
            placeholderTextColor={"#848484"}
            secureTextEntry={true}
            keyboardType="numeric"
            maxLength={4}
            onChangeText={(text) => setOtp(text, "otp")}
          />
        </View>
        <View style={styles.otpText}>
          {Timer ? (
            <Text style={{ color: "#0099FF" }}>
              {Math.floor(counter / 60)}:
              {(counter % 60).toString().padStart(2, "0")}
            </Text>
          ) : (
            <Text style={{ color: "#0099FF" }}>
              {Math.floor(resendCounter / 60)}:
              {(resendCounter % 60).toString().padStart(2, "0")}
            </Text>
          )}
        </View>
        <TouchableOpacity
          onPress={() => {
            verify();
          }}
          style={styles.loginBtn}
        >
          <Text style={styles.verifyText}>वेरीफाई एंड लॉगिन </Text>
        </TouchableOpacity>
        {counter === 0 ? (
          <TouchableOpacity
            onPress={() => {
              if (!isResend && !isResendDisable) {
                resendOTP();
              }
            }}
            style={!isResendDisable ? styles.resendBtn : styles.disableBtn}
          >
            <Text style={styles.verifyText}>ओटीपी पुनः भेजें</Text>
          </TouchableOpacity>
        ) : null}
      </View>
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
    borderColor: "#0070C0",
    borderRadius: 7,
    // borderBottomRightRadius: 7,
    marginHorizontal: "auto",
    textAlign: "center",
    borderWidth: 1,
    paddingHorizontal: 100,
    paddingVertical: 5,
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
  resendBtn: {
    backgroundColor: "#0099FF",
    borderRadius: 25,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    width: "45%",
  },

  disableBtn: {
    backgroundColor: "#D3D3D3",
    borderRadius: 25,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    width: "45%",
  },
  verifyText: {
    color: "#fff",
    fontSize: 16,
  },
});
