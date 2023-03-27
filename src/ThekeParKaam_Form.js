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
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import BottomTab from "../Component/BottomTab";
import { useDispatch, useSelector } from "react-redux";
import Service from "../service/index";
import { selectToken } from "../slices/authSlice";
import {
  setDate,
  setTime,
  setDescription,
  setLandArea,
  setLandType,
  setTotalAmount,
} from "../slices/SahayakBookingSlice";
import moment from "moment";

import Toast from "react-native-root-toast";

import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";

export default function ThekeParKaam_Form({ navigation }) {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
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
  const [mode, setMode] = useState("date");


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
    let currentDate = new Date();
    let time = currentDate.getHours();

    let enabledTime = time + 3;

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
      //  console.log("tomesss", item);
      return item + " AM";
    }
  };
  const handleTimeChange = (value) => {
    setTimes(value);
    dispatch(setTime(value));
  };

  ///---time selection validation


  ////---Date picker ----///
  const onChange = (event, selectedDate) => {
    setDefaultDate(selectedDate);
    const currentDate = moment(selectedDate).format("YYYY-MM-DD HH:mm");
    const showDate = moment(selectedDate).format("YYYY-MM-DD");
    setDate(currentDate);
    setShowDate(showDate);
   
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
  try {
    const datetime = moment(showDate).format('YYYY-MM-DD') + 'T' + moment(time).format('HH:mm:ss');
    const params = {
      datetime: datetime,
      description: description,
      land_type: landType,
      land_area: landArea,
      total_amount_theka: totalAmount,
    };
console.log('params::::::', params)
    const response = await Service.post("/api/post_thekepekam/", params, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token?.access,
      },
    });

    const data = response?.data;
    console.log("form", data);
    Toast.show("Job Posted Successfully!", Toast.SORT);
      
    navigation.replace("MyBooking");
  } catch (error) {
    console.log(error);
  }
};


  return (
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

      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <View
          style={[styles.inputView, styles.flex, styles.justifyContentBetween]}
        >
          <TouchableOpacity
            style={{ paddingVertical: 10, paddingHorizontal: 5 }}
            onPress={showDatepicker}
            title={showDate ? showDate : "Select Date"}
          >
            <Text style={{ color: showDate ? "#000" : "#ccc" }}>
              {showDate ? showDate : "Select Date"}
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

        <View
          style={[
            styles.dropdownGender,
            styles.justifyContentBetween,
            styles.flex,
          ]}
        >
          <Text style={{ color: time ? "#000" : "#ccc", left: 5 }}>
            {time ? time : "-समय-"}
          </Text>
          <Picker
            ref={pickerRef}
            selectedValue={time}
            style={{width:40}}
            onValueChange={(itemValue, itemIndex) =>
              handleTimeChange(itemValue)
            }
          >
            <Picker.Item enabled={false} label="-समय-" value="" />
            {timings.map((item, index) => {
              return (
                <Picker.Item
                  key={index}
                  onPress={() => setTime(item)}
                  style={{
                    color: checkIfTimeEnabled(item) ? "black" : "gray",
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
        <View
          style={[styles.inputView, styles.flex, styles.justifyContentBetween]}
        >
          <TextInput
            style={[styles.TextInput]}
            placeholder="काम लिखें १५ शब्दों से कम,नंबर न लिखें "
            placeholderTextColor={"#ccc"}
            onChangeText={(description) => handleDescriptionChange(description)}
            value={description}
          />
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
            <TextInput
              style={[styles.TextInput, { width: "90%" }]}
              maxLength={2}
              placeholder="भूमि क्षेत्र"
              placeholderTextColor={"#ccc"}
              keyboardType="numeric"
              onChangeText={(landArea) => handleLandAreaChange(landArea)}
              value={landArea}
            />
          </View>
          <View
            style={[
              styles.BhumiView,
              styles.flex,
              styles.justifyContentBetween,
            ]}
          >
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

        <View
          style={[styles.inputView, styles.flex, styles.justifyContentBetween]}
        >
          <TextInput
            style={styles.TextInput}
            placeholder="वेतन"
            placeholderTextColor={"#cccc"}
            keyboardType="numeric"
            onChangeText={(totalAmount) => handleTotalAmount(totalAmount)}
            value={totalAmount}
          />
          <Text style={{ right: 10, color: "#0070C0" }}>₹ 0.00</Text>
        </View>

        <TouchableOpacity
          onPress={() => handleBooking()}
          style={styles.loginBtn}
        >
          <Text style={[styles.loginText, { color: "#fff" }]}>बुकिंग करें</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
    color: "#505050",
    height: 50,
    alignItems: "center",
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
  flex: {
    alignItems: "center",
    flexDirection: "row",
  },
  justifyContentBetween: {
    justifyContent: "space-between",
  },
});
