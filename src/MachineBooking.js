import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import service from "../service";
import moment from "moment";
import { BackHandler } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Toast from "react-native-simple-toast";
import { selectIsLoggedIn, setToken, selectToken } from "../slices/authSlice";
import {
  setDate,
  setHavestingArea,
  setLandArea,
  setlandprepration,
  setLandType,
  setTime,
  setTotalAmount,
  setShowingArea,
  setDescription,
} from "../slices/SahayakBookingSlice";
export default function MachineBooking({ navigation }) {
  const token = useSelector(selectToken);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedWorkType, setSelectedWorkType] = useState("");
  const [workType, setWorkType] = useState([]);
  const [selectedMachines, setSelectedMachines] = useState("");
  const [machiness, setMachiness] = useState([]);
  const [landType, setLandTypes] = useState("");
  const dispatch = useDispatch();
  const [anyeValue, setAnyeValue] = useState();
  const [date, setDateState] = useState(new Date());
  const [defaultDate, setDefaultDate] = useState(new Date());

  const [landArea, setLandAreas] = useState("");
  const [time, setTimes] = useState("");
  const [selectedDates, setSelectedDates] = useState("");
  const [showDate, setShowDate] = useState("");
  const [totalAmount, setTotalAmounts] = useState("");
  const [mode, setMode] = useState("date");
  const [selectedItem, setSelectedItem] = useState("");
  const [other, setOther] = useState("");
  const [description, setDescriptions] = useState("");
  const [sowing, setSowing] = useState([]);
  const [errors, setErrors] = useState({
    showDate: "",
    time: "",
    //  description: "",
    landType: "",
    landArea: "",
    totalAmount: "",
    machiness: "",
    workType: "",
  });
  const pickerRef = useRef();
  const textInputRef = useRef(null);
  var isTimeSelected = false;

  const handleDescriptionChange = (value) => {
    setDescriptions(value);
    dispatch(setDescription(value));
  };

  const onChange = (event, selectedDate) => {
    setDefaultDate(selectedDate);

    const currentDate = moment(selectedDate).format("YYYY-MM-DD HH:mm");
    // const currentTime = moment(selectedDate).format("H:mm");
    const showDate = moment(selectedDate).format("YYYY-MM-DD");
    const showTime = moment(selectedDate).format("H:mm");
    setDate(currentDate);
    setShowDate(showDate);
    let currentDateTime = moment();
    let currentDay = currentDateTime.format("YYYY-MM-DD");
    if (currentDay === showDate) {
      let time = parseInt(currentDateTime.format("H"));
      console.log("timetimetime", time);
      setTimes("");
    }
  };
  const onChanges = (event, selectedDate) => {
    setDate(selectedDate);
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
    let currentDate = new Date(); // get the current date
    currentDate.setMonth(currentDate.getMonth() + 1); // add one month

    return currentDate; // display the new date with one month added
  };

  const showDatepicker = () => {
    isTimeSelected = false;
    showMode("date");
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
  // const formattedDate = date instanceof Date ? date.toLocaleDateString() : "";

  const handleTimeChange = (value) => {
    setTimes(value);

    // dispatch(setTime(value));
  };
  const timings = [
    4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
    24,
  ];

  const checkIfTimeEnabled = (timeSelect) => {
    let currentDateTime = moment();

    let currentDate = currentDateTime.format("YYYY-MM-DD");
    if (currentDate === showDate) {
      let time = parseInt(currentDateTime.format("H"));
      let enabledTime = time + 3;

      // console.log("current", time, timeSelect, enabledTime);
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

  const handlelandprepration = (value) => {
    setBhumiValue(value);
    dispatch(setlandprepration(value));
  };

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

  const machinaryBooking = (val) => {
    if (val !== "") {
      let params = {
        work_type: val,
      };

      service
        .post("/api/machine_detail/", params, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log("response", res.data);
          setMachiness(res?.data);
          // console.log("kkk====>", machiness.map((item) => item));
        })
        .catch((error) => {
          console.log("Error:", error);
        });
    }
  };
  const workTypes = () => {
    service
      .get("api/get_worktype/", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setWorkType(res.data);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };

  const Booking = async () => {
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
    const datetime = `${moment(showDate).format("YYYY-MM-DD")} ${moment(
      time,
      "h:mm A"
    ).format("HH:mm:ss.SSSSSS")}`;
    let params = {
      datetime,
      work_type: selectedWorkType,
      machine: selectedMachines,
      others: other,
      land_type: landtype,
      land_area: landarea,
      total_amount_machine: totalAmount,
      description: description,
    };
    service
      .post("/api/post_machine/", params, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        if (data?.status === 201) {
          // Toast.show("कार्य सफलतापूर्वक पोस्ट किया गया!", Toast.LONG);
          console.log("MachineBookingData", data);

          navigation.navigate("MyBookingStack", { screen: "MyBooking" });
        } else {
          Toast.show(
            "यह नौकरी पहले ही पोस्ट की जा चुकी है! कृपया नौकरी का विवरण बदलें",
            Toast.LONG
          );
        }
      })
      .catch((error) => {
        console.log("Error:", error);
        Toast.show(
          "कुछ समस्या आ रही है, कृपया बाद में पुनः प्रयास करें!",
          Toast.LONG
        );
      })
      .finally(() => {
        setIsLoading(false); // Set isLoading to false regardless of success or error
      });
  };

  const validate = () => {
    let valid = true;
    let errorMessages = {
      showDate: "",
      time: "",
      landType: "",
      landArea: "",
      totalAmount: "",
      machiness: "",
      workType: "",
      description: "",
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

    if (selectedWorkType.trim() === "") {
      errorMessages.workType = "कृपया कार्य प्रकार का चयन करें!";
      valid = false;
    }

    if (selectedMachines.trim() === "") {
      errorMessages.machiness = "कृपया मशीनें चुनें!";
      valid = false;
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
  useEffect(() => {
    if (selectedWorkType) {
      machinaryBooking(selectedWorkType);
    }
    workTypes();
  }, []);

  return (
    <SafeAreaView
      style={{ backgroundColor: "#fff", flex: 1, paddingBottom: 20 }}
    >
      <View style={{ padding: 20, marginTop: 25 }}>
        {/* <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrowleft" size={25} />
        </TouchableOpacity> */}
      </View>
      <View>
        {isLoading && <ActivityIndicator size="small" color="#black" />}
      </View>
      <View style={{ justifyContent: "center", marginBottom: 24 }}>
        <Text style={{ textAlign: "center", fontSize: 30, fontWeight: "600" }}>
          मशीनरी बुकिंग
        </Text>
      </View>
      <ScrollView horizontal={false} showsVerticalScrollIndicator={false}>
        <View style={{ marginHorizontal: 10 }}>
          <View
            style={[
              styles.dropdownGender,
              {
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              },
            ]}
          >
            <Text style={styles.label}>कार्य प्रकार</Text>
            <Picker
              style={{ width: "100%" }}
              selectedValue={selectedWorkType}
              onValueChange={(itemValue, itemIndex) => {
                setSelectedWorkType(itemValue);
                machinaryBooking(itemValue);
              }}
              required // Add required attribute
            >
              <Picker.Item
                style={{ color: selectedWorkType ? "#000" : "#ccc" }}
                label="-भूमि तैयार करना/काटना/बुआई/अन्य-"
                value=""
              />
              {workType.map((item, index) => (
                <Picker.Item
                  label={item.name}
                  value={item.name}
                  key={item.id.toString()}
                />
              ))}
            </Picker>
          </View>
          {!!errors.workType && (
            <Text style={styles.error}>{errors.workType}</Text>
          )}
          <View
            style={[
              styles.dropdownGender,
              {
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              },
            ]}
          >
            <Text style={styles.label}>मशीन के प्रकार</Text>
            <Picker
              style={{ width: "100%" }}
              selectedValue={selectedMachines}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedMachines(itemValue)
              }
            >
              <Picker.Item
                style={{ color: selectedMachines ? "#000" : "#ccc" }}
                label="-मशीन का चयन करें-"
                value=""
              />
              {machiness.map((item) => (
                <Picker.Item
                  label={item.machine}
                  value={item.machine}
                  key={item.id.toString()}
                />
              ))}
            </Picker>
          </View>
          {!!errors.machiness && (
            <Text style={styles.error}>{errors.machiness}</Text>
          )}
          <View
            style={[
              styles.inputView,
              styles.flex,
              styles.justifyContentBetween,
            ]}
          >
            <Text style={styles.label}>काम का विवरण</Text>
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

          <View style={[styles.dropdownGender, { display: "none" }]}>
            <TextInput
              value={other}
              onChangeText={(other) => setOther(other)}
              style={styles.TextInput}
              placeholder="अन्य"
              placeholderTextColor={"#ccc"}
            />
          </View>
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
            <Text style={styles.label}>तारीख़</Text>
            <TouchableOpacity
              style={{ paddingVertical: 10, paddingHorizontal: 5 }}
              color="black"
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
                onChange(selectedDates);
              }}
            />

            <TouchableOpacity onPress={showDatepicker}>
              <Image
                source={require("../assets/image/calendar.png")}
                style={{ width: 20, height: 20, right: 10, marginTop: 10 }}
              />
            </TouchableOpacity>
          </View>
          {!!errors.showDate && (
            <Text style={styles.error}>{errors.showDate}</Text>
          )}

          <View
            style={[
              styles.dropdownGender,
              {
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              },
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
                label={time ? timeConverted(time) : "-समय-"}
                value=""
              />
              {timings.map((item, index) => {
                return (
                  <Picker.Item
                    key={index}
                    onPress={() => setTime(item)}
                    style={{
                      color: checkIfTimeEnabled(item) ? "black" : "#ccc",
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
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ maxWidth: "48%", width: "100%" }}>
              <View
                style={[
                  styles.inputView,
                  { width: "100%" },

                  // styles.flex,
                  // styles.justifyContentBetween,
                ]}
              >
                <Text style={styles.label}>भूमि क्षेत्र</Text>
                <TextInput
                  style={{ flex: 1, alignItems: "center", paddingLeft: 10 }}
                  placeholder="भूमि क्षेत्र"
                  maxLength={2}
                  placeholderTextColor={"#ccc"}
                  keyboardType="numeric"
                  onChangeText={(landArea) => handleLandAreaChange(landArea)}
                  // defaultValue={email}
                  value={landArea}
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

                  {
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  },

                  // styles.flex,
                  // styles.justifyContentBetween,
                ]}
              >
                <Text style={styles.label}>भूमि का प्रकार</Text>
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
            {/* <View style={styles.dropdownGenders}>
            
          
            </View> */}
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
              <Text style={styles.label}>वेतन</Text>
              <Text style={{ color: "#ccc", marginTop: 14, left: 10 }}>
                वेतन
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ color: "#0099FF", paddingTop: 4 }}>₹ </Text>
                <TextInput
                  ref={textInputRef}
                  style={[styles.TextInput, { right: 10, color: "#0099FF" }]}
                  keyboardType="numeric"
                  placeholderTextColor={"#0099FF"}
                  value={totalAmount}
                  placeholder="0.00"
                  onChangeText={(totalAmount) => handleTotalAmount(totalAmount)}
                />
              </View>
            </View>
          </TouchableOpacity>
          {/* <View
            style={[
              styles.inputView,
              {
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              },
            ]}
          >
            <Text style={{ color: "#ccc", marginTop: 14, left: 10 }}>वेतन</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ color: "#0099FF", paddingTop: 4 }}>₹ </Text>
              <TextInput
                style={[styles.TextInput, { right: 10, color: "#0099FF" }]}
                keyboardType="numeric"
                placeholderTextColor={"#0099FF"}
                value={totalAmount}
                placeholder="0.00"
                onChangeText={(totalAmount) => handleTotalAmount(totalAmount)}
              />
            </View>
          </View> */}
          {!!errors.totalAmount && (
            <Text style={styles.error}>{errors.totalAmount}</Text>
          )}
          <TouchableOpacity
            onPress={() => {
              if (!isLoading) {
                if (validate()) {
                  Booking();
                }
              }
            }}
            style={!isLoading ? styles.loginBtn : styles.disableBtn}
          >
            {/* <TouchableOpacity onPress={() => Booking()} style={styles.loginBtn}> */}
            <Text style={[styles.loginText, { color: "#fff" }]}>
              बुकिंग करें
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    borderStyle: "solid",
    borderColor: "#B7B7B7",
    borderRadius: 7,
    borderWidth: 1,
    fontSize: 15,
    height: 50,
    marginHorizontal: 10,
    paddingStart: 10,
    marginBottom: 15,
  },
  label: {
    marginBottom: 7,
    marginStart: 10,
  },
  placeholderStyles: {
    color: "#000",
  },
  dropdownGender: {
    borderColor: "#0070C0",
    borderRadius: 7,
    // borderBottomRightRadius: 7,
    width: "100%",
    height: 48,
    marginTop: 15,
    borderWidth: 1,
  },
  dropdownGenders: {
    borderColor: "#0070C0",
    borderRadius: 7,
    // borderBottomRightRadius: 7,
    width: "50%",
    marginHorizontal: 10,
    height: 48,
    marginTop: 15,
    borderWidth: 1,
  },
  dropdown: {
    borderColor: "#B7B7B7",
    height: 50,
  },

  inputView: {
    borderColor: "#0070C0",
    borderRadius: 7,
    // borderBottomRightRadius: 7,
    width: "100%",
    height: 48,
    marginTop: 20,
    borderWidth: 1,
  },

  TextInput: {
    // height: 50,
    paddingLeft: 10,
    paddingTop: 5,

    // fontFamily: "Poppin-Light"
  },

  loginText: {
    color: "#000",
    fontSize: 16,
    //   flexDirection:"column",
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
  flex: {
    alignItems: "center",
    flexDirection: "row",
  },
  justifyContentBetween: {
    justifyContent: "space-between",
  },
});
