import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
  BackHandler,
  AppState,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import Icon from "react-native-vector-icons/AntDesign";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { selectToken, selectUserType } from "../slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import service from "../service";
import { useNavigation } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

import moment from "moment";

export default function Homepage({ navigation, route }) {
  const [refreshing, setRefreshing] = useState(false);
  const [currentUsers, setCurrentUsers] = useState([]);
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeButton, setActiveButton] = useState("");
  const [sahayak, setSahayak] = useState("");
  const isFocused = useIsFocused();
  const [page, setPage] = useState(1);
  const [expotoken, setExpoToken] = useState();
  const [activeButtons, setActiveButtons] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const usertype = useSelector(selectUserType);
  console.log("usrrjfjf", usertype);

  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };
  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };
  const handlePress = (buttonIndex) => {
    setActiveButtons(buttonIndex);
  };
  const registerForPushNotificationsAsync = async () => {
    if (Device.isDevice) {
      const status = await Notifications.getPermissionsAsync();
      console.log(status.status);
      if (status.status !== "granted") {
        console.log("Permission is not granted");
      } else {
        try {
          const expoPushToken = await Notifications.getExpoPushTokenAsync({
            projectId: "748e67ac-6fec-4f34-99b6-aa8198d3adc4",
          });
          const etoken = expoPushToken.data;
          setExpoToken(etoken);
          return etoken;
        } catch (error) {
          console.log("Error", error);
          console.log("Error message", error.message);
        }
      }
    } else {
      console.log("Must use physical device for Push Notifications");
      return null;
    }
  };

  const fetchExpoToken = async () => {
    const expoToken = await registerForPushNotificationsAsync();
    if (expoToken) {
      const tokenData = {
        push_token: expoToken,
      };
      try {
        const response = await service.post("/api/expotoken-save/", tokenData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const expoResponse = response.data;
        console.log("Response exponoti", expoResponse);
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Token not available");
    }
  };
  console.log("expoToken", expotoken);

  const fetchJobs = async () => {
    setIsLoading(true); // Show loader while fetching data
    setRefreshing(true);
    console.log("Beartoken", token);
    try {
      const cacheBuster = new Date().getTime();
      // console.log("catchhhhhhh", cacheBuster); // generate a unique timestamp
      const response = await service.get(
        `/api/nearjob/?page=${page}&cacheBuster=${cacheBuster}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;
      console.log("userData", data);
      setCurrentUsers(data.results);
      setTotalPages(data.total_pages);
    } catch (error) {
      console.log("Error:", error.status);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchJobs().then(() => {
      setRefreshing(false);
    });
  }, []);

  useEffect(() => {
    if (isFocused) {
      fetchJobs();
    }
  }, [page, isFocused]);

  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    fetchExpoToken();
  }, []);

  useEffect(() => {
    getKey();
  });
  const getKey = async () => {
    const Key = await AsyncStorage.getItem("key");
    console.log(Key);
    if (Key === "Booked" || Key === "Grahak") {
      navigation.navigate("MyBookingStack", {
        screen: "MyBooking",
      });
      await AsyncStorage.removeItem("key");
    }
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: "#fff",
        flex: 1,
      }}
    >
      <View style={{ padding: 20, marginTop: 25 }}></View>
      <View>
        {isLoading && <ActivityIndicator size="small" color="#black" />}
      </View>
      {!isLoading && (
        <ScrollView
          horizontal={false}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              // Myjobs={Myjobs}
            />
          }
        >
          {usertype === "Sahayak" || usertype === "MachineMalik" ? (
            <>
              <View
                style={
                  {
                    // justifyContent: "center",
                    // alignItems: "center",
                    // flex: 1,
                  }
                }
              >
                <View style={{ justifyContent: "center", flex: 1 }}>
                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: 30,
                      fontWeight: "600",
                    }}
                  >
                    {usertype === "Sahayak"
                      ? "ठेकेदार/सहायक के  काम "
                      : usertype === "MachineMalik"
                      ? "मशीन के काम "
                      : null}
                  </Text>
                </View>

                <View
                  style={{
                    // borderTopWidth: 0.7,
                    // borderTopColor: "#0099FF",
                    width: "100%",
                    top: 40,
                  }}
                />
                {currentUsers?.length > 0 && (
                  <>
                    {currentUsers.map((item, index) =>
                      item.status === "Pending" ? (
                        <View key={index}>
                          <View style={[styles.flex, { paddingVertical: 15 }]}>
                            <View style={[styles.DoubleView]}>
                              <View style={styles.bookingLeft}>
                                {item.job_type === "individuals_sahayak" ||
                                item.job_type === "theke_pe_kam" ? (
                                  <>
                                    <Text style={styles.bookingTitle}>
                                      {
                                        <Text style={styles.bookingTitle}>
                                          {item.job_type ===
                                          "individuals_sahayak"
                                            ? "सहायक के काम "
                                            : item.job_type === "theke_pe_kam"
                                            ? "ठेकेदार"
                                            : ""}
                                        </Text>
                                      }
                                    </Text>
                                  </>
                                ) : (
                                  <Text style={styles.bookingTitle}>
                                    {/* {item?.machine === "Harvesting"
                                    ? "काटना"
                                    : item?.work_type === "Sowing"
                                    ? "बुवाई"
                                    : "भूमि की तैयारी"} */}
                                    {item?.machine}
                                  </Text>
                                )}
                                {/* <Text style={styles.bookingTitle}>{item.job_type ==="individuals_sahayak" ? 'सहायक के  काम ': item.job_type ==="individuals_sahayak" ? 'ठेकेदार': item.job_type ==="machine_malik" ? '':''}</Text> */}

                                <Text style={{ color: "black" }}>
                                  {moment(item?.datetime).format("DD/MM/YYYY")}
                                </Text>
                              </View>
                            </View>
                            <View style={[styles.DoubleView]}>
                              <View
                                style={{ flexDirection: "row", marginLeft: 20 }}
                              >
                                <View
                                  style={[
                                    styles.bookingButton,
                                    {
                                      marginRight: 10,
                                    },
                                  ]}
                                >
                                  <Text style={styles.bookingButtonText}>
                                    विवरण देखे
                                  </Text>
                                </View>
                                <TouchableOpacity
                                  onPress={() => {
                                    if (
                                      item.job_type === "individuals_sahayak"
                                    ) {
                                      navigation.navigate(
                                        "MyBook_SahayakForm",
                                        {
                                          id: item.id,
                                          item,
                                          usertype,
                                        }
                                      );
                                    } else if (
                                      item.job_type === "theke_pe_kam"
                                    ) {
                                      navigation.navigate("Theke_MachineForm", {
                                        id: item.id,
                                        item,
                                        usertype,
                                      });
                                    } else {
                                      navigation.navigate("MachineWork", {
                                        id: item.id,
                                        item,
                                        usertype,
                                      });
                                    }
                                  }}
                                  style={{ marginTop: 15, marginRight: 15 }}
                                >
                                  <Icon name="right" size={20}></Icon>
                                </TouchableOpacity>
                              </View>
                            </View>
                          </View>
                        </View>
                      ) : null
                    )}
                    <View style={styles.line} />
                  </>
                )}

                <View
                  style={{
                    borderTopWidth: 0.7,
                    borderTopColor: "#0099FF",
                    width: "100%",
                    marginTop: 15,
                  }}
                />
              </View>
              {totalPages > 1 && (
                <View
                  style={{
                    marginVertical: 20,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginHorizontal: 10,
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity
                      style={[
                        styles.button,
                        activeButtons === 1 && styles.activeButton,
                      ]}
                      onPress={() => {
                        handlePress(1), handlePrevPage();
                      }}
                    >
                      <Icon
                        name="left"
                        size={20}
                        color={"#fff"}
                        style={{ lineHeight: 30 }}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        { marginLeft: 10 },
                        styles.button,
                        activeButtons === 2 && styles.activeButton,
                      ]}
                      onPress={() => {
                        handlePress(2), handleNextPage();
                      }}
                    >
                      <Icon
                        name="right"
                        size={20}
                        color={"#fff"}
                        style={{ lineHeight: 30 }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </>
          ) : (
            <>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  marginVertical: 50,
                }}
              >
                <Image
                  source={require("../assets/image/Fawda-logo.png")}
                  style={{ width: 200, height: 200, alignItems: "center" }}
                />

                <View style={{ alignItems: "center" }}>
                  <Text
                    style={{
                      fontSize: 28,
                      fontWeight: "600",
                      color: "#000",
                      fontFamily: "Devanagari-regular",
                    }}
                  >
                    कौनसी सेवा चाहिए
                  </Text>
                </View>

                <View style={styles.OptionButton}>
                  <TouchableOpacity
                    style={[
                      styles.machine,
                      activeButton === "सहायक"
                        ? { backgroundColor: "#44A347", borderColor: "#44A347" }
                        : null,
                    ]}
                    onPress={() => {
                      setShow(true), setActiveButton("सहायक");
                    }}
                  >
                    <Text
                      style={[
                        { fontFamily: "Devanagari-regular" },
                        styles.loginText,
                        activeButton === "सहायक" ? { color: "#fff" } : null,
                      ]}
                    >
                      सहायक
                    </Text>
                    <Text
                      style={[
                        { fontFamily: "Devanagari-regular" },
                        styles.loginText,
                        activeButton === "सहायक" ? { color: "#fff" } : null,
                      ]}
                    >
                      (मजदूर )
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.machine,
                      activeButton === "मशीन"
                        ? { backgroundColor: "#44A347", borderColor: "#44A347" }
                        : null,
                    ]}
                    onPress={() => {
                      setShow(false), setActiveButton("मशीन");
                    }}
                  >
                    <Text
                      style={[
                        { fontFamily: "Devanagari-regular" },
                        styles.loginText,
                        activeButton === "मशीन" ? { color: "#fff" } : null,
                      ]}
                    >
                      मशीन
                    </Text>
                  </TouchableOpacity>
                </View>
                {show && (
                  <View style={styles.OptionButton}>
                    <TouchableOpacity
                      style={[
                        styles.machine,
                        sahayak === "ठेके पर काम"
                          ? {
                              backgroundColor: "#44A347",
                              borderColor: "#44A347",
                            }
                          : null,
                      ]}
                      onPress={() => {
                        setSahayak("ठेके पर काम");
                      }}
                    >
                      <Text
                        style={[
                          { fontFamily: "Devanagari-regular" },
                          styles.loginText,
                          sahayak === "ठेके पर काम" ? { color: "#fff" } : null,
                        ]}
                      >
                        ठेके पर काम
                      </Text>
                      {/* <Text style={styles.loginText}>(मजदूर )</Text> */}
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.machine,
                        sahayak === "सहायक"
                          ? {
                              backgroundColor: "#44A347",
                              borderColor: "#44A347",
                            }
                          : null,
                      ]}
                      onPress={() => {
                        setSahayak("सहायक");
                      }}
                    >
                      <Text
                        style={[
                          { fontFamily: "Devanagari-regular" },
                          styles.loginText,
                          sahayak === "सहायक" ? { color: "#fff" } : null,
                        ]}
                      >
                        सहायक
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
                <TouchableOpacity
                  onPress={() => {
                    activeButton === "मशीन"
                      ? navigation.navigate("MachineBooking")
                      : sahayak === "सहायक"
                      ? navigation.navigate("SahayakForm")
                      : sahayak === "ठेके पर काम"
                      ? navigation.navigate("Thekeparkaam")
                      : null;
                  }}
                  style={styles.loginBtn}
                >
                  <Text style={styles.VerifyText}>आगे बढ़ें</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Devanagari-regular",
  },
  left: {
    marginLeft: 30,
  },
  right: {
    width: "30%",
    height: 33,
    backgroundColor: "#44A347",
    marginRight: 20,
    marginTop: 10,
  },
  title: {
    fontWeight: "600",
    fontSize: 18,
    fontFamily: "Devanagari-regular",
  },
  date: {
    color: "black",
  },
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 15,
    fontFamily: "Devanagari-regular",
  },
  bookingButton: {
    width: "65%",
    height: 33,
    backgroundColor: "#44A347",
    // marginRight: 20,
    marginTop: 10,
    // marginRight: 40,
  },
  bookingButtonText: {
    textAlign: "center",
    marginTop: 7,
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "Devanagari-regular",
  },
  OptionButton: {
    // flex:1,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
    fontFamily: "Devanagari-regular",
    // margin:20,
    //   padding:20
  },

  bookingLeft: {
    marginLeft: 30,
  },
  bookingTitle: {
    fontWeight: "600",
    fontFamily: "Devanagari-bold",
    fontSize: 18,
    // color:"#000"
  },
  CountryCode: {
    // borderColor: "#0070C0 ",
    backgroundColor: "#0070C0",
    borderTopLeftRadius: 7,
    borderBottomLeftRadius: 7,
    width: "15%",
    height: 45,
    alignItems: "center",
    // borderWidth:1
  },
  codeText: {
    color: "#fff",
    textAlign: "center",
    justifyContent: "center",
    lineHeight: 44,
    fontWeight: "600",
  },
  inputView: {
    borderColor: "#0070C0",
    borderTopRightRadius: 7,
    borderBottomRightRadius: 7,
    width: "65%",

    height: 45,
    borderWidth: 1,
    fontFamily: "Devanagari-regular",
  },

  TextInput: {
    height: 50,
    padding: 10,

    // fontFamily: "Poppin-Light"
  },
  booking: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },

  machine: {
    width: "35%",
    flexDirection: "row",
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

  loginText: {
    color: "#000",
    fontSize: 16,
    //   flexDirection:"column",
  },

  loginBtn: {
    width: "90%",
    borderRadius: 7,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    backgroundColor: "#0099FF",
  },

  VerifyText: {
    color: "#fff",
  },
  button: {
    width: 30,
    height: 30,
    textAlign: "center",
    borderRadius: 20,
    alignItems: "center",
    backgroundColor: "#ccc",
  },
  activeButton: {
    backgroundColor: "#0099FF",
  },
  DoubleView: {
    // borderColor: "#0099FF",
    // borderRadius: 7,
    // borderBottomRightRadius: 7,
    width: "50%",
    height: 48,
    marginHorizontal: 10,
    marginTop: 30,
    // borderWidth: 1,
  },
  flex: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
});
