import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import BottomTab from "../Component/BottomTab";
import { useIsFocused } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import Toast from "react-native-root-toast";
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
  const token = useSelector(selectToken);
  const [mode, setMode] = useState("date");
  const [maleCounts, setMaleCounts] = useState("");
  const [defaultDate, setDefaultDate] = useState(new Date());
  const [femaleCounts, setFemaleCounts] = useState("");
  const [landTypes, setLandTypes] = useState("");

  const [selectedDates, setSelectedDates] = useState("");
  const [landArea, setLandAreas] = useState("");
  const [showDate, setShowDate] = useState("");
  const [totalAmount, setTotalAmounts] = useState("");
  const [malepayamount, setMalepayamount] = useState("");
  const [femalepayamount, setFemalepayamount] = useState("");
  const [description, setDescriptions] = useState("");
  const [days, setDays] = useState("");
  const [time, setTimes] = useState("");

  const pickerRef = useRef();
  function open() {
    pickerRef.current.focus();
  }
  function close() {
    pickerRef.current.blur();
  }
  const daysCount = [1, 2, 3, 4, 5];
  const maleCount = [1, 2, 3, 4, 5];
  const femaleCount = [1, 2, 3, 4, 5];
  const landtypess = [
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
      //console.log("tomesss", item);
      return item + " AM";
    }
  };

  const handleTimeChange = (value) => {
    setTimes(value);

    dispatch(setTime(value));
  };

  const handleDescriptionChange = (value) => {
    setDescriptions(value);
    dispatch(setDescription(value));
  };

  // const handleLandTypeChange = (value) => {
  //   setLandTypes(value);
  //   dispatch(setLandType(value));
  // };

  const handleLandAreaChange = (value) => {
    setLandAreas(value);
    dispatch(setLandArea(value));
  };

  const onChange = (event, selectedDate) => {
    setDefaultDate(selectedDate);
    console.log("isTimeSelected", selectedDate);

    const currentDate = moment(selectedDate).format("YYYY-MM-DD HH:mm");
    // const currentTime = moment(selectedDate).format("H:mm");
    const showDate = moment(selectedDate).format("YYYY-MM-DD");
    const showTime = moment(selectedDate).format("H:mm");

    // console.log(currentDate);
    // console.log(currentTime);
    setDate(currentDate);
    setShowDate(showDate);
    console.log('fkdfk',showDate)
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

  // const handleTotalAmount = (value) => {
  //   setTotalAmounts(value);
  //   dispatch(setTotalAmount(value));
  // };
  const sahayakBooking = async () => {
    let params = {
      datetime: "2023-03-16 17:05:42.000000",
      description: description,
      land_area: landArea,
      land_type: landTypes,
      count_male: maleCounts,
      count_female: femaleCounts,
      pay_amount_male: malepayamount,
      pay_amount_female: femalepayamount,
      num_days: days,
    };
    console.log("paramsparams", params);

    console.log("tokentoken", token);
    service
      .post("/api/post_individuals/", params, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token?.access,
        },
      })
      .then((response) => {
        // setloading(false);
        let data = response?.data;
        console.log("form", data);

        Toast.show("Job Posted Successfully!", Toast.SORT);
        console.log("formparamfffff", data);
        // navigation.replace("MyBooking");
      })
      .catch((error) => {
        console.log("error", error);
        //oast.show('All Fields are required!',  Toast.SORT);
      });
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
            <Text style={styles.loginText}>ठेके पर काम</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.machine}>
            <Text style={[styles.loginText, { color: "#fff" }]}>सहायक</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView>
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
              title={showDate ? showDate : "तारीख़   dd/mm/yyyy"}
            >
              <Text>{showDate ? showDate : "तारीख़   dd/mm/yyyy"}</Text>
            </TouchableOpacity>

            <TextInput
              value={selectedDates}
              // placeholder="Selected date and time"
              editable={false}
              onChangeText={(date) => {
                handleDateChange(date);
                // setDate(date);
              }}
            />

            <TouchableOpacity onPress={showDatepicker}>
              <Image
                source={require("../assets/image/calendar.png")}
                style={{ width: 20, height: 20, marginTop: 14, right: 10 }}
              />
            </TouchableOpacity>
          </View>

       
          <View style={styles.dropdownGender}>
            <Picker
              ref={pickerRef}
              selectedValue={time}
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
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-evenly",
            }}
          ></View>

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
            <TextInput
              style={styles.TextInput}
              placeholder="काम लिखें १५ शब्दों से कम,नंबर न लिखें "
              placeholderTextColor={"#000"}
              value={description}
              onChangeText={(description) =>
                handleDescriptionChange(description)
              }
            />
          </View>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
            <View style={[styles.TaxView]}>
              <TextInput
                style={styles.TextInput}
                keyboardType="numeric"
                maxLength={2}
                placeholder="भूमि क्षेत्र"
                placeholderTextColor={"#000"}
                value={landArea}
                onChangeText={(landArea) => handleLandAreaChange(landArea)}
              />
            </View>
            <View
              style={[
                styles.TaxView,
                {
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                },
              ]}
            >
              {/* <Text style={{ paddingLeft: 10 }}>महिलाओं </Text> */}
              <Text style={{ color: "#0099FF", left: 5 }}>{landTypes}</Text>

              <Picker
                style={{ width: 20 }}
                ref={pickerRef}
                selectedValue={landTypes}
                onValueChange={(itemValue, itemIndex) =>
                  setLandTypes(itemValue)
                }
              >
                <Picker.Item label="किल्ला/बीघा" value="" />
                {landtypess.map((item) => (
                  <Picker.Item
                    label={item.name}
                    value={item.name}
                    key={item.id}
                  />
                ))}
              </Picker>
            </View>
            {/* <View style={styles.BhumiView}>
              <TextInput
                style={styles.TextInput}
                placeholder="किल्ला/बीघा"
                placeholderTextColor={"#B4B4B4"}
                // onChangeText={(email) => setEmail(email)}
                // defaultValue={email}
                // value={email}
              />
            </View> */}
          </View>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              width: "90%",
              justifyContent: "space-evenly",
            }}
          >
            <View
              style={[
                styles.DoubleView,
                {
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginHorizontal: 4,
                },
              ]}
            >
              <Text style={{ paddingLeft: 10 }}>पुरुषों </Text>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ color: "#0099FF", marginTop: 14, right: 10 }}>
                  {maleCounts}
                </Text>

                <Picker
                  style={{ width: 20, paddingTop: 16 }}
                  ref={pickerRef}
                  selectedValue={maleCounts}
                  onValueChange={(itemValue, itemIndex) =>
                    setMaleCounts(itemValue)
                  }
                >
                  <Picker.Item label="1-5" value="1-5" />
                  {maleCount.map((item) => (
                    <Picker.Item
                      label={item.toString()}
                      value={item}
                      key={item}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            <View
              style={[
                styles.DoubleView,
                {
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginHorizontal: 10,
                },
              ]}
            >
              <Text style={{ paddingLeft: 10 }}>महिलाओं </Text>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ color: "#0099FF", marginTop: 14, right: 10 }}>
                  {femaleCounts}
                </Text>

                <Picker
                  style={{ width: 20, paddingTop: 16 }}
                  ref={pickerRef}
                  selectedValue={femaleCounts}
                  onValueChange={(itemValue, itemIndex) =>
                    setFemaleCounts(itemValue)
                  }
                >
                  <Picker.Item label="1-5" value="1-5" />
                  {femaleCount.map((item) => (
                    <Picker.Item
                      label={item.toString()}
                      value={item}
                      key={item}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          </View>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              width: "90%",
              justifyContent: "space-evenly",
            }}
          >
            <View
              style={[
                styles.DoubleView,
                {
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                },
              ]}
            >
              <TextInput
                style={styles.TextInput}
                keyboardType="numeric"
                placeholder="एक पुरुष का वेतन "
                placeholderTextColor={"#000"}
                // onChangeText={(email) => setEmail(email)}
                // defaultValue={email}
                // value={email}
                value={malepayamount}
                onChangeText={(malepayamount) =>
                  setMalepayamount(malepayamount)
                }
              />
              <Text style={{ color: "#0099FF", marginTop: 14, right: 10 }}>
                ₹
              </Text>
            </View>
            <View
              style={[
                styles.DoubleView,
                {
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                },
              ]}
            >
              <TextInput
                style={styles.TextInput}
                placeholder="एक महिला का वेतन"
                keyboardType="numeric"
                placeholderTextColor={"#000"}
                value={femalepayamount}
                // onChangeText={(email) => setEmail(email)}
                // defaultValue={email}
                // value={email}
                onChangeText={(femalepayamount) =>
                  setFemalepayamount(femalepayamount)
                }
              />
              <Text style={{ color: "#0099FF", marginTop: 14, right: 10 }}>
                ₹
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.inputView,
              {
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              },
            ]}
          >
            <Text style={{ paddingLeft: 10 }}>दिनों की संख्या</Text>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ color: "#0099FF", marginTop: 14, right: 10 }}>
                {days}
              </Text>

              <Picker
                style={{ width: 40, paddingTop: 16 }}
                ref={pickerRef}
                selectedValue={days}
                onValueChange={(itemValue, itemIndex) => setDays(itemValue)}
              >
                <Picker.Item label="1-5" value="1-5" />
                {daysCount.map((item) => (
                  <Picker.Item
                    label={item.toString()}
                    value={item}
                    key={item}
                  />
                ))}
              </Picker>
            </View>
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
            <TextInput
              style={styles.TextInput}
              placeholder="वेतन "
              keyboardType="numeric"
              placeholderTextColor={"#000"}
              // onChangeText={(email) => setEmail(email)}
              // defaultValue={email}
              // value={email}
            />
            <Text style={{ color: "#0099FF", marginTop: 14, right: 10 }}>
              ₹ 0.00
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => sahayakBooking()}
            style={styles.loginBtn}
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
    // flex:1,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
    //   margin:20,
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
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#505050",
    // backgroundColor: "#44A347",
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
    // borderWidth:1,
    borderRadius: 10,
    // borderColor:"#505050"
    backgroundColor: "#44A347",
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

  VerifyText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 18,
  },

  inputView: {
    borderColor: "#0070C0",
    borderRadius: 7,
    // borderBottomRightRadius: 7,
    width: "85%",
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
    // borderBottomRightRadius: 7,
    width: "39%",
    height: 48,
    marginTop: 20,
    borderWidth: 1,
  },

  BhumiView: {
    borderColor: "#0070C0",
    borderRadius: 7,
    // borderBottomRightRadius: 0,
    // borderTopRightRadius:0,
    width: "39%",
    height: 48,
    marginTop: 20,
    borderWidth: 1,
  },

  DoubleView: {
    borderColor: "#0070C0",
    borderRadius: 7,
    // borderBottomRightRadius: 7,
    width: "46%",
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
    // borderBottomRightRadius: 7,
    width: "87%",
    height: 48,
    marginTop: 15,
    borderWidth: 1,
  },
});
