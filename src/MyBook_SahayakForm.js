import React, { useEffect, useState } from "react";
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
  ActivityIndicator
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import service from "../service";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Toast from 'react-native-simple-toast';
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
  const token = useSelector(selectToken);
  const [thekeperKam, setThekeperKam] = useState({});
  const [ratingList, setRatingList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { id, item } = route.params;
  console.log("fjd", item);
  const [show, setShow] = useState(true);
  const [checkboxStatus, setCheckboxStatus] = useState({});
  const [maleStatuses, setMaleStatuses] = useState({});
  const [totalMaleAccepted, setTotalMaleAccepted] = useState(0);
  const [showFirstView, setShowFirstView] = useState(true);
  const [showSecondView, setShowSecondView] = useState(false);
  const [totalFemaleAccepted, setTotalFemaleAccepted] = useState(0);
  const [acceptedCount, setAcceptedCount] = useState(null);
  const [maleCount, setMaleCount] = useState(null);
  const usertype = useSelector(selectUserType);
  console.log("usrrjfjf", usertype);

  const acceptSahayak = async () => {
    setIsLoading(true);
    let params = {
      count_male: totalMaleAccepted,
      count_female: totalFemaleAccepted,
      job_id: id,
    };
    console.log("jjjdjjdd", params);

    try {
      const response = await service.post("/api/accept_individuals/", params, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token?.access}`,
        },
      });
      const data = response?.data;
      console.log("datadatadatadatadata|||||||||", data);
      navigation.replace("MyBooking", { item, usertype });
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setIsLoading(false); // Hide loader after fetching data
    }
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
  // function handleTotalAccepted() {
  //   const totalAccepted = malecount();
  //   setTotalMaleAccepted(totalAccepted);
  //   console.log("totalMaleAcceptedtotalMaleAccepted", totalMaleAccepted);
  // }

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
          Authorization: `Bearer ${token?.access}`,
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

  useEffect(() => {
    RatingApi();
  }, []);


  const cancel = async() => {

    let params = {};
    if (item.status === "Accepted") {
      params = {
        job_id :item?.id ,
      job_number : item?.job_number,
      booking_id: item?.booking_id,
      status: "Cancelled-After-Payment"
    }
  } else if (item.status === "Pending") {
    params = {
      job_id :item?.id ,
      job_number : item?.job_number,
      // booking_id: item?.booking_id,
      status: "Cancelled"
    }
  }

    try {
      const response = await service.post("/api/cancel/", params, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token?.access}`,
        },
      });
      console.log(token?.access, "token");
      const data = response?.data;
      // setStatus(data.status);
      Toast.show("Cancelled", Toast.LONG);
      console.log("fjfjf", data);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const Rejected = async() => {
    let params = {
      booking_id: item?.booking_id,
      count_male: totalMaleAccepted,
      count_female: totalFemaleAccepted,
      status: "Rejected",
    }

    console.log(params , 'hjdsnjnjdsl');

    try {
      const response = await service.post("/api/rejected/", params, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token?.access}`,
        },
      });
      console.log(token?.access, "token");
      const data = response?.data;
      console.log(data , "sds");
      Toast.show('Rejected', Toast.LONG);
    } catch (error) {
      console.log("Error:", error);
    }
  };
  return (
    <SafeAreaView style={{ backgroundColor: "#fff", flex: 1 }}>
       <View>
        {isLoading && <ActivityIndicator size="small" color="#black" />}
      </View>
      <View style={{ padding: 20, marginTop: 25 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrowleft" size={25} />
        </TouchableOpacity>
      </View>
      <View style={{ justifyContent: "center" }}>
        <Text style={{ textAlign: "center", fontSize: 30, fontWeight: "600" }}>
          {item?.job_type === "individuals_sahayak" ? "सहायक" : ""}
        </Text>
      </View>
      <ScrollView>
      {!isLoading && (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
            marginHorizontal: 10,
          }}
        >
          {/* <View style={[styles.inputView, { height: 80 }]}>
              <Text style={styles.label}>काम का विवरण</Text>
              <TextInput
                style={styles.TextInput}
                placeholderTextColor="#848484"
                placeholder={item?.description}
               
              >
                 <Image
                source={require("../assets/image/edit.png")}
                style={{ width: 20, height: 20, marginTop: 10, right: 10 }}
              />
                </TextInput>
            </View> */}
          <View
            style={[
              styles.inputView,
              styles.flex,
              styles.justifyContentBetween,
              { height: 80 },
            ]}
          >
            <Text style={styles.label}>काम का विवरण</Text>
            <Text style={[styles.TextInput]}>{item?.description}</Text>
            <Image
              source={require("../assets/image/edit.png")}
              style={{ width: 20, height: 20, marginTop: 10, right: 10 }}
            />
          </View>
          {usertype &&
            (usertype === "Sahayak" || usertype === "MachineMalik") && (
              <View style={[styles.inputView, { height: 40 }]}>
                <Text style={styles.label}>गाँव</Text>
                <TextInput
                  style={styles.TextInput}
                  placeholderTextColor="#848484"
                  placeholder={item?.village}
                />
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
              {console.log(
                "fffffffffffffff",
                moment.utc(item?.datetime).format("LT")
              )}
            </Text>
          </View>
          {/* {usertype && usertype === "Grahak" && (
          <View style={styles.inputView}>
            <TextInput
              style={[styles.TextInput]}
              placeholder="काम लिखें १५ शब्दों से कम,नंबर न लिखें "
              placeholderTextColor={"#000"}
            />
          </View>
          )} */}
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
              {item?.land_type}
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
                placeholderTextColor={"#000"}
              />
              <Text style={{ marginRight: 8, color: "#0099FF" }}>
                ₹ {item?.pay_amount_male}
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
                placeholder="एक महिला का वेतन"
                placeholderTextColor={"#000"}
              />
              <Text style={{ marginRight: 20, color: "#0099FF" }}>
                ₹ {item?.pay_amount_female}
              </Text>
            </View>
          </View>
          <View style={styles.flex}>
            <View style={{ width: "70%" }}>
              <Text></Text>
            </View>
            {usertype && usertype === "Grahak" && (
              <View style={[styles.flex, { marginTop: 10 }]}>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#0099FF",
                    marginRight: 10,
                    padding: 5,
                  }}
                >
                  <Text style={[styles.TextWhite, { fontSize: 10 }]}>
                    वेतन बदलें
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#44A347",
                    paddingHorizontal: 10,
                    padding: 5,
                  }}
                >
                  <Text style={[styles.TextWhite, { fontSize: 10 }]}>
                    कन्फर्म
                  </Text>
                </TouchableOpacity>
              </View>
            )}
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
                  placeholderTextColor={"#000"}
                />
                <Text
                  style={{ marginTop: 13, marginRight: 8, color: "#0099FF" }}
                >
                  ₹ {item?.total_amount_sahayak}
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
                <View
                  style={[
                    styles.justifyContentBetween,
                    { flexDirection: "row", flexWrap: "wrap" },
                  ]}
                >
                  <>
                    {[...Array(parseInt(item?.count_male)).keys()].map(
                      (index) => (
                        <View
                          style={[
                            styles.FemalecheckView,
                            styles.flex,
                            styles.justifyContentBetween,
                            { paddingHorizontal: 5 },
                          ]}
                          key={index}
                        >
                          <TextInput
                            style={styles.CheckTextInput}
                            placeholder="पुरषो"
                            placeholderTextColor={"#000"}
                            name={`Male${index + 1}`}
                          />
                          <View
                            style={{
                              height: 25,
                              paddingHorizontal: 5,
                              backgroundColor: "#44A347",
                              marginLeft: 5,
                            }}
                          >
                            <TouchableOpacity>
                              <Text
                                style={{
                                  textAlign: "center",
                                  marginTop: 5,
                                  color: "#fff",
                                  fontSize: 10,
                                  fontWeight: "600",
                                }}
                              >
                                {item?.status}
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
                            styles.FemalecheckView,
                            styles.flex,
                            styles.justifyContentBetween,
                            { paddingHorizontal: 5 },
                          ]}
                          key={index}
                        >
                          <TextInput
                            style={styles.CheckTextInput}
                            placeholder="महिला"
                            placeholderTextColor={"#101010"}
                            name={`Female${index + 1}`}
                          />
                          <View
                            style={{
                              height: 25,
                              paddingHorizontal: 5,
                              backgroundColor: "#44A347",
                              marginLeft: 5,
                            }}
                          >
                            <TouchableOpacity>
                              <Text
                                style={{
                                  textAlign: "center",
                                  marginTop: 5,
                                  color: "#fff",
                                  fontSize: 10,
                                  fontWeight: "600",
                                }}
                              >
                                {item?.status}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      )
                    )}
                  </>
                </View>
                <View>
                  <></>
                </View>
              </View>
            )}
          </View>

          {usertype &&
            (usertype === "Sahayak" || usertype === "MachineMalik") && (
              <View>
                <View style={[styles.flex, styles.justifyContentBetween]}>
                  <View
                    style={[
                      styles.flex,
                      styles.justifyContentBetween,
                      { flexWrap: "wrap" },
                    ]}
                  >
                    <>
                      {[...Array(parseInt(item?.count_female)).keys()].map(
                        (index) => (
                          <View
                            style={[
                              styles.FemalecheckView,
                              styles.flex,
                              styles.justifyContentBetween,
                              { paddingHorizontal: 5, width: "auto" },
                            ]}
                            key={index}
                          >
                            <TextInput
                              style={styles.CheckTextInput}
                              placeholder="महिला"
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
                                height: 25,
                                paddingHorizontal: 5,
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
                                    fontSize: 10,
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
                              styles.FemalecheckView,
                              styles.flex,
                              styles.justifyContentBetween,
                              { paddingHorizontal: 5, width: "auto" },
                            ]}
                            key={index}
                          >
                            <TextInput
                              style={styles.CheckTextInput}
                              placeholder="पुरषो"
                              placeholderTextColor={"#101010"}
                              name={`Male${index + 1}`}
                              onChangeText={(text) => {
                                const updatedMaleStatuses = [...maleStatuses];
                                updatedMaleStatuses[index] = text;
                                setMaleStatuses(updatedMaleStatuses);
                              }}
                            />
                            <View
                              style={{
                                height: 25,
                                paddingHorizontal: 5,
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
                                    fontSize: 10,
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
                      styles.justifyContentBetween,
                      { flexWrap: "wrap", marginTop: 20 },
                    ]}
                  ></View>
                </View>
              </View>
            )}
          <View
            style={[
              styles.flex,
              styles.justifyContentBetween,
              { flexWrap: "wrap" },
            ]}
          ></View>

          {/* end */}
          {usertype && usertype === "Grahak" && (
            <>
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
                  placeholderTextColor={"#000"}
                  // onChangeText={(email) => setEmail(email)}
                  // defaultValue={email}
                  // value={email}
                />

                <View
                  style={{
                    height: 30,
                    backgroundColor: "#44A347",
                    marginRight: 10,
                    marginTop: 8,
                  }}
                >
                  <TouchableOpacity>
                    <Text
                      style={{
                        textAlign: "center",
                        marginTop: 5,
                        paddingHorizontal: 10,
                        color: "#fff",
                        fontSize: 15,
                        fontWeight: "600",
                      }}
                    >
                      {item.status === "Accepted" && TotalCount > 0
                        ? `${TotalCount} सहायक स्वीकार करें`
                        : "0 सहायक स्वीकार करें"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ width: "100%" }}>
                {item.status === "Accepted" && (
                  <TouchableOpacity
                    style={styles.BhuktanBtn}
                    onPress={() =>
                      navigation.navigate("Payment", {
                        item,
                      })
                    }
                  >
                    <Text style={[styles.loginText, { color: "#fff" }]}>
                      भुगतान करें
                    </Text>
                  </TouchableOpacity>
                )}
                {item.status === "Pending" && (
                  <TouchableOpacity
                    style={[styles.BhuktanBtn, { opacity: 0.5 }]}
                    disabled={true}
                  >
                    <Text style={[styles.loginText, { color: "#fff" }]}>
                      भुगतान करें
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </>
          )}
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
          {usertype === "Sahayak" || usertype === "MachineMalik" ? (
            item.status === "Accepted" ? (
              <TouchableOpacity style={styles.BhuktanBtn}>
                <Text style={[styles.loginText, { color: "#fff" }]}>
                  काम स्वीकृत
                </Text>
              </TouchableOpacity>
            ) : item.status === "Pending" ? (
              <TouchableOpacity
                style={styles.BhuktanBtn}
                onPress={() => acceptSahayak(id)}
              >
                <Text style={[styles.loginText, { color: "#fff" }]}>
                  काम स्वीकार करें
                </Text>
              </TouchableOpacity>
            ) : item.status === "Booked" ? (
              <TouchableOpacity style={styles.BhuktanBtn}>
                <Text style={[styles.loginText, { color: "#fff" }]}>
                  काम बुक
                </Text>
              </TouchableOpacity>
            ) : null
          ) : null}
          {item.status === "Completed" && (
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: 20,
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              <TouchableOpacity style={styles.BhuktanBtn}>
                <Text style={[styles.loginText, { color: "#fff" }]}>
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
          {(usertype === "Sahayak" || usertype === "MachineMalik") &&
            (item.status === "Accepted" ? (
              <>
                <View style={[styles.inputView, { height: 40 }]}>
                  <Text style={styles.label}>ग्राहक का नाम</Text>
                  <TextInput
                    style={styles.TextInput}
                    placeholderTextColor="#848484"
                    placeholder={item?.grahak_name}
                  />
                </View>

                <View style={[styles.inputView, { height: 40 }]}>
                  <Text style={styles.label}>फ़ोन:</Text>
                  <TextInput
                    style={styles.TextInput}
                    placeholderTextColor="#848484"
                    placeholder={item?.grahak_phone}
                  />
                </View>
              </>
            ) : null)}

          <TouchableOpacity style={styles.loginBtn}
          onPress={() => {usertype === "Grahak" ? cancel() : Rejected()}}
          >
            <Text style={[styles.loginText, { color: "#fff" }]}>रद्द करें</Text>
          </TouchableOpacity>
        </View>
      )}
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
});
