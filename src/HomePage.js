import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import Icon from "react-native-vector-icons/AntDesign";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { selectToken, selectUserType } from "../slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import service from "../service";
import moment from "moment";

export default function Homepage({ navigation, route }) {
  const [currentUsers, setCurrentUsers] = useState([]);
  const [show, setShow] = useState(false);
  const [activeButton, setActiveButton] = useState("");
  const [sahayak, setSahayak] = useState("");
  const isfocused = useIsFocused();
  const usertype = useSelector(selectUserType);
  console.log("usrrjfjf", usertype);

  const dispatch = useDispatch();
  const token = useSelector(selectToken);

  const getalljobs = async () => {
    try {
      const response = await service.get("/api/nearjob/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token?.access,
        },
      });
      const data = response.data;
   console.log("data:::", data);
      setCurrentUsers(data);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    getalljobs();
  }, [0]);

  return (
    <SafeAreaView style={{ backgroundColor: "#fff", flex: 1 }}>
      <View style={{ padding: 20, marginTop: 25 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrowleft" size={25} />
        </TouchableOpacity>
      </View>
      <ScrollView horizontal={false} showsVerticalScrollIndicator={false}>
        {usertype === "Sahayak" || usertype === "MachineMalik" ? (
          <>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
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
              {currentUsers?.length > 0 && (
                <>
                  {currentUsers.map((item, index) => (
                    <View key={index} style={styles.booking}>
                      <View style={styles.bookingLeft}>
                        <Text style={styles.bookingTitle}>{item.job_type}</Text>
                        <Text style={{ color: "black" }}>
                          {moment(item.date).format("l")}
                        </Text>
                      </View>
                      <TouchableOpacity style={styles.bookingButton} onPress={() => {{
                        if (
                          item.job_type === "individuals_sahayak" 
                        ) {
                          navigation.navigate("MyBook_SahayakForm", {
                            id: item.id,
                            item,
                            usertype
                          });
                        } else if (
                          item.job_type === "theke_pe_kam"
                        
                        ) {
                          navigation.navigate("Theke_MachineForm", {
                            id: item.id,
                            item,
                            usertype
                          });
                        }
                      }}}>
                        <Text style={styles.bookingButtonText}>विवरण देखे </Text>
                      </TouchableOpacity>
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
          </>
        ) : (
          <>
            <View style={styles.container}>
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
                        ? { backgroundColor: "#44A347", borderColor: "#44A347" }
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
                        ? { backgroundColor: "#44A347", borderColor: "#44A347" }
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#fff",
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
    marginTop: 50,
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
});
