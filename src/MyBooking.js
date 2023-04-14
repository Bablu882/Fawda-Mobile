import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
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

export default function MyBooking({ navigation, route }) {
  const usertype = useSelector(selectUserType);
  console.log("usrrjfjf", usertype);
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const token = useSelector(selectToken);
  const [isLoading, setIsLoading] = useState(false);
  const [machineBooking, setMachineBooking] = useState([]);
  const [machinePending, setMachinePending] = useState([]);
  const [sahayakPending, setSahayakPending] = useState([]);
  const [sahaykBooking, setSahayakBooking] = useState([]);
  const [myjob, setMyjob] = useState({});
  //=====api integration of MyBooking======//
  const booking = async () => {
    setIsLoading(true); // set isLoading to true when the function starts
    setRefreshing(true);
    try {
      const cacheBuster = new Date().getTime(); // generate a unique timestamp
      const response = await service.get(`api/my_booking_details/?cacheBuster=${cacheBuster}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      setSahayakPending(data?.sahayak_pending_booking_details);
      setSahayakBooking(data?.sahayk_booking_details?.bookings);
      setMachineBooking(data?.machine_malik_booking_details);
      setMachinePending(data?.machine_malik_pending_booking_details);
      setIsLoading(false);
      setRefreshing(false);
      console.log("data:::", data);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const Myjobs = async () => {
    setIsLoading(true); // set isLoading to true when the function starts
    setRefreshing(true); // set refreshing to true when the function starts
    try {
      const cacheBuster = new Date().getTime(); // generate a unique timestamp
      const response = await service.get(`/api/myjobs/?cacheBuster=${cacheBuster}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      setMyjob(data?.data);
      console.log("data:====::", data);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setIsLoading(false); // set isLoading to false when the function completes
      setRefreshing(false); // set refreshing to false when the function completes
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Myjobs().then(() => {
      setRefreshing(false);
    });
    booking().then(() =>{
      setRefreshing(false);
    }
    )
  }, []);
  useEffect(() => {
    booking(), Myjobs();
  }, []);
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
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              // Myjobs={Myjobs}
            />
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
                              backgroundColor: "#44A347",
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
                                    id: item.id,
                                    item,
                                  });
                                } else if (
                                  item.job_type === "theke_pe_kam" &&
                                  item?.status === "Pending"
                                ) {
                                  navigation.navigate("Theke_MachineForm", {
                                    item,
                                  });
                                }
                              }}
                            >
                              {item?.status === "Pending" && (
                                <Text
                                  style={{
                                    textAlign: "center",
                                    marginTop: 7,
                                    color: "#fff",
                                    fontSize: 15,
                                    fontWeight: "600",
                                  }}
                                >
                                  पेंडिंग
                                </Text>
                              )}
                            </TouchableOpacity>
                          </View>
                        </View>
                      ))}
                    {sahaykBooking?.length > 0 &&
                      sahaykBooking?.map((item) => (
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
                              backgroundColor: "#44A347",
                              marginRight: 20,
                              marginTop: 10,
                            }}
                          >
                            {item.booking_status === "Accepted" ||
                            item?.booking_status === "Completed" ? (
                              <TouchableOpacity
                                onPress={() => {
                                  if (item.job_type === "individuals_sahayak") {
                                    navigation.navigate("MyBook_SahayakForm", {
                                      id: item.id,
                                      item,
                                    });
                                  } else if (item.job_type === "theke_pe_kam") {
                                    navigation.navigate("Theke_MachineForm", {
                                      item,
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
                                  {item?.booking_status === "Accepted"
                                    ? "स्वीकृत"
                                    : item?.booking_status === "Completed"
                                    ? "समाप्त"
                                    : null}
                                </Text>
                              </TouchableOpacity>
                            ) : item?.booking_status === "Ongoing" ||
                              item?.booking_status === "Booked" ? (
                              <TouchableOpacity
                                onPress={() => {
                                  if (item.job_type === "individuals_sahayak") {
                                    navigation.navigate("Mybooking_Sahayak2", {
                                      id: item.id,
                                      item,
                                    });
                                  } else if (item.job_type === "theke_pe_kam") {
                                    navigation.navigate("Theke_MachineForm2", {
                                      item,
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
                                  {item?.booking_status === "Ongoing"
                                    ? "काम जारी"
                                    : item?.booking_status === "Booked"
                                    ? " काम बुक"
                                    : item?.booking_status === "Completed"
                                    ? "समाप्त"
                                    : null}
                                </Text>
                              </TouchableOpacity>
                            ) : null}
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
                              backgroundColor: "#44A347",
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
                                    item,
                                    id: item?.id,
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
                                पेंडिंग
                              </Text>
                              {/* {item.status === "Pending" && (
                               
                              )} */}
                            </TouchableOpacity>
                          </View>
                          {/* <View
                      style={{
                        width: "30%",
                        height: 33,
                        backgroundColor: "#44A347",
                        marginRight: 20,
                        marginTop: 10,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          if (
                            item.job_type === "machine_work" &&
                            item.status === "Pending"
                          ) {
                            navigation.navigate("MachineForm", {
                              item,
                              id: item.id,
                            });
                          }
                        }}
                        style={{
                          backgroundColor: "#2ED573",
                          paddingVertical: 5,
                          paddingHorizontal: 10,
                          borderRadius: 5,
                          alignSelf: "center",
                          marginTop: 5,
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
                          {item.status}
                        </Text>
                      </TouchableOpacity>
                    </View> */}
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
                            backgroundColor: "#44A347",
                            marginRight: 20,
                            marginTop: 10,
                          }}
                        >
                          {item.booking_status === "Accepted" ||
                          item?.booking_status === "Completed" ? (
                            <TouchableOpacity
                              onPress={() => {
                                navigation.navigate("MachineWork", {
                                  item,
                                  id: item?.id,
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
                                {item.booking_status === "Accepted"
                                  ? "स्वीकृत"
                                  : item?.booking_status === "Completed"
                                  ? "समाप्त"
                                  : null}
                              </Text>
                            </TouchableOpacity>
                          ) : item?.booking_status === "Ongoing" ||
                            item?.booking_status === "Booked" ? (
                            <TouchableOpacity
                              onPress={() => {
                                navigation.navigate("MachineWork2", {
                                  item,
                                  id: item?.id,
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
                                {item.booking_status === "Ongoing"
                                  ? "काम जारी"
                                  : item?.booking_status === "Booked"
                                  ? " काम बुक"
                                  : item?.booking_status === "Completed"
                                  ? "समाप्त"
                                  : null}
                              </Text>
                            </TouchableOpacity>
                          ) : null}
                          {/* <TouchableOpacity
                            onPress={() => {
                              navigation.navigate("MachineWork", {
                                item,
                                id: item?.id,
                              });
                            }}
                          >
                            {item.status === "Accepted" ? (
                              <Text
                                style={{
                                  textAlign: "center",
                                  marginTop: 7,
                                  color: "#fff",
                                  fontSize: 15,
                                  fontWeight: "600",
                                }}
                              >
                                स्वीकृत
                              </Text>
                            ) : item.status === "Booked" ? (
                              <Text
                                style={{
                                  textAlign: "center",
                                  marginTop: 7,
                                  color: "#fff",
                                  fontSize: 15,
                                  fontWeight: "600",
                                }}
                              >
                                बुक्ड
                              </Text>
                            ) : item.status === "Ongoing" ? (
                              <Text
                                style={{
                                  textAlign: "center",
                                  marginTop: 7,
                                  color: "#fff",
                                  fontSize: 15,
                                  fontWeight: "600",
                                }}
                              >
                                जारी है
                              </Text>
                            ) : item.status === "Completed" ? (
                              <Text
                                style={{
                                  textAlign: "center",
                                  marginTop: 7,
                                  color: "#fff",
                                  fontSize: 15,
                                  fontWeight: "600",
                                }}
                              >
                                समाप्त
                              </Text>
                            ) : null}
                          </TouchableOpacity> */}
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
                      {myjob.length > 0 &&
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
                                backgroundColor: "#44A347",
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
                                  विवरण देखे
                                </Text>
                              </TouchableOpacity>
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
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
