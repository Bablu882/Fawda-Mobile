import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Image,
  Button,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import BottomTab from "../Component/BottomTab";
import { useDispatch, useSelector } from "react-redux";
import Service from "../service/index";
import Toast from "react-native-simple-toast";
import { selectIsLoggedIn, setToken, selectToken } from "../slices/authSlice";
import {
  setDate,
  setTime,
  setDescription,
  setLandArea,
  setLandType,
  setTotalAmount,
} from "../slices/SahayakBookingSlice";
import moment from "moment";
import { format } from "date-fns";
// import DatePicker from "react-native-datepicker";
// import TimePicker from 'react-native-simple-time-picker';
import DatePicker from "react-native-modern-datepicker";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { TimePicker } from "react-native-simple-time-picker";
import { Picker } from "@react-native-picker/picker";

var isTimeSelected = false;
export default function ThekeParKaam_Form({ navigation }) {
  const [date, setDateState] = useState(new Date());
  const [defaultDate, setDefaultDate] = useState(new Date());

  const [time, setTimes] = useState("");
  const [description, setDescriptions] = useState("");
  const [landType, setLandTypes] = useState("");
  const [landArea, setLandAreas] = useState("");
  const [showDate, setShowDate] = useState("");
  const [totalAmount, setTotalAmounts] = useState("");
  const [selectedDates, setSelectedDates] = useState("");
  const [katayiValue, setKatayiValue] = useState();
  const token = useSelector(selectToken);
  const dispatch = useDispatch();
  const [mode, setMode] = useState("date");
  const pickerRef = useRef();

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
    console.log("isTimeSelected", selectedDate);

    const currentDate = moment(selectedDate).format("YYYY-MM-DD HH:mm");
    const currentTime = moment(selectedDate).format("H:mm");
    const showDate = moment(selectedDate).format("YYYY-MM-DD");
    const showTime = moment(selectedDate).format("H:mm");

    console.log(currentDate);
    console.log(currentTime);
    setDate(currentDate);
    setShowDate(showDate);
    if (isTimeSelected == true) {
      console.log("ShowTime", showTime);
      setShowTime(showTime);
    }
  };

  const showMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: defaultDate,
      minimumDate: new Date(),
      onChange,
      mode: currentMode,
      is24Hour: true,
    });
  };

  const showDatepicker = () => {
    isTimeSelected = false;
    showMode("date");
  };

  const handleDateChange = (value) => {
    setDateState(value);
    dispatch(setDate(value));
  };
  // const formattedDate = date instanceof Date ? date.toLocaleDateString() : "";

  const handleTimeChange = (value) => {
    setTimes(value);
    dispatch(setTime(value));
  };

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

  const handleBooking = () => {
    let params = {
      date: date,
      time: time,
      description: description,
      land_type: landType,
      land_area: landArea,
      totalAmount: totalAmount,
    };
    console.log("formparam", params);
    Service.post("/api/post_thekepekam/", params, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token.access,
      },
    })
      .then((response) => {
        // setloading(false);
        let data = response?.data;
        console.log("form", data);
        if (data.success == true) {
          let token = data?.data?.token;
          dispatch(setToken(token));
          Toast.show("Posted", Toast.SHORT);

          navigation.replace("MyBooking");
        } else {
          Toast.show(data.error, Toast.SHORT);
        }
      })
      .catch((error) => {
        console.log(error);
        // setloading(false);
      });
  };

  return (
    <>
      <SafeAreaView style={{ backgroundColor: "#fff", flex: 1 }}>
        <View style={{ padding: 20, marginTop: 25 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrowleft" size={25} />
          </TouchableOpacity>
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
            <TouchableOpacity style={styles.sahayak}>
              <Text style={[styles.loginText, { color: "#fff" }]}>
                ठेके पर काम
              </Text>
              {/* <Text style={styles.loginText}>(मजदूर )</Text> */}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.machine}
              onPress={() => navigation.navigate("SahayakForm")}
            >
              <Text style={styles.loginText}>सहायक</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ justifyContent: "center", alignItems: "center" }}>
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
              <Text>{showDate ? showDate : "Select Date"}</Text>
            </TouchableOpacity>

            {/* <Button onPress={showDatepicker} title="Show date picker!" /> */}
            {/* <Button onPress={showTimepicker} title="Show time picker!" /> */}
            <TextInput
              value={selectedDates}
              // placeholder="Selected date and time"
              editable={false}
              onChangeText={(date) => {
                handleDateChange(date);
                setDate(date);
              }}
            />
            <TouchableOpacity onPress={showDatepicker}>
              <Image
                source={require("../assets/image/calendar.png")}
                style={{ width: 20, height: 20, marginTop: 14, right: 10 }}
              />
            </TouchableOpacity>
            {/* <TextInput
              style={[styles.TextInput]}
              placeholder="तारीख़     dd/mm/yyyy"
              placeholderTextColor={"#000"}
              keyboardType="numeric"
              onChangeText={(date) => {
                handleDateChange(date);
                setDate(date);
              }}
              // defaultValue={email}
              value={selectedDates}
            />
            <TouchableOpacity
              title={showDate ? showDate : "Select Date"}
              onPress={showDatepicker}
            >
             
            </TouchableOpacity> */}
          </View>

          {/* <View
            style={[
              // styles.inputView,
              {
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              },
            ]}
          >
            <View style={styles.dropdownGender}>
          <Picker
              ref={pickerRef}
              selectedValue={time}
              onValueChange={(itemValue, itemIndex) =>
                setTimes(itemValue)
              }
            >
              <Picker.Item enabled={false} label="-भूमि तैयार करना-" value="" />
              <Picker.Item label="1" value="1" />
              <Picker.Item label="2" value="2" />
              <Picker.Item label="3" value="3" />
              <Picker.Item label="4" value="4" />
              <Picker.Item label="5" value="5" />
              <Picker.Item label="6" value="6" />
              <Picker.Item label="7" value="7" />
              <Picker.Item label="8" value="8" />
              <Picker.Item label="9" value="9" />
              <Picker.Item label="10" value="10" />
              <Picker.Item label="11" value="11" />
              <Picker.Item label="12" value="12" />
            </Picker>
            </View>
            </View> */}

          <View style={styles.dropdownGender}>
            <Picker
              ref={pickerRef}
              selectedValue={time}
              onValueChange={(itemValue, itemIndex) =>
                handleTimeChange(itemValue)
              }
            >
              <Picker.Item enabled={false} label="-समय-" value="" />
              <Picker.Item label="1:00" value="1:00" />
              <Picker.Item label="2:00" value="2:00" />
              <Picker.Item label="3:00" value="3" />
              <Picker.Item label="4" value="4" />
              <Picker.Item label="5" value="5" />
              <Picker.Item label="6" value="6" />
              <Picker.Item label="7" value="7" />
              <Picker.Item label="8" value="8" />
              <Picker.Item label="9" value="9" />
              <Picker.Item label="10" value="10" />
              <Picker.Item label="11" value="11" />
              <Picker.Item label="12" value="12" />
            </Picker>
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
            {/* <Text style={{position:'absolute', top:-10, left:30, width:"10%", textAlign:"center", backgroundColor:'#fff'}}>नाम:</Text> */}
            <TextInput
              style={[styles.TextInput]}
              placeholder="काम लिखें १५ शब्दों से कम,नंबर न लिखें "
              placeholderTextColor={"#000"}
              onChangeText={(description) =>
                handleDescriptionChange(description)
              }
              // defaultValue={email}
              value={description}
            />
            {/* <Image source={require('../assets/image/calendar.png')} style={{width:20, height:20 , marginTop:14 , right:10}} /> */}
          </View>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-evenly",
            }}
          >
            <View style={styles.TaxView}>
              {/* <Text style={{position:'absolute', top:-10, left:30, width:"18%", textAlign:"center", backgroundColor:'#fff'}}>राज्य</Text> */}
              <TextInput
                style={[styles.TextInput, { width: "90%" }]}
                placeholder="भूमि क्षेत्र"
                placeholderTextColor={"#000"}
                keyboardType="numeric"
                onChangeText={(landArea) => handleLandAreaChange(landArea)}
                // defaultValue={email}
                value={landArea}
              />
            </View>
            <View style={styles.BhumiView}>
              {/* <Text style={{position:'absolute', top:-10, left:30, width:"20%", textAlign:"center", backgroundColor:'#fff'}}>जिला </Text> */}
              <TextInput
                style={styles.TextInput}
                placeholder="किल्ला/बीघा "
                placeholderTextColor={"#B4B4B4"}
                onChangeText={(landType) => handleLandTypeChange(landType)}
                // defaultValue={email}
                value={landType}
              />
            </View>
          </View>
          <View style={[styles.inputView, {}]}>
            {/* <Text>with intervals</Text>
            <TimePicker
              value={{ hours, minutes }}
              onChange={handleChange}
              minutesInterval={10}
            />

            <Text>with zero padding</Text>
            <TimePicker
              value={{ hours, minutes }}
              onChange={handleChange}
              zeroPadding
            />

            <Text>with am/pm picker</Text>
            <TimePicker
              value={{ hours, minutes }}
              onChange={handleChange}
              isAmpm
            />

            <Text>with picker props</Text>
            <TimePicker
              value={{ hours, minutes }}
              onChange={handleChange}
              enabled={false}
            /> */}
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
            {/* <Text style={{position:'absolute', top:-10, left:30, width:"10%", textAlign:"center", backgroundColor:'#fff'}}>फ़ोन:</Text> */}
            <TextInput
              style={styles.TextInput}
              placeholder="वेतन"
              placeholderTextColor={"#000"}
              keyboardType="numeric"
              onChangeText={(totalAmount) => handleTotalAmount(totalAmount)}
              // defaultValue={email}
              value={totalAmount}
            />
            <Text style={{ marginTop: 14, right: 10, color: "#0070C0" }}>
              ₹ 0.00
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => handleBooking()}
            style={styles.loginBtn}
          >
            <Text style={[styles.loginText, { color: "#fff" }]}>
              बुकिंग करें
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  OptionButton: {
    // flex:1,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
    margin: 20,
    //   padding:20
  },

  sahayak: {
    width: "40%",
    // flexDirection:"column",
    // borderRadius: 7,
    color: "#505050",
    height: 50,
    alignItems: "center",
    //   justifyContent:"",
    justifyContent: "center",
    marginTop: 30,
    // borderWidth:1,
    borderRadius: 10,
    // borderColor:"#505050",
    backgroundColor: "#44A347",
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

  machine: {
    width: "40%",
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

  loginBtn: {
    width: "80%",
    borderRadius: 7,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    backgroundColor: "#0099FF",
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
    width: "80%",
    height: 48,
    marginTop: 20,
    borderWidth: 1,
  },

  TextInput: {
    // height: 50,
    padding: 10,
    // lineHeight:50,
    fontFamily: "Poppin-Light",
  },

  CheckTextInput: {
    textAlign: "center",
    marginTop: 10,
  },

  TaxView: {
    borderColor: "#0070C0",
    borderRadius: 7,
    // borderBottomRightRadius: 7,
    width: "35%",
    // height: 100,
    marginTop: 20,
    borderWidth: 1,
  },

  BhumiView: {
    borderColor: "#0070C0",
    borderRadius: 7,
    // borderBottomRightRadius: 0,
    // borderTopRightRadius:0,
    width: "35%",
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
});
