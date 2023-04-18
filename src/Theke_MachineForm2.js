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
  console.log("fjkfkfkff", item);
  // const bookingid = route?.params?.item;
  // console.log("bookingid", bookingid);
  const [selectedButtonIndex, setSelectedButtonIndex] = useState(-1);
  const [colors, setColors] = useState(Array(10).fill("white"));
  const [bookingjob, setBookingJob] = useState("");
  const [ratings, setRating] = useState(0);
  const [comments, setComment] = useState("");
  const [response, setResponse] = useState(null);
  const [complete, setCompleted] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [status, setStatus] = useState("");

  //  const [colors, setColors] = useState(Array(10).fill("white"));
  const [numbers, setNumber] = useState(0);

  const number = [1, 2, 3, 4];

  //   const RatingApi = async () => {
  //     let params = {
  //       booking_job: JSON.stringify(item?.booking_id),
  //       rating: ratings,
  //       comment: comments,
  //     };
  // console.log('ndndjd', params)
  //     try {
  //       const response = await service.post("/api/rating/create/", params, {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //       const data = response?.data;
  //       // setThekeperKam(data.data);
  // if(data?.status === 200){
  //   navigation.replace("MyBooking");
  //       console.log("fjfjf", data);
  // }
  //    else{
  //     console.log('fjfjf')
  //    }
  //     } catch (error) {
  //       console.log("Error:", error);
  //     }
  //   };
  const RatingApi = () => {
    let params = {
      booking_id: JSON.stringify(item.booking_id),
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
          navigation.replace("MyBooking");
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

 
  const Ongoing = () => {
    setIsLoading(true);
    let params = {
      job_id: JSON.stringify(item?.job_id),
      job_number: item?.job_number
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
      job_number: item?.job_number
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
    let params = {};
    if (payment_status === "success") {
      params = {
        job_id: item?.id,
        job_number: item?.job_number,
        booking_id: item?.booking_id,
        status: "Cancelled-After-Payment",
      };
    }
    try {
      const response = await service.post("/api/cancel/", params, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(token?.access, "token");
      const data = response?.data;
      // setStatus(data.status);
      navigation.replace("HomePage");
      Toast.show("Cancelled-After-Payment", Toast.LONG);
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
        <View style={{ alignItems: "center", flex: 1 }}>
          <Text
            style={{ textAlign: "center", fontSize: 30, fontWeight: "600" }}
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
                placeholder="भूमि क्षेत्र "
                placeholderTextColor={"#000"}
              />
              <Text style={{ marginTop: 13, marginRight: 8, color: "#0099FF" }}>
                {item?.land_area}{" "}
                {item?.land_type == "Bigha" ? "बीघा" : "किल्ला"}
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
                backgroundColor: "#0099FF",
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
              {/* {response  === "Ongoing" ? (
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
                </Text>
              ): complete === "Completed" ? (
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
              ):(
                <Text
                  style={{
                    textAlign: "center",
                    marginTop: 5,
                    color: "#fff",
                    fontSize: 15,
                    fontWeight: "600",
                  }}
                >
                  {item.booking_status === "Booked"
                    ? "बुक"
                    : item.booking_status === "Accepted"
                    ? "स्वीकार"
                    : item.booking_status === "Ongoing"
                    ? "जारी है"
                    
                    : ""}

                  {console.log("")}
                </Text>
              )} */}
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
                  {item.booking_status === "Booked"
                    ? "बुक"
                    : item.booking_status === "Accepted"
                    ? "बुक"
                    : item.booking_status === "Ongoing"
                    ? "जारी है"
                    : ""}

                  {console.log("")}
                </Text>
              )}
              {/* {status === "Ongoing" ? (
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
                </Text>
              ) : status === "Completed" ? (
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
                  {item.booking_status === "Booked"
                    ? "बुक"
                    : item.booking_status === "Accepted"
                    ? "स्वीकार"
                    : item.booking_status === "Ongoing"
                    ? "जारी है"
                    : item.booking_status === "Completed"
                    ? "समाप्त"
                    : ""}

                  {console.log("")}
                </Text>
              )} */}
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
                <Text style={{ textAlign: "center" }}>रेटिंग दें </Text>
                <View style={{ display: "flex", flexDirection: "row" }}>
                  {[...Array(5).keys()].map(renderButton)}
                </View>
              </View>
              <Text>कोई सुझाव</Text>
              <View
                style={{
                  height: 100,
                  borderWidth: 1,
                  borderRadius: 10,
                  width: "90%",
                  marginTop: 20,
                  borderColor: "#0099FF",
                }}
              >
                <TextInput
                  onChangeText={setComment}
                  value={comments}
                  style={{ width: "100%" }}
                />
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
                  {item?.thekedar_mobile_no}
                </Text>
                {/* {!!errors.name && <Text style={styles.error}>{errors.name}</Text>} */}
              </View>
            </>
          )}
          {/* {status.status === "Completed" ? (
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
          )} */}

          {/* {response === "Ongoing" || item?.booking_status === "Ongoing" ? (
            <TouchableOpacity
              style={styles.BhuktanBtn}
              onPress={bookingcompleted}
              disabled={isLoading}
            >
              <Text>
                {complete ? complete["booking-status"] : "Book Nowhdhh"}
              </Text>
            </TouchableOpacity>
          ) : 
          response === "Booked"|| response === "Accepted"  || response === "Ongoing" ? (
            <TouchableOpacity
              style={styles.BhuktanBtn}
              onPress={() => Ongoing()}
              disabled={isLoading}
            >
              <Text>
                {response && response["booking-status"]
                  ? response["booking-status"]
                  : "Book Now"}
              </Text>
            </TouchableOpacity>
          ) : response === "Completed" ? (
          <TouchableOpacity
          style={styles.BhuktanBtn}
          onPress={() => RatingApi()}
        >
          <Text style={[styles.loginText, { color: "#fff" }]}>समाप्त</Text>
        </TouchableOpacity>) : null} */}

          {/* {response === "Ongoing" || item?.booking_status === "Ongoing" ? (
            <TouchableOpacity
              style={styles.BhuktanBtn}
              onPress={bookingcompleted}
              disabled={isLoading}
            >
              <Text style={[styles.loginText, { color: "#fff" }]}>
                {complete ? complete["booking-status"] : "काम पूरा हुआ "}
              </Text>
            </TouchableOpacity>
          ) : response === "Completed" ? (
            <TouchableOpacity
              style={styles.BhuktanBtn}
              onPress={() => RatingApi()}
            >
              <Text style={[styles.loginText, { color: "#fff" }]}>समाप्त</Text>
            </TouchableOpacity>
          ) : response !== "Completed" ? (
            <TouchableOpacity
              style={styles.BhuktanBtn}
              onPress={() => Ongoing()}
              disabled={isLoading}
            >
              <Text style={[styles.loginText, { color: "#fff" }]}>
                {response && response["booking-status"]
                  ? response["booking-status"]
                  : "काम शुरू करें "}
              </Text>
            </TouchableOpacity>
          ) : (
            ""
          )} */}

{complete !== "Completed" && (
            <TouchableOpacity
              style={styles.BhuktanBtn}
              onPress={
                response === "Ongoing" || item?.booking_status === "Ongoing"
                  ? bookingcompleted
                  : response === "Completed"
                  ? () => RatingApi()
                  : () => Ongoing()
              }
              disabled={isLoading}
            >
              <Text style={[styles.loginText, { color: "#fff" }]}>
                {complete && complete["booking-status"] === "Ongoing"
                  ? "रेटिंग दें जारी है"
                  : complete && complete["booking-status"] === "Completed"
                  ? "रेटिंग दें"
                  : response === "Ongoing" || item?.booking_status === "Ongoing"
                  ? "काम पूरा हुआ"
                  : "काम शुरू करें "}
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

      {item?.booking_status === "Accepted" && response != "Ongoing"   && response !== "Completed" &&    (
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
      )}
    {item?.booking_status === "Booked" &&   (
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
    color: "#fff",
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
