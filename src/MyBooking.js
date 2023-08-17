import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  FlatList,
  StyleSheet,
} from "react-native";
import { BackHandler } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import { useDispatch, useSelector } from "react-redux";
import service from "../service";
import {
  selectIsLoggedIn,
  setToken,
  selectToken,
  selectUserType,
} from "../slices/authSlice";
import moment from "moment";
import { useIsFocused } from "@react-navigation/native";

export default function MyBooking({ navigation, route }) {
  const usertype = useSelector(selectUserType);
  console.log("usrrjfjf", usertype);
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  const token = useSelector(selectToken);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [machineBooking, setMachineBooking] = useState([]);
  const [page, setPage] = useState(1);
  const [activeButton, setActiveButton] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [machinePending, setMachinePending] = useState([]);
  const [sahayakPending, setSahayakPending] = useState([]);
  const [sahaykBooking, setSahayakBooking] = useState([]);
  const [myjob, setMyjob] = useState({});
  //=====api integration of MyBooking======//

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
    setActiveButton(buttonIndex);
  };
  const booking = async () => {
    setIsLoading(true); // set isLoading to true when the function starts
    setRefreshing(true);
    console.log("token", token);
    try {
      const cacheBuster = new Date().getTime();
      console.log("cacheBuster", cacheBuster);
      // generate a unique timestamp
      const response = await service.get(
        `api/my_booking_details/?cacheBuster=${cacheBuster}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;
      console.log("Data", data);
      setSahayakPending(data?.sahayak_pending_booking_details);
      setSahayakBooking(data?.sahayk_booking_details?.bookings);
      setMachineBooking(data?.machine_malik_booking_details);
      setMachinePending(data?.machine_malik_pending_booking_details);
      setIsLoading(false);
      setRefreshing(false);

      // console.log("data::::::::", data?.sahayk_booking_details?.bookings);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const Myjobs = async () => {
    setIsLoading(true);
    setRefreshing(true);
    try {
      const cacheBuster = Date.now();
      const response = await service.get(
        `/api/myjobs/?page=${page}&cacheBuster=${cacheBuster}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;
      setMyjob(data?.data?.results);
      setTotalPages(data?.data?.total_pages);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    Myjobs();
    if (isFocused) {
      Myjobs();
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

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Myjobs().then(() => {
      setRefreshing(false);
    });
    booking().then(() => {
      setRefreshing(false);
    });
  }, []);
  useEffect(() => {
    if (isFocused) {
      booking();
    }
  }, [isFocused]);
  return (
    <SafeAreaView style={{ backgroundColor: "#fff", flex: 1 }}>
      <View style={{ padding: 20, marginTop: 25 }}>
        {/* <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrowleft" size={25} />
        </TouchableOpacity> */}
      </View>
      {isLoading && <ActivityIndicator size="small" color="#black" />}
      {!isLoading && (
        <ScrollView
          horizontal={false}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* {usertype && usertype === "Grahak" && (
        
        )} */}
          <View>
            {usertype && usertype === "Grahak" && (
              <>
                <View style={{ justifyContent: "center" }}>
                  <View style={{ justifyContent: "center" }}>
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: 30,
                        fontWeight: "600",
                        fontFamily: "Devanagari-bold",
                      }}
                    >
                      मेरी बुकिंग
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
                  <>
                    {sahaykBooking?.length > 0 &&
                      sahaykBooking.map((sahayak, index) => {
                        const firstSahayak = sahayak.sahayaks[0];

                        return (
                          <View
                            key={index}
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              width: "100%",
                              justifyContent: "space-between",
                              marginTop: 20,
                            }}
                          >
                            <View style={[styles.DoubleView]}>
                              <View style={{ marginLeft: 20 }}>
                                <Text
                                  style={{
                                    fontWeight: "600",
                                    fontSize: 18,
                                    color: "#000",
                                    fontFamily: "Devanagari-bold",
                                  }}
                                >
                                  {sahayak.job_type === "individuals_sahayak"
                                    ? "सहायक"
                                    : sahayak.job_type === "theke_pe_kam"
                                    ? "ठेके पर काम"
                                    : ""}
                                </Text>

                                <Text
                                  style={{
                                    color: "black",
                                    fontFamily: "Devanagari-regular",
                                  }}
                                >
                                  {moment(firstSahayak?.datetime).format(
                                    "DD/MM/YYYY"
                                  )}
                                </Text>
                              </View>
                            </View>
                            <View style={[styles.DoubleView]}>
                              <View style={{ flexDirection: "row" }}>
                                {firstSahayak?.status === "Accepted" ||
                                firstSahayak?.status === "Completed" ? (
                                  <>
                                    <View
                                      style={{
                                        width: "60%",
                                        height: 33,
                                        backgroundColor: "#0099FF",

                                        marginTop: 10,
                                      }}
                                    >
                                      <View>
                                        <Text
                                          style={{
                                            textAlign: "center",
                                            marginTop: 7,
                                            color: "#fff",
                                            fontSize: 15,
                                            fontWeight: "600",
                                            fontFamily: "Devanagari-bold",
                                          }}
                                        >
                                          {firstSahayak?.status === "Accepted"
                                            ? "स्वीकृत"
                                            : firstSahayak?.status ===
                                              "Completed"
                                            ? "समाप्त"
                                            : null}
                                        </Text>
                                      </View>
                                    </View>
                                    <TouchableOpacity
                                      onPress={() => {
                                        if (
                                          firstSahayak?.job_type ===
                                          "individuals_sahayak"
                                        ) {
                                          navigation.navigate(
                                            "MyBookingStack",
                                            {
                                              screen: "MyBook_SahayakForm",
                                              params: {
                                                id: firstSahayak?.job_id,
                                                item: sahayak.sahayaks[0],
                                                totalamount:
                                                  sahayak.total_amount,
                                                fawdafee: sahayak?.fawda_fee,
                                                useramount:
                                                  sahayak?.total_amount_sahayak,
                                              },
                                            }
                                          );
                                        } else if (
                                          firstSahayak.job_type ===
                                          "theke_pe_kam"
                                        ) {
                                          navigation.navigate(
                                            "MyBookingStack",
                                            {
                                              screen: "Theke_MachineForm",
                                              params: {
                                                id: firstSahayak?.job_id,
                                                item: sahayak.sahayaks[0],
                                                totalamount:
                                                  sahayak.total_amount,
                                                fawdafee: sahayak?.fawda_fee,
                                                useramount:
                                                  sahayak?.total_amount_sahayak,
                                              },
                                            }
                                          );
                                        }
                                      }}
                                      style={{
                                        marginTop: 15,
                                        marginRight: 15,
                                        marginLeft: 10,
                                      }}
                                    >
                                      <Icon name="right" size={20}></Icon>
                                    </TouchableOpacity>
                                  </>
                                ) : firstSahayak?.status === "Ongoing" ||
                                  firstSahayak?.status === "Booked" ? (
                                  <>
                                    <View
                                      style={{
                                        width: "60%",
                                        height: 33,
                                        backgroundColor: "#0099FF",

                                        marginTop: 10,
                                      }}
                                    >
                                      <View>
                                        <Text
                                          style={{
                                            textAlign: "center",
                                            marginTop: 7,
                                            color: "#fff",
                                            fontSize: 15,
                                            fontWeight: "600",
                                            fontFamily: "Devanagari-bold",
                                          }}
                                        >
                                          {firstSahayak?.status === "Ongoing"
                                            ? "काम जारी"
                                            : firstSahayak?.status === "Booked"
                                            ? "काम बुक"
                                            : firstSahayak?.status ===
                                              "Completed"
                                            ? "समाप्त"
                                            : null}
                                        </Text>
                                      </View>
                                    </View>
                                    <TouchableOpacity
                                      onPress={() => {
                                        if (
                                          firstSahayak?.job_type ===
                                          "individuals_sahayak"
                                        ) {
                                          navigation.navigate(
                                            "MyBookingStack",
                                            {
                                              screen: "Mybooking_Sahayak2",
                                              params: {
                                                id: firstSahayak?.job_id,
                                                item: sahayak.sahayaks[0],
                                                fawdafee: sahayak?.fawda_fee,
                                                useramount:
                                                  sahayak?.total_amount_sahayak,
                                              },
                                            }
                                          );
                                        } else if (
                                          firstSahayak.job_type ===
                                          "theke_pe_kam"
                                        ) {
                                          navigation.navigate(
                                            "MyBookingStack",
                                            {
                                              screen: "Theke_MachineForm2",
                                              params: {
                                                id: firstSahayak?.job_id,
                                                item: sahayak.sahayaks[0],
                                                fawdafee: sahayak?.fawda_fee,
                                                useramount:
                                                  sahayak?.total_amount_sahayak,
                                              },
                                            }
                                          );
                                        }
                                      }}
                                      style={{
                                        marginTop: 15,
                                        marginRight: 15,
                                        marginLeft: 10,
                                      }}
                                    >
                                      <Icon name="right" size={20}></Icon>
                                    </TouchableOpacity>
                                  </>
                                ) : null}
                              </View>
                            </View>
                          </View>
                        );
                      })}

                    {sahayakPending?.length > 0 &&
                      sahayakPending?.map((item, index) => (
                        // {console.log('machine', machinePending)}
                        <View
                          key={item.id}
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            width: "100%",
                            justifyContent: "space-between",
                            marginTop: 20,
                          }}
                        >
                          <View style={[styles.DoubleView]}>
                            <View style={{ marginLeft: 20 }}>
                              <Text style={{ fontWeight: "600", fontSize: 18 }}>
                                {item.job_type === "individuals_sahayak"
                                  ? "सहायक"
                                  : item.job_type === "theke_pe_kam"
                                  ? "ठेके पर काम"
                                  : ""}
                              </Text>
                              <Text
                                style={{
                                  color: "black",
                                  fontFamily: "Devanagari-regular",
                                }}
                              >
                                {moment(item?.datetime).format("DD/MM/YYYY")}
                              </Text>
                            </View>
                          </View>
                          <View style={[styles.DoubleView]}>
                            <View style={{ flexDirection: "row" }}>
                              <View
                                style={{
                                  width: "60%",
                                  height: 33,
                                  backgroundColor: "#44A347",
                                  marginTop: 10,
                                }}
                              >
                                <View>
                                  {item?.status === "Pending" && (
                                    <Text
                                      style={{
                                        textAlign: "center",
                                        marginTop: 7,
                                        color: "#fff",
                                        fontSize: 15,
                                        fontWeight: "600",
                                        fontFamily: "Devanagari-bold",
                                      }}
                                    >
                                      पेंडिंग
                                    </Text>
                                  )}
                                </View>
                              </View>
                              <TouchableOpacity
                                onPress={() => {
                                  if (
                                    item.job_type === "individuals_sahayak" &&
                                    item?.status === "Pending"
                                  ) {
                                    navigation.navigate("MyBookingStack", {
                                      screen: "MyBook_SahayakForm",
                                      params: {
                                        id: item?.id,
                                        item,
                                        bookingid: item?.booking_id,
                                        jobtype: item?.job_type,
                                      },
                                    });
                                  } else if (
                                    item.job_type === "theke_pe_kam" &&
                                    item?.status === "Pending"
                                  ) {
                                    navigation.navigate("MyBookingStack", {
                                      screen: "Theke_MachineForm",
                                      params: {
                                        id: item?.id,
                                        item,
                                        jobtype: item?.job_type,
                                      },
                                    });
                                  }
                                }}
                                style={{
                                  marginTop: 15,
                                  marginRight: 15,
                                  marginLeft: 10,
                                }}
                              >
                                <Icon name="right" size={20}></Icon>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      ))}

                    {machinePending?.length > 0 &&
                      machinePending?.map((item, index) => (
                        // {console.log('machine', machinePending)}
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            width: "100%",
                            justifyContent: "space-between",
                            marginTop: 20,
                          }}
                        >
                          <View style={[styles.DoubleView]}>
                            <View style={{ marginLeft: 20 }}>
                              <Text
                                style={{
                                  fontWeight: "600",
                                  fontSize: 18,
                                  fontFamily: "Devanagari-bold",
                                }}
                              >
                                {item.job_type === "machine_malik" &&
                                  `${item.machine}`}
                              </Text>
                              <Text
                                style={{
                                  color: "black",
                                  fontFamily: "Devanagari-regular",
                                }}
                              >
                                {moment(item?.datetime).format("DD/MM/YYYY")}
                              </Text>
                            </View>
                          </View>
                          <View style={[styles.DoubleView]}>
                            <View style={{ flexDirection: "row" }}>
                              <View
                                style={{
                                  width: "60%",
                                  height: 33,
                                  backgroundColor: "#44A347",
                                  // marginRight: -105,
                                  marginTop: 10,
                                }}
                              >
                                <View>
                                  <Text
                                    style={{
                                      textAlign: "center",
                                      marginTop: 7,
                                      color: "#fff",
                                      fontSize: 15,
                                      fontWeight: "600",
                                      fontFamily: "Devanagari-bold",
                                    }}
                                  >
                                    पेंडिंग
                                  </Text>
                                </View>
                              </View>
                              <TouchableOpacity
                                onPress={() => {
                                  if (
                                    item.job_type === "machine_malik" &&
                                    item.status === "Pending"
                                  ) {
                                    navigation.navigate("MyBookingStack", {
                                      screen: "MachineWork",
                                      params: {
                                        id: item?.id,
                                        item,
                                        jobtype: item?.job_type,
                                      },
                                    });
                                  }
                                }}
                                style={{
                                  marginTop: 15,
                                  marginRight: 15,
                                  marginLeft: 10,
                                }}
                              >
                                <Icon name="right" size={20}></Icon>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      ))}
                    {machineBooking?.map((item, index) => (
                      // {console.log('machine', machinePending)}
                      <View
                        key={item.id}
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          width: "100%",
                          justifyContent: "space-between",
                          marginTop: 20,
                        }}
                      >
                        <View style={[styles.DoubleView]}>
                          <View style={{ marginLeft: 20 }}>
                            <Text
                              style={{
                                fontWeight: "600",
                                fontSize: 18,
                                fontFamily: "Devanagari-bold",
                              }}
                            >
                              {item.job_type === "machine_malik" &&
                                `${item.machine}`}
                            </Text>
                            <Text
                              style={{
                                color: "black",
                                fontFamily: "Devanagari-regular",
                              }}
                            >
                              {moment(item?.datetime).format("DD/MM/YYYY")}
                            </Text>
                          </View>
                        </View>
                        <View style={[styles.DoubleView]}>
                          <View style={{ flexDirection: "row" }}>
                            {item.status === "Accepted" ||
                            item?.status === "Completed" ? (
                              <>
                                <View
                                  style={{
                                    width: "60%",
                                    height: 33,
                                    backgroundColor: "#0099FF",
                                    marginTop: 10,
                                  }}
                                >
                                  <View>
                                    <Text
                                      style={{
                                        textAlign: "center",
                                        marginTop: 7,
                                        color: "#fff",
                                        fontSize: 15,
                                        fontWeight: "600",
                                        fontFamily: "Devanagari-bold",
                                      }}
                                    >
                                      {item.status === "Accepted"
                                        ? "स्वीकृत"
                                        : item?.status === "Completed"
                                        ? "समाप्त"
                                        : null}
                                    </Text>
                                  </View>
                                </View>
                                <TouchableOpacity
                                  onPress={() => {
                                    navigation.navigate("MyBookingStack", {
                                      screen: "MachineWork",
                                      params: {
                                        id: item?.job_id,
                                        item,
                                        jobtype: item?.job_type,
                                      },
                                    });
                                  }}
                                  style={{ marginTop: 15, marginRight: 15 }}
                                >
                                  <Icon name="right" size={20}></Icon>
                                </TouchableOpacity>
                              </>
                            ) : item?.status === "Ongoing" ||
                              item?.status === "Booked" ? (
                              <>
                                <View
                                  style={{
                                    width: "60%",
                                    height: 33,
                                    backgroundColor: "#0099FF",
                                    // marginRight: -105,
                                    marginTop: 10,
                                  }}
                                >
                                  <View>
                                    <Text
                                      style={{
                                        textAlign: "center",
                                        marginTop: 7,
                                        color: "#fff",
                                        fontSize: 15,
                                        fontWeight: "600",
                                        fontFamily: "Devanagari-bold",
                                      }}
                                    >
                                      {item.status === "Ongoing"
                                        ? "काम जारी"
                                        : item?.status === "Booked"
                                        ? "काम बुक"
                                        : item?.status === "Completed"
                                        ? "समाप्त"
                                        : null}
                                    </Text>
                                  </View>
                                </View>
                                <TouchableOpacity
                                  onPress={() => {
                                    navigation.navigate("MyBookingStack", {
                                      screen: "MachineWork2",
                                      params: {
                                        item,
                                        id: item?.id,
                                        jobtype: item?.job_type,
                                      },
                                    });
                                  }}
                                  style={{
                                    marginTop: 15,
                                    marginRight: 15,
                                    marginLeft: 10,
                                  }}
                                >
                                  <Icon name="right" size={20}></Icon>
                                </TouchableOpacity>
                              </>
                            ) : null}
                          </View>
                        </View>
                      </View>
                    ))}
                  </>

                  <View
                    style={{
                      borderTopWidth: 0.7,
                      borderTopColor: "#0099FF",
                      width: "100%",
                      marginTop: 15,
                    }}
                  />
                  <View
                    style={{
                      marginVertical: 20,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginHorizontal: 10,
                      alignSelf: "center",
                    }}
                  >
                    <View></View>
                    <View>
                      <TouchableOpacity
                        style={{
                          flex: 0.5,
                          alignItems: "center",
                          backgroundColor: "#0099FF",
                          justifyContent: "center",
                          borderRadius: 3,
                          paddingHorizontal: 20,
                          paddingVertical: 10,
                        }}
                        onPress={() => {
                          navigation.navigate("MyBookingStack", {
                            screen: "History",
                          });
                        }}
                      >
                        <Text
                          style={{
                            color: "#fff",
                            lineHeight: 20,
                            fontFamily: "Devanagari-bold",
                          }}
                        >
                          पुरानी बुकिंग
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </>
            )}
            {usertype &&
              (usertype === "Sahayak" || usertype === "MachineMalik") && (
                <>
                  <View
                    style={{ justifyContent: "center", alignItems: "center" }}
                  >
                    <View style={{ justifyContent: "center" }}>
                      <Text
                        style={{
                          textAlign: "center",
                          fontSize: 30,
                          fontWeight: "600",
                          fontFamily: "Devanagari-bold",
                        }}
                      >
                        मेरे काम
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
                    <>
                      {myjob?.length > 0 &&
                        myjob?.map((item) => (
                          <View
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              width: "100%",
                              justifyContent: "space-between",
                              marginTop: 20,
                            }}
                          >
                            <View style={[styles.DoubleView]}>
                              <View style={{ marginLeft: 15 }}>
                                <Text
                                  style={{
                                    fontWeight: "600",
                                    fontSize: 18,
                                    fontFamily: "Devanagari-bold",
                                  }}
                                >
                                  {item.job_type === "individuals_sahayak"
                                    ? "सहायक  "
                                    : item.job_type === "theke_pe_kam"
                                    ? "ठेके पर काम"
                                    : item.job_type === "machine_malik"
                                    ? `${item?.machine}`
                                    : null}
                                </Text>
                                <Text
                                  style={{
                                    color: "black",
                                    fontFamily: "Devanagari-regular",
                                  }}
                                >
                                  {moment(item?.datetime).format("DD/MM/YYYY")}
                                </Text>
                              </View>
                            </View>
                            <View style={[styles.DoubleView]}>
                              <View style={{ flexDirection: "row" }}>
                                <View
                                  style={{
                                    width: "60%",
                                    height: 33,
                                    backgroundColor: "#0099FF",
                                    marginTop: 10,
                                  }}
                                >
                                  <View>
                                    <Text
                                      style={{
                                        textAlign: "center",
                                        marginTop: 7,
                                        color: "#fff",
                                        fontSize: 15,
                                        fontFamily: "Devanagari-bold",
                                        fontWeight: "600",
                                      }}
                                    >
                                      {/* विवरण देखे */}
                                      {item?.status === "Accepted"
                                        ? "स्वीकृत"
                                        : item?.status === "Booked"
                                        ? "बुक"
                                        : item?.status === "Ongoing"
                                        ? "जारी है"
                                        : "समाप्त"}
                                    </Text>
                                  </View>
                                </View>
                                <TouchableOpacity
                                  onPress={() => {
                                    if (
                                      item.job_type === "individuals_sahayak"
                                    ) {
                                      navigation.navigate("MyBookingStack", {
                                        screen: "MyBook_SahayakForm",
                                        params: {
                                          id: item.id,
                                          item,
                                          usertype,
                                        },
                                      });
                                    } else if (
                                      item.job_type === "theke_pe_kam"
                                    ) {
                                      navigation.navigate("MyBookingStack", {
                                        screen: "Theke_MachineForm",
                                        params: {
                                          id: item.id,
                                          item,
                                          usertype,
                                        },
                                      });
                                    } else {
                                      navigation.navigate("MyBookingStack", {
                                        screen: "MachineWork",
                                        params: {
                                          id: item.id,
                                          item,
                                          usertype,
                                        },
                                      });
                                    }
                                  }}
                                  style={{
                                    marginTop: 15,
                                    marginRight: 15,
                                    marginLeft: 10,
                                  }}
                                >
                                  <Icon name="right" size={20}></Icon>
                                </TouchableOpacity>
                              </View>
                            </View>
                          </View>
                        ))}
                    </>

                    <View
                      style={{
                        flexDirection: "row",
                      }}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      marginTop: 20,
                      marginLeft: 10,
                    }}
                  >
                    <TouchableOpacity
                      style={[
                        styles.button,
                        activeButton === 1 && styles.activeButton,
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
                        activeButton === 2 && styles.activeButton,
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
                  <View
                    style={{
                      marginVertical: 20,
                      flexDirection: "row",
                      marginHorizontal: 10,
                      justifyContent: "space-between",
                      alignSelf: "center",
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        flex: 0.3,
                        alignItems: "center",
                        backgroundColor: "#0099FF",
                        justifyContent: "center",
                        borderRadius: 3,
                        paddingHorizontal: 10,
                        paddingVertical: 10,
                      }}
                      onPress={() => {
                        navigation.navigate("MyBookingStack", {
                          screen: "History",
                        });
                      }}
                    >
                      <Text style={{ color: "#fff", lineHeight: 20 }}>
                        पुराने काम
                      </Text>
                    </TouchableOpacity>
                    {/* <View style={{ flexDirection: "row" }}>
                      <TouchableOpacity
                        style={[
                          styles.button,
                          activeButton === 1 && styles.activeButton,
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
                          activeButton === 2 && styles.activeButton,
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
                    </View> */}
                  </View>
                  {/* <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity
                      style={[
                        styles.button,
                        activeButton === 1 && styles.activeButton,
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
                        activeButton === 2 && styles.activeButton,
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
                  </View> */}
                </>
              )}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
