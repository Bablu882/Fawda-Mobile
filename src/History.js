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

export default function History({ navigation, route }) {
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
  const [machineCancelled, setMachineCancelled] = useState([]);
  const [sahayakCancelled, setSahayakCancelled] = useState([]);
  const [indvidualSahayakCancelled, setIndvidualSahayakCancelled] = useState(
    []
  );
  const [sahayakCompleted, setSahayakCompleted] = useState([]);
  const [sahayakRejected, setSahayakRejected] = useState([]);
  const [sahayakRejectedAfterPayment, setSahayakRejectedAfterPayment] =
    useState([]);
  const [sahakCancelledAfterPayment, setSahayakCancelledAfterPayment] =
    useState([]);
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
    try {
      const cacheBuster = new Date().getTime(); // generate a unique timestamp
      const response = await service.get(
        `api/booking-history-grahak/?cacheBuster=${cacheBuster}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;
      // setSahayakBooking(data?.sahayak_booking_details[0].bookings_completed);
      setSahayakCancelledAfterPayment(
        data?.sahayak_booking_details[4].bookings_cancelled_after_payment
      );
      setSahayakCancelled(data?.sahayak_booking_details[3].bookings_cancelled);
      setSahayakRejectedAfterPayment(
        data?.sahayak_booking_details[2].bookings_rejected_after_payment
      );
      setSahayakRejected(data?.sahayak_booking_details[1].bookings_rejected);
      setSahayakCompleted(data?.sahayak_booking_details[0].bookings_completed);
      setMachineBooking(data?.machine_malik_booking_details);
      setMachineCancelled(data?.machine_malik_job_details);
      setIndvidualSahayakCancelled(data?.sahayak_job_details);
      setIsLoading(false);
      setRefreshing(false);

      // console.log("data", sahayakBooking?.bookings_cancelled_after_payment);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    const Myjobs = async () => {
      setIsLoading(true);
      setRefreshing(true);
      try {
        const cacheBuster = Date.now();
        const response = await service.get(
          `/api/booking-history-sahayak-machine-malik/?page=${page}&cacheBuster=${cacheBuster}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = response.data;
        console.log("data", data);
        setMyjob(data?.results);
        setTotalPages(data?.total_pages);
      } catch (error) {
        console.log("Error:", error);
      } finally {
        setIsLoading(false);
        setRefreshing(false);
      }
    };
    if (isFocused) {
      Myjobs();
    }
  }, [page, isFocused]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Myjobs().then(() => {
    //   setRefreshing(false);
    // });
    booking().then(() => {
      setRefreshing(false);
    });
  }, []);
  useEffect(() => {
    if (isFocused) {
      booking();
    }
  }, [isFocused]);

  function getJobStatusColor(status) {
    switch (status) {
      case "Rejected-After-Payment":
      case "Rejected":
      case "Cancelled":
      case "Cancelled-After-Payment":
        return "#dc3545";
      default:
        return "#0099FF";
    }
  }
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
                      पुरानी बुकिंग
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
                    {sahayakCompleted?.map((sahayak, index) => {
                      const firstSahayak = sahayak.sahayaks[0];
                      return (
                        <View
                          key={index}
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            width: "100%",
                            justifyContent: "space-between",
                            marginTop: 50,
                          }}
                        >
                          <View style={{ marginLeft: 30 }}>
                            <Text
                              style={{
                                fontWeight: "600",
                                fontSize: 18,
                                color: "#000",
                                fontFamily: "Devanagari-bold",
                              }}
                            >
                              {sahayak.job_type === "individuals_sahayak"
                                ? "सहायक  "
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
                          {/* <View
                            style={[
                              styles.jobStatusButton,
                              {
                                backgroundColor: getJobStatusColor(
                                  firstSahayak.status
                                ),
                                marginRight:
                                  firstSahayak.job_type ===
                                  "individuals_sahayak"
                                    ? -105
                                    : -90,
                              },
                            ]}
                          > */}
                          {firstSahayak?.status === "Completed" ? (
                            <>
                              <View
                                style={[
                                  styles.jobStatusButton,
                                  {
                                    backgroundColor: getJobStatusColor(
                                      firstSahayak.status
                                    ),
                                    marginRight:
                                      firstSahayak.job_type ===
                                      "individuals_sahayak"
                                        ? -105
                                        : -90,
                                  },
                                ]}
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
                                    {firstSahayak?.status === "Completed"
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
                                    navigation.navigate("MyBook_SahayakForm", {
                                      id: firstSahayak?.job_id,
                                      item: sahayak.sahayaks[0],
                                      totalamount: sahayak?.total_amount,
                                      fawdafee: sahayak?.fawda_fee,
                                      useramount: sahayak?.total_amount_sahayak,
                                    });
                                  } else if (
                                    firstSahayak.job_type === "theke_pe_kam"
                                  ) {
                                    navigation.navigate("Theke_MachineForm", {
                                      item: sahayak.sahayaks[0],
                                      id: firstSahayak?.job_id,
                                      totalamount: sahayak?.total_amount,
                                      fawdafee: sahayak?.fawda_fee,
                                      useramount: sahayak?.total_amount_sahayak,
                                    });
                                  }
                                }}
                                style={{ marginTop: 15, marginRight: 15 }}
                              >
                                <Icon name="right" size={20}></Icon>
                              </TouchableOpacity>
                            </>
                          ) : null}
                          {/* </View> */}
                        </View>
                      );
                    })}
                    {sahayakRejected?.map((sahayak, index) => {
                      const firstSahayak = sahayak.sahayaks[0];
                      return (
                        <View
                          key={index}
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            width: "100%",
                            justifyContent: "space-between",
                            marginTop: 50,
                          }}
                        >
                          <View style={{ marginLeft: 30 }}>
                            <Text
                              style={{
                                fontWeight: "600",
                                fontSize: 18,
                                color: "#000",
                                fontFamily: "Devanagari-bold",
                              }}
                            >
                              {firstSahayak.job_type === "individuals_sahayak"
                                ? "सहायक"
                                : firstSahayak.job_type === "theke_pe_kam"
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
                          <View
                            style={{
                              width: "30%",
                              height: 33,
                              backgroundColor: "#dc3545",
                              marginRight: 20,
                              marginTop: 10,
                            }}
                          >
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
                              रद्द
                            </Text>
                          </View>
                        </View>
                      );
                    })}
                    {sahakCancelledAfterPayment?.map((sahayak, index) => {
                      const firstSahayak = sahayak.sahayaks[0];
                      return (
                        <View
                          key={index}
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            width: "100%",
                            justifyContent: "space-between",
                            marginTop: 50,
                          }}
                        >
                          <View style={{ marginLeft: 30 }}>
                            <Text
                              style={{
                                fontWeight: "600",
                                fontSize: 18,
                                color: "#000",
                                fontFamily: "Devanagari-bold",
                              }}
                            >
                              {firstSahayak.job_type === "individuals_sahayak"
                                ? "सहायक"
                                : firstSahayak.job_type === "theke_pe_kam"
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
                          <View
                            style={{
                              width: "30%",
                              height: 33,
                              backgroundColor: "#dc3545",
                              marginRight: 20,
                              marginTop: 10,
                            }}
                          >
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
                              रद्द
                            </Text>
                          </View>
                        </View>
                      );
                    })}
                    {sahayakCancelled?.map((sahayak, index) => {
                      const firstSahayak = sahayak.sahayaks[0];
                      if (firstSahayak.job_type !== "individuals_sahayak") {
                        return (
                          <View
                            key={firstSahayak.id}
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              width: "100%",
                              justifyContent: "space-between",
                              marginTop: 50,
                            }}
                          >
                            <View style={{ marginLeft: 30 }}>
                              <Text
                                style={{
                                  fontWeight: "600",
                                  fontSize: 18,
                                  color: "#000",
                                  fontFamily: "Devanagari-bold",
                                }}
                              >
                                {firstSahayak.job_type === "individuals_sahayak"
                                  ? "सहायक"
                                  : firstSahayak.job_type === "theke_pe_kam"
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
                            <View
                              style={{
                                width: "30%",
                                height: 33,
                                backgroundColor: "#dc3545",
                                marginRight: 20,
                                marginTop: 10,
                              }}
                            >
                              <TouchableOpacity>
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
                                  {firstSahayak?.status === "Cancelled"
                                    ? "रद्द"
                                    : null}
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        );
                      } else {
                        return null;
                      }
                    })}
                    {indvidualSahayakCancelled?.map((item, index) => {
                      if (
                        item?.job_type === "individuals_sahayak" &&
                        item?.status === "Cancelled"
                      ) {
                        return (
                          <View
                            key={index}
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              width: "100%",
                              justifyContent: "space-between",
                              marginTop: 50,
                            }}
                          >
                            <View style={{ marginLeft: 30 }}>
                              <Text
                                style={{
                                  fontWeight: "600",
                                  fontSize: 18,
                                  color: "#000",
                                  fontFamily: "Devanagari-bold",
                                }}
                              >
                                {item.job_type === "individuals_sahayak"
                                  ? "सहायक"
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
                            <View
                              style={{
                                width: "30%",
                                height: 33,
                                backgroundColor: "#dc3545",
                                marginRight: 20,
                                marginTop: 10,
                              }}
                            >
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
                                रद्द
                              </Text>
                            </View>
                          </View>
                        );
                      }
                      return null;
                    })}
                    {machineBooking?.map((item, index) => (
                      <View
                        key={item.id}
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          width: "100%",
                          justifyContent: "space-between",
                          marginTop: 50,
                        }}
                      >
                        <View style={{ marginLeft: 30 }}>
                          <Text
                            style={{
                              fontWeight: "600",
                              fontSize: 18,
                              color: "#000",
                              fontFamily: "Devanagari-bold",
                            }}
                          >
                            {item.job_type === "machine_malik"
                              ? "मशीनरी"
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
                        {/* <View
                          style={[
                            styles.jobStatusButton,
                            {
                              backgroundColor: getJobStatusColor(item.status),
                              marginRight: -105,
                            },
                          ]}
                        > */}
                        {item?.status === "Completed" ? (
                          <>
                            <View
                              style={[
                                styles.jobStatusButton,
                                {
                                  backgroundColor: getJobStatusColor(
                                    item.status
                                  ),
                                  marginRight: -105,
                                },
                              ]}
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
                                  {item?.status === "Completed"
                                    ? "समाप्त"
                                    : null}
                                </Text>
                              </View>
                            </View>
                            <TouchableOpacity
                              onPress={() => {
                                navigation.navigate("MachineWork", {
                                  id: item?.job_id,
                                  item,
                                  jobtype: item?.job_type,
                                });
                              }}
                              style={{ marginTop: 15, marginRight: 15 }}
                            >
                              <Icon name="right" size={20}></Icon>
                            </TouchableOpacity>
                          </>
                        ) : item?.status === "Rejected" ||
                          item?.status === "Rejected-After-Payment" ||
                          item?.status === "Cancelled" ||
                          item?.status === "Cancelled-After-Payment" ? (
                          <>
                            <View
                              style={[
                                styles.jobStatusButton,
                                {
                                  backgroundColor: getJobStatusColor(
                                    item.status
                                  ),
                                  marginRight: 20,
                                },
                              ]}
                            >
                              <TouchableOpacity>
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
                                  {item.status === "Rejected"
                                    ? "रद्द"
                                    : item.status === "Rejected-After-Payment"
                                    ? "रद्द"
                                    : item.status === "Cancelled"
                                    ? "रद्द"
                                    : item.status === "Cancelled-After-Payment"
                                    ? "रद्द"
                                    : null}
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </>
                        ) : null}
                        {/* </View> */}
                      </View>
                    ))}
                    {machineCancelled?.map((item, index) => (
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          width: "100%",
                          justifyContent: "space-between",
                          marginTop: 50,
                        }}
                      >
                        <View style={{ marginLeft: 30 }}>
                          <Text
                            style={{
                              fontWeight: "600",
                              fontSize: 18,
                              color: "#000",
                              fontFamily: "Devanagari-bold",
                            }}
                          >
                            {item.job_type === "machine_malik"
                              ? "मशीनरी"
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
                        <View
                          style={{
                            width: "30%",
                            height: 33,
                            backgroundColor: "#dc3545",
                            marginRight: 20,
                            marginTop: 10,
                          }}
                        >
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
                            रद्द
                          </Text>
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
                        पुराना काम
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
                              marginTop: 50,
                            }}
                          >
                            <View style={{ marginLeft: 30 }}>
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
                                  ? "मशीनरी"
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
                            {/* <View
                              style={[
                                styles.jobStatusButton,
                                {
                                  backgroundColor: getJobStatusColor(
                                    item.status
                                  ),
                                  marginLeft:
                                    item.job_type === "individuals_sahayak"
                                      ? 90
                                      : 105,
                                },
                              ]}
                            > */}
                            {item.status === "Completed" ? (
                              <>
                                <View
                                  style={[
                                    styles.jobStatusButton,
                                    {
                                      backgroundColor: getJobStatusColor(
                                        item.status
                                      ),
                                      marginLeft:
                                        item.job_type === "individuals_sahayak"
                                          ? 105
                                          : item.job_type === "machine_malik"
                                          ? 105
                                          : 90,
                                    },
                                  ]}
                                >
                                  <View
                                  // onPress={() => {
                                  //   if (
                                  //     item.job_type === "individuals_sahayak"
                                  //   ) {
                                  //     navigation.navigate(
                                  //       "MyBook_SahayakForm",
                                  //       {
                                  //         id: item.id,
                                  //         item,
                                  //         usertype,
                                  //       }
                                  //     );
                                  //   } else if (
                                  //     item.job_type === "theke_pe_kam"
                                  //   ) {
                                  //     navigation.navigate(
                                  //       "Theke_MachineForm",
                                  //       {
                                  //         id: item.id,
                                  //         item,
                                  //         usertype,
                                  //       }
                                  //     );
                                  //   } else {
                                  //     navigation.navigate("MachineWork", {
                                  //       id: item.id,
                                  //       item,
                                  //       usertype,
                                  //     });
                                  //   }
                                  // }}
                                  >
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
                                      {/* विवरण देखे */}
                                      {item?.status === "Accepted"
                                        ? "स्वीकृत "
                                        : item?.status === "Booked"
                                        ? "बुक "
                                        : item?.status === "Completed"
                                        ? "समाप्त"
                                        : null}
                                    </Text>
                                  </View>
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
                              </>
                            ) : (
                              <>
                                <View
                                  style={[
                                    styles.jobStatusButton,
                                    {
                                      backgroundColor: getJobStatusColor(
                                        item.status
                                      ),
                                      marginLeft:
                                        item.job_type === "individuals_sahayak"
                                          ? 90
                                          : 105,
                                    },
                                  ]}
                                >
                                  <TouchableOpacity>
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
                                      {/* विवरण देखे */}
                                      रद्द
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              </>
                            )}
                            {/* </View> */}
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
                      justifyContent: "flex-end",
                      marginRight: 20,
                      marginVertical: 20,
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
  jobStatusButton: {
    width: "30%",
    height: 33,
    marginTop: 10,
  },
});
