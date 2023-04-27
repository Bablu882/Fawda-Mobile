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
      setSahayakPending(data?.sahayak_job_details);
      setSahayakBooking(data?.sahayk_booking_details);
      setMachineBooking(data?.machine_malik_booking_details);
      setMachinePending(data?.machine_malik_job_details);
      setIsLoading(false);
      setRefreshing(false);

      console.log("data", sahaykBooking[4]?.bookings_cancelled_after_payment);
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
  return (
    <SafeAreaView style={{ backgroundColor: "#fff", flex: 1 }}>
      <View style={{ padding: 20, marginTop: 25 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrowleft" size={25} />
        </TouchableOpacity>
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
                    {sahaykBooking[0]?.bookings_completed?.map(
                      (sahayak, index) =>
                        sahayak?.sahayaks?.map((item, index) => (
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
                                }}
                              >
                                {item.job_type === "individuals_sahayak"
                                  ? "सहायक  "
                                  : item.job_type === "theke_pe_kam"
                                  ? "ठेके पर काम"
                                  : ""}
                              </Text>

                              <Text style={{ color: "black" }}>
                                {moment.utc(item?.datetime).format("L")}
                              </Text>
                            </View>
                            <View
                              style={{
                                width: "30%",
                                height: 33,
                                backgroundColor: "#0099FF",
                                marginRight: 20,
                                marginTop: 10,
                              }}
                            >
                              {item?.status === "Accepted" ||
                              item?.status === "Completed" ? (
                                <TouchableOpacity
                                  onPress={() => {
                                    if (
                                      item?.job_type === "individuals_sahayak"
                                    ) {
                                      navigation.navigate(
                                        "MyBook_SahayakForm",
                                        {
                                          id: item?.job_id,
                                          item,
                                          totalamount: sahayak.total_amount,
                                          fawdafee: sahayak?.fawda_fee,
                                          useramount:
                                            sahayak?.total_amount_sahayak,
                                        }
                                      );
                                    } else if (
                                      item.job_type === "theke_pe_kam"
                                    ) {
                                      navigation.navigate("Theke_MachineForm", {
                                        item,
                                        id: item?.job_id,
                                        totalamount: sahayak.total_amount,
                                        fawdafee: sahayak?.fawda_fee,
                                        useramount:
                                          sahayak?.total_amount_sahayak,
                                      });
                                    }
                                  }}
                                >
                                  <Text
                                    style={{
                                      textAlign: "center",
                                      marginTop: 7,
                                      color: "#fff",
                                      fontSize: 15,
                                      fontWeight: "600",
                                    }}
                                  >
                                    {item?.status === "Accepted"
                                      ? "स्वीकृत"
                                      : item?.status === "Completed"
                                      ? "समाप्त"
                                      : null}
                                  </Text>
                                </TouchableOpacity>
                              ) : item?.status === "Ongoing" ||
                                item?.status === "Booked" ? (
                                <TouchableOpacity
                                  onPress={() => {
                                    if (
                                      item?.job_type === "individuals_sahayak"
                                    ) {
                                      navigation.navigate(
                                        "Mybooking_Sahayak2",
                                        {
                                          item,

                                          id: item?.job_id,
                                          totalamount: sahayak.total_amount,
                                          fawdafee: sahayak?.fawda_fee,
                                          useramount:
                                            sahayak?.total_amount_sahayak,
                                        }
                                      );
                                    } else if (
                                      item.job_type === "theke_pe_kam"
                                    ) {
                                      navigation.navigate(
                                        "Theke_MachineForm2",
                                        {
                                          item,
                                          id: item?.job_id,
                                          totalamount: sahayak.total_amount,
                                          fawdafee: sahayak?.fawda_fee,
                                          useramount:
                                            sahayak?.total_amount_sahayak,
                                        }
                                      );
                                    }
                                  }}
                                >
                                  <Text
                                    style={{
                                      textAlign: "center",
                                      marginTop: 7,
                                      color: "#fff",
                                      fontSize: 15,
                                      fontWeight: "600",
                                    }}
                                  >
                                    {item?.status === "Ongoing"
                                      ? "काम जारी"
                                      : item?.status === "Booked"
                                      ? " काम बुक"
                                      : item?.status === "Completed"
                                      ? "समाप्त"
                                      : null}
                                  </Text>
                                </TouchableOpacity>
                              ) : null}
                            </View>
                          </View>
                        ))
                    )}
                     {sahaykBooking[1]?.bookings_rejected?.map(
                      (sahayak, index) =>
                        sahayak?.sahayaks?.map((item, index) => (
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
                                }}
                              >
                                {item.job_type === "individuals_sahayak"
                                  ? "सहायक  "
                                  : item.job_type === "theke_pe_kam"
                                  ? "ठेके पर काम"
                                  : ""}
                              </Text>

                              <Text style={{ color: "black" }}>
                                {moment.utc(item?.datetime).format("L")}
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
                              <Text style={{      textAlign: "center",
                                  marginTop: 7,
                                  color: "#fff",
                                  fontSize: 15,
                                  fontWeight: "600",}}>रद्द</Text>
                            
                            </View>
                          </View>
                        ))
                    )}
                        {sahaykBooking[2]?.bookings_rejected_after_payment?.map(
                      (sahayak, index) =>
                        sahayak?.sahayaks?.map((item, index) => (
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
                                }}
                              >
                                {item.job_type === "individuals_sahayak"
                                  ? "सहायक  "
                                  : item.job_type === "theke_pe_kam"
                                  ? "ठेके पर काम"
                                  : ""}
                              </Text>

                              <Text style={{ color: "black" }}>
                                {moment.utc(item?.datetime).format("L")}
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
                              <Text style={{      textAlign: "center",
                                  marginTop: 7,
                                  color: "#fff",
                                  fontSize: 15,
                                  fontWeight: "600",}}>रद्द</Text>
                            
                            </View>
                          </View>
                        ))
                    )}
                    {sahaykBooking[3]?.bookings_cancelled?.map(
                      (sahayak, index) =>
                        sahayak?.sahayaks?.map((item, index) => (
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
                                }}
                              >
                                {item.job_type === "individuals_sahayak"
                                  ? "सहायक  "
                                  : item.job_type === "theke_pe_kam"
                                  ? "ठेके पर काम"
                                  : ""}
                              </Text>

                              <Text style={{ color: "black" }}>
                                {moment.utc(item?.datetime).format("L")}
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
                              <Text style={{      textAlign: "center",
                                  marginTop: 7,
                                  color: "#fff",
                                  fontSize: 15,
                                  fontWeight: "600",}}>रद्द</Text>
                            
                            </View>
                          </View>
                        ))
                    )}
                    {sahaykBooking[4]?.bookings_cancelled_after_payment?.map(
                      (sahayak, index) =>
                        sahayak?.sahayaks?.map((item, index) => (
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
                                }}
                              >
                                {item.job_type === "individuals_sahayak"
                                  ? "सहायक  "
                                  : item.job_type === "theke_pe_kam"
                                  ? "ठेके पर काम"
                                  : ""}
                              </Text>

                              <Text style={{ color: "black" }}>
                                {moment.utc(item?.datetime).format("L")}
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
                              <Text style={{      textAlign: "center",
                                  marginTop: 7,
                                  color: "#fff",
                                  fontSize: 15,
                                  fontWeight: "600",}}>रद्द</Text>
                            
                            </View>
                          </View>
                        ))
                    )}

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
                            marginTop: 50,
                          }}
                        >
                          <View style={{ marginLeft: 30 }}>
                            <Text style={{ fontWeight: "600", fontSize: 18 }}>
                              {item.job_type === "individuals_sahayak"
                                ? "सहायक  "
                                : item.job_type === "theke_pe_kam"
                                ? "ठेके पर काम"
                                : ""}
                            </Text>
                            <Text style={{ color: "black" }}>
                              {moment.utc(item?.datetime).format("L")}
                            </Text>
                          </View>
                          <View
                            style={{
                              width: "30%",
                              height: 33,
                              backgroundColor:
                                item?.status === "Pending"
                                  ? "#44A347"
                                  : "#dc3545",
                              marginRight: 20,
                              marginTop: 10,
                            }}
                          >
                            <TouchableOpacity
                              onPress={() => {
                                if (
                                  item.job_type === "individuals_sahayak" &&
                                  item?.status === "Pending"
                                ) {
                                  navigation.navigate("MyBook_SahayakForm", {
                                    id: item?.id,
                                    item,
                                    bookingid: item.booking_id,
                                    jobtype: item?.job_type,
                                  });
                                } else if (
                                  item.job_type === "theke_pe_kam" &&
                                  item?.status === "Pending"
                                ) {
                                  navigation.navigate("Theke_MachineForm", {
                                    id: item?.id,
                                    item,

                                    jobtype: item?.job_type,
                                  });
                                }
                              }}
                            >
                              <Text
                                style={{
                                  textAlign: "center",
                                  marginTop: 7,
                                  color: "#fff",
                                  fontSize: 15,
                                  fontWeight: "600",
                                }}
                              >
                                {item?.status === "Pending"
                                  ? "पेंडिंग"
                                  : "रद्द"}
                              </Text>
                            </TouchableOpacity>
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
                            marginTop: 50,
                          }}
                        >
                          <View style={{ marginLeft: 30 }}>
                            <Text style={{ fontWeight: "600", fontSize: 18 }}>
                              {item.job_type === "machine_malik"
                                ? " मशीनरी"
                                : ""}
                            </Text>
                            <Text style={{ color: "black" }}>
                              {/* {moment(item?.datetime).format('L')}
                           { console.log('djdjddj', item?.datetime)} */}
                              {moment.utc(item?.datetime).format("L")}
                            </Text>
                          </View>
                          <View
                            style={{
                              width: "30%",
                              height: 33,
                              backgroundColor:
                                item?.status === "Pending"
                                  ? "#44A347"
                                  : "#dc3545",
                              marginRight: 20,
                              marginTop: 10,
                            }}
                          >
                            <TouchableOpacity
                              onPress={() => {
                                if (
                                  item.job_type === "machine_malik" &&
                                  item.status === "Pending"
                                ) {
                                  navigation.navigate("MachineWork", {
                                    id: item?.id,
                                    item,

                                    jobtype: item?.job_type,
                                  });
                                } else {
                                  console.log(
                                    "Cannot navigate to MachineWork screen"
                                  );
                                }
                              }}
                            >
                              <Text
                                style={{
                                  textAlign: "center",
                                  marginTop: 7,
                                  color: "#fff",
                                  fontSize: 15,
                                  fontWeight: "600",
                                }}
                              >
                                {item?.status === "Pending"
                                  ? "पेंडिंग"
                                  : "रद्द"}
                              </Text>
                            </TouchableOpacity>
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
                          marginTop: 50,
                        }}
                      >
                        <View style={{ marginLeft: 30 }}>
                          <Text style={{ fontWeight: "600", fontSize: 18 }}>
                            {item.job_type === "machine_malik"
                              ? " मशीनरी"
                              : "मशीनरी"}
                          </Text>
                          <Text style={{ color: "black" }}>
                            {moment.utc(item?.datetime).format("L")}
                          </Text>
                        </View>
                        <View
                          style={{
                            width: "30%",
                            height: 33,
                            backgroundColor: "#0099FF",
                            marginRight: 20,
                            marginTop: 10,
                          }}
                        >
                          {item.status === "Accepted" ||
                          item?.status === "Completed" ? (
                            <TouchableOpacity
                              onPress={() => {
                                navigation.navigate("MachineWork", {
                                  id: item?.job_id,
                                  item,

                                  jobtype: item?.job_type,
                                  // fawdafee: item?.fawda_fee,
                                  // totalamount: item?.total_amount,
                                });
                              }}
                            >
                              <Text
                                style={{
                                  textAlign: "center",
                                  marginTop: 7,
                                  color: "#fff",
                                  fontSize: 15,
                                  fontWeight: "600",
                                }}
                              >
                                {item.status === "Accepted"
                                  ? "स्वीकृत"
                                  : item?.status === "Completed"
                                  ? "समाप्त"
                                  : null}
                              </Text>
                            </TouchableOpacity>
                          ) : item?.status === "Ongoing" ||
                            item?.status === "Booked" ? (
                            <TouchableOpacity
                              onPress={() => {
                                navigation.navigate("MachineWork2", {
                                  item,
                                  id: item?.id,
                                  useramount: item?.payment_your,
                                });
                              }}
                            >
                              <Text
                                style={{
                                  textAlign: "center",
                                  marginTop: 7,
                                  color: "#fff",
                                  fontSize: 15,
                                  fontWeight: "600",
                                }}
                              >
                                {item.status === "Ongoing"
                                  ? "काम जारी"
                                  : item?.status === "Booked"
                                  ? " काम बुक"
                                  : item?.status === "Completed"
                                  ? "समाप्त"
                                  : null}
                              </Text>
                            </TouchableOpacity>
                          ) : null}
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
                              marginTop: 50,
                            }}
                          >
                            <View style={{ marginLeft: 30 }}>
                              <Text style={{ fontWeight: "600", fontSize: 18 }}>
                                {item.job_type === "individuals_sahayak"
                                  ? "सहायक  "
                                  : item.job_type === "theke_pe_kam"
                                  ? "ठेके पर काम"
                                  : item.job_type === "machine_malik"
                                  ? " मशीनरी"
                                  : null}
                              </Text>
                              <Text style={{ color: "black" }}>
                                {moment.utc(item?.datetime).format("L")}
                              </Text>
                            </View>
                            <View
                              style={{
                                width: "30%",
                                height: 33,
                                backgroundColor: "#0099FF",
                                marginRight: 20,
                                marginTop: 10,
                              }}
                            >
                              <TouchableOpacity
                                onPress={() => {
                                  if (item.job_type === "individuals_sahayak") {
                                    navigation.navigate("MyBook_SahayakForm", {
                                      id: item.id,
                                      item,
                                      usertype,
                                    });
                                  } else if (item.job_type === "theke_pe_kam") {
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
                              >
                                <Text
                                  style={{
                                    textAlign: "center",
                                    marginTop: 7,
                                    color: "#fff",
                                    fontSize: 15,
                                    fontWeight: "600",
                                  }}
                                >
                                  {/* विवरण देखे */}
                                  {item?.status === "Accepted"
                                    ? "स्वीकृत "
                                    : item?.status === "Booked"
                                    ? "बुक "
                                    : item?.status === "Ongoing"
                                    ? "जारी है"
                                    : "समाप्त"}
                                </Text>
                              </TouchableOpacity>
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
});
