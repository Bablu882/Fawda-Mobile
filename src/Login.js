
import { useFocusEffect } from "@react-navigation/core";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import Service from "../service/index";
import Toast from 'react-native-root-toast';

import { useDispatch, useSelector } from "react-redux";
import { selectIsLoggedIn, setToken } from "../slices/authSlice";
import { useIsFocused } from "@react-navigation/native";

export default function Login({ navigation }) {
  const [phone, setPhone] = useState("");
  const [isPhoneEmpty, setIsPhoneEmpty] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});
  const dispatch = useDispatch();
  const isfocused = useIsFocused();
  const isLoggedIn = useSelector(selectIsLoggedIn);

  useEffect(() => {
    if (isLoggedIn) {
      navigation.navigate("HomePage");
    }
  }, []);

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
        // dispatch(setToken(loginResponse?.token));
        Toast.show(JSON.stringify(loginResponse.otp), Toast.LONG);
        navigation.replace("Verification", {
          user_type: loginResponse.user_type, 
          phone
        });
      } else {
        Toast.show("User is not Registered", Toast.SHORT);
        navigation.replace("Register", { phone });
        console.log("phone:", phone);
      }
    } catch (error) {
      console.log(error);
      Toast.show("Invalid Credentials", Toast.SHORT);
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
    } else if (phone.length < 10 ||!/^[0-9]+$/.test(phone)) {
      errors.phone = "कृपया एक वैध फ़ोन नंबर लिखें";
      setIsPhoneEmpty(false);
      isValid = false;
  
    } else {
      setIsPhoneEmpty(false);
    }

    setErrorMessages(errors);
    return isValid;
  };

  return (
    <View style={styles.container}>
      {/* <Text>{deviceId}</Text> */}
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          flex: 1,
        }}
      >
        <Image
          source={require("../assets/image/Fawda-logo.png")}
          style={{
            width: 220,
            height: 200,
            alignItems: "center",
            marginBottom: 30,
          }}
        />

        <View
          style={{ flexDirection: "row", alignItems: "center", marginTop: 30 }}
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
              style={[styles.codeText, { width: 30, height: 22 }]}
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
      </View>

      <View
        style={{
          display: "flex",
          flexDirection: "row",
          width: "70%",
          marginBottom: 20,
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
        <Text style={{ textAlign: "center" }}>
          अगर आप आगे बढ़ते है आप हमारी नियम और शर्तों और प्राइवेसी नीति से सहमत
          हैं
        </Text>
      </View>
    </View>
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
    color: "#000",
    textAlign: "center",
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
  },
  loginText: {
    color: "#fff",
  },
});
