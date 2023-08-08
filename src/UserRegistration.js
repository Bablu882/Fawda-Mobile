import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Dimensions,
  ScrollView,
  Alert,
} from "react-native";

import * as Linking from "expo-linking";
import Icon from "react-native-vector-icons/AntDesign";
import { useDispatch, useSelector } from "react-redux";
import { selectIsLoggedIn, selectToken, setToken } from "../slices/authSlice";
import Service from "../service/index";
import Toast from "react-native-simple-toast";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Picker } from "@react-native-picker/picker";
import { RadioButton } from "react-native-paper";
const { height } = Dimensions.get("window");

import * as Location from "expo-location";

export default function UserRegistration({ navigation, route }) {
  const { user } = route?.params ?? {};
  const token = useSelector(selectToken);
  const [checked, setChecked] = React.useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setphone] = useState(route?.params?.phone || "");
  const [village, setVillage] = useState("");
  const [mohalla, setMohalla] = useState("");
  const [state, setState] = useState([]);
  const [age, setAge] = useState(0);
  const [pincode, setPincode] = useState(0);
  const [upiId, setUpiId] = useState("");
  const [upi, setUpi] = useState("");
  const [referCode, setReferCode] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [district, setDistrict] = useState([]);
  const [location, setLocation] = useState({ latitude: "", longitude: "" });
  const [isLocationGranted, setIsLocationGranted] = useState(false);
  const [permissionAsked, setPermissionAsked] = useState(false);

  const ageArray = Array.from(
    { length: 70 - 18 + 1 },
    (_, index) => 18 + index
  );

  const [errors, setErrors] = useState({
    name: "",
    gender: "",
    phone: "",
    mohalla: "",
    village: "",
    state: "",
    district: "",
    age: "",
    pincode: "",
    upiid: "",
    refercode: "",
  });
  const dispatch = useDispatch();

  const pickerRef = useRef();
  function open() {
    pickerRef.current.focus();
  }
  function close() {
    pickerRef.current.blur();
  }

  const validate = () => {
    let valid = true;
    let errorMessages = {
      name: "",
      gender: "",
      phone: "",
      mohalla: "",
      village: "",
      state: "",
      district: "",
      age: "",
      pincode: "",
      upiid: "",
      refercode: "",
    };

    if (name.trim() === "") {
      errorMessages.name = "कृपया नाम दर्ज करें!";
      valid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
      errorMessages.name =
        "कृपया एक वैध नाम दर्ज करें (केवल अक्षर और रिक्त स्थान)!";
      valid = false;
    }

    if (gender === "") {
      errorMessages.gender = "कृपया लिंग का चयन करें!";
      valid = false;
    }

    if (phone.trim() === "") {
      errorMessages.phone = "कृपया फ़ोन नंबर दर्ज करें!";
      valid = false;
    } else if (phone.trim().length < 10) {
      errorMessages.phone = "एक मान्य फ़ोन नंबर दर्ज करें!";
      valid = false;
    }

    if (pincode.toString().trim() === "") {
      errorMessages.pincode = "कृपया पिनकोड दर्ज करें!";
      valid = false;
    } else if (pincode.toString().trim().length < 6) {
      errorMessages.pincode = "कृपया एक वैध पिनकोड दर्ज करें!";
      valid = false;
    } else if (!/^\d+$/.test(pincode.trim())) {
      errorMessages.pincode = "केवल संख्याओं की अनुमति है!";
      valid = false;
    }

    if (upiId.trim() === "") {
      errorMessages.upiid = "कृपया यूपीआई आईडी दर्ज करें!";
      valid = false;
    } else if (upiId.trim().length > 100) {
      errorMessages.upiid = "कृपया एक वैध यूपीआई आईडी दर्ज करें!";
      valid = false;
    }

    if (age.toString().trim() === "") {
      errorMessages.age = "कृपया आयु दर्ज करें!";
      valid = false;
    } else if (parseInt(age) < 18 || parseInt(age) > 70) {
      errorMessages.age = "कृपया वैध आयु दर्ज करें (18 से 70 के बीच)!";
      valid = false;
    }
    if (referCode !== "") {
      if (referCode.trim().length > 6) {
        errorMessages.refercode = "कृपया एक वैध रेफरकोड दर्ज करें!";
        valid = false;
      } else if (!/^(?=.*[a-zA-Z])(?=.*\d).+$/.test(referCode)) {
        errorMessages.refercode = "कृपया एक वैध रेफरकोड दर्ज करें!";
        valid = false;
      }
    }

    if (mohalla.trim() === "") {
      errorMessages.mohalla = "कृपया मोहल्ले का नाम दर्ज करें!";
      valid = false;
    }

    if (selectedState.trim() === "") {
      errorMessages.state = "कृपया राज्य का चयन करें!";
      valid = false;
    }

    if (selectedDistrict.trim() === "") {
      errorMessages.district = "कृपया जिला का चयन करें!";
      valid = false;
    }

    if (village.trim() === "") {
      errorMessages.village = "कृपया गांव का नाम दर्ज करें!";
      valid = false;
    }

    setErrors(errorMessages);
    return valid;
  };

  const handleGenderSelection = (value) => {
    setGender(value);
    setErrors({ ...errors, gender: "" });
  };

  const handleAgeChange = (value) => {
    setAge(value);
  };

  const RegisterServices = async () => {
    if (isLocationGranted) {
      let upi = "";
      let refer_code = "";
      if (user !== "Grahak") {
        upi = upiId;
      } else {
        upi = "None";
      }
      if (referCode !== "") {
        refer_code = referCode;
      } else {
        refer_code = "";
      }
      try {
        const params = {
          name,
          gender,
          phone: phone,
          village,
          mohalla,
          state: selectedState,
          district: selectedDistrict,
          user_type: user,
          latitude: location.latitude,
          longitude: location.longitude,
          age: age,
          pincode: pincode,
          upiid: upi,
          refer_code: refer_code,
        };
        console.log("params", params);
        const response = await Service.post("/api/register/", params, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = response?.data;
        if (data?.status == 201) {
          console.log(data, "data");
          // Toast.show("नया उपयोगकर्ता पंजीकरण सफल है", Toast.LONG);
          navigation.replace("Verification", {
            user_type: data?.user_type,
            phone,
          });
        } else if (data?.status === 0) {
          console.log("error", data);
          Toast.show("अमान्य रेफर कोड", Toast.LONG);
        } else if (data?.status === 1) {
          console.log("error", data);
          Toast.show("रेफर कोड समान यूजर प्रकार का होना चाहिए", Toast.LONG);
        } else if (data?.status === 2) {
          console.log("error", data);
          Toast.show("यह रेफर कोड अपनी उपयोग सीमा तक पहुंच गया है", Toast.LONG);
        } else if (data?.status === 3) {
          console.log("error", data);
          Toast.show(
            "रेफर कोड का उपयोग एक ही उपयोगकर्ता द्वारा दो बार नहीं किया जा सकता",
            Toast.LONG
          );
        } else {
          console.log("error", data);
          Toast.show(
            "कुछ समस्या आ रही है, कृपया बाद में पुनः प्रयास करें!",
            Toast.LONG
          );
        }
      } catch (error) {
        console.log(error.data);
        Toast.show(
          "कुछ समस्या आ रही है, कृपया बाद में पुनः प्रयास करें!",
          Toast.LONG
        );
      }
    } else {
      // Toast.show("स्थान की अनुमति आवश्यक है!", Toast.LONG);
      handlePermissionAlert();
    }
  };

  const openAppSettings = async () => {
    await Linking.openSettings();
  };

  const handlePermissionAlert = () => {
    Alert.alert(
      "अनुमति आवश्यक!",
      "इस सुविधा के लिए स्थान अनुमति की आवश्यकता है. क्या आप इसे अभी देना चाहेंगे?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: openAppSettings, // Call the function to open app settings
        },
      ]
    );
  };

  const stateapi = async () => {
    try {
      const response = await Service.get("/api/states/", {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = response.data;
      console.log("data::", data);
      setState(data);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const districtapi = async (val) => {
    const params = {
      state: val,
    };

    try {
      const response = await Service.post("/api/districts/", params, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { data } = response;
      console.log("data:", data);
      setDistrict(data);
    } catch (error) {
      console.log("Error:", error);
    }
  };
  useEffect(() => {
    stateapi();
    if (selectedState) {
      districtapi(selectedState);
    }
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        setIsLocationGranted(false);
        return;
      } else {
        console.log("Permission to access location was granted");
        setIsLocationGranted(true);
      }

      let { coords } = await Location.getCurrentPositionAsync({});
      setLocation(coords);
    })();
  }, []);

  const checkLocationPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      setIsLocationGranted(false);
      handlePermissionAlert();
      return;
    } else {
      setIsLocationGranted(true);
      console.log("Permission to access location was granted");
    }

    let { coords } = await Location.getCurrentPositionAsync({});
    setLocation(coords);
    if (location.latitude !== "" && location.longitude !== "") {
      RegisterServices();
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: "#fff", flex: 1 }}>
      <View style={{ padding: 20, marginTop: 25 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrowleft" size={25} />
        </TouchableOpacity>
      </View>
      <View style={{ justifyContent: "center" }}>
        <Text style={{ textAlign: "center", fontSize: 30, fontWeight: "600" }}>
          {user === "Grahak"
            ? "ग्राहक रजिस्ट्रेशन"
            : user === "Sahayak"
            ? "सहायक रजिस्ट्रेशन"
            : user === "MachineMalik"
            ? "मशीन मालिक रजिस्ट्रेशन"
            : null}
        </Text>
      </View>
      <ScrollView horizontal={false} showsVerticalScrollIndicator={false}>
        {/* <KeyboardAwareScrollView
            enableAutomaticScroll={true}
            showsVerticalScrollIndicator={false}
          >
            <KeyboardAvoidingView
              behavior="padding"
              style={{ height: height * 0.8 }}
            > */}
        <View
          style={{
            marginHorizontal: 13,
            marginTop: 15,
          }}
        >
          <View style={{ display: "none" }}>
            <Text>Latitude: {JSON.stringify(location.latitude)}</Text>
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
            <TextInput
              style={styles.TextInput}
              placeholder=""
              placeholderTextColor={"#848484"}
              onChangeText={(text) => setName(text, "name")}
              // defaultValue={email}
              value={name}
              //   error={input.name}
              //   onFocus={() => handleError(null, "name")}
            />
            {!!errors.name && <Text style={styles.error}>{errors.name}</Text>}
          </View>
          <RadioButton.Group
            onValueChange={handleGenderSelection}
            value={gender}
          >
            <View style={styles.alignItems}>
              <View style={[styles.MaleCheckView, { position: "relative" }]}>
                <Text style={styles.label}>लिंग:</Text>
                <TouchableOpacity>
                  <RadioButton.Item
                    label="पुरुष"
                    value="Male"
                    uncheckedColor="transparent"
                  />
                </TouchableOpacity>
              </View>
              <View style={[styles.FemalecheckView, { position: "relative" }]}>
                <TouchableOpacity>
                  <RadioButton.Item
                    label="महिला"
                    value="Female"
                    uncheckedColor="transparent"
                  />
                </TouchableOpacity>
              </View>
              {/* </View> */}
            </View>
            {!!errors.gender && (
              <Text style={styles.error}>{errors.gender}</Text>
            )}
          </RadioButton.Group>
          <View style={[styles.inputView, { position: "relative" }]}>
            <Text style={styles.label}>फ़ोन:</Text>
            <Text
              style={[styles.TextInput, { marginTop: 5 }]}
              placeholder=""
              placeholderTextColor={"#848484"}
            >
              {phone}
            </Text>
          </View>
          <View
            style={{
              position: "relative",
              borderColor: "#0099FF",
              borderRadius: 7,
              width: "100%",
              height: 50,
              marginTop: 30,
              borderWidth: 1,
            }}
          >
            <Text style={styles.label}>आयु:</Text>
            <Picker
              style={{ width: "100%", paddingTop: 16 }}
              ref={pickerRef}
              selectedValue={age}
              onValueChange={handleAgeChange}
            >
              <Picker.Item label="" value="" />
              {ageArray.map((value) => (
                <Picker.Item
                  label={value.toString()}
                  value={value}
                  key={value}
                />
              ))}
            </Picker>
            {!!errors.age && <Text style={styles.error}>{errors.age}</Text>}
          </View>
          <View style={styles.flex}>
            <View style={[styles.DoubleView, { position: "relative" }]}>
              <Text style={styles.label}>मोहल्ला:</Text>
              <TextInput
                style={styles.TextInput}
                placeholder=""
                placeholderTextColor={"#848484"}
                onChangeText={(text) => setMohalla(text)}
                // defaultValue={email}
                value={mohalla}
              />
              {!!errors.mohalla && (
                <Text style={styles.error}>{errors.mohalla}</Text>
              )}
            </View>
            <View style={[styles.DoubleView, { position: "relative" }]}>
              <Text style={styles.label}>गांव:</Text>
              <TextInput
                style={styles.TextInput}
                placeholder=""
                placeholderTextColor={"#848484"}
                onChangeText={(text) => setVillage(text)}
                // defaultValue={email}
                value={village}
              />
              {!!errors.village && (
                <Text style={styles.error}>{errors.village}</Text>
              )}
            </View>
          </View>

          <View style={styles.flex}>
            <View style={[styles.DoubleView, { position: "relative" }]}>
              <Text style={styles.label}>राज्य:</Text>
              <Picker
                selectedValue={selectedState}
                onValueChange={(itemValue, itemIndex) => {
                  setSelectedState(itemValue);
                  districtapi(itemValue);
                }}
              >
                <Picker.Item label="" value="" enabled={false} />
                {state?.map((state) => (
                  <Picker.Item
                    key={state.id}
                    label={state.name}
                    value={state.name}
                  />
                ))}
              </Picker>
              {!!errors.state && (
                <Text style={styles.error}>{errors.state}</Text>
              )}
            </View>
            <View style={[styles.DoubleView]}>
              <Text style={styles.label}>जिला:</Text>
              <Picker
                style={{ width: "100%" }}
                selectedValue={selectedDistrict}
                onValueChange={(itemValue, itemIndex) =>
                  setSelectedDistrict(itemValue)
                }
              >
                <Picker.Item label="" value="" enabled={false} />
                {district?.map((district, index) => (
                  <Picker.Item
                    key={index}
                    label={district.district}
                    value={district.district}
                  />
                ))}
              </Picker>
              {!!errors.district && (
                <Text style={styles.error}>{errors.district}</Text>
              )}
            </View>
          </View>
          <View style={styles.flex}>
            <View style={[styles.DoubleView, { position: "relative" }]}>
              <Text style={styles.label}>पिन कोड:</Text>
              <TextInput
                style={styles.TextInput}
                placeholder=""
                maxLength={6}
                keyboardType="numeric"
                placeholderTextColor={"#848484"}
                onChangeText={(text) => setPincode(text)}
                value={pincode}
              />
              {!!errors.pincode && (
                <Text style={styles.error}>{errors.pincode}</Text>
              )}
            </View>
          </View>
          <View
            style={{
              position: "relative",
              borderColor: "#0099FF",
              borderRadius: 7,
              width: "100%",
              height: 50,
              marginTop: 30,
              borderWidth: 1,
            }}
          >
            <Text style={styles.label}>Upi Id:</Text>
            <TextInput
              style={styles.TextInput}
              placeholder=""
              placeholderTextColor={"#848484"}
              onChangeText={(text) => setUpiId(text)}
              value={upiId}
            />
            {!!errors.upiid && <Text style={styles.error}>{errors.upiid}</Text>}
          </View>
          {user !== "MachineMalik" && (
            <View
              style={{
                position: "relative",
                borderColor: "#0099FF",
                borderRadius: 7,
                width: "100%",
                height: 50,
                marginTop: 30,
                borderWidth: 1,
              }}
            >
              <Text style={styles.label}>रेफरल कोड (यदि कोई हो):</Text>
              <TextInput
                style={styles.TextInput}
                maxLength={6}
                onChangeText={(text) => setReferCode(text)}
                value={referCode}
                defaultValue=""
              />
              {!!errors.refercode && (
                <Text style={styles.error}>{errors.refercode}</Text>
              )}
            </View>
          )}

          <TouchableOpacity
            onPress={() => {
              if (validate()) {
                checkLocationPermission();
              }
            }}
            // onPress={handleNextButtonPress}
            style={[styles.loginBtn, { marginBottom: 50 }]}
          >
            <Text style={styles.loginText}>आगे बढ़ें</Text>
          </TouchableOpacity>
        </View>
        {/* </KeyboardAvoidingView>
          </KeyboardAwareScrollView> */}
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
    marginTop: 15,
    borderWidth: 1,
  },
  label: {
    position: "absolute",
    top: -10,
    left: 30,

    textAlign: "center",
    backgroundColor: "#fff",
  },
  TextInput: {
    height: 50,
    padding: 10,

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

  MaleCheckView: {
    borderColor: "#0099FF",
    borderRadius: 7,
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
    width: "50%",
    height: 48,
    marginTop: 30,
    borderWidth: 1,
  },

  FemalecheckView: {
    borderColor: "#0099FF",
    borderRadius: 7,
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 0,
    width: "50%",
    height: 48,
    marginTop: 30,
    borderWidth: 1,
  },

  loginBtn: {
    width: "100%",

    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    backgroundColor: "#0099FF",
  },
  loginText: {
    color: "#fff",
    fontSize: 18,
  },
  error: {
    color: "red",
    fontSize: 12,
  },
});
