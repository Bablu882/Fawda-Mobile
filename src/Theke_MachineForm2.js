import React, { useState, useEffect, useRef } from "react";
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
import { selectToken, selectUserType } from "../slices/authSlice";
import moment from "moment";
import { Picker } from "@react-native-picker/picker";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Toast from "react-native-simple-toast";
import * as Linking from "expo-linking";

function Theke_MachineForm2({ navigation, route }) {
  const dispatch = useDispatch();
  const usertype = useSelector(selectUserType);
  const ReviewInput = useRef(null);
  const token = useSelector(selectToken);
  const [checked, setChecked] = React.useState("first");
  const [thekeperKam, setThekeperKam] = useState({});
  const { data, useramount, amount, item, totalamount, payment_status } =
    route.params ?? {};
  const itemStatus = item?.status;
  console.log("fjkfkfkff", amount, item, totalamount, useramount);
  // const bookingid = route?.params?.item;
  // console.log("bookingid", bookingid);
  const [selectedButtonIndex, setSelectedButtonIndex] = useState(-1);
  const [colors, setColors] = useState(Array(10).fill("white"));
  const [bookingjob, setBookingJob] = useState("");
  const [ratings, setRating] = useState(0);
  const [comments, setComment] = useState("");

  const [response, setResponse] = useState("");
  const [complete, setCompleted] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [status, setStatus] = useState("");

  //  const [colors, setColors] = useState(Array(10).fill("white"));
  const [numbers, setNumber] = useState(0);

  const number = [1, 2, 3, 4];
  const handlereviewbutton = () => {
    ReviewInput.current.focus();
  };

  const handleCallPress = (phone) => {
    const url = `tel:${phone}`;
    Linking.canOpenURL(url)
      ?.then((supported) => {
        if (!supported) {
          console.log("Phone number is not available");
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error("An error occurred", err));
  };

  const RatingApi = () => {
    let params = {
      job_id: JSON.stringify(item?.job_id),
      job_number: item?.job_number,
      rating: ratings,
      comment: comments,
    };
    console.log("fjfjf", params);

    service
      .post("/api/rating/create/", params, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        let data = res?.data;
        if (data?.status === 201) {
          navigation.replace("Thankyou");
          console.log("fjfjf", data);
        } else {
          console.log("error message");
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  // const {  item , status} = route.params;
  // console.log("fjds", status , item);

  const handleClick = (index) => {
    setRating(index + 1);
    setSelectedButtonIndex(index);
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

  const Ongoing = () => {
    let params = {
      job_id: JSON.stringify(item?.job_id),
      job_number: item?.job_number,
    };
    console.log(params);
    service
      .post("/api/booking_ongoing/", params, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        let data = res?.data;
        if (
          data["booking-status"] !== "Ongoing" ||
          data["booking-status"] === undefined
        ) {
          navigation.replace("HomeStack", { screen: "BottomTab" });
          Toast.show(
            "भुगतान के बाद सहायक द्वारा यह बुकिंग रद्द कर दी गई है।कृपया बुकिंग पुनः लोड करें!",
            Toast.LONG
          );
        } else {
          setResponse(data["booking-status"]);
          console.log("jdjjdd", data);
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  const bookingcompleted = () => {
    let params = {
      job_id: JSON.stringify(item?.job_id),
      job_number: item?.job_number,
    };
    console.log(params);
    service
      .post("/api/booking_completed/", params, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        let data = res?.data;
        setCompleted(data["booking-status"]);
        setResponse(data["booking-status"]);

        console.log("jdjjdd", data);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  const cancel = async () => {
    let params = {
      job_id: item?.job_id,
      job_number: item?.job_number,
      // booking_id: item?.booking_id,
      status: "Cancelled-After-Payment",
    };
    console.log("fjffjfjf", params);
    try {
      const response = await service.post("/api/cancel/", params, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response?.data;
      // setStatus(data.status);
      navigation.replace("HomeStack", { screen: "BottomTab" });
      Toast.show("काम रद्द किया गया है !", Toast.LONG);
      console.log("fjfjf", data);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ padding: 20, marginTop: 35 }}>
        {/* <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrowleft" size={25} />
        </TouchableOpacity> */}
      </View>
      <ScrollView horizontal={false} showsVerticalScrollIndicator={false}>
        <View style={{ alignItems: "center", flex: 1, marginHorizontal: 10 }}>
          <Text
            style={{
              textAlign: "center",
              fontSize: 30,
              fontWeight: "600",
              fontFamily: "Devanagari-bold",
            }}
          >
            {item.job_type === "individuals_sahayak"
              ? "सहायक के काम "
              : item.job_type === "theke_pe_kam"
              ? "ठेके पर काम"
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
            <Text style={styles.label}>काम का विवरण</Text>
            <Text style={[styles.TextInput, { maxWidth: "98%" }]}>
              {item?.description}
            </Text>
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
              {moment(item?.datetime).format("DD/MM/YYYY")}
            </Text>
            <Text style={styles.TextInput}>
              {moment(item?.datetime).format("LT")}
            </Text>
          </View>

          <View style={[styles.flex, { justifyContent: "space-around" }]}>
            <View
              style={[
                styles.TaxView,
                styles.flex,
                styles.justifyContentBetween,
                { marginRight: 10 },
              ]}
            >
              <TextInput
                style={styles.TextInput}
                editable={false}
                placeholder="भूमि क्षेत्र "
                placeholderTextColor={"#000"}
              />
              <Text
                style={{
                  marginTop: 13,
                  marginRight: 8,
                  color: "#0099FF",
                  fontFamily: "Devanagari-regular",
                }}
              >
                {item?.land_area}
                {item?.land_type == "Bigha" ? " बीघा" : " किल्ला"}
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
                editable={false}
                placeholder="वेतन"
                placeholderTextColor={"#000"}
              />
              <Text
                style={{
                  marginTop: 13,
                  marginRight: 8,
                  color: "#0099FF",
                  fontFamily: "Devanagari-regular",
                }}
              >
                ₹ {useramount}
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
              editable={false}
            />
            <View
              style={{
                width: "30%",
                height: 30,
                backgroundColor: "#0099FF",
                marginRight: 10,
                marginTop: 8,
              }}
            >
              {response ? (
                <Text
                  style={{
                    textAlign: "center",
                    marginTop: 5,
                    color: "#fff",
                    fontSize: 15,
                    fontWeight: "600",
                    fontFamily: "Devanagari-bold",
                  }}
                >
                  {response === "Booked"
                    ? "बुक"
                    : response === "Accepted"
                    ? "स्वीकार"
                    : response === "Ongoing"
                    ? "जारी है"
                    : response === "Completed"
                    ? "समाप्त"
                    : ""}
                </Text>
              ) : (
                <Text
                  style={{
                    textAlign: "center",
                    marginTop: 5,
                    color: "#fff",
                    fontSize: 15,
                    fontWeight: "600",
                    fontFamily: "Devanagari-bold",
                  }}
                >
                  {item.status === "Booked"
                    ? "बुक"
                    : item.status === "Accepted"
                    ? "बुक"
                    : item.status === "Ongoing"
                    ? "जारी है"
                    : ""}
                </Text>
              )}
            </View>
          </View>
          {/* 
          {response !=="Completed" && (
          
          )} */}
          {complete === "Completed" ? (
            <View
              style={{
                width: "90%",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 20,
              }}
            >
              <View style={{ marginBottom: 10 }}>
                <Text
                  style={{ textAlign: "center", fontFamily: "Devanagari-bold" }}
                >
                  रेटिंग दें{" "}
                </Text>
                <View style={{ display: "flex", flexDirection: "row" }}>
                  {[...Array(5).keys()].map(renderButton)}
                </View>
              </View>
              <Text style={{ fontFamily: "Devanagari-bold" }}>कोई सुझाव</Text>
              <View style={{ width: "100%" }}>
                <TouchableOpacity
                  onPress={handlereviewbutton}
                  style={{
                    height: 100,
                    borderWidth: 1,
                    borderRadius: 10,
                    width: "100%",
                    marginTop: 20,
                    borderColor: "#0099FF",
                  }}
                >
                  <TextInput
                    onChangeText={setComment}
                    value={comments}
                    ref={ReviewInput}
                  />
                </TouchableOpacity>
              </View>
            </View>
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
                    fontFamily: "Devanagari-bold",
                  }}
                >
                  ठेकेदार
                </Text>
                <Text style={styles.TextInput}>{item?.thekedar_name}</Text>
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
                    fontFamily: "Devanagari-bold",
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
                    fontFamily: "Devanagari-bold",
                  }}
                >
                  मोबाइल नंबर
                </Text>
                <Text style={styles.TextInput}>{item?.thekedar_mobile_no}</Text>
              </View>
              <View style={[styles.CallBtn]}>
                <TouchableOpacity
                  onPress={() => handleCallPress(item?.thekedar_mobile_no)}
                >
                  <Text
                    style={[
                      styles.loginText,
                      { color: "#fff", fontFamily: "Devanagari-bold" },
                    ]}
                  >
                    कॉल करें
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {complete !== "Completed" && (
            <TouchableOpacity
              style={[styles.BhuktanBtn, { marginTop: 20 }]}
              onPress={
                response === "Ongoing" || item?.status === "Ongoing"
                  ? bookingcompleted
                  : response === "Completed"
                  ? () => RatingApi()
                  : () => Ongoing()
              }
            >
              <Text
                style={[
                  styles.loginText,
                  { color: "#fff", fontFamily: "Devanagari-bold" },
                ]}
              >
                {complete && complete["booking-status"] === "Ongoing"
                  ? "रेटिंग दें जारी है"
                  : complete && complete["booking-status"] === "Completed"
                  ? "रेटिंग दें"
                  : response === "Ongoing" || item?.status === "Ongoing"
                  ? "काम पूरा हुआ"
                  : "काम शुरू करें "}
              </Text>
            </TouchableOpacity>
          )}

          {complete === "Completed" && (
            <TouchableOpacity
              style={styles.BhuktanBtn}
              onPress={() => {
                RatingApi();
              }}
            >
              <Text
                style={[
                  styles.loginText,
                  { color: "#fff", fontFamily: "Devanagari-bold" },
                ]}
              >
                समाप्त
              </Text>
            </TouchableOpacity>
          )}

          <View style={{ marginTop: "auto", padding: 5 }}>
            {usertype &&
              usertype === "Grahak" &&
              itemStatus !== "Completed" && (
                <>
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
                    <Text style={styles.label}>टिप्पणी</Text>
                    {response === "" && itemStatus === "Booked" && (
                      <Text style={[styles.TextInput, { maxWidth: "98%" }]}>
                        कृपया ऊपर दिए गए नंबर पर संपर्क करें! काम शुरू करने के
                        लिए कृपया "काम शुरू करें" दबाएँ !
                      </Text>
                    )}
                    {(response === "Ongoing" || itemStatus === "Ongoing") &&
                      response !== "Completed" && (
                        <Text style={[styles.TextInput, { maxWidth: "98%" }]}>
                          कार्य पूरा होने के बाद "काम पूरा हुआ" दबाएँ !
                        </Text>
                      )}
                    {response === "Completed" && (
                      <Text style={[styles.TextInput, { maxWidth: "98%" }]}>
                        कृपया रेटिंग दें! यदि आपका कोई सुझाव है तो कृपया लिखें
                        और फिर "समाप्त" बटन दबाएँ
                      </Text>
                    )}
                  </View>
                </>
              )}
          </View>

          {item?.status != "Completed" &&
            response != "Ongoing" &&
            response !== "Completed" && (
              <View style={{ marginTop: "auto", padding: 5 }}>
                <TouchableOpacity
                  onPress={() => {
                    cancel();
                  }}
                  style={{
                    backgroundColor: "#D9D9D9",
                    alignSelf: "center",
                    paddingHorizontal: 50,
                    paddingVertical: 10,
                    borderRadius: 5,
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      color: "#fff",
                      fontFamily: "Devanagari-bold",
                    }}
                  >
                    रद्द करें
                  </Text>
                </TouchableOpacity>
              </View>
            )}
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

  loginText: {
    color: "#000",
    fontSize: 16,
    fontFamily: "Devanagari-regular",
    //   flexDirection:"column",
  },

  BhuktanBtn: {
    width: "100%",
    borderRadius: 7,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    color: "#fff",
    backgroundColor: "#0099FF",
  },
  CallBtn: {
    width: "25%",
    borderRadius: 7,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    color: "#fff",
    backgroundColor: "#0099FF",
  },

  inputView: {
    borderColor: "#0070C0",
    borderRadius: 7,
    // borderBottomRightRadius: 7,
    width: "100%",
    height: 48,
    marginTop: 15,
    borderWidth: 1,
  },

  TextInput: {
    padding: 10,
    color: "#000",
    fontFamily: "Devanagari-regular",
  },

  TaxView: {
    borderColor: "#0070C0",
    borderRadius: 7,
    // borderBottomRightRadius: 7,
    width: "50%",
    height: 48,
    marginTop: 20,
    borderWidth: 1,
  },

  BhumiView: {
    borderColor: "#0070C0",
    borderRadius: 7,
    // borderBottomRightRadius: 0,
    // borderTopRightRadius:0,
    width: "45%",
    height: 48,
    marginTop: 20,
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
  label: {
    position: "absolute",
    top: -10,
    left: 30,
    marginHorizontal: 5,
    paddingHorizontal: 10,
    fontFamily: "Devanagari-bold",

    textAlign: "center",
    backgroundColor: "#fff",
  },
});
