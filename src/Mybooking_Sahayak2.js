import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Image,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import service from "../service";
import { selectToken } from "../slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { Picker } from "@react-native-picker/picker";

export default function Mybooking_Sahayak2({ navigation, route }) {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const [thekeperKam, setThekeperKam] = useState({});
  const [numbers, setNumber] = useState(0);
 
  const [show , setShow] = useState(true);
  const [colors, setColors] = useState(Array(10).fill('white'));

  const handleClick = (index) => {
    const newColors = [...colors];
    if (index === 0) newColors[index] = 'red';
    else if (index === 4) newColors[index] = 'yellow';
    else if (index === 9) newColors[index] = 'green';
    setColors(newColors);
    };


  const { id, item } = route.params;
  console.log("mybook", item);

  const acceptSahayak = async () => {
    let params = {
      count_male: item.count_male,
      count_female: item.count_female,
      job_id: id,
    };
    console.log("paramsacceptSahayak",params);

    try {
      const response = await service.post("/api/accept_individuals/", params, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token?.access}`,
        },
      });
      const data = response?.data;
      console.log("datadata", data);
   
    } catch (error) {
      console.log("Error:", error);
    }
  };
// useEffect(() => {
//   acceptSahayak()
// }, [])

// phone number dropdown
const number = [1, 2, 3, 4];
// end


  return (
    <SafeAreaView style={{ backgroundColor: "#fff", flex: 1 }}>
      <View style={{ padding: 20, marginTop: 25 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrowleft" size={25} />
        </TouchableOpacity>
      </View>
      <View style={{ justifyContent: "center" }}>
        <Text style={{ textAlign: "center", fontSize: 30, fontWeight: "600" }}>
          {item?.job_type === "individuals_sahayak" ? "सहायक" : ""}
        </Text>
      </View>
      <ScrollView>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
            marginHorizontal: 10,
          }}
        >
          <View
            style={[
              styles.inputView,
              styles.flex,
              styles.justifyContentBetween,
            ]}
          >
            <Text style={[styles.TextInput]}>{item?.description}</Text>
            <Image
              source={require("../assets/image/edit.png")}
              style={{ width: 20, height: 20, marginTop: 10, right: 10 }}
            />
          </View>

          <View
            style={[
              styles.inputView,
              styles.flex,
              styles.justifyContentBetween,
            ]}
          >
            <Text style={styles.TextInput}>
              {moment(item?.date).format("l")}
            </Text>
            <Text style={styles.TextInput}>
              {moment(item?.time).format("HH:mm")}
            </Text>
          </View>

        
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <View
              style={[
                styles.flex,
                styles.justifyContentBetween,
                styles.TaxView,
                { width: "35%" },
              ]}
            >
              <TextInput
                style={styles.TextInput}
                placeholder="भूमि क्षेत्र"
                placeholderTextColor={"#000"}
              />
              <Text style={{ marginRight: 8, color: "#0099FF" }}>
                {item?.land_area}
                {item?.land_type}
              </Text>
            </View>
            <View style={[ styles.TaxView , 
             styles.flex,
                styles.justifyContentBetween,]}></View>
          </View>

         
         

         

          <View style={[styles.flex, styles.justifyContentBetween]}></View>

          <View style={[styles.flex, styles.justifyContentBetween]}></View>
        

          <View
            style={[
              styles.flex,
              styles.justifyContentBetween,
              { flexWrap: "wrap" },
            ]}
          ></View>

          {/* end */}

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
              placeholder="काम की स्थिति"
              placeholderTextColor={"#000"}
              // onChangeText={(email) => setEmail(email)}
              // defaultValue={email}
              // value={email}
            />
            <View
              style={{
                height: 30,
                backgroundColor: "#44A347",
                marginRight: 10,
                marginTop: 8,
              }}
            >
              <TouchableOpacity>
                <Text
                  style={{
                    textAlign: "center",
                    marginTop: 5,
                    paddingHorizontal: 10,
                    color: "#fff",
                    fontSize: 15,
                    fontWeight: "600",
                  }}
                >
                  बुक 
                </Text>
              </TouchableOpacity>
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
              placeholder="सहायकों के मोबाइल नंबर "
              placeholderTextColor={"#000"}
              // onChangeText={(email) => setEmail(email)}
              // defaultValue={email}
              // value={email}
            />
            <View
              style={{
                height: 30,
                // backgroundColor: "#44A347",
                marginRight: 10,
                marginTop: 8,
              }}
            >
              <TouchableOpacity >
              <View
              style={[
                styles.DoubleView,
                styles.flex,
                styles.justifyContentBetween,{marginHorizontal:4}
              ]}
            >
                <Text
                  style={{
                    textAlign: "center",
                    marginTop: 5,
                    paddingHorizontal: 10,
                    color: "#0099FF",
                    fontSize: 15,
                    fontWeight: "600",
                  }}
                >
                  1-4 
                </Text>
                
           
           {/* <Text style={{ color: numbers ? "#000" : "#ccc", left: 5 }}>
              {numbers ? numbers : ""}
            </Text> */}
              <View style={{ flexDirection: "row" }}>
          
                <Picker
                  style={{ width: 20, paddingTop: 16 }}
                  // ref={pickerRef}
                  selectedValue={numbers}
                  onValueChange={(itemValue, itemIndex) =>
                    setNumber(itemValue)
                  }
                >
                  <Picker.Item label="1-4" value="1-4" enabled={false} />
                  {number.map((item) => (
                    <Picker.Item
                      label={item.toString()}
                      value={item}
                      key={item}
                    />
                  ))}
                </Picker>
              </View>
            </View>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.inputView, { position: "relative" }]}>
          <Text
            style={{
              position: "absolute",
              top: -10,
              left: 30,
              width: "15%",
              textAlign: "center",
              backgroundColor: "#fff",
            }}
          >
            सहायक 
          </Text>
          <TextInput
            style={styles.TextInput}
            placeholder=""
            placeholderTextColor={"#848484"}
            // onChangeText={(text) => setName(text, "name")}
            // defaultValue={email}
            // value={name}
            //   error={input.name}
            //   onFocus={() => handleError(null, "name")}
          />
          {/* {!!errors.name && <Text style={styles.error}>{errors.name}</Text>} */}
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
            गाँव 
          </Text>
          <TextInput
            style={styles.TextInput}
            placeholder=""
            placeholderTextColor={"#848484"}
            // onChangeText={(text) => setName(text, "name")}
            // defaultValue={email}
            // value={name}
            //   error={input.name}
            //   onFocus={() => handleError(null, "name")}
          />
          {/* {!!errors.name && <Text style={styles.error}>{errors.name}</Text>} */}
        </View>

        <View style={[styles.inputView, { position: "relative" }]}>
          <Text
            style={{
              position: "absolute",
              top: -10,
              left: 30,
              width: "20%",
              textAlign: "center",
              backgroundColor: "#fff",
            }}
          >
            मोबाइल नंबर 
          </Text>
          <TextInput
            style={styles.TextInput}
            placeholder=""
            placeholderTextColor={"#848484"}
            // onChangeText={(text) => setName(text, "name")}
            // defaultValue={email}
            // value={name}
            //   error={input.name}
            //   onFocus={() => handleError(null, "name")}
          />
          {/* {!!errors.name && <Text style={styles.error}>{errors.name}</Text>} */}
        </View>
        
        <View style={{display:"flex" , flexDirection:"row", marginTop:20}}>
{Array.from({ length: 10 }, (_, index) => (
<TouchableOpacity key={index} onPress={() => handleClick(index)}>
<Text style={{ backgroundColor: colors[index], padding: 10 , borderWidth:0.7, borderColor:"#000"}}>
{index + 1}
</Text>
</TouchableOpacity>
))}
</View>
          <TouchableOpacity
            style={styles.BhuktanBtn}
            onPress={() => navigation.navigate("Payment")}
            // onPress = {() => toggleViews()}
          >
            <Text style={[styles.loginText, { color: "#fff" }]}>
            काम शुरू करें 
            </Text>
          </TouchableOpacity>

          {/* <TouchableOpacity
            onPress={() => navigation.navigate("Profile")}
            style={styles.loginBtn}
          >
            <Text style={[styles.loginText, { color: "#fff" }]}>रद्द करें</Text>
          </TouchableOpacity> */}
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

  MaleCheckView: {
    borderColor: "#0070C0",
    borderRadius: 7,
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
    width: "30%",
    height: 55,
    marginTop: 10,
    borderWidth: 1,
  },

  // FemalecheckView:{
  //     borderColor: "#0070C0",
  //     borderRadius: 7,
  //     borderBottomLeftRadius: 0,
  //     borderTopLeftRadius:0,
  //     width: "30%",
  //     height: 48,
  //     // marginTop: 30,
  //     borderWidth: 1,
  // },

  loginText: {
    color: "#000",
    fontSize: 16,
    //   flexDirection:"column",
  },

  loginBtn: {
    width: "30%",
    borderRadius: 7,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
    backgroundColor: "#DCDCDC",
  },

  BhuktanBtn: {
    width: "85%",
    borderRadius: 7,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
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
    width: "100%",
    height: 48,
    marginTop: 10,
    borderWidth: 1,
  },

  TextInput: {
    // height: 50,
    padding: 10,

    // fontFamily: "Poppin-Light"
  },

  CheckTextInput: {
    textAlign: "center",
    marginTop: 0,
  },

  TaxView: {
    borderColor: "#0070C0",
    borderRadius: 7,
    // borderBottomRightRadius: 7,
    width: "50%",
    height: 48,
    marginTop: 10,

    borderWidth: 1,
  },

  BhumiView: {
    borderColor: "#0070C0",
    borderRadius: 7,
    // borderBottomRightRadius: 0,
    // borderTopRightRadius:0,
    width: "52%",
    height: 48,
    marginTop: 10,
    borderWidth: 1,
  },

  DateView: {
    borderColor: "#0070C0",
    borderRadius: 7,
    // borderBottomRightRadius: 7,
    width: "39%",
    height: 48,
    marginTop: 10,
    borderWidth: 1,
  },

  TimeView: {
    borderColor: "#0070C0",
    borderRadius: 7,
    // borderBottomRightRadius: 0,
    // borderTopRightRadius:0,
    width: "39%",
    height: 48,
    marginTop: 10,
    borderWidth: 1,
  },

  JobStatusView: {
    borderColor: "#0070C0",
    borderRadius: 7,
    // borderBottomRightRadius: 7,
    width: "43%",
    height: 48,
    marginTop: 20,
    borderWidth: 1,
  },

  AmountView: {
    borderColor: "#0070C0",
    borderRadius: 7,
    // borderBottomRightRadius: 0,
    // borderTopRightRadius:0,
    width: "43%",
    height: 48,
    marginTop: 20,
    borderWidth: 1,
  },

  DoubleView: {
    borderColor: "#0070C0",
    borderRadius: 7,
    // borderBottomRightRadius: 7,
    // width: "42%",
    // height: 48,
    marginTop:-10,
    // borderWidth: 1,
  },

  FemalecheckView: {
    borderColor: "#0070C0",
    borderRadius: 7,
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 0,
    width: "27%",
    height: 55,
    marginTop: 10,
    borderWidth: 1,
  },
  flex: {
    alignItems: "center",
    flexDirection: "row",
  },
  justifyContentBetween: {
    justifyContent: "space-between",
  },
  TextWhite: {
    color: "#fff",
  },
});
