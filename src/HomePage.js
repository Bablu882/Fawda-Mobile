import React, { useState, useEffect, useCallback } from "react";
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
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import Icon from "react-native-vector-icons/AntDesign";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { selectToken, selectUserType } from "../slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import service from "../service";
import moment from "moment";

export default function Homepage({ navigation, route }) {
  const [refreshing, setRefreshing] = useState(false);
  const [currentUsers, setCurrentUsers] = useState([]);
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeButton, setActiveButton] = useState("");
  const [sahayak, setSahayak] = useState("");
  const isfocused = useIsFocused();
  const [page, setPage] = useState(1);
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

  // const getalljobs = async () => {
  //   setIsLoading(true); // Show loader while fetching data
  //   setRefreshing(true);
  //   try {
  //     const cacheBuster = new Date().getTime(); // generate a unique timestamp
  //     const response = await service.get(`/api/nearjob/?cacheBuster=${cacheBuster}`, {
  //       headers: {
  //         "Content-Type": "application/json",
  //         'Authorization': `Bearer ${token}`
  //       },
  //     });
  //     const data = response.data;
  //     setCurrentUsers(data.results);
  //     console.log('jdjhff',currentUsers)
  //   } catch (error) {
  //     console.log("Error:", error);
  //   } finally {
  //     setIsLoading(false);
  //     setRefreshing(false);
  //   }
  // };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // fetchJobs().then(() => {
    //   setRefreshing(false);
    // });
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const cacheBuster = Date.now();
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
        setCurrentUsers(data.results);
        setTotalPages(data.total_pages);
      } catch (error) {
        console.log("Error:", error);
      }
    };
    fetchJobs();
  }, [page]);

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
                    {currentUsers.map((item, index) => (
                      <View key={index}  >
                        <View style={[styles.booking,{paddingVertical:15,}]}>
                        <View style={styles.bookingLeft}>
                          {item.job_type === "individuals_sahayak" ||
                          item.job_type === "theke_pe_kam" ? (
                            <>
                              <Text style={styles.bookingTitle}>
                                {
                                  <Text style={styles.bookingTitle}>
                                    {item.job_type === "individuals_sahayak"
                                      ? "सहायक के  काम "
                                      : item.job_type === "theke_pe_kam"
                                      ? "ठेकेदार"
                                      : ""}
                                  </Text>
                                }
                              </Text>
                            </>
                          ) : (
                            <Text style={styles.bookingTitle}>
                              {item?.work_type === "Harvesting"
                                ? "काटना"
                                : item?.work_type === "Sowing"
                                ? "बुवाई"
                                : "भूमि की तैयारी"}
                            </Text>
                          )}
                          {/* <Text style={styles.bookingTitle}>{item.job_type ==="individuals_sahayak" ? 'सहायक के  काम ': item.job_type ==="individuals_sahayak" ? 'ठेकेदार': item.job_type ==="machine_malik" ? '':''}</Text> */}

                          <Text style={{ color: "black" }}>
                            {moment.utc(item.datetime).format("l")}
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={styles.bookingButton}
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
                          <Text style={styles.bookingButtonText}>
                            विवरण देखे
                          </Text>
                        </TouchableOpacity>
                        </View>
                       
                      </View>
                    ))}
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
              <View
                style={{
                  marginVertical: 20,
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  marginRight: 10,
                }}
              >
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
                    {marginLeft:10},
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
                    style={{ fontSize: 28, fontWeight: "600", color: "#000" }}
                  >
                    कौनसी सेवा चाहिए
                  </Text>
                </View>

                <View style={styles.OptionButton1}>
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
                        styles.loginText,
                        activeButton === "सहायक" ? { color: "#fff" } : null,
                      ]}
                    >
                      सहायक
                    </Text>
                    <Text
                      style={[
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
                        styles.theke,
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
                        styles.theke,
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
  },
  bookingButton: {
    width: "30%",
    height: 33,
    backgroundColor: "#44A347",
    marginRight: 20,
    marginTop: 10,
  },
  bookingButtonText: {
    textAlign: "center",
    marginTop: 7,
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  OptionButton: {
    // flex:1,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
    // margin:20,
    //   padding:20
  },

  OptionButton1: {
    // flex:1,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
    // margin:20,
    // marginRight:20
    // padding:20
  },
  bookingLeft: {
    marginLeft: 30,
  },
  bookingTitle: {
    fontWeight: "600",
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
  sahayak: {
    width: "35%",
    flexDirection: "column",
    // borderRadius: 7,
    color: "#505050",
    height: 50,
    alignItems: "center",
    //   justifyContent:"",
    justifyContent: "center",
    marginTop: 30,
    // borderWidth:1,
    borderRadius: 10,
    // borderColor:"#505050",
    backgroundColor: "#44A347",
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

  machine1: {
    width: "40%",
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

  theke: {
    width: "40%",
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
});
