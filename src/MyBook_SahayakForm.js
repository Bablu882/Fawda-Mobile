import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Image,
  ScrollView,
  Button,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import service from "../service";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Toast from "react-native-root-toast";

import { selectToken, selectUserType } from "../slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

const CustomComponent = ({ label, value }) => {
  return (
    <View
      style={[
        styles.inputView,
        styles.inputbox,
        { flexDirection: "row", flex: 1, position: "relative" },
      ]}
    >
      <TextInput
        style={[styles.TextInput, { width: "100%" }]}
        placeholder={label}
        editable={false}
        placeholderTextColor={"#000"}
      />
      <Text
        style={{ color: "#0070C0", position: "absolute", right: 10, top: 10 }}
      >
        {value}
      </Text>
    </View>
  );
};

export default function MyBook_SahayakForm({ navigation, route }) {
  const dispatch = useDispatch();
  const [bookingstate, setBookingState] = useState(item?.status);
  const token = useSelector(selectToken);

  const [ratingList, setRatingList] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const { id, item, totalamount, fawdafee, bookingid } = route.params;
  const [show, setShow] = useState(true);
  const [checkboxStatus, setCheckboxStatus] = useState({});
  const [maleStatuses, setMaleStatuses] = useState({});
  const [totalMaleAccepted, setTotalMaleAccepted] = useState(0);
  const [showFirstView, setShowFirstView] = useState(true);
  const [showSecondView, setShowSecondView] = useState(false);
  const [thekeperKams, setThekeperKams] = useState([]);
  const [thekeparpending, setThekeperKamPending] = useState([]);
  const [thekeperKam, setThekeperKam] = useState([]);
  const [totalFemaleAccepted, setTotalFemaleAccepted] = useState(0);
  const [acceptedCount, setAcceptedCount] = useState(null);
  const [maleCount, setMaleCount] = useState(null);
  const usertype = useSelector(selectUserType);
  const [edit, setEdit] = useState(false);
  const [editmale, setEditMale] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [amountMale, setAmountMale] = useState(0);
  const [amountFemale, setAmountFemale] = useState(0);
  const textInputRef = useRef(null);
  const handleClick = () => {
    setEdit(true);
    setEditMale(true);
    textInputRef.current.focus();
  };

  const acceptSahayak = async () => {
    setIsLoading(true);
    let params = {
      count_male: totalMaleAccepted,
      count_female: totalFemaleAccepted,
      job_id: JSON.stringify(id),
    };
    try {
      const response = await service.post("/api/accept_individuals/", params, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response?.data;
      navigation.navigate("MyBookingStack", {
        screen: "MyBooking",
      });
    } catch (error) {
      console.log("Error:", error);
    }
    // finally {
    //   setIsLoading(false); // Hide loader after fetching data
    // }
  };
  const Edit = async () => {
    let params = {
      job_id: JSON.stringify(id),
      pay_amount_male: amountMale,
      pay_amount_female: amountFemale,
    };
    try {
      const response = await service.post("/api/edit_individuals/", params, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response?.data;

      if (data.status === 200) {
        Toast.show("वेतन सफलतापूर्वक अपडेट किया गया है!", Toast.LONG);
      } else {
        Toast.show("राशि अपडेट नहीं की गई है।", Toast.LONG);
      }
    } catch (error) {
      console.log("Error:", error);
    }
    // finally {
    //   setIsLoading(false); // Hide loader after fetching data
    // }
  };
 

  const toggleViews = () => {
    setShowFirstView(!showFirstView);
    setShowSecondView(!showSecondView);
  };

  const handleCheckboxChange = (index) => {
    const updatedStatus = { ...checkboxStatus };
    if (updatedStatus[index] === "Accepted") {
      updatedStatus[index] = "Pending";
    } else {
      updatedStatus[index] = "Accepted";
    }
    setCheckboxStatus(updatedStatus);
    // Call countAccepted function to update count
    const acceptedCount = countAccepted();
    setAcceptedCount(acceptedCount);
  };

  const countAccepted = () => {
    let count = 0;
    Object.values(checkboxStatus).forEach((value) => {
      if (value === "Accepted") {
        count++;
      }
    });
    return count;
  };

  const handleAcceptMale = (index) => {
    const updatedMaleStatuses = { ...maleStatuses };
    if (updatedMaleStatuses[index] === "Accepted") {
      updatedMaleStatuses[index] = "Pending";
    } else {
      updatedMaleStatuses[index] = "Accepted";
    }
    setMaleStatuses(updatedMaleStatuses);
    // Call malecount function to update count
    const maleCount = malecount();
    setMaleCount(maleCount);
  };

  const malecount = () => {
    let count = 0;
    Object.values(maleStatuses).forEach((value) => {
      if (value === "Accepted") {
        count++;
      }
    });
    return count;
  };

  function handleFemaleAccepted() {
    const totalfemale = countAccepted();
    setTotalFemaleAccepted(totalfemale);
    console.log("totalFemaleAcceptedtotalFemaleAccepted", totalFemaleAccepted);
  }
 

  useEffect(() => {
    const totalAccepted = malecount();
    setTotalMaleAccepted(totalAccepted);
    console.log("totalMaleAcceptedtotalMaleAccepted", totalMaleAccepted);
  }, [malecount]);
  useEffect(() => {
    const totalfemale = countAccepted();
    setTotalFemaleAccepted(totalfemale);
    console.log("totalFemaleAcceptedtotalFemaleAccepted", totalFemaleAccepted);
  }, [countAccepted]);

  const TotalCount = parseInt(item.count_female) + parseInt(item.count_male);
  console.log("fjfjfhjfhjffffjf", TotalCount);
  // useEffect(() => {

  // },[])
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
      const ratings = data?.rating;
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
    } finally {
      setIsLoading(false); // Hide loader after fetching data
    }
  };

  const cancel = async () => {
    let params = {
      job_id: JSON.stringify(item?.job_id),
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
      navigation.navigate("HomeStack", { screen: "HomePage" });
      Toast.show("Job रद्द कर दी गई है", Toast.LONG);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const Rejected = async () => {
    let params = {
      booking_id: JSON.stringify(item?.booking_id),
      count_male: totalMaleAccepted,
      count_female: totalFemaleAccepted,
      status: "Rejected",
    };
    try {
      const response = await service.post("/api/rejected/", params, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = response?.data;
      navigation.navigate("HomeStack", { screen: "HomePage" });
 
      Toast.show("Rejected", Toast.LONG);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  function getStatusButton(status, label) {
    return (
      <TouchableOpacity
        style={{
          backgroundColor: status === "Pending" ? "#44A347" : "#0099FF",
          width: "100%",
          borderRadius: 7,
          height: 30,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            textAlign: "center",

            color: "#fff",
            fontSize: 10,
            fontWeight: "600",
          }}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  }

  const mybookingdetail = async () => {
    setIsLoading(true); // set isLoading to true when the function starts
    setRefreshing(true);
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
      setThekeperKamPending(data?.sahayak_pending_booking_details);
      setThekeperKams(data?.sahayk_booking_details?.bookings);
      setIsLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const myjobs = async () => {
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
      setThekeperKam(data);
    
    } catch (error) {
      console.log("Error:", error);
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
    Edit().then(() => {
      setEdit(false);
    });
  }, []);

  return (
    <SafeAreaView style={{ backgroundColor: "#fff", flex: 1 }}>
      <View>
        {/* {isLoading && <ActivityIndicator size="small" color="#black" />} */}
      </View>
      <View style={{ padding: 20, marginTop: 25 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrowleft" size={25} />
        </TouchableOpacity>
      </View>
      <View style={{ justifyContent: "center" }}>
        <Text style={{ textAlign: "center", fontSize: 30, fontWeight: "600" }}>
          {item?.job_type === "individuals_sahayak" && "सहायक का काम "}
        </Text>
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
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 20,
              marginHorizontal: 10,
            }}
          >
            <Text>{item.status}</Text>
            <View
              style={[
                styles.inputView,
                styles.flex,
                styles.justifyContentBetween,
                { height: 80 },
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
            {usertype &&
              (usertype === "Sahayak" || usertype === "MachineMalik") && (
                <View style={[styles.inputView, { height: 40 }]}>
                  <Text style={styles.label}>गाँव</Text>
                  <Text style={[styles.TextInput, { color: "#848484" }]}>
                    {item?.village}
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
                {moment.utc(item?.datetime).format("l")}
              </Text>
              <Text style={styles.TextInput}>
                {moment.utc(item?.datetime).format("LT")}
                
              </Text>
            </View>
        
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
                placeholderTextColor="#848484"
                editable={false}
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
                {item?.land_type == "Bigha" ? "बीघा" : "किल्ला"}
              </Text>
            </View>

            <View style={[styles.flex, styles.justifyContentBetween]}>
              <View
                style={[
                  styles.TaxView,
                  styles.flex,
                  styles.justifyContentBetween,
                  { marginRight: 5 },
                ]}
              >
                <TextInput
                  style={styles.TextInput}
                  placeholder="एक पुरुष का वेतन"
                  editable={false}
                  placeholderTextColor={"#000"}
                />
                <TextInput
                  // editable={editmale}
                  keyboardType="numeric"
                  ref={textInputRef}
                  onChangeText={(amountMale) => setAmountMale(amountMale)}
                  value={amountMale}
                  style={{ paddingRight: 10 }}
                  defaultValue={item?.pay_amount_male}
                />
                {/* <Text style={{ marginRight: 8, color: "#0099FF" }}>
                  ₹ {item?.pay_amount_male}
                </Text> */}
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
                  placeholder="एक महिला का वेतन"
                  editable={false}
                  placeholderTextColor={"#000"}
                />
                <TextInput
                  // editable={edit}
                  keyboardType="numeric"
                  ref={textInputRef}
                  onChangeText={(amountFemale) => setAmountFemale(amountFemale)}
                  value={amountFemale}
                  style={{ paddingRight: 10 }}
                  defaultValue={item?.pay_amount_female}
                />
                {/* <Text style={{ marginRight: 20, color: "#0099FF" }}>
                  ₹ {item?.pay_amount_female}
                </Text> */}
              </View>
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View style={{ width: "70%" }}></View>
              <View>
                {usertype &&
                  usertype === "Grahak" &&
                  item?.status === "Pending" && (
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "flex-end",
                      }}
                    >
                      {thekeperKams.length > 0 ? (
                          thekeperKams.map((item) => (
                            <View key={item.id}>
                              {item.status === "Accepted" ? (
                                <View key={item.id}>
                                
                                </View>
                              ) : (
                                <View>
                                  <View key={item.id}>
                                    <View
                                      style={{
                                        flexDirection: "row",
                                        marginTop: 5,
                                      }}
                                    >
                                      <TouchableOpacity
                                        onPress={() => {
                                          handleClick();
                                          setEdit(true);
                                          setEditMale(true);
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
                                            { fontSize: 10 },
                                          ]}
                                        >
                                          वेतन बदलें
                                        </Text>
                                      </TouchableOpacity>
                                      <TouchableOpacity
                                        onPress={() => Edit()}
                                        style={{
                                          backgroundColor: "#44A347",
                                          paddingHorizontal: 10,
                                          padding: 5,
                                        }}
                                      >
                                        <Text
                                          style={[
                                            styles.TextWhite,
                                            { fontSize: 10 },
                                          ]}
                                        >
                                          कन्फर्म
                                        </Text>
                                      </TouchableOpacity>
                                    </View>
                                  </View>
                                </View>
                              )}
                            </View>
                          ))
                        ) : (
                          <View>
                            <View key={item.id}>
                              <View
                                style={{ flexDirection: "row", marginTop: 5 }}
                              >
                                <TouchableOpacity
                                  onPress={() => {
                                    handleClick();
                                    setEdit(true);
                                    setEditMale(true);
                                    console.log("edit:::::", edit);
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
                                  onPress={() => Edit()}
                                  style={{
                                    backgroundColor: "#44A347",
                                    paddingHorizontal: 10,
                                    padding: 5,
                                  }}
                                >
                                  <Text
                                    style={[styles.TextWhite, { fontSize: 10 }]}
                                  >
                                    कन्फर्म
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          </View>
                        )}
                   
                    </View>
                  )}
              </View>
            </View>

            {usertype && usertype === "Grahak" ? (
              <View
                style={[
                  styles.flex,
                  styles.justifyContentBetween,
                  { marginBottom: 20 },
                ]}
              >
                <View
                  style={[
                    styles.TaxView,
                    styles.flex,
                    styles.justifyContentBetween,
                    ,
                    { marginRight: 5 },
                  ]}
                >
                  <TextInput
                    style={styles.TextInput}
                    placeholder="दिनों की संख्या"
                    editable={false}
                    placeholderTextColor={"#000"}
                  />
                  <Text
                    style={{ marginTop: 5, marginRight: 8, color: "#0099FF" }}
                  >
                    {item?.num_days}
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
                    editable={false}
                    placeholderTextColor={"#000"}
                  />

                  <Text
                    style={{ marginTop: 13, marginRight: 8, color: "#0099FF" }}
                  >
                    {item.status === "Pending" &&
                      thekeparpending.map((item) => (
                        <View key={item.id}>
                          <Text> ₹ {item.total_amount_sahayak}</Text>
                        </View>
                      ))}

                    {thekeperKams != 0
                      ? thekeperKams.map((item) => (
                          <View key={item.id}>
                            {item.status === "Accepted" ||
                              (item.status === "Completed" && (
                                <Text> ₹ {item.total_amount_sahayak}</Text>
                              ))}
                          </View>
                        ))
                      : thekeparpending.map((item) => (
                          <View key={item.id}>
                            {item.status != "Pending" && (
                              <Text> ₹ {item.total_amount_sahayak}</Text>
                            )}
                          </View>
                        ))}
                  </Text>
                </View>
              </View>
            ) : (
              <View
                style={[
                  styles.inputView,
                  styles.flex,
                  styles.justifyContentBetween,
                  ,
                  { marginRight: 5, position: "relative", marginBottom: 20 },
                ]}
              >
                <TextInput
                  style={styles.TextInput}
                  placeholder="दिनों की संख्या"
                  placeholderTextColor={"#000"}
                />
                <Text
                  style={{ position: "absolute", right: 5, color: "#0099FF" }}
                >
                  {item?.num_days}
                </Text>
              </View>
            )}
            <View>
              {usertype && usertype === "Grahak" && (
                <View>
                  {item.status === "Accepted" || item.status == "Completed" ? (
                    thekeperKams != 0 &&
                    thekeperKams?.map((item, index) => (
                      <View key={item?.id}>
                        <View
                          style={{ flexDirection: "row", flexWrap: "wrap" }}
                        >
                          {[...Array(parseInt(item?.count_male)).keys()].map(
                            (index) => (
                              <View
                                style={[
                                  styles.flex,
                                  styles.justifyContentBetween,
                                  {
                                    paddingHorizontal: 5,
                                    borderColor: "#0070C0",
                                    // borderRadius: 7,
                                    borderWidth: 0.4,
                                    paddingVertical: 10,
                                    maxWidth: "33.33%",
                                    width: "100%",
                                    marginBottom: 5,
                                  },
                                ]}
                                key={index}
                              >
                                <TextInput
                                  style={styles.CheckTextInput}
                                  placeholder="पुरषो"
                                  editable={false}
                                  placeholderTextColor={"#000"}
                                  name={`Male${index + 1}`}
                                />
                                <View
                                  style={{
                                    height: 25,
                                    paddingHorizontal: 5,
                                    backgroundColor:
                                      item.status === "Pending"
                                        ? "#44A347"
                                        : "#0099FF",
                                    marginLeft: 5,
                                  }}
                                >
                                  <TouchableOpacity>
                                    <Text
                                      style={{
                                        textAlign: "center",
                                        marginTop: 5,
                                        color: "#fff",
                                        fontSize: 12,
                                        fontWeight: "600",
                                      }}
                                    >
                                      {item?.status === "Pending"
                                        ? "पेंडिंग"
                                        : item?.status === "Accepted"
                                        ? "स्वीकार "
                                        : item?.status === "Booked"
                                        ? "बुक्ड"
                                        : item?.status === "Ongoing"
                                        ? "जारी है "
                                        : "समाप्त"}
                                      {console.log("fjfjfjfjfjf", item?.status)}
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              </View>
                            )
                          )}
                          {[...Array(parseInt(item?.count_female)).keys()].map(
                            (index) => (
                              <View
                                style={[
                                  styles.flex,
                                  {
                                    paddingHorizontal: 5,
                                    borderColor: "#0070C0",
                                    // borderRadius: 7,
                                    borderWidth: 0.4,
                                    paddingVertical: 10,
                                    maxWidth: "33.33%",
                                    width: "100%",
                                    marginBottom: 5,
                                  },
                                ]}
                                key={index}
                              >
                                <TextInput
                                  style={{ ...styles.CheckTextInput }}
                                  placeholder="महिला"
                                  editable={false}
                                  placeholderTextColor={"#101010"}
                                  name={`Female${index + 1}`}
                                />
                                <View
                                  style={{
                                    height: 25,
                                    paddingHorizontal: 5,
                                    backgroundColor:
                                      item.status === "Pending"
                                        ? "#44A347"
                                        : "#0099FF",
                                    marginLeft: 5,
                                  }}
                                >
                                  <TouchableOpacity>
                                    <Text
                                      style={{
                                        textAlign: "center",
                                        marginTop: 5,
                                        color: "#fff",
                                        fontSize: 12,
                                        fontWeight: "600",
                                      }}
                                    >
                                      {item?.status === "Pending"
                                        ? "पेंडिंग"
                                        : item?.status === "Accepted"
                                        ? "स्वीकार "
                                        : item?.status === "Booked"
                                        ? "बुक्ड"
                                        : item?.status === "Ongoing"
                                        ? "जारी है "
                                        : "समाप्त"}
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              </View>
                            )
                          )}
                        </View>
                      </View>
                    ))
                  ) : (
                    <View>
                      {thekeparpending?.map((item, index) => (
                        <View
                          key={item?.id}
                          style={[
                            styles.flex,
                            styles.justifyContentBetween,
                            { flexWrap: "wrap" },
                          ]}
                        >
                          <>
                            {[...Array(parseInt(item?.count_male)).keys()].map(
                              (index) => (
                                <View
                                  style={[
                                    styles.flex,
                                    styles.justifyContentBetween,
                                    {
                                      paddingHorizontal: 5,
                                      borderColor: "#0070C0",
                                      // borderRadius: 7,
                                      borderWidth: 0.4,
                                      paddingVertical: 10,
                                      maxWidth: "33.33%",
                                      width: "100%",
                                      marginBottom: 5,
                                    },
                                  ]}
                                  key={index}
                                >
                                  <TextInput
                                    style={styles.CheckTextInput}
                                    placeholder="पुरषो"
                                    editable={false}
                                    placeholderTextColor={"#000"}
                                    name={`Male${index + 1}`}
                                  />
                                  <View
                                    style={{
                                      height: 25,
                                      paddingHorizontal: 5,
                                      backgroundColor:
                                        item.status === "Pending"
                                          ? "#44A347"
                                          : "#0099FF",
                                      marginLeft: 5,
                                    }}
                                  >
                                    <TouchableOpacity>
                                      <Text
                                        style={{
                                          textAlign: "center",
                                          marginTop: 5,
                                          color: "#fff",
                                          fontSize: 12,
                                          fontWeight: "600",
                                        }}
                                      >
                                        {item?.status === "Pending"
                                          ? "पेंडिंग"
                                          : item?.status === "Accepted"
                                          ? "स्वीकार "
                                          : item?.status === "Booked"
                                          ? "बुक्ड"
                                          : item?.status === "Ongoing"
                                          ? "जारी है "
                                          : "समाप्त"}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              )
                            )}
                            {[
                              ...Array(parseInt(item?.count_female)).keys(),
                            ].map((index) => (
                              <View
                                style={[
                                  styles.flex,
                                  styles.justifyContentBetween,
                                  {
                                    paddingHorizontal: 5,
                                    borderColor: "#0070C0",
                                    // borderRadius: 7,
                                    borderWidth: 0.4,
                                    paddingVertical: 10,
                                    maxWidth: "33.33%",
                                    width: "100%",
                                    marginBottom: 5,
                                  },
                                ]}
                                key={index}
                              >
                                <TextInput
                                  style={styles.CheckTextInput}
                                  placeholder="महिला"
                                  editable={false}
                                  placeholderTextColor={"#101010"}
                                  name={`Female${index + 1}`}
                                />
                                <View
                                  style={{
                                    height: 25,
                                    paddingHorizontal: 5,
                                    backgroundColor:
                                      item.status === "Pending"
                                        ? "#44A347"
                                        : "#0099FF",
                                    marginLeft: 5,
                                  }}
                                >
                                  <TouchableOpacity>
                                    <Text
                                      style={{
                                        textAlign: "center",
                                        marginTop: 5,
                                        color: "#fff",
                                        fontSize: 12,
                                        fontWeight: "600",
                                      }}
                                    >
                                      {item?.status === "Pending"
                                        ? "पेंडिंग"
                                        : item?.status === "Accepted"
                                        ? "स्वीकार "
                                        : item?.status === "Booked"
                                        ? "बुक्ड"
                                        : item?.status === "Ongoing"
                                        ? "जारी है "
                                        : "समाप्त"}
                                      {/* {item?.status === "Pending"
                                    ? "पेंडिंग"
                                    : "स्वीकार"} */}
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              </View>
                            ))}
                          </>
                        </View>
                      ))}

                      {thekeperKams != 0 &&
                        thekeperKams?.map((item, index) => (
                          <View key={item?.id}>
                            {item.status === "Accepted" && (
                              <View
                                style={{
                                  flexDirection: "row",
                                  flexWrap: "wrap",
                                }}
                              >
                                {[
                                  ...Array(parseInt(item?.count_male)).keys(),
                                ].map((index) => (
                                  <View
                                    style={[
                                      styles.flex,
                                      styles.justifyContentBetween,
                                      {
                                        paddingHorizontal: 5,
                                        borderColor: "#0070C0",
                                        // borderRadius: 7,
                                        borderWidth: 0.4,
                                        paddingVertical: 10,
                                        maxWidth: "33.33%",
                                        width: "100%",
                                        marginBottom: 5,
                                      },
                                    ]}
                                    key={index}
                                  >
                                    <TextInput
                                      style={styles.CheckTextInput}
                                      placeholder="पुरषो"
                                      editable={false}
                                      placeholderTextColor={"#000"}
                                      name={`Male${index + 1}`}
                                    />
                                    <View
                                      style={{
                                        height: 25,
                                        paddingHorizontal: 5,
                                        backgroundColor:
                                          item.status === "Pending"
                                            ? "#44A347"
                                            : "#0099FF",
                                        marginLeft: 5,
                                      }}
                                    >
                                      <TouchableOpacity>
                                        <Text
                                          style={{
                                            textAlign: "center",
                                            marginTop: 5,
                                            color: "#fff",
                                            fontSize: 12,
                                            fontWeight: "600",
                                          }}
                                        >
                                          {item?.status === "Pending"
                                            ? "पेंडिंग"
                                            : item?.status === "Accepted"
                                            ? "स्वीकार "
                                            : item?.status === "Booked"
                                            ? "बुक्ड"
                                            : item?.status === "Ongoing"
                                            ? "जारी है "
                                            : "समाप्त"}
                                          
                                        </Text>
                                      </TouchableOpacity>
                                    </View>
                                  </View>
                                ))}
                                {[
                                  ...Array(parseInt(item?.count_female)).keys(),
                                ].map((index) => (
                                  <View
                                    style={[
                                      styles.flex,
                                      {
                                        paddingHorizontal: 5,
                                        borderColor: "#0070C0",
                                        // borderRadius: 7,
                                        borderWidth: 0.4,
                                        paddingVertical: 10,
                                        maxWidth: "33.33%",
                                        width: "100%",
                                        marginBottom: 5,
                                      },
                                    ]}
                                    key={index}
                                  >
                                    <TextInput
                                      style={{ ...styles.CheckTextInput }}
                                      placeholder="महिला"
                                      editable={false}
                                      placeholderTextColor={"#101010"}
                                      name={`Female${index + 1}`}
                                    />
                                    <View
                                      style={{
                                        height: 25,
                                        paddingHorizontal: 5,
                                        backgroundColor:
                                          item.status === "Pending"
                                            ? "#44A347"
                                            : "#0099FF",
                                        marginLeft: 5,
                                      }}
                                    >
                                      <TouchableOpacity>
                                        <Text
                                          style={{
                                            textAlign: "center",
                                            marginTop: 5,
                                            color: "#fff",
                                            fontSize: 12,
                                            fontWeight: "600",
                                          }}
                                        >
                                          {item?.status === "Pending"
                                            ? "पेंडिंग"
                                            : item?.status === "Accepted"
                                            ? "स्वीकार "
                                            : item?.status === "Booked"
                                            ? "बुक्ड"
                                            : item?.status === "Ongoing"
                                            ? "जारी है "
                                            : "समाप्त"}
                                        </Text>
                                      </TouchableOpacity>
                                    </View>
                                  </View>
                                ))}
                              </View>
                            )}
                          </View>
                        ))}
                    </View>
                  )}
             
                </View>
              )}
            </View>
            <>
              {item.status != "Pending" &&
                usertype &&
                (usertype === "Sahayak" || usertype === "MachineMalik") && (
                  <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                    {[...Array(parseInt(item?.count_male)).keys()].map(
                      (index) => (
                        <View
                          style={[
                            styles.flex,
                            styles.justifyContentBetween,
                            {
                              paddingHorizontal: 5,
                              borderColor: "#0070C0",
                              // borderRadius: 7,
                              borderWidth: 0.4,
                              paddingVertical: 10,
                              maxWidth: "33.33%",
                              width: "100%",
                              marginBottom: 5,
                            },
                          ]}
                          key={index}
                        >
                          <TextInput
                            style={styles.CheckTextInput}
                            placeholder="पुरषो"
                            editable={false}
                            placeholderTextColor={"#000"}
                            name={`Male${index + 1}`}
                          />
                          <View
                            style={{
                              // height: 25,
                              paddingHorizontal: 5,
                              backgroundColor:
                                item.status === "Pending"
                                  ? "#44A347"
                                  : "#0099FF",
                              marginLeft: 5,
                            }}
                          >
                            {thekeperKam.map((item, index) => (
                              <View key={index}>
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
                            ))}
                          </View>
                        </View>
                      )
                    )}
                    {[...Array(parseInt(item?.count_female)).keys()].map(
                      (index) => (
                        <View
                          style={[
                            styles.flex,
                            styles.justifyContentBetween,
                            {
                              paddingHorizontal: 5,
                              borderColor: "#0070C0",
                              // borderRadius: 7,
                              borderWidth: 0.4,
                              paddingVertical: 10,
                              maxWidth: "33.33%",
                              width: "100%",
                              marginBottom: 5,
                            },
                          ]}
                          key={index}
                        >
                          <TextInput
                            style={{ ...styles.CheckTextInput }}
                            placeholder="महिला"
                            editable={false}
                            placeholderTextColor={"#101010"}
                            name={`Female${index + 1}`}
                          />
                          <View
                            style={{
                              // height: 25,
                              paddingHorizontal: 5,
                              backgroundColor:
                                item.status === "Pending"
                                  ? "#44A347"
                                  : "#0099FF",
                              marginLeft: 5,
                            }}
                          >
                            {thekeperKam.map((item, index) => (
                              <View key={index}>
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
                            ))}
                          </View>
                        </View>
                      )
                    )}
                  </View>
                )}
            </>
          
            {item.status === "Pending" && usertype === "Sahayak" && (
              <View>
                <View
                  style={[
                    styles.flex,
                    styles.justifyContentBetween,
                    { justifyContent: "flex-start" },
                  ]}
                >
                  <View
                    style={[
                      {
                        flexWrap: "wrap",
                        justifyContent: "flex-start",
                        flexDirection: "row",
                      },
                    ]}
                  >
                    <>
                      {[...Array(parseInt(item?.count_female)).keys()].map(
                        (index) => (
                          <View
                            style={[
                              styles.flex,
                              styles.justifyContentBetween,
                              {
                                paddingHorizontal: 5,
                                borderColor: "#0070C0",
                                // borderRadius: 7,
                                borderWidth: 0.4,
                                paddingVertical: 10,
                              },
                            ]}
                            key={index}
                          >
                            <TextInput
                              style={styles.CheckTextInput}
                              placeholder="महिला"
                              editable={false}
                              placeholderTextColor={"#101010"}
                              name={`Female${index + 1}`}
                              onChangeText={(text) => {
                                const updatedStatus = { ...checkboxStatus };
                                updatedStatus[index] = text;
                                setCheckboxStatus(updatedStatus);
                              }}
                            />
                            <View
                              style={{
                                paddingBottom: 5,
                                paddingHorizontal: 3,
                                backgroundColor:
                                  checkboxStatus[index] === "Accepted"
                                    ? "#0099FF"
                                    : "#44A347",
                                marginLeft: 5,
                              }}
                            >
                              <TouchableOpacity
                                onPress={() => handleCheckboxChange(index)}
                                disabled={checkboxStatus[index] === "Pending"}
                              >
                                <Text
                                  style={{
                                    textAlign: "center",
                                    marginTop: 5,
                                    color: "#fff",
                                    fontSize: 9,
                                    fontWeight: "600",
                                  }}
                                >
                                  {checkboxStatus[index] || item?.status}
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        )
                      )}
                    </>
                    <>
                      {[...Array(parseInt(item?.count_male)).keys()].map(
                        (index) => (
                          <View
                            style={[
                              styles.flex,
                              // styles.justifyContentBetween,
                              {
                                paddingHorizontal: 3,
                                borderColor: "#0070C0",
                                // borderRadius: 7,
                                borderWidth: 0.4,
                                paddingVertical: 10,
                              },
                            ]}
                            key={index}
                          >
                            <TextInput
                              style={styles.CheckTextInput}
                              placeholder="पुरषो"
                              placeholderTextColor={"#101010"}
                              name={`Male${index + 1}`}
                              editable={false}
                              onChangeText={(text) => {
                                const updatedMaleStatuses = [...maleStatuses];
                                updatedMaleStatuses[index] = text;
                                setMaleStatuses(updatedMaleStatuses);
                              }}
                            />
                            <View
                              style={{
                                paddingBottom: 5,
                                paddingHorizontal: 3,
                                backgroundColor:
                                  maleStatuses[index] === "Accepted"
                                    ? "#0099FF"
                                    : "#44A347",
                                marginLeft: 5,
                              }}
                            >
                              <TouchableOpacity
                                onPress={() => handleAcceptMale(index)}
                                disabled={maleStatuses[index] === "Pending"}
                              >
                                <Text
                                  style={{
                                    textAlign: "center",
                                    marginTop: 5,
                                    color: "#fff",
                                    fontSize: 9,
                                    fontWeight: "600",
                                  }}
                                >
                                  {maleStatuses[index] || item?.status}
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        )
                      )}
                    </>
                  </View>
                </View>

                <View style={[styles.flex, styles.justifyContentBetween]}>
                  <View
                    style={[
                      styles.flex,
                      // styles.justifyContentBetween,
                      { flexWrap: "wrap", marginTop: 20 },
                    ]}
                  ></View>
                </View>
              </View>
            )}
          

            <View style={{ width: "100%" }}>
              {(item.status === "Accepted" || item.status === "Pending") &&
                usertype === "Grahak" && (
                  <>
                    <View
                      style={[
                        styles.inputView,
                        {
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                        },
                      ]}
                    >
                      <TextInput
                        style={styles.TextInput}
                        placeholder="काम की स्थिति"
                        editable={false}
                        placeholderTextColor={"#000"}
                        // onChangeText={(email) => setEmail(email)}
                        // defaultValue={email}
                        // value={email}
                      />

                      <View style={{ marginRight: 10 }}>
                        {thekeperKams != 0 ? (
                          thekeperKams.map((item) => (
                            <View key={item.id}>
                              {item.status === "Completed" ||
                              item.status === "Accepted" ? (
                                <TouchableOpacity>
                                  <Text style={styles.accepted}>
                                    {parseInt(item.count_female) +
                                      parseInt(item.count_male)}
                                    सहायक स्वीकार करे
                                  </Text>
                                </TouchableOpacity>
                              ) : (
                                <TouchableOpacity>
                                  <Text style={styles.pending}>
                                    0 सहायक स्वीकार करें
                                  </Text>
                                </TouchableOpacity>
                              )}
                            </View>
                          ))
                        ) : (
                          <View>
                            {thekeparpending.map((item) => (
                              <TouchableOpacity key={item.id}>
                                <Text style={styles.pending}>
                                  0 सहायक स्वीकार करें
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        )}
                      </View>
                    </View>

                    <View style={{ width: "100%" }}>
                      {thekeperKams.length > 0 ? (
                        thekeperKams.map((item) => (
                          <View key={item.id}>
                            {item.status === "Accepted" ? (
                              <TouchableOpacity
                                style={[styles.BhuktanBtn]}
                                onPress={() =>
                                  navigation.navigate("Payment", {
                                    item,
                                    fawdafee: item?.fawda_fee,
                                    totalamount: item?.total_amount,
                                    useramount: item?.total_amount_sahayak,
                                  })
                                }
                              >
                                <Text
                                  style={[styles.loginText, { color: "#fff" }]}
                                >
                                  भुगतान करें
                                </Text>
                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity
                                style={[styles.BhuktanBtn, { opacity: 0.5 }]}
                                disabled={true}
                              >
                                <Text
                                  style={[styles.loginText, { color: "#fff" }]}
                                >
                                  भुगतान करें
                                </Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        ))
                      ) : (
                        <View>
                          {thekeparpending.map((item) => (
                            <TouchableOpacity
                              style={[styles.BhuktanBtn, { opacity: 0.5 }]}
                              disabled={true}
                            >
                              <Text
                                style={[styles.loginText, { color: "#fff" }]}
                              >
                                भुगतान करें
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      )}
                    </View>
                  </>
                )}
              {item.status === "Completed" && usertype === "Grahak" && (
                <>
                  <View
                    style={[
                      styles.inputView,
                      {
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      },
                    ]}
                  >
                    <TextInput
                      style={styles.TextInput}
                      placeholder="काम की स्थिति"
                      editable={false}
                      placeholderTextColor={"#000"}
                      // onChangeText={(email) => setEmail(email)}
                      // defaultValue={email}
                      // value={email}
                    />

                    <View style={{ marginRight: 10 }}>
                      <TouchableOpacity>
                        <Text style={styles.accepted}>
                          {parseInt(item.count_female) +
                            parseInt(item.count_male)}
                          सहायक समाप्त करे
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={{ width: "100%" }}>
                    {thekeperKams != 0 &&
                      thekeperKams.map(
                        (item) =>
                          item.status === "Completed" && (
                            <TouchableOpacity
                              style={[styles.BhuktanBtn]}
                              disabled={true}
                            >
                              <Text
                                style={[styles.loginText, { color: "#fff" }]}
                              >
                                समाप्त
                              </Text>
                            </TouchableOpacity>
                          )
                      )}
                  </View>
                </>
              )}
            </View>

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
                  (usertype === "Sahayak" || usertype === "MachineMalik") && (
                    <>
                      <CustomComponent
                        label="किसान से वेतन"
                        value={item?.total_amount_sahayak}
                      />
                      <CustomComponent
                        label="फावड़ा की फीस"
                        value={item?.fawda_fee}
                      />
                      <CustomComponent
                        label="आपका भुगतान"
                        value={item?.payment_your}
                      />
                    </>
                  )}
              </>
            </View>
            <View style={{ width: "100%" }}>
              {usertype === "Sahayak" || usertype === "MachineMalik" ? (
                <>
                  <View style={{ marginTop: 10 }}>
                    {item?.status === "Pending" ? (
                      <TouchableOpacity
                        style={styles.BhuktanBtn}
                        onPress={() => acceptSahayak()}
                      >
                        <Text style={[styles.loginText, { color: "#fff" }]}>
                          काम स्वीकार करें
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      thekeperKam?.map((item) => (
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
                                  style={[styles.inputView, { height: 40 }]}
                                >
                                  <Text style={styles.label}>
                                    ग्राहक का नाम
                                  </Text>
                                  <TextInput
                                    style={styles.TextInput}
                                    editable={false}
                                    placeholderTextColor="#848484"
                                    placeholder={item.grahak_name}
                                  />
                                </View>
                                <View
                                  style={[styles.inputView, { height: 40 }]}
                                >
                                  <Text style={styles.label}>फ़ोन:</Text>
                                  <TextInput
                                    style={styles.TextInput}
                                    editable={false}
                                    placeholderTextColor="#848484"
                                    placeholder={item.grahak_phone}
                                  />
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
                                <TouchableOpacity
                                  style={[
                                    styles.BhuktanBtn,
                                    { width: "95%", marginBottom: 10 },
                                  ]}
                                >
                                  <Text
                                    style={[
                                      styles.loginText,
                                      { color: "#fff" },
                                    ]}
                                  >
                                    समाप्त
                                  </Text>
                                </TouchableOpacity>
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
                          {item.status === "Accepted" ||
                            (item.status === "Booked" && (
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
                                    Rejected();
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
                            ))}
                          
                        </View>
                      ))
                    )}
                  </View>
                </>
              ) : null}
            </View>

            <View style={{ marginTop: "auto", padding: 5 }}>
              {usertype === "Grahak" ||
                item.status != "Completed" ||
                ((item.status === "Pending" || "Accepted") && (
                  <>
                    {thekeperKams != 0 &&
                      thekeperKams.map((item) => (
                        <View key={item.booking_id}>
                          {item.status === "Pending" ||
                          item.status === "Accepted" ||
                          item.status != "Completed" ? (
                            <TouchableOpacity
                              style={{
                                backgroundColor: "#D9D9D9",
                                alignSelf: "center",
                                paddingHorizontal: 50,
                                paddingVertical: 10,
                                borderRadius: 5,
                              }}
                              onPress={() => {
                                cancel();
                              }}
                            >
                              <Text
                                style={[styles.loginText, { color: "#fff" }]}
                              >
                                रद्द करें
                              </Text>
                            </TouchableOpacity>
                          ) : null}
                        </View>
                      ))}
                    {thekeparpending?.map((item) => (
                      <View key={item.booking_id}>
                        {item.status === "Pending" ||
                        item.status === "Accepted" ? (
                          <TouchableOpacity
                            style={{
                              backgroundColor: "#D9D9D9",
                              alignSelf: "center",
                              paddingHorizontal: 50,
                              paddingVertical: 10,
                              borderRadius: 5,
                            }}
                            onPress={() => {
                              cancel();
                            }}
                          >
                            <Text style={[styles.loginText, { color: "#fff" }]}>
                              रद्द करें
                            </Text>
                          </TouchableOpacity>
                        ) : null}
                      </View>
                    ))}
                  </>
                ))}
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
    width: "33.33%",
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 0,
    // width: "33.33%",
    borderBottomWidth: 0.4,
    borderLeftWidth: 0.4,
    borderRightWidth: 0.4,
    height: 55,

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

    textAlign: "center",
    backgroundColor: "#fff",
  },
  accepted: {
    textAlign: "center",
    backgroundColor: "#0099FF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  pending: {
    textAlign: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#44A347",
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});
