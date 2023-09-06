import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Image,
  RefreshControl,
  ScrollView,
  ActivityIndicator,
  Linking,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import service from "../service";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { selectToken, selectUserType } from "../slices/authSlice";
import Toast from "react-native-simple-toast";
import CustomComponent from "../Component/CustomComponent";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
// import * as Linking from "expo-linking";

export default function MachineWork({ navigation, route }) {
  const [thekeperKam, setThekeperKam] = useState([]);
  const [editable, setEditable] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [thekeperKams, setThekeperKams] = useState([]);
  const [thekeparpending, setThekeperKamPending] = useState([]);
  const [ratingList, setRatingList] = useState([]);
  const usertype = useSelector(selectUserType);
  const { id, item, fawdafee, totalamount } = route.params ?? {};
  console.log("jobdata", item);
  const itemStatus = item?.status;
  const [amount, setAmount] = useState(0 || totalamount);
  const [edit, setEdit] = useState(false);
  const [status, setStatus] = useState("");
  const [statusAccept, setStatusAccept] = useState("");
  const [statusPending, setStatusPending] = useState("");
  const textInputRef = useRef(null);
  const [jobsData, setJobsData] = useState([]);
  const [fawdaFees, setFawdafees] = useState(0 || item?.fawda_fee);
  const [paymentYour, setPaymentYour] = useState(0 || item?.payment_your);
  const [amountMachine, setAmountMachine] = useState(
    0 || item?.total_amount_machine
  );
  const [paymentCheck, setPaymentCheck] = useState(false);

  const onEditPress = () => {
    setEdit(true);
    textInputRef?.current?.focus();
  };
  const handleCallPress = async (phone) => {
    const url = `tel:${phone}`;
    await Linking.openURL(url);
    // await Linking.canOpenURL(url)
    //   ?.then(async (supported) => {
    //     if (!supported) {
    //       console.log("Phone number is not available");
    //     } else {
    //       await Linking.openURL(url);
    //       // return Linking.openURL(url);
    //     }
    //   })
    //   .catch((err) => console.error("An error occurred", err));
  };

  const onAcceptPress = async () => {
    setIsLoading(true);
    try {
      let params = {
        job_id: JSON.stringify(item?.id),
        amount: amount,
      };

      const response = await service.post("/api/edit_machine/", params, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      let data = response.data;
      if (response.status === 200) {
        Toast.show("वेतन सफलतापूर्वक अपडेट किया गया है!", Toast.LONG);
        navigation.navigate("MyBookingStack", { screen: "MyBooking" });
      } else {
        Toast.show("राशि अपडेट नहीं की गई है।", Toast.LONG);
      }
    } catch (error) {
      console.log(error);
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
          setAmountMachine(jobData.total_amount_machine);
          setFawdafees(jobData.fawda_fee);
          setPaymentYour(jobData.payment_your);
        }
      });
    }
  }, [jobsData]);

  const checkStatus = async () => {
    setIsLoading(true);
    let params = {
      machine_job_id: JSON.stringify(id),
      machine_job_number: item?.job_number,
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
        const statusCheck =
          data?.machine_malik_pending_booking_details[0]?.status || "";
        const accept_data = data?.machine_malik_booking_details[0] || {};
        if (statusCheck === "Pending") {
          navigation.replace("HomeStack", { screen: "BottomTab" });
          Toast.show("यह बुकिंग सहायक द्वारा रद्द कर दी गई है।", Toast.LONG);
        } else {
          navigation.replace("Payment", {
            item: accept_data,
            fawdafee: accept_data?.fawda_fee,
            totalamount: accept_data?.total_amount,
            useramount: accept_data?.total_amount_machine,
            id: accept_data?.job_id,
          });
        }
      }
      setIsLoading(false);
    } catch (error) {
      console.log("Error:", error);
    }
  };

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
          console.log("amount", matchingJobData.total_amount_machine);
          const totalAmount = matchingJobData.total_amount_machine;
          if (amountMachine !== totalAmount) {
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

  const checkSahayakStatus = async () => {
    setIsLoading(true);
    let params = {
      machine_job_id: JSON.stringify(id),
      machine_job_number: item?.job_number,
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
        const statusCheck =
          data?.machine_malik_booking_details[0]?.status || "";
        if (statusCheck === "Accepted") {
          Toast.show(
            "यह बुकिंग सहायक द्वारा स्वीकार कर ली गई है। कृपया स्क्रीन को रिफ्रेश करें।",
            Toast.LONG
          );
        } else {
          onAcceptPress();
        }
      }
      setIsLoading(false);
    } catch (error) {
      console.log("Error:", error);
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

  const accptThekha = async () => {
    setIsLoading(true);
    let params = {
      job_id: item?.id,
    };

    try {
      const response = await service.post("/api/accept_machine/", params, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response?.data;
      if (data?.status === 200) {
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

      const ratings = data?.data?.rating;
      const ratingColor = "#e6b400";

      const ratingList = Array(5)
        .fill(0)
        .map((_, num) => {
          // let color = num < ratings ? ratingColor : "#e6b400";
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
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    RatingApi();
  }, []);
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
            fontWeight: "600",
          }}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  }
  const cancel = async () => {
    setIsLoading(true);
    let params = {
      job_id: item?.id,
      job_number: item?.job_number,
      // booking_id: item?.booking_id,
      status: "Cancelled",
    };

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
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setIsLoading(false);
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
  const mybookingdetail = async () => {
    setIsLoading(true); // set isLoading to true when the function starts
    setRefreshing(true);
    let params = {
      machine_job_id: JSON.stringify(id),
      machine_job_number: item?.job_number,
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

      setThekeperKams(data?.machine_malik_booking_details);
      setThekeperKamPending(data?.machine_malik_pending_booking_details);
      if (usertype && usertype === "Grahak") {
        setStatusAccept(data?.machine_malik_booking_details[0]?.status || "");
        setStatusPending(
          data?.machine_malik_pending_booking_details[0]?.status || ""
        );
        if (statusPending === "Pending") {
          setAmount(
            data?.machine_malik_pending_booking_details[0]?.total_amount_machine
          );
        } else {
          setAmount(
            data?.machine_malik_booking_details[0]?.total_amount_machine
          );
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
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    mybookingdetail();
    myjobs();
    RatingApi();
  }, []);
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
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,

        backgroundColor: "#fff",
      }}
    >
      <View>
        {/* {isLoading && <ActivityIndicator size="small" color="#black" />} */}
      </View>
      <View style={{ padding: 20, marginTop: 25 }}>
        {/* <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrowleft" size={25} />
        </TouchableOpacity> */}
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
            <View style={{ flex: 1 }}>
              <Text
                style={{ textAlign: "center", fontSize: 30, fontWeight: "600" }}
              >
                मशीन का काम
              </Text>
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
                  <Text style={styles.label}>मशीन का प्रकार </Text>
                  <Text style={[styles.TextInput]}>{item?.machine}</Text>
                </View>
                {usertype &&
                  (usertype === "Sahayak" || usertype === "MachineMalik") && (
                    <>
                      <View
                        style={[
                          styles.inputView,
                          styles.flex,
                          styles.justifyContentBetween,
                        ]}
                      >
                        <Text style={styles.label}>काम का विवरण</Text>
                        <Text style={[styles.TextInput]}>
                          {item?.description}
                        </Text>
                      </View>

                      <View style={[styles.inputView, { height: 40 }]}>
                        <Text style={styles.label}>गाँव</Text>
                        <Text style={[styles.TextInput]}>
                          {item?.status == "Completed"
                            ? item?.grahak_village
                            : item?.village}
                        </Text>
                        {/* <TextInput
                    style={styles.TextInput}
                    placeholderTextColor="#848484"
                    placeholder={item?.village}
                  /> */}
                      </View>
                    </>
                  )}
                {usertype && usertype === "Grahak" && (
                  <View
                    style={[
                      styles.inputView,
                      styles.flex,
                      styles.justifyContentBetween,
                    ]}
                  >
                    <Text style={styles.label}>काम का विवरण</Text>
                    <Text style={[styles.TextInput]}>{item?.description}</Text>
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
                        { position: "relative" },
                      ]}
                    >
                      <Text style={styles.label}>भूमि क्षेत्र</Text>
                      <TextInput
                        style={styles.TextInput}
                        editable={false}
                        placeholderTextColor="#848484"
                        placeholder=""
                      />
                      <Text
                        style={{
                          top: 10,
                          right: 5,
                          position: "absolute",
                          color: "#0099FF",
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
                  )}
                {usertype && usertype === "Grahak" && (
                  <View
                    style={[
                      styles.flex,
                      styles.justifyContentBetween,
                      { marginHorizontal: 10 },
                    ]}
                  >
                    <View
                      style={[
                        styles.TaxView,
                        styles.inputbox,
                        { position: "relative", marginHorizontal: 10 },
                      ]}
                    >
                      {/* <Text style={styles.label}>भूमि क्षेत्र</Text> */}
                      <TextInput
                        style={styles.TextInput}
                        editable={false}
                        placeholderTextColor="#000"
                        placeholder="भूमि क्षेत्र"
                      />
                      <Text
                        style={{
                          top: 10,
                          right: 5,
                          position: "absolute",
                          color: "#0099FF",
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
                        { marginHorizontal: 10 },
                      ]}
                    >
                      <Text style={{ marginLeft: 10 }}>वेतन</Text>
                      {edit ? (
                        <TextInput
                          style={[
                            // styles.TextInput,
                            { marginRight: 10, color: "#0099FF", padding: 10 },
                          ]}
                          ref={textInputRef}
                          onChangeText={(amount) => setAmount(amount)}
                          value={amount}
                          keyboardType="numeric"
                          defaultValue={item?.total_amount_machine}
                        />
                      ) : (
                        <View>
                          <Text
                            style={[
                              // styles.TextInput,
                              {
                                marginRight: 10,
                                color: "#0099FF",
                                padding: 10,
                              },
                            ]}
                          >
                            ₹ {item?.total_amount_machine}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                )}

                {item?.status === "Pending" && (
                  <View
                    style={[
                      styles.flex,
                      { marginTop: 10, justifyContent: "space-between" },
                    ]}
                  >
                    <View style={{ width: "70%" }}></View>
                    <View>
                      {thekeparpending?.map((item) => (
                        <View key={item.id}>
                          <View style={[styles.flex, { marginTop: 10 }]}>
                            <TouchableOpacity
                              onPress={() => {
                                onEditPress();
                                setEdit(true);
                              }}
                              style={{
                                backgroundColor: "#0099FF",
                                marginRight: 10,
                                padding: 5,
                              }}
                            >
                              <Text
                                style={[styles.TextWhite, { fontSize: 10 }]}
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
                                padding: 5,
                              }}
                              disabled={!edit}
                            >
                              <Text
                                style={[styles.TextWhite, { fontSize: 10 }]}
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

                {/* end */}

                <View
                  style={{
                    flex: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <>
                    {usertype &&
                      (usertype === "Sahayak" ||
                        usertype === "MachineMalik") && (
                        <>
                          <CustomComponent
                            label="किसान से वेतन"
                            value={amountMachine}
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
                {usertype && usertype === "Grahak" && (
                  <>
                    <View
                      style={[
                        styles.inputView,
                        styles.flex,
                        styles.justifyContentBetween,
                        { marginBottom: 10 },
                      ]}
                    >
                      <TextInput
                        style={styles.TextInput}
                        editable={false}
                        placeholder="काम की स्थिति"
                        placeholderTextColor={"#000"}
                      />

                      <View style={{ width: "30%", marginRight: 10 }}>
                        <View>
                          <>
                            {[...thekeparpending, ...thekeperKams].map(
                              (item) => (
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
                                </View>
                              )
                            )}
                          </>
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
                                getStatusButton(item?.status, "समाप्त")
                              ) : (
                                <TouchableOpacity
                                  style={[
                                    styles.BhuktanBtn,
                                    item?.status === "Pending"
                                      ? { opacity: 0.5 }
                                      : {},
                                  ]}
                                  disabled={item?.status === "Pending"}
                                  onPress={() => checkStatus()}
                                >
                                  <Text
                                    style={[
                                      styles.loginText,
                                      { color: "#fff" },
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
                            {item?.status === "Completed"
                              ? getStatusButton(item?.status, "समाप्त")
                              : null}
                          </View>
                        ))}
                    </View>
                  </>
                )}
                <View style={{ width: "100%" }}>
                  {usertype === "Sahayak" ||
                    (usertype === "MachineMalik" && (
                      <>
                        <View style={{ marginTop: 10 }}>
                          {item?.status === "Pending" ? (
                            <TouchableOpacity
                              style={styles.BhuktanBtn}
                              onPress={() => checkPayment()}
                            >
                              <Text
                                style={[styles.loginText, { color: "#fff" }]}
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
                                            { color: "#fff" },
                                          ]}
                                        >
                                          {item?.status === "Accepted"
                                            ? "काम स्वीकृत "
                                            : item?.status === "Booked"
                                            ? "बुक्ड"
                                            : item?.status === "Ongoing"
                                            ? "जारी है "
                                            : ""}{" "}
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
                                            { color: "#fff" },
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
                                        style={[
                                          styles.inputView,
                                          { height: 40 },
                                        ]}
                                      >
                                        <Text style={styles.label}>
                                          ग्राहक का नाम
                                        </Text>
                                        <TextInput
                                          style={styles.TextInput}
                                          editable={false}
                                          placeholderTextColor="#000000"
                                          placeholder={item.grahak_name}
                                        />
                                      </View>
                                      <View
                                        style={[
                                          styles.inputView,
                                          { height: 40 },
                                        ]}
                                      >
                                        <Text style={styles.label}>फ़ोन:</Text>
                                        <TextInput
                                          style={styles.TextInput}
                                          editable={false}
                                          placeholderTextColor="#000000"
                                          placeholder={item.grahak_phone}
                                        />
                                      </View>
                                      <View style={[styles.CallBtn]}>
                                        <TouchableOpacity
                                          onPress={() =>
                                            handleCallPress(item.grahak_phone)
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
                                  <View>
                                    <View
                                      style={{ marginTop: "auto", padding: 5 }}
                                    >
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
                                        <Text style={styles.label}>
                                          टिप्पणी
                                        </Text>
                                        <Text
                                          style={[
                                            styles.TextInput,
                                            { maxWidth: "98%" },
                                          ]}
                                        >
                                          कृपया किसान द्वारा बुकिंग को कन्फर्म
                                          करने की प्रतीक्षा करें!
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
                                    <View
                                      style={{ marginTop: "auto", padding: 5 }}
                                    >
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
                                        <Text style={styles.label}>
                                          टिप्पणी
                                        </Text>
                                        <Text
                                          style={[
                                            styles.TextInput,
                                            { maxWidth: "98%" },
                                          ]}
                                        >
                                          कृपया ऊपर दिए गए नंबर पर बात करें और
                                          कृपया काम के लिए समय पर पहुंचें!
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
                    ))}
                </View>
              </View>
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

                      <Text style={[styles.TextInput, { maxWidth: "98%" }]}>
                        धन्यवाद! कुछ देर बाद भुगतान आपके खाते में आ जाएगा!
                        {"\n"}और काम ढूंढ़ने के लिए होम पेज पर जाएं!
                      </Text>
                    </View>
                  </>
                )}
            </View>
          </View>
        </ScrollView>
      )}
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
    fontFamily: "Devanagari-regular",
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
    width: "95%",
    borderRadius: 7,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginHorizontal: 10,
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
    // width: "27%",
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
    fontFamily: "Devanagari-bold",

    textAlign: "center",
    backgroundColor: "#fff",
  },
  CallBtn: {
    width: "25%",
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    color: "#fff",
    backgroundColor: "#0099FF",
  },
});
