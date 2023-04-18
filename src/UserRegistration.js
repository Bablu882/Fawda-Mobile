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
} from "react-native";

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
  const { user } = route?.params??{};
  const token = useSelector(selectToken);
  const [checked, setChecked] = React.useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setphone] = useState(route?.params?.phone || "");
  const [village, setVillage] = useState("");
  const [mohalla, setMohalla] = useState("");
  const [state, setState] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [district, setDistrict] = useState([]);
  const [location, setLocation] = useState({ latitude: "", longitude: "" });

  const [errors, setErrors] = useState({
    name: "",
    gender: "",
    phone: "",
    mohalla: "",
    village: "",
    state: "",
    district: "",
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
    };
    if (name.trim() === "") {
      errorMessages.name = "Please enter your name";
      valid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
      errorMessages.name =
        "Please enter a valid name (letters and spaces only)";
      valid = false;
    }

    if (gender === "") {
      errorMessages.gender = "Please select your gender";
      valid = false;
    }
    if (phone.trim() === "") {
      errorMessages.phone = "Please enter your phone number";
      valid = false;
    } else if (phone.trim().length < 10) {
      errorMessages.phone = "Please enter a valid phone number";
      valid = false;
    }
    if (mohalla.trim() === "") {
      errorMessages.mohalla = "Please enter your mohalla";
      valid = false;
    }
    // else if (!/^[a-zA-Z0-9\s]+$/.test(mohalla.trim())) {
    //   errorMessages.mohalla = "Please enter a valid mohalla (alphanumeric characters and spaces only)";
    //   valid = false;
    // }
    if (selectedState.trim() === "") {
      errorMessages.state = "Please select your state";
      valid = false;
    }

    if (selectedDistrict.trim() === "") {
      errorMessages.district = "Please select your district";
      valid = false;
    }
    if (village.trim() === "") {
      errorMessages.village = "Please enter your village";
      valid = false;
    }

    setErrors(errorMessages);
    return valid;
  };

  const handleGenderSelection = (value) => {
    setGender(value);
    setErrors({ ...errors, gender: "" });
  };

  const handleSubmit = () => {
    if (validate()) {
      // submit form here
      console.log("Form submitted");
    } else {
      console.log("Form has errors");
    }
  };

  const RegisterServices = async () => {
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
        device_id: "74747474747",
      };
      console.log("registerparams", params);

      const response = await Service.post("/api/register/", params, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = response?.data;
      console.log("register", data);
 
      if (data?.success === true || data?.status == 201) {
        const token = data?.token;
        dispatch(setToken(token));
        Toast.show("Registration successful", Toast.SHORT);
        Toast.show(JSON.stringify(data.otp), Toast.LONG);
        console.log("fjfjfjf", data);

        navigation.replace("Verification", { user_type: user, phone });
        console.log("djdjkd", user_type);
      } else if (data?.error) {
        Toast.show(data.error, Toast.SHORT);
      } else {
        Toast.show(
          "Something went wrong. Please try again later.",
          Toast.SHORT
        );
      }
    } catch (error) {
      console.log(error);
      Toast.show("Something went wrong. Please try again later.", Toast.SHORT);
    }
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
      // Toast.show("Error Occurred. Please try again later.", Toast.SORT);
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
        return;
      }

      let { coords } = await Location.getCurrentPositionAsync({});
      setLocation(coords);
      // console.log("locationlocation",location);
    })();
  }, []);
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
      <KeyboardAwareScrollView
        enableAutomaticScroll={true}
        showsVerticalScrollIndicator={false}
      >
        <KeyboardAvoidingView
          behavior="padding"
          style={{ height: height * 0.8 }}
        >
          <View
            style={{
              marginHorizontal: 13,
              marginTop: 30,
            }}
          >
            <View style={{ display: "none" }}>
              <Text>Latitude: {JSON.stringify(location.latitude)}</Text>
              {/* <Text>Longitude: {location.longitude}</Text> */}
              {console.log("location", location.latitude)}
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
                      label="Male"
                      value="Male"
                      uncheckedColor="transparent"
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={[styles.FemalecheckView, { position: "relative" }]}
                >
                  <TouchableOpacity>
                    <RadioButton.Item
                      label="Female"
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
              <TextInput
                style={styles.TextInput}
                keyboardType="numeric"
                maxLength={10}
                placeholder=""
                placeholderTextColor={"#848484"}
                onChangeText={(phone) => setphone(phone, "phone")}
                defaultValue={phone}
              />
              {!!errors.phone && (
                <Text style={styles.error}>{errors.phone}</Text>
              )}
            </View>

            <View style={styles.flex}>
              <View style={[styles.DoubleView, { position: "relative" }]}>
                <Text style={styles.label}>मोहल्ला</Text>
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
                <Text style={styles.label}>गांव</Text>
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
                <Text style={styles.label}>राज्य</Text>
                <Picker
                  selectedValue={selectedState}
                  onValueChange={(itemValue, itemIndex) => {
                    setSelectedState(itemValue);
                    console.log("jnjdjdjdjd", itemValue);
                    districtapi(itemValue);
                  }}
                >
                  <Picker.Item
                    label="राज्य"
                    value=""
                    enabled={false}
                    style={{ color: "#ccc" }}
                  />
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
              <View style={[styles.DoubleView, { position: "relative" }]}>
                <Text style={styles.label}>जिला</Text>
                <Picker
                  selectedValue={selectedDistrict}
                  onValueChange={(itemValue, itemIndex) =>
                    setSelectedDistrict(itemValue)
                  }
                >
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
                {/* <Picker
              selectedValue={selectedDistrict}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedDistrict(itemValue)
              }
            >
              <Picker.Item
                label="जिला"
                value=""
                enabled={false}
                style={{ color: "#ccc" }}
              />
              {district?.map((item) => (
                <Picker.Item

                  label={item.district}
                  value={item.district}
                />
              ))}
            </Picker> */}
              </View>
            </View>

            <TouchableOpacity
              onPress={() => {
                if (validate()) {
                  RegisterServices();

                  // navigation.navigate("Home")
                }
              }}
              style={styles.loginBtn}
            >
              <Text style={styles.loginText}>आगे बढ़ें</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </KeyboardAwareScrollView>
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
    marginTop: 30,
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
