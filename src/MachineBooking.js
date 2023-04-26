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
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import service from "../service";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import Toast from "react-native-root-toast";
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
} from "../slices/SahayakBookingSlice";
export default function MachineBooking({ navigation }) {
  const token = useSelector(selectToken);
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

  const onChange = (event, selectedDate) => {
    setDefaultDate(selectedDate);

    const currentDate = moment(selectedDate).format("YYYY-MM-DD HH:mm");
    // const currentTime = moment(selectedDate).format("H:mm");
    const showDate = moment(selectedDate).format("YYYY-MM-DD");
    const showTime = moment(selectedDate).format("H:mm");
    setDate(currentDate);
    setShowDate(showDate);
  
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

  // const formattedDate = date instanceof Date ? date.toLocaleDateString() : "";

  const handleTimeChange = (value) => {
    setTimes(value);

    dispatch(setTime(value));
  };
  const timings = [
    4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
    24,
  ];

  const checkIfTimeEnabled = (timeSelect) => {
    let currentDate = new Date();
    let time = currentDate.getHours();

    let enabledTime = time + 3;

    // console.log("current", time, timeSelect, enabledTime);
    if (timeSelect > time + 3) {
      return true;
    } else {
      return false;
    }
  };

  const timeConverted = (item) => {
    if (item > 12) {
      item = item - 12;
      return (item = item + " PM");
    } else {
      // console.log("tomesss", item);
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
        setMachiness(res?.data);
        // console.log("kkk====>", machiness.map((item) => item));
      })
      .catch((error) => {
        console.log("Error:", error);
      });
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
    // const datetime =
    //   moment(showDate).format("YYYY-MM-DD") +
    //   " " +
    //   moment(time, "h:mm A").format("HH:mm:ss.SSSSSS");
    const datetime = `${moment(showDate).format("YYYY-MM-DD")} ${moment(
      time,
      "h:mm A"
    ).format("HH:mm:ss.SSSSSS")}`;
    let params = {
      datetime,
      work_type: selectedWorkType,
      machine: selectedMachines,
      others: other,
      land_type: landType,
      land_area: landArea,
      total_amount_machine: totalAmount,
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
          Toast.show("कार्य सफलतापूर्वक पोस्ट किया गया!", Toast.SORT);

          navigation.navigate("MyBookingStack", {screen: 'MyBooking'});
        } else {
          Toast.show(
            "कार्य फिर से पोस्ट करें, पोस्ट अभी तक नहीं हुई है।",
            Toast.SORT
          );
        }
      })
      .catch((error) => {
        console.log("Error:", error);
        Toast.show(
          error.response.data.message || "An error occurred!",
          Toast.SORT
        );
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
    };

    if (showDate === "") {
      errorMessages.showDate = "Please enter valid date";
      valid = false;
    }

    if (time === "") {
      errorMessages.time = "Please select valid time";
      valid = false;
    }
    // if (description.trim() === "") {
    //   errorMessages.description = "Please enter your description";
    //   valid = false;
    // } else if (!/^[a-zA-Z\s]+$/.test(description.trim())) {
    //   errorMessages.description =
    //     "Please enter a valid description (letters only)";
    //   valid = false;
    // }

    if (landType.trim() === "") {
      errorMessages.landType = "Please enter your land type";
      valid = false;
    }

    if (landArea.trim() === "") {
      errorMessages.landArea = "Please select your land area";
      valid = false;
    }
    // if (!selectedWorkType) {
    //   errorMessages.workType = "Please select a work type";
    //   valid = false;
    // }
    if (selectedWorkType.trim() === "") {
      errorMessages.workType = "Please select your work Type";
      valid = false;
    }

    if (selectedMachines.trim() === "") {
      errorMessages.machiness = "Please select your Machines";
      valid = false;
    }

    if (totalAmount.trim() === "") {
      errorMessages.totalAmount = "Please enter your amount";
      valid = false;
    } else if (!/^[0-9\s.]+$/.test(totalAmount.trim())) {
      errorMessages.totalAmount = "Only numbers are allowed";
      valid = false;
    } else if (parseFloat(totalAmount.trim()) <= 5) {
      errorMessages.totalAmount = "Please enter an amount greater than 5";
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
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrowleft" size={25} />
        </TouchableOpacity>
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
            {/* <Text
              style={{ color: selectedMachines ? "#000" : "#ccc", left: 5 }}
            >
              {selectedMachines ? selectedMachines : "-Select Machine-"}
            </Text> */}
            <Picker
              style={{ width: "100%" }}
              selectedValue={selectedMachines}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedMachines(itemValue)
              }
            >
              <Picker.Item
                style={{ color: selectedMachines ? "#000" : "#ccc" }}
                label="-Select Machine-"
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

          <View style={[styles.dropdownGender,{display:'none'}]}>
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
            <Picker
              ref={pickerRef}
              selectedValue={time}
              style={{ width: "100%" }}
              onValueChange={(itemValue, itemIndex) =>
                setTimes(timeConverted(itemValue))
              }
            >
              <Picker.Item
                style={{ color: time ? "#000" : "#ccc" }}
                label={time ? time : "-समय-"}
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
                    value={item}
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
              {!!errors.landType && (
                <Text style={styles.error}>{errors.landType}</Text>
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
              if (validate()) {
                Booking();
              }
            }}
            style={styles.loginBtn}
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
  error: {
    color: "red",
    fontSize: 13,
  },
});
