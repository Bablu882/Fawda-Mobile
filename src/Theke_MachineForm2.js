import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Image,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import { useDispatch, useSelector } from "react-redux";
import service from "../service";
import { selectToken } from "../slices/authSlice";
import moment from "moment";
import { Picker } from "@react-native-picker/picker";

function Theke_MachineForm2({ navigation, route }) {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const [checked, setChecked] = React.useState("first");
  const [thekeperKam, setThekeperKam] = useState({});
  const { item, data, payment_status} = route?.params;
  console.log('fjkfkfkff', data, payment_status)
  // const bookingid = route?.params?.item;
  // console.log("bookingid", bookingid);
  const [colors, setColors] = useState(Array(10).fill("white"));
  const [bookingjob , setBookingJob] = useState("");
  const [ratings , setRating] = useState(0);
  const [comments , setComment] = useState("");

//  const [colors, setColors] = useState(Array(10).fill("white"));
  const [numbers, setNumber] = useState(0);

  const number = [1, 2, 3, 4];

  const RatingApi = async() => {
    let params = {
      booking_job : item?.booking_id,
      rating : ratings,
      comment : comments,
    }

    try {
      const response = await service.post("/api/rating/create/", params, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token?.access}`,
        },
      });
      const data = response?.data;
      // setThekeperKam(data.data);
      console.log("fjfjf", data);
    } catch (error) {
      console.log("Error:", error);
    }
  }

  // const {  item , status} = route.params;
  // console.log("fjds", status , item);

  const handleClick = (index) => {
    setRating(index+1);
    const newColors = [...colors];
    if (index < 4) newColors[index] = "red";
    else if (index >= 4 && index < 9) newColors[index] = "yellow";
    else if (index >= 9) newColors[index] = "green";
    setColors(newColors);
    RatingApi()
  };



  const fetchBookings = async () => {
    try {
      const response = await service.get("api/my_booking_details/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token?.access}`,
        },
      });
      const data = response.data;
      setThekeperKam(item.data);
      console.log("fjfjf", data);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const accptThekha = async () => {
    let params = {
      job_id: item.id,
    };

    try {
      const response = await service.post("/api/accept_theka/", params, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token?.access}`,
        },
      });
      const data = response?.data;
      setThekeperKam(data.data);
      console.log("fjfjf", data);
    } catch (error) {
      console.log("Error:", error);
    }
  };
  useEffect(() => {
    fetchBookings();
  }, [0]);
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ padding: 20, marginTop: 25 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrowleft" size={25} />
        </TouchableOpacity>
      </View>

      <ScrollView horizontal={false}>
        <View style={{ alignItems: "center", flex: 1 }}>
          <Text
            style={{ textAlign: "center", fontSize: 30, fontWeight: "600" }}
          >
            {item?.job_type}
          </Text>
          <View
            style={[
              styles.inputView,
              styles.flex,
              styles.justifyContentBetween,
              {
                height: 90,
              },
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
            style={[styles.flex, styles.justifyContentevenly, { width: "92%" }]}
          >
            <View
              style={[
                styles.TaxView,
                styles.flex,
                styles.justifyContentBetween,
              ]}
            >
              <TextInput
                style={styles.TextInput}
                placeholder={item?.land_area}
                placeholderTextColor={"#000"}
              />
              <Text style={{ marginTop: 13, marginRight: 8, color: "#0099FF" }}>
                {item?.land_type}
              </Text>
            </View>
            <View
              style={[
                styles.BhumiView,
                styles.flex,
                styles.justifyContentBetween,
              ]}
            >
              <TextInput
                style={styles.TextInput}
                placeholder="वेतन"
                placeholderTextColor={"#000"}
              />
              <Text style={{ marginTop: 13, marginRight: 8, color: "#0099FF" }}>
                ₹ {item?.total_amount_theka}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.inputView,
              styles.flex,
              styles.justifyContentBetween,
            ]}
          >
            <TextInput
              style={styles.TextInput}
              placeholder="काम की स्थिति"
              placeholderTextColor={"#000"}
            />
            <View
              style={{
                width: "30%",
                height: 30,
                backgroundColor: "#44A347",
                marginRight: 10,
                marginTop: 8,
              }}
            >
              {/* <TouchableOpacity>
              {thekeperKam && (
                <Text
                  style={{
                    textAlign: "center",
                    marginTop: 5,
                    color: "#fff",
                    fontSize: 15,
                    fontWeight: "600",
                  }}
                >
                  {thekeperKam?.status}
                </Text>
              )}
            </TouchableOpacity> */}
              <TouchableOpacity>
                <Text
                  style={{
                    textAlign: "center",
                    marginTop: 5,
                    color: "#fff",
                    fontSize: 15,
                    fontWeight: "600",
                  }}
                >
                  {/* {bookingid?.status} */}
                  बुक
                </Text>
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
              ठेकेदार
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
                width: "25%",
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

          <View
            style={{ display: "flex", flexDirection: "row", marginTop: 20 }}
          >
            {Array.from({ length: 10 }, (_, index) => (
              <TouchableOpacity key={index} onPress={() => {handleClick(index)}}>
                <Text
                  style={{
                    backgroundColor: colors[index],
                    padding: 10,
                    borderWidth: 0.7,
                    borderColor: "#000",
                  }}
                >
                  {index + 1}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{height:100 , borderWidth:1, width:"75%", marginTop:20}}>
            <TextInput 
            placeholder="comment"
            onChangeText={setComment}
            value={comments}
            />
          </View>

          <TouchableOpacity
            style={styles.BhuktanBtn}
            onPress={() =>
              navigation.navigate("Payment", {
                item: item.job_type,
                id: id,
                // bookingid: item,
              })
            }
            // onPress = {() => toggleViews()}
          >
            <Text style={[styles.loginText, { color: "#fff" }]}>
            काम शुरू करें 
            </Text>
          </TouchableOpacity>

          <View style={{ marginTop: "auto", padding: 5 }}>
            <TouchableOpacity
              style={{
                backgroundColor: "#D9D9D9",
                alignSelf: "center",
                paddingHorizontal: 50,
                paddingVertical: 10,
                borderRadius: 5,
              }}
            >
              <Text style={{ textAlign: "center", color: "#fff" }}>
                रद्द करें{" "}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
export default Theke_MachineForm2;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    justifyContent: "center",
    backgroundColor: "#fff",
  },
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
    marginTop: 10,
    backgroundColor: "#0099FF",
  },

  BhuktanBtn: {
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
    width: "80%",
    height: 48,
    marginTop: 15,
    borderWidth: 1,
  },

  TextInput: {
    padding: 10,

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
    width: "40%",
    height: 48,
    marginTop: 20,
    borderWidth: 1,
  },

  BhumiView: {
    borderColor: "#0070C0",
    borderRadius: 7,
    // borderBottomRightRadius: 0,
    // borderTopRightRadius:0,
    width: "40%",
    height: 48,
    marginTop: 20,
    borderWidth: 1,
  },

  DoubleView: {
    borderColor: "#0070C0",
    borderRadius: 7,
    // borderBottomRightRadius: 7,
    width: "42%",
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
  flex: {
    display: "flex",
    flexDirection: "row",
  },
  justifyContentBetween: {
    justifyContent: "space-between",
  },
  justifyContentevenly: {
    justifyContent: "space-evenly",
  },
  TextWhite: {
    color: "#fff",
  },
});
