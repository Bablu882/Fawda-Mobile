import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Image,
  KeyboardAvoidingView,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import Toast from "react-native-simple-toast";

import { useDispatch, useSelector } from "react-redux";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import service from "../service";
import { selectToken, selectUserType } from "../slices/authSlice";
import moment from "moment";
import CustomComponent from "../Component/CustomComponent";
import * as Linking from "expo-linking";

function Theke_MachineForm({ navigation, route }) {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const { id, item, totalamount, fawdafee, useramount, jobtype } =
    route?.params ?? {};
  const itemStatus = item?.status;
  // console.log("JobData", item);
  const [ratingList, setRatingList] = useState([]);
  const [bookingstate, setBookingState] = useState();

  const usertype = useSelector(selectUserType);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [colors, setColors] = useState(Array(10).fill("white"));
  const [checked, setChecked] = React.useState("first");
  const [thekeperKam, setThekeperKam] = useState([]);
  const [thekeperKams, setThekeperKams] = useState([]);
  const [thekeparpending, setThekeperKamPending] = useState([]);
  const [amount, setAmount] = useState(0 || item?.total_amount_theka);
  const [edit, setEdit] = useState(false);
  const [editable, setEditable] = useState(false);
  const [status, setStatus] = useState("");
  const [statusAccept, setStatusAccept] = useState("");
  const [statusPending, setStatusPending] = useState("");
  const [jobsData, setJobsData] = useState([]);
  const [thekeParAmount, setThekeParAmount] = useState(
    0 || item?.total_amount_theka
  );
  const [fawdaFees, setFawdafees] = useState(0 || item?.fawda_fee);
  const [paymentYour, setPaymentYour] = useState(0 || item?.payment_your);

  const textInputRef = useRef(null);
  const handleClick = () => {
    textInputRef.current.focus();
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

  const accptThekha = async () => {
    setIsLoading(true);
    let params = {
      job_id: item?.id,
    };

    try {
      const response = await service.post("/api/accept_theka/", params, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response?.data;
      if (data?.status === 200) {
        console.log("aaaa", data);
        setThekeperKam(data?.data);
        // Toast.show("काम स्वीकार किया गया है!", Toast.LONG);
        navigation.navigate("MyBookingStack", { screen: "MyBooking" });
      } else {
        Toast.show("जॉब स्वीकार नहीं हो पा रही है!", Toast.LONG);
      }
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  function getStatusButton(status, label) {
    return (
      <TouchableOpacity
        style={{
          backgroundColor: status === "Pending" ? "#44A347" : "#0099FF",
          height: 30,
        }}
      >
        <Text
          style={{
            textAlign: "center",
            lineHeight: 30,
            color: "#fff",
            fontSize: 15,
            fontFamily: "Devanagari-bold",
            fontWeight: "600",
          }}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  }

  const Edit = async () => {
    // setIsLoading(true);
    let params = {
      job_id: JSON.stringify(item?.id),
      amount: amount,
    };
    console.log(params, "params");

    try {
      const response = await service.post("/api/edit_thekepekam/", params, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response?.data;
      if (data?.status === 200) {
        navigation.navigate("MyBookingStack", { screen: "MyBooking" });
        Toast.show("वेतन सफलतापूर्वक अपडेट किया गया है!", Toast.LONG);
      } else {
        Toast.show("राशि अपडेट नहीं की गई है।", Toast.LONG);
      }
    } catch (error) {
      console.log("Error:", error);
    }
    //  finally {
    //   setIsLoading(false);
    // }
  };

  //   };
  const RatingApi = async () => {
    setIsLoading(true);
    let params = {
      booking_job: item?.booking_id,
    };

    try {
      const response = await service.post("/api/get-rating/", params, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response?.data;
      console.log("data", response?.data.status);

      const ratings = data?.data?.rating;
      const ratingColor = "#e6b400";

      const ratingList = Array(5)
        .fill(0)
        .map((_, num) => {
          let color = num < ratings ? ratingColor : "white";
          return (
            <View
              key={num}
              style={{
                // borderColor: color,
                // borderWidth: 1,
                width: 30,
                height: 30,
                // borderRightWidth: 0.1,
                // borderEndWidth: 0.4,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {num + 1 <= ratings && (
                <FontAwesome name="star" size={24} color="#e6b400" />
              )}
              {num + 1 > ratings && (
                <FontAwesome name="star-o" size={24} color={ratingColor} />
              )}
            </View>
          );
        });

      setRatingList(ratingList);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  // useEffect(() => {

  // }, []);

  useEffect(() => {
    mybookingdetail();
    myjobs();
    RatingApi();
  }, []);

  const cancel = async () => {
    setIsLoading(true);
    let params = {
      job_id: JSON.stringify(id),
      job_number: item?.job_number,
      // booking_id: item?.booking_id,
      status: "Cancelled",
    };
    console.log("cancelled data", params);

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

      console.log("cancel api data ", data);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchJobData = async () => {
    setIsLoading(true);
    try {
      const response = await service.get(`/api/nearjob/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response?.data?.results;
      // console.log("dayaaaaaa", data);
      setJobsData(data);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };
  useEffect(() => {
    if (usertype && usertype !== "Grahak") {
      jobsData.forEach((jobData, index) => {
        if (id === jobData.id) {
          // setAmountMale(jobData.pay_amount_male);
          // setAmountFemale(jobData.pay_amount_female);
          setThekeParAmount(jobData.total_amount_theka);
          setFawdafees(jobData.fawda_fee);
          setPaymentYour(jobData.payment_your);
        }
      });
    }
  }, [jobsData]);

  const checkPayment = async () => {
    setIsLoading(true);
    try {
      const response = await service.get(`/api/nearjob/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response?.data?.results;
      console.log("dayaaaaaa", data);

      if (usertype && usertype !== "Grahak") {
        const matchingJobData = data.find((jobData) => jobData.id === item?.id);
        console.log("matchingJobData:", matchingJobData);

        if (matchingJobData) {
          const totalAmount = matchingJobData.total_amount_theka;
          if (thekeParAmount !== totalAmount) {
            Toast.show(
              "इस कार्य के लिए भुगतान बदल दिया गया है! कृपया स्क्रीन को रिफ़्रेश करें!",
              Toast.LONG
            );
          } else {
            console.log("Payment OK");
            accptThekha();
          }
        } else {
          navigation.replace("HomeStack", { screen: "BottomTab" });
          Toast.show("यह नौकरी ग्राहक द्वारा रद्द कर दी गई है", Toast.LONG);
        }
      }
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const myStatusBooked = async () => {
    setIsLoading(true);
    let params = {
      booking_id: JSON.stringify(item.booking_id),
    };
    try {
      const cacheBuster = new Date().getTime();
      const response = await service.post(
        `api/refresh-myjobs/?cacheBuster=${cacheBuster}`,
        params,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response?.data;
      if (data[0]?.status === "Booked") {
        Toast.show(
          "यह बुकिंग ग्राहक द्वारा बुक की गई है। कृपया रिफ़्रेश करें!",
          Toast.LONG
        );
      } else {
        Rejected();
      }
      console.log("status", status);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkStatus = async () => {
    setIsLoading(true);
    let params = {
      sahayak_job_id: JSON.stringify(id),
      sahayak_job_number: item?.job_number,
    };

    try {
      const cacheBuster = new Date().getTime();
      const response = await service.post(
        `api/refresh-my-booking/?cacheBuster=${cacheBuster}`,
        params,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response?.data;
      if (usertype && usertype === "Grahak") {
        console.log("datatesting", data?.sahayak_pending_booking_details[0]);
        const statusCheck =
          data?.sahayak_pending_booking_details[0]?.status || "";
        const accept_data = data?.booking_theke_pe_kam[0] || {};
        if (statusCheck === "Pending") {
          navigation.replace("HomeStack", { screen: "BottomTab" });
          Toast.show("यह बुकिंग सहायक द्वारा रद्द कर दी गई है।", Toast.LONG);
        } else {
          navigation.replace("Payment", {
            item: accept_data,
            fawdafee: accept_data?.fawda_fee,
            totalamount: accept_data?.total_amount,
            useramount: accept_data?.total_amount_theka,
            id: accept_data?.job_id,
          });
        }
      }
      setIsLoading(false);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const checkSahayakStatus = async () => {
    setIsLoading(true);
    let params = {
      sahayak_job_id: JSON.stringify(id),
      sahayak_job_number: item?.job_number,
    };

    try {
      const cacheBuster = new Date().getTime();
      const response = await service.post(
        `api/refresh-my-booking/?cacheBuster=${cacheBuster}`,
        params,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response?.data;

      if (usertype && usertype === "Grahak") {
        const statusCheck = data?.booking_theke_pe_kam[0]?.status || "";
        if (statusCheck === "Accepted") {
          Toast.show(
            "यह बुकिंग सहायक द्वारा स्वीकार कर ली गई है। कृपया स्क्रीन को रिफ्रेश करें।",
            Toast.LONG
          );
        } else {
          Edit();
        }
      }
      setIsLoading(false);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const mybookingdetail = async () => {
    setIsLoading(true); // set isLoading to true when the function starts
    setRefreshing(true);
    let params = {
      sahayak_job_id: JSON.stringify(id),
      sahayak_job_number: item?.job_number,
    };
    console.log("jfjgjg", params);

    try {
      const cacheBuster = new Date().getTime();
      const response = await service.post(
        `api/refresh-my-booking/?cacheBuster=${cacheBuster}`,
        params,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response?.data;
      setThekeperKams(data?.booking_theke_pe_kam);
      setThekeperKamPending(data?.sahayak_pending_booking_details);
      if (usertype && usertype === "Grahak") {
        setStatusAccept(data?.booking_theke_pe_kam[0]?.status || "");
        setStatusPending(
          data?.sahayak_pending_booking_details[0]?.status || ""
        );
        if (statusPending === "Pending") {
          setAmount(
            data?.sahayak_pending_booking_details[0]?.total_amount_theka
          );
        } else {
          setAmount(data?.booking_theke_pe_kam[0]?.total_amount_theka);
        }
      }
      setIsLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const myjobs = async () => {
    setIsLoading(true);
    setRefreshing(true);
    let params = {
      booking_id: JSON.stringify(item?.booking_id),
    };

    try {
      const cacheBuster = new Date().getTime();
      const response = await service.post(
        `api/refresh-myjobs/?cacheBuster=${cacheBuster}`,
        params,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response?.data;
      setThekeperKam(data);
      setStatus(data[0]?.status);
      if (
        data[0]?.status === "Cancelled" ||
        data[0]?.status === "Cancelled-After-Payment"
      ) {
        navigation.replace("HomeStack", { screen: "BottomTab" });
        Toast.show("यह नौकरी ग्राहक द्वारा रद्द कर दी गई है!", Toast.LONG);
      }
      console.log("status", status);
      console.log("myjobsdata", data);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const Rejected = async () => {
    setIsLoading(true);
    let params = {
      booking_id: JSON.stringify(item?.booking_id),
      status: "Rejected",
    };
    console.log("Rejected", params);

    try {
      const response = await service.post("/api/rejected/", params, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response?.data;
      navigation.replace("HomeStack", { screen: "BottomTab" });
      console.log(data, "sds");
      Toast.show("काम रद्द किया गया है !", Toast.LONG);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const RejectedPayment = async () => {
    setIsLoading(true);
    let params = {
      booking_id: JSON.stringify(item?.booking_id),
      status: "Rejected-After-Payment",
    };
    console.log("Rejected", params);

    try {
      const response = await service.post("/api/rejected/", params, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response?.data;
      navigation.replace("HomeStack", { screen: "BottomTab" });
      console.log(data, "sds");
      Toast.show("काम रद्द किया गया है !", Toast.LONG);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    myjobs().then(() => {
      setRefreshing(false);
    });
    RatingApi().then(() => {
      setRefreshing(false);
    });
    mybookingdetail().then(() => {
      setRefreshing(false);
    });
    fetchJobData().then(() => {
      setRefreshing(false);
    });
    // checkStatus().then(() => {
    //   setRefreshing(false);
    // });
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ padding: 20, marginTop: 25 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrowleft" size={25} />
        </TouchableOpacity>
      </View>
      <View>
        {isLoading && <ActivityIndicator size="small" color="#black" />}
      </View>
      {!isLoading && (
        <ScrollView
          horizontal={false}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View>
            <View
              style={{
                //alignItems: "center",
                flex: 1,
                justifyContent: "center",
                marginHorizontal: 10,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 30,
                  fontWeight: "600",
                  fontFamily: "Devanagari-bold",
                }}
              >
                {item?.job_type === "theke_pe_kam" && "ठेके पर काम"}
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
                  {item.description}
                </Text>
                {/* <Image
                  source={require("../assets/image/edit.png")}
                  style={{ width: 20, height: 20, marginTop: 10, right: 10 }}
                /> */}
              </View>
              {usertype &&
                (usertype === "Sahayak" || usertype === "MachineMalik") && (
                  <View style={[styles.inputView, { height: 40 }]}>
                    <Text style={styles.label}>गाँव</Text>
                    <Text style={[styles.TextInput]}>
                      {item?.status == "Completed"
                        ? item?.grahak_village
                        : item?.village}
                    </Text>
                  </View>
                )}
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
              {usertype &&
                (usertype === "Sahayak" || usertype === "MachineMalik") && (
                  <View
                    style={[
                      styles.inputView,
                      styles.inputbox,
                      { flexDirection: "row", justifyContent: "space-between" },
                    ]}
                  >
                    <Text style={styles.label}>भूमि क्षेत्र </Text>
                    <TextInput
                      style={styles.TextInput}
                      placeholderTextColor="#848484"
                      placeholder=""
                    />
                    <Text
                      style={{ marginTop: 15, right: 10, color: "#0070C0" }}
                    >
                      {item?.land_area}
                      {item?.land_type == "Bigha"
                        ? " बीघा"
                        : item?.land_type == "Killa"
                        ? " किल्ला"
                        : " "}
                    </Text>
                  </View>
                )}
              <View></View>

              {usertype && usertype === "Grahak" && (
                <>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <View
                      style={[
                        styles.BhumiView,
                        styles.inputbox,
                        {
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          width: "40%",
                        },
                      ]}
                    >
                      <TextInput
                        style={styles.TextInput}
                        placeholderTextColor="#000"
                        editable={false}
                        placeholder="भूमि क्षेत्र "
                      />
                      <Text
                        style={{
                          right: 10,
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
                        styles.BhumiView,
                        styles.flex,
                        styles.justifyContentBetween,
                        { width: "40%" },
                      ]}
                    >
                      {item.status === "Pending" ? (
                        <>
                          <TextInput
                            style={styles.TextInput}
                            editable={false}
                            placeholderTextColor="#000"
                            placeholder="वेतन"
                          />
                          <Text
                            style={{
                              color: "#0099FF",
                              marginLeft: 30,
                              marginTop: 12,
                            }}
                          >
                            ₹
                          </Text>
                          <TextInput
                            editable={edit}
                            ref={textInputRef}
                            onChangeText={(amount) => setAmount(amount)}
                            value={amount}
                            keyboardType="numeric"
                            style={{
                              paddingRight: 10,
                              fontFamily: "Devanagari-regular",
                              color: "#0099FF",
                            }}
                            defaultValue={item?.total_amount_theka}
                          />
                        </>
                      ) : (
                        <>
                          <TextInput
                            style={styles.TextInput}
                            placeholder="वेतन"
                            editable={false}
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
                        </>
                      )}
                    </View>
                  </View>
                  {item?.status === "Pending" && (
                    <View
                      style={[
                        styles.flex,
                        { marginTop: 10, justifyContent: "space-between" },
                      ]}
                    >
                      <View style={{ width: "60%" }}></View>
                      <View>
                        {thekeparpending?.map((item) => (
                          <View key={item.id}>
                            <View style={{ flexDirection: "row" }}>
                              <TouchableOpacity
                                onPress={() => {
                                  handleClick();
                                  setEdit(true);
                                  console.log("edit:::::", edit);
                                }}
                                style={{
                                  backgroundColor: "#0099FF",
                                  marginRight: 10,
                                  padding: 5,
                                }}
                              >
                                <Text
                                  style={[
                                    styles.TextWhite,
                                    {
                                      fontSize: 12,
                                      fontFamily: "Devanagari-bold",
                                    },
                                  ]}
                                >
                                  वेतन बदलें
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => {
                                  checkSahayakStatus();
                                  setEdit(false);
                                }}
                                style={{
                                  backgroundColor: "#44A347",
                                  paddingHorizontal: 10,
                                  paddingTop: 4,
                                }}
                                disabled={!edit}
                              >
                                <Text
                                  style={[
                                    styles.TextWhite,
                                    {
                                      fontSize: 12,
                                      fontFamily: "Devanagari-bold",
                                    },
                                  ]}
                                >
                                  कन्फर्म
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                  <View
                    style={[
                      styles.inputView,
                      styles.flex,
                      styles.justifyContentBetween,
                      { alignItems: "center" },
                    ]}
                  >
                    <TextInput
                      style={styles.TextInput}
                      placeholder="काम की स्थिति"
                      editable={false}
                      placeholderTextColor={"#000"}
                    />
                    <View style={{ width: "30%", marginRight: 10 }}>
                      <View>
                        {[...thekeparpending, ...thekeperKams].map((item) => (
                          <>
                            <View key={item.id}>
                              {item?.status === "Pending"
                                ? getStatusButton(item?.status, "पेंडिंग")
                                : item?.status === "Accepted"
                                ? getStatusButton(item?.status, "स्वीकार")
                                : item?.status === "Booked"
                                ? getStatusButton(item?.status, "बुक्ड")
                                : item?.status === "Ongoing"
                                ? getStatusButton(item?.status, "जारी है ")
                                : item?.status === "Completed"
                                ? getStatusButton(item?.status, "समाप्त")
                                : null}
                              {console.log("item?.status", item?.status)}
                              {/* 
                                {console.log("bookingstate",bookingstate)} */}
                            </View>
                            {console.log("aaaa", item?.status)}

                            {/* {setBookingState(item?.status)} */}
                          </>
                        ))}
                      </View>
                    </View>
                  </View>
                  <View style={{ width: "100%" }}>
                    {(item?.status === "Pending" ||
                      item?.status === "Accepted") && (
                      <>
                        {[...thekeparpending, ...thekeperKams].map((item) => (
                          <View key={item.id}>
                            {item?.status === "Completed" ? (
                              <TouchableOpacity style={styles.BhuktanBtn}>
                                <Text
                                  style={[
                                    styles.loginText,
                                    { color: "#fff", paddingVertical: 10 },
                                  ]}
                                >
                                  समाप्त
                                </Text>
                              </TouchableOpacity>
                            ) : (
                              // getStatusButton(item?.status, "समाप्त")
                              <TouchableOpacity
                                style={[
                                  styles.BhuktanBtn,
                                  item?.status === "Pending"
                                    ? { opacity: 0.5 }
                                    : {},
                                ]}
                                disabled={item?.status === "Pending"}
                                onPress={() => {
                                  // navigation.replace("Payment", {
                                  //   item,
                                  //   fawdafee: item?.fawda_fee,
                                  //   totalamount: item?.total_amount,
                                  //   useramount: item?.total_amount_theka,
                                  //   id: id,
                                  // });
                                  checkStatus();
                                }}
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
                                  {item?.status === "Pending"
                                    ? "भुगतान करें"
                                    : "भुगतान करें"}
                                </Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        ))}
                      </>
                    )}
                    {item?.status === "Completed" &&
                      thekeperKams.map((item) => (
                        <View key={item.id}>
                          <TouchableOpacity style={styles.BhuktanBtn}>
                            <Text
                              style={[
                                styles.loginText,
                                {
                                  color: "#fff",
                                  paddingVertical: 10,
                                  fontFamily: "Devanagari-bold",
                                },
                              ]}
                            >
                              समाप्त
                            </Text>
                          </TouchableOpacity>
                        </View>
                      ))}
                  </View>
                  {/* <View style={{ width: "100%" }}>
                    {(item?.status === "Pending" ||
                      item?.status === "Accepted") && (
                      <>
                        {[...thekeparpending, ...thekeperKams].map((item) => (
                          <View key={item.id}>
                            <TouchableOpacity
                              style={[
                                styles.BhuktanBtn,
                                item?.status === "Pending"
                                  ? { opacity: 0.5 }
                                  : {},
                              ]}
                              disabled={item?.status === "Pending"}
                              onPress={() =>
                                navigation.navigate("Payment", {
                                  item,
                                  fawdafee: item?.fawda_fee,
                                  totalamount: item?.total_amount,
                                  useramount: item?.total_amount_theka,
                                })
                              }
                            >
                              <Text
                                style={[styles.loginText, { color: "#fff" }]}
                              >
                                {item?.status === "Pending"
                                  ? "भुगतान करें"
                                  : "भुगतान करें"}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        ))}
                      </>
                    )}
                  </View> */}
                </>
              )}

              <View
                style={{
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <>
                  {usertype &&
                    (usertype === "Sahayak" || usertype === "MachineMalik") && (
                      <>
                        <CustomComponent
                          label="किसान से वेतन"
                          value={thekeParAmount}
                        />
                        <CustomComponent
                          label="फावड़ा की फीस"
                          value={fawdaFees}
                        />

                        <CustomComponent
                          label="आपका भुगतान"
                          value={paymentYour}
                        />
                      </>
                    )}
                </>
              </View>

              <View style={{ width: "100%" }}>
                {usertype === "Sahayak" || usertype === "MachineMalik" ? (
                  <>
                    <View style={{ marginTop: 10 }}>
                      {console.log("thekeparkaam", thekeperKam)}
                      {item?.status === "Pending" ? (
                        <TouchableOpacity
                          style={styles.BhuktanBtn}
                          onPress={() => {
                            if (!isLoading) {
                              checkPayment();
                            }
                          }}
                        >
                          <Text
                            style={[
                              styles.loginText,
                              { color: "#fff", fontFamily: "Devanagari-bold" },
                            ]}
                          >
                            काम स्वीकार करें
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        thekeperKam.map((item) => (
                          <View key={item.id}>
                            <>
                              {item.status === "Accepted" ? (
                                <>
                                  <TouchableOpacity
                                    style={[styles.BhuktanBtn]}
                                    disabled={true}
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
                                      {item?.status === "Accepted"
                                        ? "काम स्वीकृत "
                                        : item?.status === "Booked"
                                        ? "बुक्ड"
                                        : item?.status === "Ongoing"
                                        ? "जारी है "
                                        : ""}
                                    </Text>
                                  </TouchableOpacity>
                                </>
                              ) : item.status === "Ongoing" ||
                                item.status === "Booked" ? (
                                <>
                                  <TouchableOpacity
                                    style={[styles.BhuktanBtn]}
                                    disabled={true}
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
                                      {item?.status === "Accepted"
                                        ? "काम स्वीकृत "
                                        : item?.status === "Booked"
                                        ? "बुक्ड"
                                        : item?.status === "Ongoing"
                                        ? "जारी है "
                                        : ""}
                                    </Text>
                                  </TouchableOpacity>
                                  <View
                                    style={[styles.inputView, { height: 40 }]}
                                  >
                                    <Text style={styles.label}>
                                      ग्राहक का नाम
                                    </Text>
                                    <TextInput
                                      style={styles.TextInput}
                                      editable={false}
                                      placeholderTextColor="#000000"
                                      placeholder={item?.grahak_name}
                                    />
                                  </View>
                                  <View
                                    style={[styles.inputView, { height: 40 }]}
                                  >
                                    <Text style={styles.label}>फ़ोन:</Text>
                                    <TextInput
                                      style={styles.TextInput}
                                      editable={false}
                                      placeholderTextColor="#000000"
                                      placeholder={item?.grahak_phone}
                                    />
                                  </View>
                                  <View style={[styles.CallBtn]}>
                                    <TouchableOpacity
                                      onPress={() =>
                                        handleCallPress(item?.grahak_phone)
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
                                </>
                              ) : (
                                <View
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    // marginTop: 20,
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <View
                                    style={[
                                      styles.BhuktanBtn,
                                      { width: "95%", marginBottom: 10 },
                                    ]}
                                    // onPress={() => {
                                    //   if (itemStatus !== "Completed") {
                                    //     navigation.replace("HomeStack", {
                                    //       screen: "BottomTab",
                                    //     });
                                    //   }
                                    // }}
                                  >
                                    <Text
                                      style={[
                                        styles.loginText,
                                        { color: "#fff" },
                                      ]}
                                    >
                                      समाप्त
                                    </Text>
                                  </View>
                                  <View
                                    style={{
                                      flexDirection: "row",
                                      alignItems: "center",
                                    }}
                                  >
                                    {ratingList}
                                  </View>
                                </View>
                              )}
                            </>
                            {item.status === "Accepted" && (
                              <View style={{ marginTop: "auto", padding: 5 }}>
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
                                  <Text
                                    style={[
                                      styles.TextInput,
                                      { maxWidth: "98%" },
                                    ]}
                                  >
                                    कृपया किसान द्वारा बुकिंग को कन्फर्म करने की
                                    प्रतीक्षा करें!
                                  </Text>
                                </View>
                                <View>
                                  <TouchableOpacity
                                    style={{
                                      backgroundColor: "#D9D9D9",
                                      alignSelf: "center",
                                      paddingHorizontal: 50,
                                      paddingVertical: 10,
                                      borderRadius: 5,
                                      marginTop: 10,
                                    }}
                                    onPress={() => {
                                      if (!isLoading) {
                                        myStatusBooked();
                                      }
                                    }}
                                  >
                                    <Text
                                      style={[
                                        styles.loginText,
                                        { color: "#fff" },
                                      ]}
                                    >
                                      रद्द करें
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              </View>
                            )}
                            {item.status === "Booked" && (
                              <View>
                                <View style={{ marginTop: "auto", padding: 5 }}>
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
                                    <Text
                                      style={[
                                        styles.TextInput,
                                        { maxWidth: "98%" },
                                      ]}
                                    >
                                      कृपया ऊपर दिए गए नंबर पर बात करें और कृपया
                                      नौकरी के लिए समय पर पहुंचें!
                                    </Text>
                                  </View>
                                </View>
                                <View>
                                  <TouchableOpacity
                                    style={{
                                      backgroundColor: "#D9D9D9",
                                      alignSelf: "center",
                                      paddingHorizontal: 50,
                                      paddingVertical: 10,
                                      borderRadius: 5,
                                      marginTop: 10,
                                    }}
                                    onPress={() => {
                                      if (!isLoading) {
                                        RejectedPayment();
                                      }
                                    }}
                                  >
                                    <Text
                                      style={[
                                        styles.loginText,
                                        { color: "#fff" },
                                      ]}
                                    >
                                      रद्द करें
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              </View>
                            )}
                          </View>
                        ))
                      )}
                    </View>
                  </>
                ) : null}
              </View>

              <View style={{ width: "100%" }}></View>
            </View>

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
                      {statusPending === "Pending" && (
                        <Text style={[styles.TextInput, { maxWidth: "98%" }]}>
                          काम स्वीकृत होने की प्रतीक्षा करें ! स्वीकृत होने पर
                          आपको भुगतान के लिए सूचित किया जाएगा
                        </Text>
                      )}
                      {statusAccept === "Accepted" && (
                        <Text style={[styles.TextInput, { maxWidth: "98%" }]}>
                          बुकिंग कन्फर्म करने के लिए कृपा भुगतान करें!
                        </Text>
                      )}
                    </View>
                  </>
                )}
            </View>

            <View style={{ marginTop: "auto", padding: 5 }}>
              {usertype &&
                usertype === "Grahak" &&
                // Render the list of "cancel" buttons if usertype is "Grahak"
                thekeparpending.map((item) => (
                  <View>
                    {item.status == "Pending" && (
                      <TouchableOpacity
                        style={{
                          backgroundColor: "#D9D9D9",
                          alignSelf: "center",
                          paddingHorizontal: 50,
                          paddingVertical: 10,
                          borderRadius: 5,
                        }}
                        onPress={() => {
                          if (!isLoading) {
                            cancel();
                          }
                        }}
                      >
                        <Text style={[styles.loginText, { color: "#fff" }]}>
                          रद्द करें
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              {thekeperKams != 0 &&
                thekeperKams?.map((item) => (
                  <View>
                    {item.status == "Pending" ||
                      (item.status === "Accepted" && (
                        <TouchableOpacity
                          style={{
                            backgroundColor: "#D9D9D9",
                            alignSelf: "center",
                            paddingHorizontal: 50,
                            paddingVertical: 10,
                            borderRadius: 5,
                          }}
                          onPress={() => {
                            if (!isLoading) {
                              cancel();
                            }
                          }}
                        >
                          <Text style={[styles.loginText, { color: "#fff" }]}>
                            रद्द करें
                          </Text>
                        </TouchableOpacity>
                      ))}
                  </View>
                ))}
            </View>
            <View style={{ marginTop: "auto", padding: 5 }}>
              {usertype &&
                (usertype === "Sahayak" || usertype === "MachineMalik") &&
                status === "Completed" &&
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
                      <Text style={[styles.TextInput, { maxWidth: "98%" }]}>
                        धन्यवाद! कुछ देर बाद भुगतान आपके खाते में आ जाएगा!
                        {"\n"}कृपया आगे बढ़ने के लिए होम पेज पर जाएँ!
                      </Text>
                    </View>
                  </>
                )}
            </View>
          </View>
          {/* {!isLoading && (
        
        )} */}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
export default Theke_MachineForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
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
  TestText: {
    color: "#D3D3D3",
    fontSize: 16,
    fontFamily: "Devanagari-regular",
    //   flexDirection:"column",
  },

  loginBtn: {
    width: "100%",
    borderRadius: 7,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    backgroundColor: "#0099FF",
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
    // borderBottomRightRadius: 7,
    width: "100%",
    height: 48,
    marginTop: 20,
    borderWidth: 1,
  },

  TextInput: {
    fontFamily: "Devanagari-regular",
    padding: 10,
  },

  BhumiView: {
    borderColor: "#0070C0",
    borderRadius: 7,
    // borderBottomRightRadius: 0,
    // borderTopRightRadius:0,
    width: "50%",
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
    fontFamily: "Devanagari-bold",
  },
  salaryAmount: {
    marginTop: 13,
    marginRight: 8,
    color: "#0099FF",
    fontFamily: "Devanagari-regular",
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
});
