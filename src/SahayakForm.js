import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import BottomTab from "../Component/BottomTab";
import { useIsFocused } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import Toast from "react-native-simple-toast";

import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

import moment from "moment";
import { selectIsLoggedIn, setToken, selectToken } from "../slices/authSlice";
import {
  setDate,
  setTime,
  setDescription,
  setLandArea,
  setLandType,
  setTotalAmount,
} from "../slices/SahayakBookingSlice";
import { useDispatch, useSelector } from "react-redux";
import service from "../service";

export default function SahayakForm({ navigation }) {
  const dispatch = useDispatch();
  const isfocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(false);
  const token = useSelector(selectToken);
  const [mode, setMode] = useState("date");
  const [maleCounts, setMaleCounts] = useState(0);
  const [defaultDate, setDefaultDate] = useState(new Date());
  const [femaleCounts, setFemaleCounts] = useState(0);
  const [landType, setlandType] = useState("");
  const [selectedDates, setSelectedDates] = useState("");
  const [landArea, setLandAreas] = useState("");
  const [showDate, setShowDate] = useState("");
  const [malepayamount, setMalepayamount] = useState(0);
  const [femalepayamount, setFemalepayamount] = useState(0);
  const [description, setDescriptions] = useState("");
  const [days, setDays] = useState(0);
  const [time, setTimes] = useState("");
  const [total, setTotal] = useState(0);
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
  const daysCount = [1, 2, 3, 4, 5];
  const maleCount = [1, 2, 3, 4, 5, 6];
  const femaleCount = [1, 2, 3, 4, 5, 6];
  const maxMaleCount = Math.min(6 - femaleCounts, 6);
  const maxFemaleCount = Math.min(6 - maleCounts, 6);
  const landTypes = [
    {
      id: 0,
      name: "Killa",
    },
    {
      id: 1,
      name: "Bigha",
    },
  ];

  const timings = [
    4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
    24,
  ];

  const checkIfTimeEnabled = (timeSelect) => {
    let currentDateTime = moment();
    let currentDate = currentDateTime.format("YYYY-MM-DD");
    if (currentDate === showDate) {
      let time = parseInt(currentDateTime.format("H"));

      // let enabledTime = time + 3;

      if (timeSelect > time + 3) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  };

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

  const handleDescriptionChange = (value) => {
    setDescriptions(value);
    dispatch(setDescription(value));
  };

  const handleLandAreaChange = (value) => {
    setLandAreas(value);
    dispatch(setLandArea(value));
  };

  const handleMaleCountChange = (itemValue) => {
    setMaleCounts(itemValue);
    if (itemValue) {
      const remainingFemaleCount = 6 - itemValue;
      if (remainingFemaleCount < femaleCounts) {
        setFemaleCounts(remainingFemaleCount);
      }
    }
  };

  const handleFemaleCountChange = (itemValue) => {
    setFemaleCounts(itemValue);
    if (itemValue) {
      const remainingMaleCount = 6 - itemValue;
      if (remainingMaleCount < maleCounts) {
        setMaleCounts(remainingMaleCount);
      }
    }
  };

  const onChange = (event, selectedDate) => {
    setDefaultDate(selectedDate);
    console.log("isTimeSelected", selectedDate);

    const currentDate = moment(selectedDate).format("YYYY-MM-DD HH:mm");
    const showDate = moment(selectedDate).format("YYYY-MM-DD");
    const showTime = moment(selectedDate).format("H:mm");

    setDate(currentDate);
    setShowDate(showDate);
    console.log("fkdfk", showDate);
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

    if (!days || days.toString().trim() === "") {
      errorMessages.days = "कृपया दिनों की संख्या चुनें!";
      valid = false;
    }

    if (landArea.trim() !== "") {
      if (!/^[0-9]+$/.test(landArea)) {
        errorMessages.landArea = "कृपया एक वैध भूमि क्षेत्र दर्ज करें!";
        valid = false;
      } else if (parseFloat(landArea.trim()) > 100) {
        errorMessages.landArea = "कृपया 100 से कम भूमि क्षेत्र दर्ज करें!";
        valid = false;
      }
    }

    if (
      (femaleCounts !== 0 || femaleCounts.toString().trim() !== "") &&
      !femalepayamount &&
      (maleCounts === 0 || maleCounts.toString().trim() === "") &&
      !malepayamount
    ) {
      errorMessages.femalepayamount = "कृपया महिला वेतन राशि दर्ज करें!";
      valid = false;
    }
    if (
      (femaleCounts === 0 || femaleCounts.toString().trim() === "") &&
      !femalepayamount &&
      (maleCounts !== 0 || maleCounts.toString().trim() !== "") &&
      !malepayamount
    ) {
      errorMessages.malepayamount = "कृपया पुरुष वेतन राशि दर्ज करें!";
      valid = false;
    }

    if (maleCounts === 0 && femaleCounts === 0) {
      errorMessages.maleCounts = "कृपया पुरुष की संख्या चुनें!";
      errorMessages.femaleCounts = "कृपया महिला की संख्या चुनें!";

      valid = false;
    }
    if (
      maleCounts !== 0 &&
      femaleCounts !== 0 &&
      !malepayamount &&
      !femalepayamount
    ) {
      errorMessages.malepayamount = "कृपया पुरुष वेतन राशि दर्ज करें!";
      errorMessages.femalepayamount = "कृपया महिला वेतन राशि दर्ज करें!";
      valid = false;
    }

    setErrors(errorMessages);
    return valid;
  };

  const sahayakBooking = async () => {
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
    const datetime =
      moment(showDate).format("YYYY-MM-DD") +
      "T" +
      moment(time, "h:mm A").format("HH:mm:ss.SSSSSS");
    const params = {
      datetime: datetime,
      // datetime: "2023-03-16 17:05:42.000000",
      description: description,
      land_area: landarea,
      land_type: landtype,
      count_male: maleCounts || "0",
      count_female: femaleCounts || "0",
      pay_amount_male: malepayamount || "0",
      pay_amount_female: femalepayamount || "0",
      num_days: days,
    };

    console.log("paramsparams::", params);

    try {
      const response = await service.post("/api/post_individuals/", params, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response?.data;
      console.log("datadata", data);
      if (data?.status === 201) {
        console.log("form", data);
        // Toast.show("नौकरी सफलतापूर्वक पोस्ट हो गई है!", Toast.LONG);

        navigation.navigate("MyBookingStack", { screen: "MyBooking" });
      } else {
        Toast.show(
          "यह नौकरी पहले ही पोस्ट की जा चुकी है! कृपया नौकरी का विवरण बदलें",
          Toast.LONG
        );
      }
    } catch (error) {
      console.log("Error:", error);
      Toast.show(
        "कुछ समस्या आ रही है, कृपया बाद में पुनः प्रयास करें!",
        Toast.LONG
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const Total =
      (maleCounts * malepayamount + femaleCounts * femalepayamount) * days;
    return setTotal(Total);
  }, [maleCounts, femaleCounts, malepayamount, femalepayamount, days]);

  return (
    <SafeAreaView style={{ backgroundColor: "#fff", flex: 1 }}>
      <View style={{ padding: 20, marginTop: 25 }}>
        {/* <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrowleft" size={25} />
        </TouchableOpacity> */}
      </View>
      <View>
        {isLoading && <ActivityIndicator size="small" color="#black" />}
      </View>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <View style={{ justifyContent: "center" }}>
          <Text
            style={{ textAlign: "center", fontSize: 30, fontWeight: "600" }}
          >
            सहायक बुकिंग
          </Text>
        </View>

        <View style={styles.OptionButton}>
          <TouchableOpacity
            style={styles.sahayak}
            onPress={() => navigation.navigate("Thekeparkaam")}
          >
            <Text style={styles.loginText}>ठेके पर काम</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.machine}>
            <Text style={[styles.loginText, { color: "#fff" }]}>सहायक</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView horizontal={false} showsVerticalScrollIndicator={false}>
        <View style={{ marginHorizontal: 10 }}>
          <View
            style={[
              styles.inputView,
              styles.flex,
              styles.justifyContentBetween,
            ]}
          >
            <Text style={styles.label}>तारीख़</Text>
            <TouchableOpacity
              style={{ paddingVertical: 10, paddingHorizontal: 5 }}
              color="black"
              onPress={showDatepicker}
              title={showDate ? showDate : " yyyy/mm/dd"}
            >
              <Text style={{ color: showDate ? "#000" : "#ccc" }}>
                {showDate ? showDate : " yyyy/mm/dd"}
              </Text>
            </TouchableOpacity>

            <TextInput
              value={selectedDates}
              editable={false}
              onChangeText={(date) => {
                handleDateChange(date);
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
              { width: "100%" },
            ]}
          >
            <Text style={styles.label}>समय</Text>
            <Picker
              ref={pickerRef}
              selectedValue={time}
              style={{ width: "100%" }}
              onValueChange={handleTimeChange}
            >
              <Picker.Item
                style={{ color: time ? "#000" : "#ccc" }}
                label={time ? timeConverted(time) : ""}
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
          {!!errors.time && <Text style={styles.error}>{errors.time}</Text>}

          <View
            style={[
              styles.inputView,
              styles.flex,
              styles.justifyContentBetween,
            ]}
          >
            <Text style={styles.label}>काम का विवरण</Text>
            <TextInput
              style={styles.TextInput}
              placeholder="काम लिखें 15 शब्दों से कम,नंबर न लिखें "
              placeholderTextColor={"#ccc"}
              value={description}
              onChangeText={(description) =>
                handleDescriptionChange(description)
              }
            />
          </View>
          {!!errors.description && (
            <Text style={styles.error}>{errors.description}</Text>
          )}
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ maxWidth: "48%", width: "100%" }}>
              <View style={[styles.inputView, { width: "100%" }]}>
                <Text style={styles.label}>भूमि क्षेत्र</Text>
                <TextInput
                  style={styles.TextInput}
                  keyboardType="numeric"
                  maxLength={2}
                  // placeholder="भूमि क्षेत्र"
                  placeholderTextColor={"#ccc"}
                  value={landArea}
                  onChangeText={(landArea) => handleLandAreaChange(landArea)}
                />
              </View>
              {!!errors.landArea && (
                <Text style={styles.error}>{errors.landArea}</Text>
              )}
            </View>

            <View style={{ maxWidth: "48%", width: "100%" }}>
              <View
                style={[
                  styles.inputView,
                  styles.flex,
                  styles.justifyContentBetween,
                ]}
              >
                <Text style={styles.label}>भूमि का प्रकार</Text>
                <Picker
                  style={{ width: "100%" }}
                  ref={pickerRef}
                  selectedValue={landType}
                  onValueChange={(itemValue, itemIndex) =>
                    setlandType(itemValue)
                  }
                >
                  <Picker.Item
                    style={{ color: landType ? "#000" : "#ccc" }}
                    label="किल्ला/बीघा"
                    value=""
                  />
                  {landTypes.map((item) => (
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
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ maxWidth: "48%", width: "100%" }}>
              <View
                style={[
                  styles.inputView,
                  styles.flex,
                  styles.justifyContentBetween,
                  // { marginLeft: 10 },

                  // styles.flex,
                  // styles.justifyContentBetween,
                ]}
              >
                <Text style={styles.label}>पुरुषों की संख्या</Text>
                <View style={{ flexDirection: "row" }}>
                  <Picker
                    style={{ width: "100%", paddingTop: 16 }}
                    ref={pickerRef}
                    selectedValue={maleCounts}
                    onValueChange={handleMaleCountChange}
                  >
                    <Picker.Item
                      style={{ color: maleCounts ? "#000" : "#ccc" }}
                      label=""
                      value={0}
                    />
                    {/* {maleCount.map((item) => (
                      <Picker.Item
                        label={item.toString()}
                        value={item}
                        key={item}
                      />
                    ))} */}
                    {Array.from({ length: maxMaleCount }).map((_, index) => (
                      <Picker.Item
                        label={(index + 1).toString()}
                        value={index + 1}
                        key={index + 1}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
              {!!errors.maleCounts && (
                <Text style={styles.error}>{errors.maleCounts}</Text>
              )}
            </View>

            <View style={{ maxWidth: "48%", width: "100%" }}>
              <View
                style={[
                  styles.inputView,
                  styles.flex,
                  styles.justifyContentBetween,
                  // { marginLeft: 10 },

                  // styles.flex,
                  // styles.justifyContentBetween,
                ]}
              >
                <Text style={styles.label}>महिलाओं की संख्या</Text>
                <View style={{ flexDirection: "row" }}>
                  <Picker
                    style={{ width: "100%", paddingTop: 16 }}
                    ref={pickerRef}
                    selectedValue={femaleCounts}
                    onValueChange={handleFemaleCountChange}
                  >
                    <Picker.Item
                      style={{ color: femaleCounts ? "#000" : "#ccc" }}
                      label=""
                      value={0}
                    />
                    {/* {femaleCount.map((item) => (
                      <Picker.Item
                        label={item.toString()}
                        value={item}
                        key={item}
                      />
                    ))} */}
                    {Array.from({ length: maxFemaleCount }).map((_, index) => (
                      <Picker.Item
                        label={(index + 1).toString()}
                        value={index + 1}
                        key={index + 1}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
              {!!errors.femaleCounts && (
                <Text style={styles.error}>{errors.femaleCounts}</Text>
              )}
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",

              justifyContent: "space-between",
            }}
          >
            <View style={{ maxWidth: "48%", width: "100%" }}>
              <View
                style={[
                  styles.flex,
                  styles.inputView,
                  styles.justifyContentBetween,
                  { width: "100%" },

                  // styles.flex,
                  // styles.justifyContentBetween,
                ]}
              >
                <Text style={styles.label}>पुरुष वेतन</Text>
                <TextInput
                  style={styles.TextInput}
                  keyboardType="numeric"
                  // placeholder="एक पुरुष का वेतन "
                  placeholderTextColor={"#ccc"}
                  value={malepayamount}
                  onChangeText={(malepayamount) =>
                    setMalepayamount(malepayamount)
                  }
                />
                <Text style={{ color: "#0099FF", right: 10 }}>₹</Text>
              </View>
              {!!errors.malepayamount && (
                <Text style={styles.error}>{errors.malepayamount}</Text>
              )}
            </View>
            <View style={{ maxWidth: "48%", width: "100%" }}>
              <View
                style={[
                  styles.flex,
                  styles.inputView,
                  styles.justifyContentBetween,
                  { width: "100%" },

                  // styles.flex,
                  // styles.justifyContentBetween,
                ]}
              >
                <Text style={styles.label}>महिला वेतन</Text>
                <TextInput
                  style={styles.TextInput}
                  // placeholder="एक महिला का वेतन"
                  keyboardType="numeric"
                  placeholderTextColor={"#ccc"}
                  value={femalepayamount}
                  onChangeText={(femalepayamount) =>
                    setFemalepayamount(femalepayamount)
                  }
                />
                <Text style={{ color: "#0099FF", right: 10 }}>₹</Text>
              </View>
              {!!errors.femalepayamount && (
                <Text style={styles.error}>{errors.femalepayamount}</Text>
              )}
            </View>
          </View>

          <View
            style={[
              styles.inputView,
              styles.flex,
              styles.justifyContentBetween,
            ]}
          >
            <Text style={styles.label}>दिनों की संख्या</Text>
            <Picker
              style={{ width: "100%", paddingTop: 16 }}
              ref={pickerRef}
              selectedValue={days}
              onValueChange={(itemValue, itemIndex) => setDays(itemValue)}
            >
              <Picker.Item
                style={{ color: days ? "#000" : "#ccc" }}
                label=""
                value=""
              />
              {daysCount.map((item) => (
                <Picker.Item label={item.toString()} value={item} key={item} />
              ))}
            </Picker>
          </View>
          {!!errors.days && <Text style={styles.error}>{errors.days}</Text>}

          <View
            style={[
              styles.inputView,
              styles.flex,
              styles.justifyContentBetween,
            ]}
          >
            <Text style={styles.label}>वेतन</Text>
            <TextInput
              style={styles.TextInput}
              // placeholder="वेतन "
              keyboardType="numeric"
              placeholderTextColor={"#ccc"}
            />
            <Text style={{ color: "#0099FF", right: 10 }}>₹ {total}</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              if (!isLoading) {
                if (validate()) {
                  sahayakBooking();
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
      </ScrollView>

      {/* <BottomTab/> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  OptionButton: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
  },

  sahayak: {
    width: "40%",
    color: "#505050",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#505050",
  },

  machine: {
    width: "40%",
    flexDirection: "row",
    color: "#505050",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    borderRadius: 10,
    backgroundColor: "#44A347",
  },

  loginText: {
    color: "#000",
    fontSize: 16,
  },

  loginBtn: {
    width: "100%",
    borderRadius: 7,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
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
    width: "100%",
    height: 48,
    marginTop: 20,
    borderWidth: 1,
  },

  TextInput: {
    padding: 10,
  },

  CheckTextInput: {
    textAlign: "center",
    marginTop: 10,
  },

  TaxView: {
    borderColor: "#0070C0",
    borderRadius: 7,
    width: "50%",
    height: 48,
    marginTop: 20,
    borderWidth: 1,
  },

  BhumiView: {
    borderColor: "#0070C0",
    borderRadius: 7,
    width: "50%",
    height: 48,
    marginTop: 20,
    borderWidth: 1,
  },

  DoubleView: {
    borderColor: "#0070C0",
    borderRadius: 7,
    width: "50%",
    height: 48,
    marginTop: 10,
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

  dropdownGender: {
    borderColor: "#0070C0",
    borderRadius: 7,
    width: "87%",
    height: 48,
    marginTop: 15,
    borderWidth: 1,
  },
  flex: {
    alignItems: "center",
    flexDirection: "row",
  },
  justifyContentBetween: {
    justifyContent: "space-between",
  },
  error: {
    color: "red",
    fontSize: 13,
  },
  label: {
    position: "absolute",
    top: -10,
    left: 15,
    marginHorizontal: 5,
    paddingHorizontal: 10,
    fontFamily: "Devanagari-bold",
    textAlign: "center",
    backgroundColor: "#fff",
  },
});
