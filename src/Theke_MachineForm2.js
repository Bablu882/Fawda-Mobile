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
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Toast from "react-native-simple-toast";

function Theke_MachineForm2({ navigation, route }) {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const [checked, setChecked] = React.useState("first");
  const [thekeperKam, setThekeperKam] = useState({});
  const { item, data, payment_status } = route?.params;
  console.log("fjkfkfkff", item, data, payment_status);
  // const bookingid = route?.params?.item;
  // console.log("bookingid", bookingid);
  const [selectedButtonIndex, setSelectedButtonIndex] = useState(-1);
  const [colors, setColors] = useState(Array(10).fill("white"));
  const [bookingjob, setBookingJob] = useState("");
  const [ratings, setRating] = useState(0);
  const [comments, setComment] = useState("");
  const [status, setStatus] = useState("");

  //  const [colors, setColors] = useState(Array(10).fill("white"));
  const [numbers, setNumber] = useState(0);

  const number = [1, 2, 3, 4];

  const RatingApi = async () => {
    let params = {
      booking_job: data,
      rating: ratings,
      comment: comments,
    };

    try {
      const response = await service.post("/api/rating/create/", params, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token?.access}`,
        },
      });
      const data = response?.data;
      // setThekeperKam(data.data);
      navigation.replace("MyBooking");
      console.log("fjfjf", data);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  // const {  item , status} = route.params;
  // console.log("fjds", status , item);

  const handleClick = (index) => {
    setRating(index + 1);
    setSelectedButtonIndex(index);
    // const newColors = [...colors];
    // if (index < 4) newColors[index] = "red";
    // else if (index >= 4 && index < 9) newColors[index] = "yellow";
    // else if (index >= 9) newColors[index] = "green";
    // setColors(newColors);
  };

  const renderButton = (index) => {
    const backgroundColor =
      index <= selectedButtonIndex ? "red" : "transparent";
    const iconName = index <= selectedButtonIndex ? "star" : "star-o";
    return (
      <TouchableOpacity key={index} onPress={() => handleClick(index)}>
        <View style={[styles.button]}>
          <FontAwesome name={iconName} size={30} color="#e6b400" />
        </View>
      </TouchableOpacity>
    );
  };

  const ratingColor = "orange";

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

  const onGoing = async () => {
    let params = {
      booking_id: data,
    };
    console.log("fhsfhdfhdfh", params);
    try {
      const response = await service.post("/api/booking_ongoing/", params, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token?.access}`,
        },
      });
      const data = response?.data;
      setStatus(data);
      console.log(status, "check status");
      // setThekeperKam(data.data);
      console.log("fjfjf", data);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const Completed = async () => {
    let params = {
      booking_id: data,
    };
    console.log("fhsfhdfhdfh", params);
    try {
      const response = await service.post("/api/booking_completed/", params, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token?.access}`,
        },
      });
      const data = response?.data;
      setStatus(data);
      console.log(status, "check status");
      // setThekeperKam(data.data);
      console.log("fjfjf", data);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const cancel = async () => {
    let params = {};
    // if (payment_status === "success") {
    params = {
      job_id: item?.id,
      job_number: item?.job_number,
      booking_id: item?.booking_id,
      status: status,
      // }
    };
    try {
      const response = await service.post("/api/cancel/", params, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token?.access}`,
        },
      });
      console.log(token?.access, "token");
      const data = response?.data;
      setStatus(data.status);
      // Toast.show(JSON.stringify(data.status), Toast.LONG);s
      console.log("fjfjf", data);
    } catch (error) {
      console.log("Error:", error);
    }
  };

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
            {item.job_type === "individuals_sahayak"
              ? "सहायक के काम "
              : item.job_type === "theke_pe_kam"
              ? "ठेकेदार"
              : ""}
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
              {moment.utc(item?.datetime).format("l")}
            </Text>
            <Text style={styles.TextInput}>
              {moment.utc(item?.datetime).format("LT")}
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
              {status.status === "Ongoing" ? (
                <Text
                  style={{
                    textAlign: "center",
                    marginTop: 5,
                    color: "#fff",
                    fontSize: 15,
                    fontWeight: "600",
                  }}
                >
                  जारी है
                  {console.log("")}
                </Text>
              ) : status.status === "Completed" ? (
                <Text
                  style={{
                    textAlign: "center",
                    marginTop: 5,
                    color: "#fff",
                    fontSize: 15,
                    fontWeight: "600",
                  }}
                >
                  समाप्त{" "}
                </Text>
              ) : (
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
                  {console.log("")}
                </Text>
              )}
            </View>
          </View>

          {status.status === "Completed" ? (
            ""
          ) : (
            <>
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
                <Text
                  style={styles.TextInput}

                  // onChangeText={(text) => setName(text, "name")}
                  // defaultValue={email}
                  // value={name}
                  //   error={input.name}
                  //   onFocus={() => handleError(null, "name")}
                >
                  {item?.thekedar_name}
                </Text>
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
                <Text style={styles.TextInput}>{item?.thekedar_village}</Text>
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
                <Text
                  style={styles.TextInput}

                  // onChangeText={(text) => setName(text, "name")}
                  // defaultValue={email}
                  // value={name}
                  //   error={input.name}
                  //   onFocus={() => handleError(null, "name")}
                >
                  {" "}
                  {item?.thekedar_mobile_no}
                </Text>
                {/* {!!errors.name && <Text style={styles.error}>{errors.name}</Text>} */}
              </View>
            </>
          )}

          {status.status === "Completed" ? (
            <>
              <View
                style={{ display: "flex", flexDirection: "row", marginTop: 20 }}
              >
                {[...Array(5).keys()].map(renderButton)}
              </View>

              <View
                style={{
                  height: 100,
                  borderWidth: 1,
                  width: "75%",
                  marginTop: 20,
                }}
              >
                <TextInput
                  placeholder="comment"
                  onChangeText={setComment}
                  value={comments}
                />
              </View>
            </>
          ) : (
            ""
          )}
          {status.status === "Ongoing" ? (
            <TouchableOpacity
              style={styles.BhuktanBtn}
              onPress={() => Completed()}
            >
              <Text style={[styles.loginText, { color: "#fff" }]}>
                काम पूरा हुआ
              </Text>
            </TouchableOpacity>
          ) : status.status === "Completed" ? (
            <TouchableOpacity
              style={styles.BhuktanBtn}
              onPress={() => RatingApi()}
            >
              <Text style={[styles.loginText, { color: "#fff" }]}>समाप्त</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.BhuktanBtn}
              onPress={() => onGoing()}
            >
              <Text style={[styles.loginText, { color: "#fff" }]}>
                काम शुरू करें
              </Text>
            </TouchableOpacity>
          )}

          {status.status === "Ongoing" ||
            ("Completed" && (
              <View style={{ marginTop: "auto", padding: 5 }}>
                <TouchableOpacity
                  onPress={() => cancel()}
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
            ))}
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
    color: "#000",
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
