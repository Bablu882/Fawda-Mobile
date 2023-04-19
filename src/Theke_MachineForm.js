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
  ActivityIndicator,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import Toast from "react-native-simple-toast";
import { useDispatch, useSelector } from "react-redux";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import service from "../service";
import { selectToken, selectUserType } from "../slices/authSlice";
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
  const { id, item, totalamount, fawdafee } = route?.params ?? {};
  console.log("fjd", item, totalamount, fawdafee);
  const [ratingList, setRatingList] = useState([]);
  console.log("rating", item, item?.rating);
  const usertype = useSelector(selectUserType);
  console.log("usrrjfjf", usertype);
  const [isLoading, setIsLoading] = useState(false);
  const [colors, setColors] = useState(Array(10).fill("white"));
  const [checked, setChecked] = React.useState("first");
  const [thekeperKam, setThekeperKam] = useState({ status: "pending" });

  const [amount, setAmount] = useState({});
  const [edit, setEdit] = useState(false);
  const [editable, setEditable] = useState(false);
  const [status, setStatus] = useState("");

  const textInputRef = useRef(null);
  const handleClick = () => {
    textInputRef.current.focus();
  };

  console.log("fnfjff", item, item.booking_id);
  const accptThekha = async () => {
    setIsLoading(true);
    let params = {
      job_id: item?.id,
    };
    console.log("jjff", params);
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
        navigation.replace("MyBooking");
      } else {
        Toast.show("जॉब स्वीकार नहीं हो पा रही है!", Toast.SHORT);
      }
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setIsLoading(false); // Hide loader after fetching data
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
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  //   };
  const RatingApi = async () => {
    setIsLoading(true);
    let params = {
      booking_job: item?.booking_id,
    };
    console.log("fjnfjfjfjf", params);

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
      console.log("fjkdfjkdffjk", data);
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
      setIsLoading(false);
    }
  };

  useEffect(() => {
    RatingApi();
  }, []);

  const cancel = async () => {
    let params = {};
    if (item.booking_status === "Accepted") {
      params = {
        job_id: item?.id,
        job_number: item?.job_number,
        booking_id: item?.booking_id,
        status: "Cancelled",
      };
    } else if (item.status === "Pending") {
      params = {
        job_id: item?.id,
        job_number: item?.job_number,
        // booking_id: item?.booking_id,
        status: "Cancelled",
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
      Toast.show("Cancelled", Toast.LONG);

      console.log("fjfjf", data);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const Rejected = async () => {
    let params = {
      booking_id: JSON.stringify(item?.booking_id),
      status: "Rejected",
    };

    console.log(params, "hjdsnjnjdsl");

    try {
      const response = await service.post("/api/rejected/", params, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(token?.access, "token");
      const data = response?.data;
      navigation.replace("HomePage");
      console.log(data, "sds");
      Toast.show("Rejected", Toast.LONG);
    } catch (error) {
      console.log("Error:", error);
    }
  };

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

      <ScrollView horizontal={false} showsVerticalScrollIndicator={false}>
        {!isLoading && (
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
                <Text style={[styles.TextInput]}>{item.description}</Text>
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
                      {item?.status === "Pending" ? (
                        <>
                          <TextInput
                            style={styles.TextInput}
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
                  {item.status === "Pending" && (
                    <View
                      style={[
                        styles.flex,
                        { marginTop: 10, justifyContent: "space-between" },
                      ]}
                    >
                      <View style={{ width: "60%" }}></View>
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
                          <Text style={[styles.TextWhite, { fontSize: 12 }]}>
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
                          <Text style={[styles.TextWhite, { fontSize: 12 }]}>
                            कन्फर्म
                          </Text>
                        </TouchableOpacity>
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
                      placeholderTextColor={"#000"}
                    />
                    <View style={{ width: "30%", marginRight: 10 }}>
                      {item?.status === "Pending"
                        ? getStatusButton(item.status, "पेंडिंग")
                        : item?.booking_status === "Accepted"
                        ? getStatusButton(item?.booking_status, "स्वीकार")
                        : item?.booking_status === "Booked"
                        ? getStatusButton(item.booking_status, "बुक्ड")
                        : item?.booking_status === "Ongoing"
                        ? getStatusButton(item.booking_status, "जारी है ")
                        : item?.booking_status === "Completed"
                        ? getStatusButton(item.booking_status, "समाप्त")
                        : null}
                    </View>
                  </View>
                  {item.booking_status === "Accepted" && (
                    <TouchableOpacity
                      style={styles.BhuktanBtn}
                      onPress={() =>
                        navigation.navigate("Payment", {
                          item, fawdafee, totalamount
                        })
                      }
                    >
                      <Text style={[styles.loginText, { color: "#fff" }]}>
                        भुगतान करें
                      </Text>
                    </TouchableOpacity>
                  )}
                  {item.status === "Pending" && (
                    <TouchableOpacity style={styles.BhuktanBtn}>
                      <Text style={[styles.loginText, { color: "#fff" }]}>
                        भुगतान करें
                      </Text>
                    </TouchableOpacity>
                  )}
                  {item.booking_status === "Booked" && (
                    <TouchableOpacity
                      style={[styles.BhuktanBtn]}
                      disabled={true}
                    >
                      <Text style={[styles.loginText, { color: "#fff" }]}>
                        काम बुक
                      </Text>
                    </TouchableOpacity>
                  )}
                  {item?.booking_status === "Ongoing" && (
                    <TouchableOpacity
                      style={[styles.BhuktanBtn]}
                      disabled={true}
                    >
                      <Text style={[styles.loginText, { color: "#fff" }]}>
                        काम जारी
                      </Text>
                    </TouchableOpacity>
                  )}
                  {item?.booking_status === "Completed" && (
                    <TouchableOpacity
                      style={[styles.BhuktanBtn]}
                      disabled={true}
                    >
                      <Text style={[styles.loginText, { color: "#fff" }]}>
                        समाप्त
                      </Text>
                    </TouchableOpacity>
                  )}
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
              {usertype === "Sahayak" || usertype === "MachineMalik" ? (
                <>
                  {item.status === "Accepted" && (
                    <TouchableOpacity style={styles.BhuktanBtn}>
                      <Text style={[styles.loginText, { color: "#fff" }]}>
                        काम स्वीकृत
                      </Text>
                    </TouchableOpacity>
                  )}
                  {item.status === "Pending" && (
                    <TouchableOpacity
                      style={styles.BhuktanBtn}
                      onPress={() => accptThekha()}
                    >
                      <Text style={[styles.loginText, { color: "#fff" }]}>
                        काम स्वीकार करें
                      </Text>
                    </TouchableOpacity>
                  )}
                  {item.status === "Booked" && (
                    <TouchableOpacity style={styles.BhuktanBtn}>
                      <Text style={[styles.loginText, { color: "#fff" }]}>
                        काम बुक
                      </Text>
                    </TouchableOpacity>
                  )}
                  {item.status === "Ongoing" && (
                    <TouchableOpacity style={styles.BhuktanBtn}>
                      <Text style={[styles.loginText, { color: "#fff" }]}>
                        जारी है
                      </Text>
                    </TouchableOpacity>
                  )}
                  {item.status === "Completed" && (
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
                </>
              ) : null}

              {/* {usertype === "Sahayak" ||
                (usertype === "MachineMalik" && item.status === "Completed" && (
                  <View
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginTop: 20,
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
                ))} */}

              {(usertype === "Sahayak" || usertype === "MachineMalik") &&
              (item.status === "Booked" || item.status === "Ongoing") ? (
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
              ) : null}
            </View>

            <View style={{ marginTop: "auto", padding: 5 }}>
              {(usertype === "Sahayak" || usertype === "MachineMalik") &&
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
                      usertype === "Grahak" ? cancel() : Rejected();
                    }}
                  >
                    <Text style={[styles.loginText, { color: "#fff" }]}>
                      रद्द करें
                    </Text>
                  </TouchableOpacity>
                )}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
export default Theke_MachineForm;

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
