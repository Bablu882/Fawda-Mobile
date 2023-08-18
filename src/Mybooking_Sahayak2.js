import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Image,
  ScrollView,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import service from "../service";
import { selectToken, selectUserType } from "../slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { Picker } from "@react-native-picker/picker";
import Toast from "react-native-simple-toast";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import * as Linking from "expo-linking";

export default function Mybooking_Sahayak2({ navigation, route }) {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const ReviewInput = useRef(null);
  const usertype = useSelector(selectUserType);
  const [numbers, setNumber] = useState(0);
  const [selectedButtonIndex, setSelectedButtonIndex] = useState(-1);
  const {
    data,
    payment_status,
    amount,
    item,
    useramount,
    male_count,
    female_count,
  } = route.params ?? {};
  console.log("+++++pluss++++", item, male_count, female_count);
  const [colors, setColors] = useState(Array(10).fill("white"));
  const [ratings, setRating] = useState(0);
  const [comments, setComment] = useState("");
  const [response, setResponse] = useState("");
  const [complete, setCompleted] = useState(null);
  const [bookingss, setBookings] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [countMale, setCountMale] = useState(0);
  const [countFemale, setCountFemale] = useState(0);
  const [jobCurentStatus, setJobCurrentStatus] = useState("");

  console.log("Count", countFemale, "  ", countMale);

  const [thekeperKams, setThekeperKams] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handlebutton = () => {
    ReviewInput.current.focus();
  };

  const handleCallPress = async (phone) => {
    const url = `tel:${phone}`;
    await Linking.canOpenURL(url)
      ?.then(async (supported) => {
        if (!supported) {
          console.log("Phone number is not available");
        } else {
          await Linking.openURL(url);
          // return Linking.openURL(url);
        }
      })
      .catch((err) => console.error("An error occurred", err));
  };

  const checkSahayakCount = async () => {
    let params = {
      sahayak_job_id: JSON.stringify(item.job_id),
      sahayak_job_number: item?.job_number,
    };

    try {
      const response = await service.post(`api/refresh-my-booking/`, params, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response?.data;
      if (response?.data?.sahayk_booking_details?.bookings.length > 0) {
        const maleCount = data?.sahayk_booking_details?.count_male;
        const femaleCount = data?.sahayk_booking_details?.count_female;

        if (femaleCount !== countFemale || maleCount !== countMale) {
          navigation.replace("HomeStack", { screen: "BottomTab" });
          Toast.show(
            "भुगतान के बाद सहायक द्वारा यह बुकिंग रद्द कर दी गई है।कृपया बुकिंग पुनः लोड करें!",
            Toast.LONG
          );
        } else {
          Ongoing();
        }
      } else {
        navigation.replace("HomeStack", { screen: "BottomTab" });
        Toast.show(
          "भुगतान के बाद सहायक द्वारा यह बुकिंग रद्द कर दी गई है।कृपया बुकिंग पुनः लोड करें!",
          Toast.LONG
        );
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const RatingApi = () => {
    console.log("getting hit");
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
          // navigation.replace("Thankyou");
          console.log("fjfjf", data);
        } else {
          console.log("error message");
          console.log("message", data?.message);
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
  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedBooking(null); // Reset selectedBooking when the modal is closed
  };

  const handleStatus = () => {
    setJobCurrentStatus("Completed");
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

  const totalCount = item.count_female + item.count_male;

  console.log(totalCount, "count check");

  // phone number dropdown
  const number = [1, 2, 3, 4];
  // end

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
        setResponse(data["booking-status"]);
        console.log("jdjjdd", data);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  const bookingcompleted = () => {
    RatingApi();
    let params = {
      job_id: JSON.stringify(item?.job_id),
      job_number: item?.job_number,
    };
    console.log(params, "params");

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
        if (data["booking-status"] === "Completed") {
          navigation.replace("Thankyou");
        }
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
      console.log(token?.access, "token");
      const data = response?.data;
      navigation.replace("HomeStack", { screen: "BottomTab" });
      console.log("fjfjf", data);
      // setStatus(data.status);
      Toast.show("काम रद्द किया गया है !", Toast.LONG);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const mybookingdetail = async () => {
    let params = {
      sahayak_job_id: JSON.stringify(item.job_id),
      sahayak_job_number: item?.job_number,
    };
    console.log("jfjgjg", params);

    try {
      const response = await service.post(`api/refresh-my-booking/`, params, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response?.data;
      console.log("datadata", data);
      if (response?.data?.sahayk_booking_details?.bookings.length > 0) {
        setBookings(data?.sahayk_booking_details?.bookings);
        setCountMale(data?.sahayk_booking_details?.count_male);
        setCountFemale(data?.sahayk_booking_details?.count_female);
      }
      console.log(
        "data?.sahayk_booking_details?.bookings",
        response?.data?.sahayk_booking_details?.bookings.length
      );
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    mybookingdetail();
  }, []);
  const handleBookingSelect = (booking) => {
    setSelectedBooking(booking);
    setModalVisible(true);
  };
  return (
    <SafeAreaView style={{ backgroundColor: "#fff", flex: 1 }}>
      <View style={{ padding: 20, marginTop: 25 }}></View>
      <View style={{ justifyContent: "center" }}>
        <Text
          style={{
            textAlign: "center",
            fontSize: 30,
            fontWeight: "600",
            fontFamily: "Devanagari-bold",
          }}
        >
          {item?.job_type === "individuals_sahayak" && "सहायक"}
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
            <Text style={styles.label}>काम का विवरण</Text>
            <Text style={[styles.TextInput]}>{item?.description}</Text>
            {/* <Image
              source={require("../assets/image/edit.png")}
              style={{ width: 20, height: 20, marginTop: 10, right: 10 }}
            /> */}
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
                editable={false}
                placeholderTextColor={"#000"}
              />
              <Text
                style={{
                  marginRight: 8,
                  color: "#0099FF",
                  fontFamily: "Devanagari-regular",
                }}
              >
                {item?.land_area}
                {item?.land_type == "Bigha"
                  ? " बीघा"
                  : item?.land_type == "Killa"
                  ? " किल्ला"
                  : " "}
              </Text>
            </View>
            <View
              style={[
                styles.TaxView,
                styles.flex,
                styles.justifyContentBetween,
                { alignItems: "center" },
              ]}
            >
              <TextInput
                style={styles.TextInput}
                placeholder="वेतन"
                editable={false}
                placeholderTextColor={"#000"}
              />
              <Text style={{ color: "#0099FF", paddingRight: 10 }}>
                ₹ {useramount}
              </Text>
            </View>
          </View>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginTop: 15,
              width: "100%",
              flexWrap: "wrap",
            }}
          >
            {[...Array(countMale).keys()].map((index) => (
              <View
                style={{
                  paddingHorizontal: 5,
                  borderColor: "#0070C0",
                  // borderRadius: 7,
                  borderWidth: 0.4,
                  paddingVertical: 10,
                  maxWidth: "33.33%",
                  width: "100%",
                  marginBottom: 5,
                }}
                key={index}
              >
                <TextInput
                  style={styles.CheckTextInput}
                  placeholder="पुरषो"
                  editable={false}
                  placeholderTextColor={"#000"}
                  name={`Male${index}`}
                />
              </View>
            ))}
            {[...Array(countFemale).keys()].map((index) => (
              <View
                style={{
                  paddingHorizontal: 5,
                  borderColor: "#0070C0",
                  // borderRadius: 7,
                  borderWidth: 0.4,
                  paddingVertical: 10,
                  maxWidth: "33.33%",
                  width: "100%",
                  marginBottom: 5,
                }}
                key={index}
              >
                <TextInput
                  style={styles.CheckTextInput}
                  editable={false}
                  placeholder="महिला"
                  placeholderTextColor={"#101010"}
                  name={`Female${index}`}
                />
              </View>
            ))}
            {/* <Text style={{ textAlign: "center" }}>पुरुष</Text> */}
          </View>

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
              editable={false}
              placeholderTextColor={"#000"}
            />
            <View
              style={{
                height: 30,
                backgroundColor: "#0099FF",
                marginRight: 10,
                marginTop: 8,
                width: "30%",
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
                    : jobCurentStatus === "Completed"
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
                  {item?.status === "Booked"
                    ? "बुक"
                    : item?.status === "Accepted"
                    ? "बुक"
                    : item?.status === "Ongoing"
                    ? "जारी है"
                    : ""}

                  {console.log("")}
                </Text>
              )}
            </View>
          </View>
          {jobCurentStatus !== "Completed" && (
            <>
              <View
                style={[
                  styles.inputView,
                  { flex: 1, width: "100%", justifyContent: "center" },
                ]}
              >
                <View style={{}}>
                  <Picker
                    selectedValue={selectedBooking}
                    style={{ width: "100%" }}
                    onValueChange={(itemValue) =>
                      handleBookingSelect(itemValue)
                    }
                  >
                    <Picker.Item label="सहायकों के मोबाइल नंबर " value="" />
                    {bookingss?.map((booking, index) => (
                      <Picker.Item
                        key={booking.booking_id}
                        label={`${index + 1}`}
                        value={booking}
                      />
                    ))}
                  </Picker>
                </View>

                <Modal
                  visible={modalVisible}
                  animationType="slide"
                  onRequestClose={handleModalClose}
                  transparent={true}
                >
                  <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={handleModalClose}
                  >
                    <View style={[styles.modalContainer, styles.modalRight]}>
                      <TouchableOpacity onPress={handleModalClose}>
                        <Text style={{ textAlign: "right", marginBottom: 10 }}>
                          <Icon name="close" size={20} color="#000" />
                        </Text>
                      </TouchableOpacity>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          flex: 1,
                        }}
                      >
                        {selectedBooking && (
                          <View style={{ width: "100%" }}>
                            <View style={{ width: "100%" }}>
                              <View
                                style={[
                                  styles.inputView,
                                  { position: "relative" },
                                ]}
                              >
                                <Text style={styles.sahaykdetails}>सहायक</Text>
                                <Text style={styles.TextInput} editable={false}>
                                  {selectedBooking?.sahayak_name}
                                </Text>
                              </View>

                              <View
                                style={[
                                  styles.inputView,
                                  { position: "relative" },
                                ]}
                              >
                                <Text style={styles.sahaykdetails}>गाँव</Text>
                                <Text style={styles.TextInput} editable={false}>
                                  {selectedBooking?.sahayak_village}
                                </Text>
                              </View>

                              <View
                                style={[
                                  styles.inputView,
                                  { position: "relative" },
                                ]}
                              >
                                <Text style={styles.sahaykdetails}>
                                  मोबाइल नंबर
                                </Text>
                                <Text style={styles.TextInput} editable={false}>
                                  {selectedBooking?.sahayak_mobile_no}
                                </Text>
                              </View>
                              <View style={[styles.CallBtn]}>
                                <TouchableOpacity
                                  onPress={() =>
                                    handleCallPress(
                                      selectedBooking?.sahayak_mobile_no
                                    )
                                  }
                                >
                                  <Text
                                    style={[
                                      styles.loginText,
                                      {
                                        color: "#fff",
                                        fontFamily: "Devanagari-bold",
                                      },
                                    ]}
                                  >
                                    कॉल करें
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          </View>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                </Modal>
              </View>
            </>
          )}

          {jobCurentStatus === "Completed" && (
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
              <TouchableOpacity
                onPress={handlebutton}
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
          )}
          {jobCurentStatus !== "Completed" && (
            <TouchableOpacity
              style={styles.BhuktanBtn}
              onPress={
                response === "Ongoing" || item?.status === "Ongoing"
                  ? () => handleStatus()
                  : jobCurentStatus === "Completed"
                  ? () => RatingApi()
                  : () => checkSahayakCount()
              }
            >
              <Text style={[styles.loginText, { color: "#fff" }]}>
                {complete && complete["booking-status"] === "Ongoing"
                  ? "रेटिंग दें जारी है"
                  : jobCurentStatus === "Completed" //complete && complete["booking-status"] === "Completed"
                  ? "रेटिंग दें"
                  : response === "Ongoing" || item?.status === "Ongoing"
                  ? "काम पूरा हुआ"
                  : "काम शुरू करें"}
              </Text>
            </TouchableOpacity>
          )}

          {jobCurentStatus === "Completed" && (
            <TouchableOpacity
              style={styles.BhuktanBtn}
              onPress={() => {
                // RatingApi();
                bookingcompleted();
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
              item.status !== "Completed" && (
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
                    {response === "" && item.status === "Booked" && (
                      <Text style={[styles.TextInput, { maxWidth: "98%" }]}>
                        ऊपर दिए गए नंबर पर संपर्क करें।{"\n"} जब काम शुरू करना
                        हो, तभी "काम शुरू करें" दबायें
                      </Text>
                    )}
                    {(response === "Ongoing" || item.status === "Ongoing") &&
                      jobCurentStatus !== "Completed" && (
                        <Text style={[styles.TextInput, { maxWidth: "98%" }]}>
                          कार्य पूरा होने के बाद "काम पूरा हुआ" दबाएँ !
                        </Text>
                      )}
                    {jobCurentStatus === "Completed" && (
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
            jobCurentStatus !== "Completed" && (
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
  sahaykdetails: {
    position: "absolute",
    top: -10,
    left: 30,
    width: "auto",
    textAlign: "center",
    backgroundColor: "#fff",
    fontFamily: "Devanagari-bold",
    paddingHorizontal: 10,
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
  modalRight: {
    position: "absolute",
    bottom: "10%",
    left: 0,
    width: "100%",
    height: "auto",
    backgroundColor: "#fff",
    padding: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    // alignItems: "center",
  },
  modalText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: "#ff6666",
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    fontSize: 18,
    color: "#fff",
  },
  button: {
    width: 30,
    height: 50,
    margin: 2,
    justifyContent: "center",
    alignItems: "center",
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
    fontFamily: "Devanagari-bold",
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
    width: "100%",
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
    fontFamily: "Devanagari-regular",
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
    marginTop: -10,
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
