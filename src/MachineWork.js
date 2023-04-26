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
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import BottomTab from "../Component/BottomTab";
import service from "../service";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { selectToken, selectUserType } from "../slices/authSlice";
import Toast from "react-native-simple-toast";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
const CustomComponent = ({ label, value }) => {
  return (
    <View
      style={[
        styles.inputView,
        styles.inputbox,
        {
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          flex: 1,
        },
      ]}
    >
      <TextInput
        style={[styles.TextInput, { width: "100%", left: 10 }]}
        placeholder={label}
        editable={false}
        placeholderTextColor={"#000"}
      />
      <Text style={{ marginTop: 5, right: 20, color: "#0070C0" }}>{value}</Text>
    </View>
  );
};

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
  const [amount, setAmount] = useState(totalamount);
  const [edit, setEdit] = useState(false);
  const textInputRef = useRef(null);

  const onEditPress = () => {
    setEdit(true);
    textInputRef?.current?.focus();
  };

  const onAcceptPress = async () => {
    try {
      // setIsLoading(true);
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
      } else {
        Toast.show("राशि अपडेट नहीं की गई है।", Toast.LONG);
      }
    } catch (error) {
      console.log(error);
    }
   
  };

  const accptThekha = async () => {
    // setIsLoading(true);
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
        Toast.show("काम स्वीकार किया गया है!", Toast.SHORT);
        navigation.navigate("MyBookingStack", { screen: "MyBooking" });
      } else {
        Toast.show("जॉब स्वीकार नहीं हो पा रही है!", Toast.SHORT);
      }
      
    } catch (error) {
      console.log("Error:", error);
    }
    
  };

  const RatingApi = async () => {
    // setIsLoading(true);
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
    }
    //  finally {
    //   setIsLoading(false); // Hide loader after fetching data
    // }
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
      navigation.navigate("HomeStack", { screen: "HomePage" });
      Toast.show("Job रद्द कर दी गई है", Toast.LONG);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const Rejected = async () => {
    let params = {
      booking_id: JSON.stringify(item?.booking_id),
      count_male: 1,
      count_female:1,
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
      navigation.replace("HomePage");

      Toast.show("Job रद्द कर दी गई है", Toast.LONG);
    } catch (error) {
      console.log("Error:", error);
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
                    <View style={[styles.inputView, { height: 40 }]}>
                      <Text style={styles.label}>गाँव</Text>
                      <Text style={[styles.TextInput, { color: "#848484" }]}>
                        {item?.village}
                      </Text>
                      {/* <TextInput
                    style={styles.TextInput}
                    placeholderTextColor="#848484"
                    placeholder={item?.village}
                  /> */}
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
                          color: "#0070C0",
                        }}
                      >
                        {item?.land_area}
                        {item?.land_type == "Bigha" ? "बीघा" : "किल्ला"}
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
                          color: "#0070C0",
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
                        { marginHorizontal: 10 },
                      ]}
                    >
                      <Text style={{ marginLeft: 10 }}>वेतन</Text>
                      {edit ? (
                        <TextInput
                          style={[styles.TextInput, { marginRight: 10 }]}
                          placeholder=""
                          ref={textInputRef}
                          onChangeText={(amount) => setAmount(amount)}
                          value={amount}
                          keyboardType="numeric"
                          placeholderTextColor={"#000"}
                        />
                      ) : (
                        <View>
                          <Text style={[styles.Text, { marginRight: 10 }]}>
                            {item?.total_amount_machine}
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
                                onAcceptPress();
                              }}
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
                            value={item?.total_amount_machine}
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
                                  onPress={() =>
                                    navigation.navigate("Payment", {
                                      item,
                                      fawdafee: item?.fawda_fee,
                                      totalamount: item?.total_amount,
                                      useramount: item?.total_amount_machine,
                                    })
                                  }
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
                              onPress={() => accptThekha()}
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
                                          placeholderTextColor="#848484"
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
                                          marginTop:10
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
                    ))}
                </View>
              </View>
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
            {/* <View style={{ marginTop: "auto", padding: 5 }}>
            {usertype === "Sahayak" || usertype === "MachineMalik" ? (
              (item?.status === "Accepted" || item?.status === "Booked") && (
                <TouchableOpacity
                  style={{
                    backgroundColor: "#D9D9D9",
                    alignSelf: "center",
                    paddingHorizontal: 50,
                    paddingVertical: 10,
                    borderRadius: 5,
                  }}
                  onPress={() => {
                    Rejected();
                  }}
                >
                  <Text style={[styles.loginText, { color: "#fff" }]}>
                    रद्द करें
                  </Text>
                </TouchableOpacity>
              )
            ) : (
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
          </View> */}
          </View>
          {/* )} */}
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

    textAlign: "center",
    backgroundColor: "#fff",
  },
});
