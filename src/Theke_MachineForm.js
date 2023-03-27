import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Image,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import { useDispatch, useSelector } from "react-redux";
import service from "../service";
import { selectToken } from "../slices/authSlice";
import moment from "moment";

function Theke_MachineForm({ navigation, route }) {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const [checked, setChecked] = React.useState("first");
  const [thekeperKam, setThekeperKam] = useState({});
  const bookingid = route?.params?.item;
  console.log("bookingid", bookingid);

  const fetchBookings = async () => {
    try {
      const response = await service.get("api/my_booking_details/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token?.access}`,
        },
      });
      const data = response.data;
      setThekeperKam(bookingid.data)
      console.log("fjfjf", data);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const accptThekha = async () => {
    let params = {
      job_id: bookingid.id,
    };

    try {
      const response = await service.post("/api/accept_theka/", params, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token?.access}`,
        },
      });
      const data = response?.data;
      setThekeperKam(data.data);
      console.log("fjfjf", data);
    } catch (error) {
      console.log("Error:", error);
    }
  };
  useEffect(() => {
    fetchBookings();
  }, [0]);
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ padding: 20, marginTop: 25 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrowleft" size={25} />
        </TouchableOpacity>
      </View>
      <View style={{ alignItems: "center", flex: 1 }}>
        <Text style={{ textAlign: "center", fontSize: 30, fontWeight: "600" }}>
          {bookingid?.job_type}
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
          <Text style={[styles.TextInput]}>{bookingid.description}</Text>
          <Image
            source={require("../assets/image/edit.png")}
            style={{ width: 20, height: 20, marginTop: 10, right: 10 }}
          />
        </View>

        <View
          style={[styles.inputView, styles.flex, styles.justifyContentBetween]}
        >
          <Text style={styles.TextInput}>
            {moment(bookingid?.date).format("l")}
          </Text>
          <Text style={styles.TextInput}>
            {moment(bookingid?.time).format("HH:mm")}
          </Text>
        </View>

        <View
          style={[styles.flex, styles.justifyContentevenly, { width: "92%" }]}
        >
          <View
            style={[styles.TaxView, styles.flex, styles.justifyContentBetween]}
          >
            <TextInput
              style={styles.TextInput}
              placeholder={bookingid?.land_area}
              placeholderTextColor={"#000"}
            />
            <Text style={{ marginTop: 13, marginRight: 8, color: "#0099FF" }}>
              {bookingid?.land_type}
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
            <Text style={{ marginTop: 13, marginRight: 8, color: "#0099FF" }}>
              ₹ {bookingid?.total_amount_theka}
            </Text>
          </View>
        </View>

        <View style={styles.flex}>
          <View style={{ width: "50%" }}>
            <Text></Text>
          </View>
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
              onPress={() => accptThekha()}
              style={{
                backgroundColor: "#44A347",
                paddingHorizontal: 10,
                paddingTop: 4,
              }}
            >
              <Text style={[styles.TextWhite, { fontSize: 10 }]}>
                Accept Thekha
              </Text>
            </TouchableOpacity>
          </View>
          {/* <Text></Text>
   <View>
   <TouchableOpacity>
      <Text style={{ textAlign: "right" }}>1</Text>
    </TouchableOpacity>
    <TouchableOpacity>
      <Text>2</Text>
    </TouchableOpacity>
    </View> */}
        </View>

        <View
          style={[styles.inputView, styles.flex, styles.justifyContentBetween]}
        >
          <TextInput
            style={styles.TextInput}
            placeholder="काम की स्थिति"
            placeholderTextColor={"#000"}
          />
          <View
            style={{
              width: "30%",
              height: 30,
              backgroundColor: "#44A347",
              marginRight: 10,
              marginTop: 8,
            }}
          >
            <TouchableOpacity>
              {thekeperKam && (
                <Text
                  style={{
                    textAlign: "center",
                    marginTop: 5,
                    color: "#fff",
                    fontSize: 15,
                    fontWeight: "600",
                  }}
                >
                  {thekeperKam?.status}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    

      <View style={{ marginTop: "auto", padding: 5 }}>
        <TouchableOpacity
          style={{
            backgroundColor: "#D9D9D9",
            alignSelf: "center",
            paddingHorizontal: 50,
            paddingVertical: 10,
            borderRadius: 5,
          }}
        >
          <Text style={{ textAlign: "center", color: "#fff" }}>रद्द करें </Text>
        </TouchableOpacity>
      </View>
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
    width: "85%",
    borderRadius: 7,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    backgroundColor: "#0099FF",
  },

  BhuktanBtn: {
    width: "85%",
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
    width: "80%",
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
    width: "40%",
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
});
