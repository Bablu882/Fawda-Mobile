import { useFocusEffect } from "@react-navigation/core";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Linking,
  SafeAreaView,
} from "react-native";
import React, { useEffect, useState } from "react";
import Service from "../service/index";
import Toast from "react-native-simple-toast";
import Icon from "react-native-vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useDispatch, useSelector } from "react-redux";
import { selectIsLoggedIn, setToken, clearAuth } from "../slices/authSlice";
import { useIsFocused } from "@react-navigation/native";
import { WebView } from "react-native-webview";

export default function Login({ navigation }) {
  const [phone, setPhone] = useState("");
  const [isPhoneEmpty, setIsPhoneEmpty] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});
  const dispatch = useDispatch();
  const isfocused = useIsFocused();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const [
    termsAndConditionsWebViewVisible,
    setTermsAndConditionsWebViewVisible,
  ] = useState(false);
  const [privacyPolicyWebViewVisible, setPrivacyPolicyWebViewVisible] =
    useState(false);
  const [webViewVisible, setWebViewVisible] = useState(false);

  useEffect(() => {
    checkRootKey();
    if (isLoggedIn) {
      navigation.replace("HomeStack", { screen: "BottomTab" });
    }
  }, [isLoggedIn]);

  const checkRootKey = async () => {
    const key = await AsyncStorage.getItem("persist:root");
    if (key == null || key == undefined || key == "") {
      dispatch(clearAuth());
    }
  };

  const login = async () => {
    setLoading(true);
    const loginData = {
      phone: phone,
    };

    console.log("login data:", loginData);

    try {
      const response = await Service.post("/api/login/", loginData, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      const loginResponse = response.data;
      console.log("login response:", loginResponse);
      if (loginResponse?.success) {
        navigation.replace("Verification", {
          user_type: loginResponse.user_type,
          phone: phone,
        });
        setPhone("");
      } else if (loginResponse?.deactivate) {
        Toast.show(
          "आपका खाता निष्क्रिय या हटा दिया गया है, कृपया व्यवस्थापक से संपर्क करें",
          Toast.LONG
        );
        // Toast.show("", Toast.LONG);
      } else {
        // Toast.show("यूजर पंजीकृत नहीं है !", Toast.SHORT);
        console.log("Error message", loginResponse.message);
        navigation.navigate("Register", { phone });
        console.log("phone:", phone);
      }
    } catch (error) {
      console.log(error);
      Toast.show(
        "कुछ समस्या आ रही है, कृपया बाद में पुनः प्रयास करें!",
        Toast.LONG
      );
      console.log("error", JSON.stringify(error.message));
    } finally {
      setLoading(false);
    }
  };

  const handlePress = () => {
    let errors = {};
    let isValid = true;

    if (phone.trim() === "") {
      errors.phone = "फ़ोन नंबर आवश्यक है";
      setIsPhoneEmpty(true);
      isValid = false;
    } else if (phone.length < 10 || !/^[0-9]+$/.test(phone)) {
      errors.phone = "कृपया एक वैध फ़ोन नंबर लिखें";
      setIsPhoneEmpty(false);
      isValid = false;
    } else {
      setIsPhoneEmpty(false);
    }

    setErrorMessages(errors);
    return isValid;
  };

  const handleTermsAndConditionsWebViewClose = () => {
    setTermsAndConditionsWebViewVisible(false);
    setWebViewVisible(false);
  };

  const handleTermsAndConditionsWebViewOpen = () => {
    setWebViewVisible(true);
    setTermsAndConditionsWebViewVisible(true);
  };

  const handlePrivacyPolicyWebViewOpen = () => {
    setWebViewVisible(true);
    setPrivacyPolicyWebViewVisible(true);
  };

  const handlePrivacyPolicyWebViewClose = () => {
    setPrivacyPolicyWebViewVisible(false);
    setWebViewVisible(false);
  };

  const renderTermsAndConditionsWebView = () => {
    return (
      <SafeAreaView>
        <View style={{ marginRight: 290, marginBottom: 20, marginTop: 20 }}>
          <TouchableOpacity onPress={handleTermsAndConditionsWebViewClose}>
            <Icon name="close" size={20} />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}>
          <WebView
            source={{ uri: "https://fawda.in/terms-and-conditions.html" }}
            startInLoadingState={true}
          />
        </View>
      </SafeAreaView>
    );
  };

  const renderPrivacyPolicyWebView = () => {
    return (
      <SafeAreaView>
        <View style={{ marginRight: 290, marginBottom: 20, marginTop: 20 }}>
          <TouchableOpacity onPress={handlePrivacyPolicyWebViewClose}>
            <Icon name="close" size={20} />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}>
          <WebView
            source={{ uri: "https://fawda.in/privacy-policy.html" }}
            startInLoadingState={true}
          />
        </View>
      </SafeAreaView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ padding: 20, marginTop: 25 }}></View>
      {/* <Text>{deviceId}</Text> */}
      {!webViewVisible && (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            flex: 1,
            marginBottom: 30,
          }}
        >
          <Image
            source={require("../assets/image/Fawda-logo.png")}
            style={{
              width: 220,
              height: 200,
              alignItems: "center",
              marginBottom: 20,
            }}
          />

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 30,
              marginBottom: 10,
            }}
          >
            {/* <Text >(+91)</Text> */}
            <View
              style={[
                styles.CountryCode,
                {
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                },
              ]}
            >
              <Image
                source={require("../assets/image/Flag.png")}
                // style={[styles.codeText, { width: 30, height: 22 }]}
                style={{ width: 30, height: 22 }}
              />
            </View>
            <TextInput
              style={[styles.input, styles.inputView, { paddingHorizontal: 5 }]}
              placeholder="फ़ोन नंबर लिखें"
              keyboardType="numeric"
              maxLength={10}
              placeholderTextColor="#000"
              onChangeText={(value) => {
                // Remove any non-numeric characters from the input value
                value = value.replace(/[^0-9]/g, "");
                setPhone(value);
                setIsPhoneEmpty(false);
              }}
              onBlur={() => setIsPhoneEmpty(phone === "")}
              value={phone}
            />
          </View>
          <View>
            {isPhoneEmpty ? (
              <Text style={styles.error}>फ़ोन नंबर आवश्यक है</Text>
            ) : phone.length > 0 && phone.length < 10 ? (
              <Text style={styles.error}>नंबर 10 से कम नहीं होना चाहिए।</Text>
            ) : null}
          </View>
          <View style={styles.commentContainer}>
            <Text style={styles.label}>टिप्पणी</Text>

            <Text style={styles.commentText}>
              फ़ोन नंबर UPI से लिंक होना चाहिए!{"\n"}आप Google Pay, Phone Pay या
              Paytm या किसी अन्य UPI ऐप का उपयोग कर सकते हैं!
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              if (handlePress()) {
                login();
              }
            }}
            style={styles.loginBtn}
          >
            <Text style={styles.loginText}>आगे बढ़ें</Text>
          </TouchableOpacity>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              width: "70%",
              marginBottom: 10,
              alignItems: "center",
              marginTop: 50,
            }}
          >
            <View
              style={{
                backgroundColor: "#0099FF",
                height: 18,
                width: 20,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={require("../assets/image/check.png")}
                style={{ width: 15, height: 20 }}
                resizeMode="contain"
              />
            </View>
            <View
              style={{
                textAlign: "center",
                alignItems: "center",
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <Text>अगर आप आगे बढ़ते हैं, तो आप हमारी </Text>
              <View>
                <TouchableOpacity
                  // onPress={() =>
                  //   Linking.openURL("https://fawda.in/terms-and-conditions.html")
                  // }
                  onPress={handleTermsAndConditionsWebViewOpen}
                >
                  <Text
                    style={{ color: "green", textDecorationLine: "underline" }}
                  >
                    नियम और शर्तों
                  </Text>
                </TouchableOpacity>
              </View>
              <Text> और </Text>
              <View>
                <TouchableOpacity
                  // onPress={() =>
                  //   Linking.openURL("https://fawda.in/privacy-policy.html")
                  // }
                  onPress={handlePrivacyPolicyWebViewOpen}
                >
                  <Text
                    style={{ color: "green", textDecorationLine: "underline" }}
                  >
                    प्राइवेसी नीति
                  </Text>
                </TouchableOpacity>
              </View>
              <Text> से सहमत हैं</Text>
            </View>
          </View>
        </View>
      )}
      {termsAndConditionsWebViewVisible && renderTermsAndConditionsWebView()}
      {privacyPolicyWebViewVisible && renderPrivacyPolicyWebView()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  error: {
    color: "red",
    textAlign: "left",
  },
  CountryCode: {
    borderColor: "#0070C0",
    // backgroundColor: "#0070C0",
    borderTopLeftRadius: 7,
    borderBottomLeftRadius: 7,
    borderRightWidth: 0,
    width: "15%",
    resizeMode: "contain",
    height: 45,
    alignItems: "center",
    borderWidth: 1,
  },
  codeText: {
    // color: "#000",
    // textAlign: "center",
    justifyContent: "center",
    lineHeight: 44,
    fontWeight: "600",
  },
  inputView: {
    borderColor: "#0070C0",
    borderTopRightRadius: 7,
    borderBottomRightRadius: 7,
    width: "65%",
    height: 45,
    borderWidth: 1,
  },

  TextInput: {
    height: 50,
    padding: 10,

    // fontFamily: "Poppin-Light"
  },

  loginBtn: {
    width: "80%",
    // borderRadius: 7,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    backgroundColor: "#0099FF",
    marginBottom: 10,
  },
  loginText: {
    color: "#fff",
  },
  label: {
    position: "absolute",
    top: -10,
    left: 10,
    marginHorizontal: 5,
    paddingHorizontal: 10,
    fontFamily: "Devanagari-bold",
    backgroundColor: "#fff",
  },
  commentContainer: {
    padding: 10,
    marginTop: 10,
    width: "80%",
    borderColor: "#0070C0",
    borderRadius: 7,
    borderWidth: 1,
    marginBottom: 10,
  },
  commentText: {
    fontFamily: "Devanagari-regular",
  },
  justifyContentBetween: {
    justifyContent: "space-between",
  },
  flex: {
    display: "flex",
    flexDirection: "row",
  },
  inputViewNote: {
    borderColor: "#0070C0",
    borderRadius: 7,
    // borderBottomRightRadius: 7,
    width: "80%",
    height: 48,
    borderWidth: 1,
  },

  TextInputNote: {
    fontFamily: "Devanagari-regular",
    padding: 10,
  },
});
