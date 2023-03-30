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
  const pickerRef = useRef();
  var isTimeSelected = false;
  function open() {
    pickerRef.current.focus();
  }

  function close() {
    pickerRef.current.blur();
  }

  const onSubmit = (data) => {
    console.log(data, "data");
  };
  const onChange = (event, selectedDate) => {
    setDefaultDate(selectedDate);

    const currentDate = moment(selectedDate).format("YYYY-MM-DD HH:mm");
    // const currentTime = moment(selectedDate).format("H:mm");
    const showDate = moment(selectedDate).format("YYYY-MM-DD");
    const showTime = moment(selectedDate).format("H:mm");
    console.log("isTimeSelected", currentDate);
    // console.log(currentDate);
    // console.log(currentTime);
    setDate(currentDate);
    setShowDate(showDate);
    console.log("fkdfk", showDate);
  };
  const onChanges = (event, selectedDate) => {
    // alert(selectedDate)
    setDate(selectedDate);
    // console.log("isTimeSelected", selectedDate);
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
    console.log("params", params);
    service
      .post("/api/machine_detail/", params, {
        headers: {
          "Content-Type": "application/json",
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
        console.log("data====>", res.data);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };
  const handleDateChange = (value) => {
    // alert(value);
    console.log("dddd", value);
    // setDateState(value);
    // dispatch(setDate(value));
  };

  const Booking = async () => {
    const datetime =
      moment(showDate).format("YYYY-MM-DD") +
      " " +
      moment(time).format("HH:mm:ss") +
      ".000000";
    let params = {
      datetime: datetime,
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
          Authorization: "Bearer " + token?.access,
        },
      })
      .then((res) => {
        let data = res?.data;
        console.log("formparamfffff", data);

        Toast.show("Job Posted Successfully!", Toast.SORT);
        navigation.replace("MyBooking");
      })
      .catch((error) => {
        console.log("Error:", error);
        Toast.show("All Fields are required!", Toast.SORT);
      });
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
        <View style={{ justifyContent: "center", alignItems: "center" }}>
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
            <Text
              style={{ color: selectedWorkType ? "#000" : "#ccc", left: 5 }}
            >
              {selectedWorkType ? selectedWorkType : "-भूमि तैयार करना-"}
            </Text>
            <Picker
              style={{ width: 80 }}
              selectedValue={selectedWorkType}
              onValueChange={(itemValue, itemIndex) => {
                setSelectedWorkType(itemValue);
                console.log(itemValue);
                machinaryBooking(itemValue);
              }}
            >
              <Picker.Item label="" value="" enabled={false} />
              {workType.map((item, index) => (
                <Picker.Item
                  label={item.name}
                  value={item.name}
                  key={item.id.toString()}
                />
              ))}
            </Picker>
          </View>
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
            <Text
              style={{ color: selectedMachines ? "#000" : "#ccc", left: 5 }}
            >
              {selectedMachines ? selectedMachines : "-Select Machine-"}
            </Text>
            <Picker
              style={{ width: 40 }}
              selectedValue={selectedMachines}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedMachines(itemValue)
              }
            >
              <Picker.Item label="-Select Machine-" value="" />

              {machiness.map((item) => (
                <Picker.Item
                  label={item.machine}
                  value={item.machine}
                  key={item.id.toString()}
                />
              ))}
            </Picker>
          </View>

          {/* <View
            style={[
              styles.dropdownGender,
              {
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              },
            ]}
          >
            <Text style={{ color: buayiValue ? "#000" : "#ccc", left: 5 }}>
              {buayiValue ? buayiValue : "-बुआई-"}
            </Text>
            <Picker
              ref={pickerRef}
              style={{ width: 80 }}
              selectedValue={buayiValue}
              onValueChange={(itemValue, itemIndex) => handlesowing(itemValue)}
            >
              <Picker.Item
                label="बुआई"
                value=""
                enabled={false}
                style={{ color: "#ccc" }}
              />
              {sowing?.map((item, index) => (
                <Picker.Item
                  label={item.name}
                  value={item.name}
                  key={item.id}
                />
              ))}
            </Picker>
          </View>  */}

          {/* <View
            style={[
              styles.dropdownGender,
              {
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              },
            ]}
          >
            <Text style={{ color: katayiValue ? "#000" : "#ccc", left: 5 }}>
              {katayiValue ? katayiValue : "कटाई"}
            </Text>
            <Picker
              ref={pickerRef}
              style={{ width: 80 }}
              selectedValue={katayiValue}
              onValueChange={(itemValue, itemIndex) =>
                handleharvesting(itemValue)
              }
            >
              <Picker.Item
                label="कटाई"
                value=""
                enabled={false}
                style={{ color: "#ccc" }}
              />
              {haevesting?.map((item, index) => (
                <Picker.Item
                  label={item.name}
                  value={item.name}
                  key={item.id}
                />
              ))}
            </Picker>
          </View> */}

          <View style={styles.dropdownGender}>
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
              title={showDate ? showDate : "Select Date"}
            >
              <Text style={{ color: showDate ? "#000" : "#ccc" }}>
                {showDate ? showDate : "Select Date"}
              </Text>
              {console.log("jfjdj", showDate)}
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
            <Text style={{ color: time ? "#000" : "#ccc", left: 5 }}>
              {time ? time : "-समय-"}
            </Text>
            <Picker
              ref={pickerRef}
              selectedValue={time}
              style={{ width: 50 }}
              onValueChange={(itemValue, itemIndex) =>
                handleTimeChange(itemValue)
              }
            >
              {/* <Picker.Item enabled={false} label="-समय-" value="" /> */}
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

          <View style={{ flexDirection: "row" }}>
            <View style={styles.dropdownGenders}>
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
            <View
              style={[
                styles.dropdownGenders,
                {
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                },
              ]}
            >
              {/* <Text style={{ paddingLeft: 10 }}>किल्ला/बीघा </Text> */}
              <Text style={{ color: landType ? "#000" : "#ccc", left: 5 }}>
              {landType ? landType : "किल्ला/बीघा"}
            </Text>

            <Picker
              style={{ width: 20 }}
              ref={pickerRef}
              selectedValue={landType}
              onValueChange={(itemValue, itemIndex) => setLandTypes(itemValue)}
            >
              <Picker.Item label="किल्ला/बीघा" value="" />
              {landtypes.map((item) => (
                <Picker.Item
                  label={item.name}
                  value={item.name}
                  key={item.id}
                />
              ))}
            </Picker>
            </View>
          </View>
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
            <Text style={{ marginTop: 14, left: 10, color: "#ccc" }}>वेतन</Text>
   
            <TextInput
              placeholderTextColor={"#ccc"}
              value={totalAmount}
              placeholder="₹0.00"
              onChangeText={(totalAmount) => handleTotalAmount(totalAmount)}
            />
          </View> */}

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
          </View>
          <TouchableOpacity onPress={() => Booking()} style={styles.loginBtn}>
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
    width: "80%",
    height: 48,
    marginTop: 15,
    borderWidth: 1,
  },
  dropdownGenders: {
    borderColor: "#0070C0",
    borderRadius: 7,
    // borderBottomRightRadius: 7,
    width: "38%",
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
    width: "80%",
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
    width: "85%",
    borderRadius: 7,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    backgroundColor: "#0099FF",
  },
});
