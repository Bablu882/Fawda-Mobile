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
import Toast from "react-native-root-toast";

import { useDispatch, useSelector } from "react-redux";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import service from "../service";
import { selectToken, selectUserType } from "../slices/authSlice";
import moment from "moment";
import { setTime } from "../slices/SahayakBookingSlice";

const CustomComponent = ({ label, value }) => {
  return (
    <View
      style={[
        styles.inputView,
        styles.inputbox,
        {
          flexDirection: "row",
          justifyContent: "space-around",
          paddingHorizontal: 10,
        },
      ]}
    >
      <TextInput
        style={[styles.TextInput, { width: "100%" }]}
        placeholder={label}
        editable={false}
        placeholderTextColor={"#000"}
      />
      <Text style={{ marginTop: 5, right: 10, color: "#0070C0" }}>{value}</Text>
    </View>
  );
};

function Theke_MachineForm({ navigation, route }) {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const { id, item, totalamount, fawdafee, useramount, jobtype } =
    route?.params ?? {};

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
  const [amount, setAmount] = useState({});
  const [edit, setEdit] = useState(false);
  const [editable, setEditable] = useState(false);
  const [status, setStatus] = useState("");

  const textInputRef = useRef(null);
  const handleClick = () => {
    textInputRef.current.focus();
  };

  const accptThekha = async () => {
    //setIsLoading(true);
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
        Toast.show("काम स्वीकार किया गया है!", Toast.SHORT);
        navigation.navigate("MyBookingStack", { screen: "MyBooking" });
      } else {
        Toast.show("जॉब स्वीकार नहीं हो पा रही है!", Toast.SHORT);
      }
    } catch (error) {
      console.log("Error:", error);
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
      console.log("datadatadatadatadata", response?.data.status);
      // if ( response?.data.status == 200) {
      //   setTimeout(() => {
      //     navigation.navigate("HomeStack", { screen: "HomePage" });
      //   }, 4000);
      //   console.log("vjvjvv",response?.data.status);
      // }

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
  }, []);

  const cancel = async () => {
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
      navigation.navigate("HomeStack", { screen: "HomePage" });
      Toast.show("Job रद्द कर दी गई है", Toast.LONG);

      console.log("cancel api data ", data);
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
      console.log("thekeparbooking", data?.booking_theke_pe_kam);
      console.log("thekeparpending", data?.sahayak_pending_booking_details);
      setIsLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const myjobs = async () => {
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
      console.log("myjobsdata", data);
    } catch (error) {
      console.log("Error:", error);
    }
  };
  const Rejected = async () => {
    let params = {
      booking_id: JSON.stringify(item?.booking_id),
     
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
      console.log(data, "sds");
      Toast.show("Job रद्द कर दी गई है", Toast.LONG);
    } catch (error) {
      console.log("Error:", error);
    }
  };
  useEffect(() => {
    // mybookingdetail();
    //myjobs();
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
                style={{ textAlign: "center", fontSize: 30, fontWeight: "600" }}
              >
                {item?.job_type === "theke_pe_kam"
                  ? "ठेके पर काम"
                  : "ठेके पर काम"}
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
              {usertype &&
                (usertype === "Sahayak" || usertype === "MachineMalik") && (
                  <View
                    style={[
                      styles.inputView,
                      styles.inputbox,
                      { flexDirection: "row", justifyContent: "space-between" },
                    ]}
                  >
                    <Text style={styles.label}>भूमि क्षेत्र</Text>
                    <TextInput
                      style={styles.TextInput}
                      placeholderTextColor="#848484"
                      placeholder=""
                    />
                    <Text style={{ marginTop: 5, right: 10, color: "#0070C0" }}>
                      {item?.land_area}
                      {item?.land_type == "Bigha" ? "बीघा" : "किल्ला"}
                    </Text>
                  </View>
                )}
              <View></View>
              {/* {usertype === "Grahak" && (
           
          )} */}

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
                      <Text style={{ right: 10, color: "#0070C0" }}>
                        {item?.land_area}
                        {item?.land_type == "Bigha" ? "बीघा" : "किल्ला"}
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
                          <TextInput
                            editable={edit}
                            ref={textInputRef}
                            onChangeText={(amount) => setAmount(amount)}
                            value={amount}
                            keyboardType="numeric"
                            style={{ paddingRight: 10 }}
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
                            }}
                          >
                            ₹ {totalamount}
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
                                  style={[styles.TextWhite, { fontSize: 12 }]}
                                >
                                  वेतन बदलें
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => Edit()}
                                style={{
                                  backgroundColor: "#44A347",
                                  paddingHorizontal: 10,
                                  paddingTop: 4,
                                }}
                              >
                                <Text
                                  style={[styles.TextWhite, { fontSize: 12 }]}
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
                                { color: "#fff", paddingVertical: 10 },
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
                          value={item?.total_amount_theka}
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
                      {console.log("thekeparkaam", thekeperKam)}
                      {item?.status === "Pending" ? (
                        <TouchableOpacity
                          style={styles.BhuktanBtn}
                          onPress={() => accptThekha()}
                        >
                          <Text style={[styles.loginText, { color: "#fff" }]}>
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

              <View style={{ width: "100%" }}></View>
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
                          cancel();
                        }}
                      >
                        <Text style={[styles.loginText, { color: "#fff" }]}>
                          रद्द करें
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
                 {thekeperKams != 0 && thekeperKams?.map((item) => (
                  
                  <View>
                    {item.status == "Pending" || item.status === "Accepted" && (
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
                    )}
                  </View>
                ))}
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
    padding: 10,
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
    width: "50%",
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
  salaryAmount: {
    marginTop: 13,
    marginRight: 8,
    color: "#0099FF",
  },
  label: {
    position: "absolute",
    top: -10,
    left: 30,
    marginHorizontal: 5,

    textAlign: "center",
    backgroundColor: "#fff",
  },
});
