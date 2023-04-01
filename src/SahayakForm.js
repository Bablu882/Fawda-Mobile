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
  const [maleCounts, setMaleCounts] = useState(0);
  const [defaultDate, setDefaultDate] = useState(new Date());
  const [femaleCounts, setFemaleCounts] = useState(0);
  const [landTypes, setLandTypes] = useState('');
  const [selectedDates, setSelectedDates] = useState('');
  const [landArea, setLandAreas] = useState("");
  const [showDate, setShowDate] = useState("");
  const [malepayamount, setMalepayamount] = useState(0);
  const [femalepayamount, setFemalepayamount] = useState(0);
  const [description, setDescriptions] = useState("");
  const [days, setDays] = useState(0);
  const [time, setTimes] = useState("");
  const [total, setTotal] = useState(0)

  var isTimeSelected = false;




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

  const handleLandAreaChange = (value) => {
    setLandAreas(value);
    dispatch(setLandArea(value));
  };

  const onChange = (event, selectedDate) => {
    setDefaultDate(selectedDate);
    console.log("isTimeSelected", selectedDate);

    const currentDate = moment(selectedDate).format("YYYY-MM-DD HH:mm");
    const showDate = moment(selectedDate).format("YYYY-MM-DD");
    const showTime = moment(selectedDate).format("H:mm");

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
    let currentDate = new Date(); 
    currentDate.setMonth(currentDate.getMonth() + 1);

    return currentDate; 
  };

  const showDatepicker = () => {
    isTimeSelected = false;
    showMode("date");
  };

  const sahayakBooking = async () => {
    const datetime = moment(showDate).format('YYYY-MM-DD') + 'T' +  moment(time, "h:mm A").format('HH:mm:ss.SSSSSS')
    console.log('date', datetime)
    const params = {
      datetime: datetime,
      // datetime: "2023-03-16 17:05:42.000000",
      description: description,
      land_area: landArea,
      land_type: landTypes,
      count_male: maleCounts,
      count_female: femaleCounts,
      pay_amount_male: malepayamount,
      pay_amount_female: femalepayamount,
      num_days: days,
    };

    
    console.log('params::', params)

    try {
      const response = await service.post("/api/post_individuals/", params, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token?.access,
        },
      });
      
      const { data } = response;
      Toast.show("Job Posted Successfully!", Toast.SORT);
      console.log('data::', data)
      navigation.replace("MyBooking");
    } catch (error) {
      console.log("Error:", error);
      Toast.show("Error Occurred. Please try again later.", Toast.SORT);
    }
  };
  useEffect(() => {
   const Total = (((maleCounts * malepayamount) + (femaleCounts * femalepayamount)) * days )
   return setTotal(Total)
  
  }, [maleCounts, femaleCounts, malepayamount, femalepayamount, days])

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
              styles.flex,
              styles.justifyContentBetween
            ]}
          >
            <TouchableOpacity
              style={{ paddingVertical: 10, paddingHorizontal: 5 }}
              color="black"
              onPress={showDatepicker}
              title={showDate ? showDate : "तारीख़   dd/mm/yyyy"}
            >
              <Text style={{color:showDate?'#000':'#ccc'}}>{showDate ? showDate : "तारीख़   dd/mm/yyyy"}</Text>
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

       
          <View style={[styles.dropdownGender, styles.justifyContentBetween, styles.flex]}>
          <Text style={{ color: time ? "#000" : "#ccc", left: 5 }}>
            {time ? time : "-समय-"}
          </Text>
            <Picker
              ref={pickerRef}
              selectedValue={time}
              style={{width:40}}
              onValueChange={(itemValue, itemIndex) =>
                setTimes(timeConverted(itemValue))
                }
            >
              <Picker.Item enabled={false} label="-समय-" value="" />
              {timings.map((item, index) => {
                return (
                  <Picker.Item
                    key={index}
                 
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
              styles.flex,
              styles.justifyContentBetween
            ]}
          >
            <TextInput
              style={styles.TextInput}
              placeholder="काम लिखें १५ शब्दों से कम,नंबर न लिखें "
              placeholderTextColor={"#ccc"}
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
                placeholderTextColor={"#ccc"}
                value={landArea}
                onChangeText={(landArea) => handleLandAreaChange(landArea)}
              />
            </View>
            <View
              style={[
                styles.TaxView,
                styles.flex,
             styles.justifyContentBetween
              ]}
            >

              <Text style={{ color: landTypes ? "#000" : "#ccc", left: 5 }}>
              {landTypes ? landTypes : "किल्ला/बीघा"}
            </Text>
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
                styles.flex,
                styles.justifyContentBetween,{marginHorizontal:4}
              ]}
            >
           
           <Text style={{ color: maleCounts ? "#000" : "#ccc", left: 5 }}>
              {maleCounts ? maleCounts : "पुरुषों"}
            </Text>
              <View style={{ flexDirection: "row" }}>
          
                <Picker
                  style={{ width: 20, paddingTop: 16 }}
                  ref={pickerRef}
                  selectedValue={maleCounts}
                  onValueChange={(itemValue, itemIndex) =>
                    setMaleCounts(itemValue)
                  }
                >
                  <Picker.Item label="1-5" value="1-5" enabled={false} />
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
                styles.DoubleView,styles.flex,styles.justifyContentBetween,
                {

                  marginHorizontal: 10,
                },
              ]}
            >
               <Text style={{ color: femaleCounts ? "#000" : "#ccc", left: 5 }}>
              {femaleCounts ? femaleCounts : "महिलाओं"}
            </Text>
          
              <View style={{ flexDirection: "row" }}>
                <Picker
                  style={{ width: 20, paddingTop: 16 }}
                  ref={pickerRef}
                  selectedValue={femaleCounts}
                  onValueChange={(itemValue, itemIndex) =>
                    setFemaleCounts(itemValue)
                  }
                >
                  <Picker.Item label="1-5" value="1-5" enabled={false}/>
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
                styles.flex,
                styles.justifyContentBetween
              ]}
            >
              <TextInput
                style={styles.TextInput}
                keyboardType="numeric"
                placeholder="एक पुरुष का वेतन "
                placeholderTextColor={"#ccc"}
              
                value={malepayamount}
                onChangeText={(malepayamount) =>
                  setMalepayamount(malepayamount)
                }
              />
              <Text style={{ color: "#0099FF", right: 10 }}>
                ₹
              </Text>
            </View>
            <View
              style={[
                styles.DoubleView,
                styles.flex,
                styles.justifyContentBetween
              ]}
            >
              <TextInput
                style={styles.TextInput}
                placeholder="एक महिला का वेतन"
                keyboardType="numeric"
                placeholderTextColor={"#ccc"}
                value={femalepayamount}
        
                onChangeText={(femalepayamount) =>
                  setFemalepayamount(femalepayamount)
                }
              />
              <Text style={{ color: "#0099FF", right: 10 }}>
                ₹
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.inputView,
              styles.flex,
             styles.justifyContentBetween
            ]}
          >
            <Text style={{ paddingLeft: 10, color:'#ccc' }}>दिनों की संख्या</Text>
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
                <Picker.Item label="1-5" value="1-5" enabled={false}/>
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
             styles.flex,
             styles.justifyContentBetween
            ]}
          >
            <TextInput
              style={styles.TextInput}
              placeholder="वेतन "
              keyboardType="numeric"
              placeholderTextColor={"#ccc"}
            
            />
            <Text style={{ color: "#0099FF", right: 10 }}>
              ₹ {total}
            </Text>
          </View>

          <TouchableOpacity
          onPress={() => {sahayakBooking()}}
            // onPress={() => sahayakBooking()}
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
    width: "39%",
    height: 48,
    marginTop: 20,
    borderWidth: 1,
  },

  BhumiView: {
    borderColor: "#0070C0",
    borderRadius: 7,
    width: "39%",
    height: 48,
    marginTop: 20,
    borderWidth: 1,
  },

  DoubleView: {
    borderColor: "#0070C0",
    borderRadius: 7,
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
});

