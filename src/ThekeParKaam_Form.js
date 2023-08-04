import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Image,
  Button,
  ScrollView,
  KeyboardAvoidingView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import BottomTab from "../Component/BottomTab";
import { useDispatch, useSelector } from "react-redux";
import Service from "../service/index";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { selectToken } from "../slices/authSlice";
import { BackHandler } from "react-native";
const { height } = Dimensions.get("window");
import {
  setDate,
  setTime,
  setDescription,
  setLandArea,
  setLandType,
  setTotalAmount,
} from "../slices/SahayakBookingSlice";
import moment from "moment";

import Toast from "react-native-simple-toast";

import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";

export default function ThekeParKaam_Form({ navigation }) {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDateState] = useState(new Date());
  const [defaultDate, setDefaultDate] = useState(new Date());
  const textInputRef = useRef(null);
  const [time, setTimes] = useState("");
  const [description, setDescriptions] = useState("");
  const [landType, setLandTypes] = useState("");
  const [landArea, setLandAreas] = useState("");
  console.log(landArea, landType);
  const [showDate, setShowDate] = useState("");
  const [totalAmount, setTotalAmounts] = useState("");
  const [selectedDates, setSelectedDates] = useState("");
  const [katayiValue, setKatayiValue] = useState();
  const [mode, setMode] = useState("date");
  const [errors, setErrors] = useState({
    showDate: "",
    time: "",
    description: "",
    landType: "",
    landArea: "",
    totalAmount: "",
  });

  var isTimeSelected = false;
  const pickerRef = useRef();
  function open() {
    pickerRef.current.focus();
  }

  function close() {
    pickerRef.current.blur();
  }

  ////-----Time Selection Validation -----////
  const timings = [
    4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
    24,
  ];

  const checkIfTimeEnabled = (timeSelect) => {
    let currentDateTime = moment();

    let currentDate = currentDateTime.format("YYYY-MM-DD");
    // console.log(currentDate);
    // console.log(showDate);
    if (currentDate === showDate) {
      let time = parseInt(currentDateTime.format("H"));

      let enabledTime = time + 3;

      if (timeSelect > time + 3) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  };
  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const timeConverted = (item) => {
    if (item < 24 && item > 12) {
      item = item - 12;
      return item + " PM";
    } else if (item === 12) {
      return item + " PM";
    } else if (item < 12) {
      return item + " AM";
    } else if (item === 24) {
      item = item - 12;
      return item + " AM";
    }
  };
  const handleTimeChange = (value) => {
    setTimes(value);
    // dispatch(setTime(value));
  };

  ///---time selection validation

  ////---Date picker ----///
  const onChange = (event, selectedDate) => {
    setDefaultDate(selectedDate);
    const currentDate = moment(selectedDate).format("YYYY-MM-DD HH:mm");
    const showDate = moment(selectedDate).format("YYYY-MM-DD");
    setDate(currentDate);
    setShowDate(showDate);

    let currentDateTime = moment();

    let currentDay = currentDateTime.format("YYYY-MM-DD");
    if (currentDay === showDate) {
      let time = parseInt(currentDateTime.format("H"));
      console.log("timetimetime", time);

      let enabledTime = time + 3;
      setTimes("");
    }
  };

  const showMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: defaultDate,
      minimumDate: new Date(),
      onChange,
      maximumDate: dateValidate(),
      mode: currentMode,
      is24Hour: true,
    });
  };
  const dateValidate = () => {
    let currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() + 1);
    return currentDate;
  };

  const showDatepicker = () => {
    isTimeSelected = false;
    showMode("date");
  };

  const handleDateChange = (value) => {
    alert(value);
  };
  //---End of Date picker ---///

  ///--Land Type Dropdown ---///
  const landtypes = [
    {
      id: 0,
      name: "Killa",
    },
    {
      id: 1,
      name: "Bigha",
    },
  ];

  ///---End of land type dropdown ---///

  const handleDescriptionChange = (value) => {
    setDescriptions(value);
    dispatch(setDescription(value));
  };

  const handleLandTypeChange = (value) => {
    setLandTypes(value);
    dispatch(setLandType(value));
  };

  const handleLandAreaChange = (value) => {
    setLandAreas(value);
    dispatch(setLandArea(value));
  };

  const handleTotalAmount = (value) => {
    setTotalAmounts(value);
    dispatch(setTotalAmount(value));
  };
  const handleBooking = async () => {
    setIsLoading(true);
    let landtype = "";
    let landarea = "";
    if (landType === "") {
      landtype = "None";
    } else {
      landtype = landType;
    }
    if (landArea === "") {
      landarea = "0";
    } else {
      landarea = landArea;
    }
    try {
      const datetime =
        moment(showDate).format("YYYY-MM-DD") +
        "T" +
        moment(time, "h:mm A").format("HH:mm:ss.SSSSSS");
      const params = {
        datetime: datetime,
        description: description,
        land_type: landtype,
        land_area: landarea,
        total_amount_theka: totalAmount,
      };
      console.log("token", token);
      console.log("params", params);

      const response = await Service.post("/api/post_thekepekam/", params, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response?.data;
      if (data?.status === 201) {
        // Toast.show("नौकरी सफलतापूर्वक पोस्ट हो गई है!", Toast.LONG);
        navigation.navigate("MyBookingStack", { screen: "MyBooking" });
        console.log("ThekeDaar job data", data);
      } else {
        Toast.show(
          "यह नौकरी पहले ही पोस्ट की जा चुकी है! कृपया नौकरी का विवरण बदलें",
          Toast.LONG
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  // validate fields start

  const validate = () => {
    let valid = true;
    let errorMessages = {
      showDate: "",
      time: "",
      description: "",
      landType: "",
      landArea: "",
      totalAmount: "",
    };

    if (showDate === "") {
      errorMessages.showDate = "कृपया कोई मान्य दिनांक दर्ज करें!";
      valid = false;
    }

    if (time === "") {
      errorMessages.time = "कृपया एक वैध समय चुनें!";
      valid = false;
    }
    if (description.trim() === "") {
      errorMessages.description = "कृपया विवरण दर्ज करें!";
      valid = false;
    } else if (!/^[^0-9]+$/.test(description.trim())) {
      errorMessages.description =
        "कृपया एक वैध विवरण दर्ज करें (केवल अक्षरों में लिखें)!";
      valid = false;
    }

    // if (landType.trim() === "") {
    //   errorMessages.landType = "कृपया भूमि का प्रकार चुनें!";
    //   valid = false;
    // }

    if (landArea.trim() !== "") {
      if (!/^[0-9]+$/.test(landArea)) {
        errorMessages.landArea = "कृपया एक वैध भूमि क्षेत्र दर्ज करें!";
        valid = false;
      } else if (parseFloat(landArea.trim()) > 100) {
        errorMessages.landArea = "कृपया 100 से कम भूमि क्षेत्र दर्ज करें!";
        valid = false;
      }
    }
    if (totalAmount.trim() === "") {
      errorMessages.totalAmount = "कृपया भुगतान राशि दर्ज करें!";
      valid = false;
    } else if (!/^\d+$/.test(totalAmount.trim())) {
      errorMessages.totalAmount = "केवल संख्याओं की अनुमति है!";
      valid = false;
    } else if (parseFloat(totalAmount.trim()) <= 5) {
      errorMessages.totalAmount = "कृपया 5 से अधिक भुगतान राशि दर्ज करें!";
      valid = false;
    }

    setErrors(errorMessages);
    return valid;
  };

  // end validation
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ marginHorizontal: 20 }}>
        <View style={{ padding: 20, marginTop: 25 }}>
          {/* <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrowleft" size={25} />
          </TouchableOpacity> */}
        </View>
        <View>
          {isLoading && <ActivityIndicator size="small" color="#black" />}
        </View>
        <KeyboardAwareScrollView
          enableAutomaticScroll={true}
          showsVerticalScrollIndicator={false}
        >
          <KeyboardAvoidingView
            behavior="padding"
            style={{ height: height * 0.8 }}
          >
            <>
              <View>
                <View>
                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: 30,
                      fontWeight: "600",
                    }}
                  >
                    सहायक बुकिंग
                  </Text>
                </View>

                <View style={styles.OptionButton}>
                  <TouchableOpacity
                    style={styles.sahayak}
                    onPress={() => navigation.navigate("Thekeparkaam")}
                  >
                    <Text style={[styles.loginText, { color: "#fff" }]}>
                      ठेके पर काम
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.machine}
                    onPress={() => navigation.navigate("SahayakForm")}
                  >
                    <Text style={styles.loginText}>सहायक</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View>
                <View
                  style={[
                    styles.inputView,
                    styles.flex,
                    styles.justifyContentBetween,
                  ]}
                >
                  <TouchableOpacity
                    style={{ paddingVertical: 10, paddingHorizontal: 5 }}
                    onPress={showDatepicker}
                    title={showDate ? showDate : "तारीख़   dd/mm/yyyy"}
                  >
                    <Text style={{ color: showDate ? "#000" : "#ccc" }}>
                      {showDate ? showDate : "तारीख़   dd/mm/yyyy"}
                    </Text>
                  </TouchableOpacity>

                  <TextInput
                    value={selectedDates}
                    editable={false}
                    onChangeText={(date) => {
                      handleDateChange(date);
                      // setDate(date);
                    }}
                  />
                  <TouchableOpacity onPress={showDatepicker}>
                    <Image
                      source={require("../assets/image/calendar.png")}
                      style={{ width: 20, height: 20, right: 10 }}
                    />
                  </TouchableOpacity>
                </View>
                {!!errors.showDate && (
                  <Text style={styles.error}>{errors.showDate}</Text>
                )}

                <View
                  style={[
                    styles.dropdownGender,
                    styles.justifyContentBetween,
                    styles.flex,
                  ]}
                >
                  <Picker
                    ref={pickerRef}
                    selectedValue={time}
                    style={{ width: "100%" }}
                    onValueChange={handleTimeChange}
                  >
                    <Picker.Item
                      style={{ color: time ? "#000" : "#ccc" }}
                      label={time ? timeConverted(time) : "-समय-"}
                      value=""
                    />
                    {timings.map((item, index) => {
                      return (
                        <Picker.Item
                          key={index}
                          style={{
                            color: checkIfTimeEnabled(item) ? "black" : "gray",
                            fontSize: 14,
                          }}
                          label={timeConverted(item)}
                          value={item.toString()}
                          enabled={checkIfTimeEnabled(item)}
                        />
                      );
                    })}
                  </Picker>
                </View>
                {!!errors.time && (
                  <Text style={styles.error}>{errors.time}</Text>
                )}

                <View
                  style={[
                    styles.inputView,
                    styles.flex,
                    styles.justifyContentBetween,
                  ]}
                >
                  <TextInput
                    style={[styles.TextInput]}
                    placeholder="काम लिखें 15 शब्दों से कम,नंबर न लिखें "
                    placeholderTextColor={"#ccc"}
                    onChangeText={(description) =>
                      handleDescriptionChange(description)
                    }
                    value={description}
                  />
                </View>
                {!!errors.description && (
                  <Text style={styles.error}>{errors.description}</Text>
                )}

                <View
                  style={{
                    flexDirection: "row",

                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ maxWidth: "50%", width: "100%" }}>
                    <View
                      style={[
                        styles.inputView,
                        { width: "100%" },
                        { marginRight: 10 },
                        // styles.flex,
                        // styles.justifyContentBetween,
                      ]}
                    >
                      <TextInput
                        style={[styles.TextInput]}
                        maxLength={2}
                        placeholder="भूमि क्षेत्र"
                        keyboardType="numeric"
                        onChangeText={(landArea) =>
                          handleLandAreaChange(landArea)
                        }
                        value={landArea}
                      />
                    </View>
                    {!!errors.landArea && (
                      <Text style={styles.error}>{errors.landArea}</Text>
                    )}
                  </View>

                  <View style={{ maxWidth: "50%", width: "100%" }}>
                    <View
                      style={[
                        styles.inputView,
                        styles.flex,
                        styles.justifyContentBetween,
                        { marginLeft: 10 },

                        // styles.flex,
                        // styles.justifyContentBetween,
                      ]}
                    >
                      <Picker
                        style={{ width: "100%" }}
                        ref={pickerRef}
                        selectedValue={landType}
                        onValueChange={(itemValue, itemIndex) =>
                          setLandTypes(itemValue)
                        }
                      >
                        <Picker.Item
                          style={{ color: landType ? "#000" : "#ccc" }}
                          label="किल्ला/बीघा"
                          value=""
                        />
                        {landtypes.map((item) => (
                          <Picker.Item
                            label={item.name === "Bigha" ? "बीघा" : "किल्ला"}
                            value={item.name}
                            key={item.id}
                          />
                        ))}
                      </Picker>
                    </View>
                    {!!errors.landType && (
                      <Text style={styles.error}>{errors.landType}</Text>
                    )}
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    textInputRef.current.focus();
                  }}
                >
                  <View
                    style={[
                      styles.inputView,
                      {
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      },
                    ]}
                  >
                    <Text style={{ color: "#ccc", marginTop: 14, left: 10 }}>
                      वेतन
                    </Text>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text style={{ color: "#0099FF" }}>₹ </Text>
                      <TextInput
                        ref={textInputRef}
                        style={[
                          styles.TextInput,
                          { right: 10, color: "#0099FF" },
                        ]}
                        keyboardType="numeric"
                        placeholderTextColor={"#0099FF"}
                        value={totalAmount}
                        placeholder="0.00"
                        onChangeText={(totalAmount) =>
                          handleTotalAmount(totalAmount)
                        }
                      />
                    </View>
                  </View>
                  {!!errors.totalAmount && (
                    <Text style={styles.error}>{errors.totalAmount}</Text>
                  )}
                </TouchableOpacity>

                {/* {!!errors.totalAmount && (
                  <Text style={styles.error}>{errors.totalAmount}</Text>
                )} */}

                <TouchableOpacity
                  onPress={() => {
                    if (!isLoading) {
                      if (validate()) {
                        handleBooking();
                      }
                    }
                  }}
                  style={!isLoading ? styles.loginBtn : styles.disableBtn}
                >
                  <Text style={[styles.loginText, { color: "#fff" }]}>
                    बुकिंग करें
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          </KeyboardAvoidingView>
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  OptionButton: {
    flexDirection: "row",
  },

  sahayak: {
    width: "45%",
    color: "#505050",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    // borderWidth:1,
    borderRadius: 10,
    marginHorizontal: 10,
    // borderColor:"#505050",
    backgroundColor: "#44A347",
  },

  dropdownGender: {
    borderColor: "#0070C0",
    borderRadius: 7,
    // borderBottomRightRadius: 7,
    // width: "80%",
    height: 48,
    marginTop: 15,
    borderWidth: 1,
  },

  machine: {
    width: "45%",
    flexDirection: "row",
    // borderRadius: 7,
    color: "#505050",
    height: 50,
    alignItems: "center",
    //   justifyContent:"",
    justifyContent: "center",
    marginTop: 30,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#505050",
    // backgroundColor: "#44A347",
  },

  loginText: {
    color: "#000",
    fontSize: 16,
    //   flexDirection:"column",
  },
  error: {
    color: "red",
    fontSize: 13,
  },

  loginBtn: {
    width: "100%",
    borderRadius: 7,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    backgroundColor: "#0099FF",
  },
  disableBtn: {
    width: "100%",
    borderRadius: 7,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    backgroundColor: "#D3D3D3",
  },

  VerifyText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 18,
  },

  inputView: {
    borderColor: "#0070C0",
    borderRadius: 7,
    // borderBottomRightRadius: 7,
    // width: "80%",
    height: 48,
    marginTop: 20,
    borderWidth: 1,
  },

  TextInput: {
    // height: 50,
    padding: 10,
    // lineHeight:50,
    // fontFamily: "Poppin-Light",
  },

  CheckTextInput: {
    textAlign: "center",
    marginTop: 10,
  },

  TaxView: {
    borderColor: "#0070C0",
    borderRadius: 7,
    // borderBottomRightRadius: 7,
    width: "45%",
    // height: 100,
    marginTop: 20,
    borderWidth: 1,
  },

  BhumiView: {
    borderColor: "#0070C0",
    borderRadius: 7,
    // borderBottomRightRadius: 0,
    // borderTopRightRadius:0,
    width: "50%",
    height: 48,
    marginTop: 20,
    borderWidth: 1,
  },

  TimeView: {
    borderColor: "#0070C0",
    borderRadius: 7,
    // borderBottomRightRadius: 7,
    width: "35%",
    // height: 100,
    marginTop: 20,
    borderWidth: 1,
  },

  FemalecheckView: {
    borderColor: "#0070C0",
    borderRadius: 7,
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 0,
    width: "40%",
    height: 48,
    marginTop: 30,
    borderWidth: 1,
  },
  flex: {
    alignItems: "center",
    flexDirection: "row",
  },
  justifyContentBetween: {
    justifyContent: "space-between",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
});
