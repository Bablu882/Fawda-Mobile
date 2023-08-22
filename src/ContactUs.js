import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  ScrollView,
  Button,
  Alert,
  Linking,
  //   RadioButton
} from "react-native";

import Icon from "react-native-vector-icons/AntDesign";
import { useDispatch, useSelector } from "react-redux";
import {
  selectIsLoggedIn,
  selectToken,
  setToken,
  clearAuth,
} from "../slices/authSlice";
import Service from "../service/index";
// import * as Linking from "expo-linking";

import Toast from "react-native-simple-toast";
import AsyncStorage from "@react-native-async-storage/async-storage";

// import * as Location from "expo-location";

export default function ContactUs({ navigation, route }) {
  // const { user  } = route.params;
  // console.log("fnkfjk", user);
  const token = useSelector(selectToken);
  const [phoneno, setphoneno] = useState("");
  const [state, setState] = useState("");
  const dispatch = useDispatch();
  const [Data, setData] = useState("");
  const [loading, setLoading] = useState(false);
  const [appVersion, setAppVersion] = useState(0);

  const handleCallPress = async () => {
    const url = `tel:${phoneno}`;
    await Linking.openURL(url);
    // await Linking.canOpenURL(url)
    //   ?.then(async (supported) => {
    //     if (!supported) {
    //       console.log("Phone number is not available");
    //     } else {
    //       await Linking.openURL(url);
    //       // return Linking.openURL(url);
    //     }
    //   })
    //   .catch((err) => console.error("An error occurred", err));
  };

  const validatePhone = () => {
    const phoneRegex = /^\d{10}$/;
    if (!phoneno) {
      setErrors({ phoneno: "Please enter a phone number" });
    } else if (!phoneRegex.test(phoneno)) {
      setErrors({ phoneno: "Please enter a valid phone number" });
    } else {
      setErrors({});
    }
  };

  const detailList = async () => {
    try {
      const response = await Service.get("/api/client_user_info/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;
      console.log("Contact Data", data);
      setState(data.user_details);
      setphoneno(data?.client_info?.phone_no);
      setAppVersion(data?.app_version);
      console.log(phoneno, "checkhone");
      setData(data);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    detailList();
  }, [0]);

  const Logout = async () => {
    try {
      const response = await Service.post("/api/logout/", null, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response?.data;
      console.log("logout data", data);
      dispatch(clearAuth());
      navigation.replace("Login");
    } catch (error) {
      console.log("Error", error);
    }
  };

  const deactivateAccount = async () => {
    setLoading(true);
    try {
      const response = await Service.post("/api/delete-account/", null, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const deactivateResponse = response.data;
      const status = deactivateResponse.status;
      console.log("Deactivate Response", deactivateResponse);
      if (status === "success") {
        Toast.show("खाता निष्क्रिय!", Toast.LONG);
        dispatch(clearAuth());
        navigation.replace("Login");
      } else {
        Toast.show(
          "सुनिश्चित करें कि कोई भी नौकरी/बुकिंग की स्थिति (बुक्ड) या (जारी है) नहीं हो!",
          Toast.LONG
        );
      }
    } catch (error) {
      console.log("deactivate error ", error);
      Toast.show(
        "कुछ समस्या आ रही है, कृपया बाद में पुनः प्रयास करें!",
        Toast.LONG
      );
      console.log("error", JSON.stringify(error.message));
      // navigation.replace("Login");
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = () => {
    Alert.alert("खाता हटाएं", "क्या आप अपना खाता हटाना चाहते हैं ?", [
      {
        text: "नहीं",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "हाँ",
        onPress: () => {
          deactivateAccount();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={{ backgroundColor: "#fff", flex: 1 }}>
      <View style={{ padding: 20, marginTop: 25 }}>
        {/* <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrowleft" size={25} />
        </TouchableOpacity> */}
      </View>
      <ScrollView horizontal={false} showsVerticalScrollIndicator={false}>
        <View>
          <View style={{ justifyContent: "center" }}>
            <Text
              style={{
                textAlign: "center",
                fontSize: 30,
                fontWeight: "600",
                fontFamily: "Devanagari-bold",
              }}
            >
              संपर्क करें
            </Text>
          </View>
          <View
            style={{
              marginHorizontal: 13,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                flex: 1,
                position: "relative",
                alignItems: "center",
              }}
            >
              <View style={[styles.inputView]}>
                <Text style={styles.label}>फ़ोन:</Text>
                <Text
                  style={[
                    styles.TextInput,
                    { width: "90%", marginHorizontal: 10, marginTop: 3 },
                  ]}
                  placeholder=""
                  placeholderTextColor={"#848484"}
                >
                  {phoneno}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  handleCallPress();
                }}
                style={{
                  position: "absolute",
                  right: 0,
                  backgroundColor: "#0099FF",
                  paddingVertical: 13,
                  bottom: 0,
                  paddingHorizontal: 18,
                  borderRadius: 8,
                  elevation: 7,
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 16,
                    fontFamily: "Devanagari-bold",
                  }}
                >
                  कॉल करें{" "}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ justifyContent: "center", marginTop: 20 }}>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 30,
                  fontWeight: "600",
                  fontFamily: "Devanagari-bold",
                }}
              >
                रजिस्ट्रेशन
              </Text>
            </View>
            <View style={[styles.inputView, { position: "relative" }]}>
              <Text
                style={{
                  position: "absolute",
                  top: -10,
                  left: 30,
                  width: "10%",
                  textAlign: "center",
                  backgroundColor: "#fff",
                }}
              >
                नाम:
              </Text>
              <Text
                style={styles.TextInput}
                placeholder=""
                placeholderTextColor={"#848484"}
              >
                {state.name}
              </Text>
            </View>
            <View style={[styles.inputView, { position: "relative" }]}>
              <Text style={styles.label}>लिंग:</Text>
              <Text
                style={styles.TextInput}
                placeholder=""
                placeholderTextColor={"#848484"}
              >
                {state.gender === "Male"
                  ? "पुरुष"
                  : state.gender === "Female"
                  ? "महिला"
                  : null}
              </Text>
            </View>
            <View style={[styles.inputView, { position: "relative" }]}>
              <Text style={styles.label}>फ़ोन:</Text>
              <Text
                style={styles.TextInput}
                placeholder=""
                placeholderTextColor={"#848484"}
              >
                {state.phone}
              </Text>
            </View>

            <View style={styles.flex}>
              <View style={[styles.DoubleView, { position: "relative" }]}>
                <Text style={styles.label}>मोहल्ला</Text>
                <Text
                  style={styles.TextInput}
                  placeholder=""
                  placeholderTextColor={"#848484"}
                >
                  {state.mohalla}
                </Text>
              </View>
              <View style={[styles.DoubleView, { position: "relative" }]}>
                <Text style={styles.label}>गांव</Text>
                <Text
                  style={styles.TextInput}
                  placeholder=""
                  placeholderTextColor={"#848484"}
                >
                  {state.village}
                </Text>
              </View>
            </View>

            <View style={styles.flex}>
              <View style={[styles.DoubleView, { position: "relative" }]}>
                <Text style={styles.label}>राज्य</Text>
                <Text style={styles.TextInput}>{state.state}</Text>
              </View>
              <View style={[styles.DoubleView, { position: "relative" }]}>
                <Text style={styles.label}>जिला</Text>
                <Text style={styles.TextInput}>{state.district}</Text>
              </View>
            </View>
            <View style={[styles.inputView, { position: "relative" }]}>
              <Text style={styles.label}>पिन कोड :</Text>
              <Text
                style={styles.TextInput}
                placeholder=""
                placeholderTextColor={"#848484"}
              >
                {state.pincode}
              </Text>
            </View>
            <View style={{ paddingTop: 30 }}>
              <View style={styles.flexbetween}>
                <Text style={{ fontFamily: "Devanagari-bold" }}>
                  हमारे बारे में{" "}
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("about_us", {
                      terms: Data,
                    })
                  }
                >
                  <Icon name="right" size={18} color="#0099FF" />
                </TouchableOpacity>
              </View>
              <View style={styles.flexbetween}>
                <Text style={{ fontFamily: "Devanagari-bold" }}>
                  नियम और शर्तें{" "}
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("terms", {
                      terms: Data,
                    })
                  }
                >
                  <Icon name="right" size={18} color="#0099FF" />
                </TouchableOpacity>
              </View>
              <View style={styles.flexbetween}>
                <Text style={{ fontFamily: "Devanagari-bold" }}>
                  प्राइवेसी नीति
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("privacy", {
                      terms: Data,
                    })
                  }
                >
                  <Icon name="right" size={18} color="#0099FF" />
                </TouchableOpacity>
              </View>
              <View style={styles.flexbetween}>
                <Text style={{ fontFamily: "Devanagari-bold" }}>वरजन</Text>
                <Text style={{ color: "#0099FF", fontSize: 16 }}>
                  {appVersion}
                </Text>
              </View>
              <View style={styles.flexbetween}>
                <Text style={{ fontFamily: "Devanagari-bold" }}>
                  खाता हटाएं
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    deleteAccount();
                  }}
                >
                  <Icon name="right" size={18} color="#0099FF" />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                Logout();
              }}
              style={styles.loginBtn}
            >
              <Text style={styles.loginText}>लॉग आउट करें </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  inputView: {
    borderColor: "#0099FF",
    borderRadius: 7,
    // borderBottomRightRadius: 7,
    width: "100%",
    height: 48,
    marginTop: 30,
    borderWidth: 1,
  },
  label: {
    position: "absolute",
    top: -10,
    left: 30,
    fontFamily: "Devanagari-bold",
    paddingHorizontal: 10,

    textAlign: "center",
    backgroundColor: "#fff",
  },
  TextInput: {
    height: 50,
    padding: 10,
    fontFamily: "Devanagari-regular",
    // fontFamily: "Poppin-Light",
  },

  CheckTextInput: {
    textAlign: "center",
    marginTop: 10,
  },

  DoubleView: {
    borderColor: "#0099FF",
    borderRadius: 7,
    // borderBottomRightRadius: 7,
    width: "50%",
    height: 48,
    marginHorizontal: 10,
    marginTop: 30,
    borderWidth: 1,
  },
  justifyContent: {
    justifyContent: "center",
  },
  alignItems: {
    flexDirection: "row",
    alignItems: "center",
  },
  flex: {
    flexDirection: "row",

    justifyContent: "space-evenly",
  },

  loginBtn: {
    width: "100%",

    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    backgroundColor: "#0099FF",
  },
  loginText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Devanagari-bold",
  },
  error: {
    color: "red",
    fontSize: 12,
  },
  flexbetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 10,
    alignItems: "center",
  },
});
