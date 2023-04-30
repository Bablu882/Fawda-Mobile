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
import { selectToken } from "../slices/authSlice";
import moment from "moment";
import Toast from "react-native-root-toast";

import { Picker } from "@react-native-picker/picker";
import FontAwesome from "react-native-vector-icons/FontAwesome";

function MachineWork2({ navigation, route }) {
  const dispatch = useDispatch();
  const ReviewInput = useRef(null);
  const token = useSelector(selectToken);
  const { data, payment_status, amount, item, useramount } = route.params ?? {};
  console.log("fjkfkfkff", amount, item, useramount);
  const [selectedButtonIndex, setSelectedButtonIndex] = useState(-1);
  const [ratings, setRating] = useState(0);
  const [comments, setComment] = useState("");
  const [response, setResponse] = useState(null);
  const [complete, setCompleted] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [numbers, setNumber] = useState(0);

  const number = [1, 2, 3, 4];



  const handleReviewbutton = ()  => {
    ReviewInput.current.focus()
  }
  const RatingApi = () => {
    let params = {
      job_id: JSON.stringify(item?.job_id),
      job_number: item?.job_number,
      rating: ratings,
      comment: comments,
    };

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
          
        } else {
          console.log("error message");
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

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

  const Ongoing = () => {
    setIsLoading(true);
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
        setIsLoading(false);
        setResponse(data["booking-status"]);
        console.log("jdjjdd", data);
      })
      .catch((error) => {
        setIsLoading(false);
        console.log("error", error);
      });
  };
  const bookingcompleted = () => {
    setIsLoading(true);
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
        setIsLoading(false);
        setCompleted(data["booking-status"]);
        setResponse(data["booking-status"]);

        console.log("jdjjdd", data);
      })
      .catch((error) => {
        setIsLoading(false);
        console.log("error", error);
      });
  };

  const cancel = async () => {
    let params = {
      job_id: JSON.stringify(item?.job_id),
      job_number: item?.job_number,
      // booking_id: item?.booking_id,
      status: "Cancelled-After-Payment",
    };
    try {
      const response = await service.post("/api/cancel/", params, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(token?.access, "token");
      const data = response?.data;
      navigation.navigate("HomeStack", { screen: "HomePage" });
      // setStatus(data.status);
      Toast.show("Job रद्द कर दी गई है", Toast.LONG);
      console.log("fjfjf", data);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ padding: 20, marginTop: 25 }}>
        {/* <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrowleft" size={25} />
        </TouchableOpacity> */}
      </View>

      <ScrollView horizontal={false} showsVerticalScrollIndicator={false}>
        <View style={{ alignItems: "center", flex: 1, marginHorizontal: 10 }}>
          <Text
            style={{ textAlign: "center", fontSize: 30, fontWeight: "600", fontFamily:'Devanagari-bold', }}
          >
            {item.job_type === "machine_malik"
              ? " मशीन का काम "
              : "मशीन का काम "}
          </Text>
          <View
            style={[
              styles.inputView,
              styles.flex,
              styles.justifyContentBetween,
              {
                height: 45,
              },
            ]}
          >
            <Text style={[styles.TextInput]}>{item?.machine}</Text>
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
            style={[
              styles.flex,
              styles.justifyContentBetween,
              { width: "100%" },
            ]}
          >
            <View
              style={[
                styles.TaxView,
                styles.flex,
                styles.justifyContentBetween,
                { alignItems: "center" },
              ]}
            >
              <Text style={[styles.label, { marginLeft: 10 }]}>
                भूमि क्षेत्र
              </Text>
              <TextInput
                style={styles.TextInput}
                placeholderTextColor="#848484"
                editable={false}
                placeholder=""
              />
              <Text
                style={{
                  paddingRight: 10,
                  color: "#0099FF",
                }}
              >
                {item?.land_area}
                {item?.land_type == "Bigha" ? "बीघा" : "किल्ला"}
              </Text>
            </View>

            <View
              style={[
                styles.TaxView,
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
                style={{ marginTop: 13, color: "#0099FF", paddingRight: 10 }}
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
              editable={false}
              placeholder="काम की स्थिति"
              placeholderTextColor={"#000"}
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
                  }}
                >
                  {item.status === "Booked"
                    ? "बुक"
                    : item.status === "Accepted"
                    ? "बुक"
                    : item.status === "Ongoing"
                    ? "जारी है"
                    : ""}

                  {console.log("")}
                </Text>
              )}
            </View>
          </View>

          {complete === "Completed" ? (
            ""
          ) : (
            <>
              <View style={[styles.inputView, { position: "relative" }]}>
              <Text
                  style={styles.sahayakDetails}
                >
                  मशीन मालिक
                </Text>
                <Text style={styles.TextInput}>{item?.machine_malik_name}</Text>
                {/* {!!errors.name && <Text style={styles.error}>{errors.name}</Text>} */}
              </View>

              <View style={[styles.inputView, { position: "relative" }]}>
                <Text
                  style={styles.sahayakDetails}
                >
                  गाँव
                </Text>
                <Text style={styles.TextInput}>
                  {item?.machine_malik_village}
                </Text>
                {/* {!!errors.name && <Text style={styles.error}>{errors.name}</Text>} */}
              </View>

              <View style={[styles.inputView, { position: "relative" }]}>
              <Text
                  style={styles.sahayakDetails}
                >
                  मोबाइल नंबर
                </Text>
                <Text style={styles.TextInput}>
                  {item?.machine_malik_mobile_no}
                </Text>
                {/* {!!errors.name && <Text style={styles.error}>{errors.name}</Text>} */}
              </View>
            </>
          )}

          {complete === "Completed" && (
            <View
              style={{
                width: "100%",
                flexDirection: "column",
                // justifyContent: "center",
                alignItems: "center",
                marginTop: 20,
              }}
            >
              <View style={{ marginBottom: 10 }}>
                <Text style={{ textAlign: "center", fontFamily:'Devanagari-bold', }}>रेटिंग दें </Text>
                <View style={{ display: "flex", flexDirection: "row" }}>
                  {[...Array(5).keys()].map(renderButton)}
                </View>
              </View>
              <Text style={{ fontFamily:'Devanagari-bold',}}>कोई सुझाव</Text>
              <View style={{ width: "100%" }}>
                <TouchableOpacity onPress={handleReviewbutton}
                 style={{  height: 100,
                    borderWidth: 1,
                    borderRadius: 10,
                    width: "100%",
                    marginTop: 20,
                    borderColor: "#0099FF",}}>

              
                <TextInput
                ref={ReviewInput}
                  onChangeText={setComment}
                  value={comments}
                
                />
                  </TouchableOpacity>
              </View>
            </View>
          )}

          {complete !== "Completed" && (
            <TouchableOpacity
              style={styles.BhuktanBtn}
              onPress={
                response === "Ongoing" || item?.status === "Ongoing"
                  ? bookingcompleted
                  : response === "Completed"
                  ? () => RatingApi()
                  : () => Ongoing()
              }
              disabled={isLoading}
            >
              <Text style={[styles.loginText, { color: "#fff", fontFamily:'Devanagari-bold', }]}>
                {complete && complete["booking-status"] === "Ongoing"
                  ? "रेटिंग दें जारी है"
                  : complete && complete["booking-status"] === "Completed"
                  ? "रेटिंग दें"
                  : response === "Ongoing" || item?.status === "Ongoing"
                  ? "काम पूरा हुआ"
                  : "काम शुरू करें"}
              </Text>
            </TouchableOpacity>
          )}

          {complete === "Completed" && (
            <TouchableOpacity
              style={styles.BhuktanBtn}
              onPress={() => RatingApi()}
            >
              <Text style={[styles.loginText, { color: "#fff" }]}>समाप्त</Text>
            </TouchableOpacity>
          )}

          {item?.status != "Completed" &&
            response != "Ongoing" &&
            response !== "Completed" && (
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
                  <Text style={{ textAlign: "center", color: "#fff", fontFamily:'Devanagari-bold', }}>
                    रद्द करें
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          {/* {item?.status === "Booked" ||
            (response != "Ongoing" && response !== "Completed" && (
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
                    रद्द करें
                  </Text>
                </TouchableOpacity>
              </View>
            ))} */}
          {/* {item?.status === "Booked" && (
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
                  रद्द करें
                </Text>
              </TouchableOpacity>
            </View>
          )} */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
export default MachineWork2;

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
sahayakDetails:{
  position: "absolute",
  top: -10,
  left: 30,
  width: "25%",
  textAlign: "center",
  backgroundColor: "#fff",
  fontFamily:'Devanagari-bold',
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

  BhuktanBtn: {
    width: "100%",
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

    width: "100%",
    height: 48,
    marginTop: 15,
    borderWidth: 1,
  },

  TextInput: {
    padding: 10,
    fontFamily:'Devanagari-bold',

    // fontFamily: "Poppin-Light",
  },
  TaxView: {
    borderColor: "#0070C0",
    borderRadius: 7,
    // borderBottomRightRadius: 7,
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
});
