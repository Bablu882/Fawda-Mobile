import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
} from "react-native";

import Icon from "react-native-vector-icons/AntDesign";
import BottomTab from "../Component/BottomTab";
import moment from "moment";



const acceptThekha = async () => {
  let params = {
    job_id: bookingid.id,
  };

  try {
    const response = await service.post(
      "/api/accept_theka/",
      params,
      {
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
      }
    );
    const data = response?.data;
    setThekeperKam(data.data);
    console.log("fjfjf", data);
  } catch (error) {
    console.log("Error:", error);
  }
};







export default function Theke_k_Kaam({ navigation, route }) {
  const {thekejobs} = route?.params?.item;
  console.log("params:::::", thekejobs, thekejobs.datetime,);
  return (
    <>
      <SafeAreaView style={{ backgroundColor: "#fff", flex: 1 }}>
        <View style={{ padding: 20, marginTop: 25 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrowleft" size={25} />
          </TouchableOpacity>
        </View>
        <View style={{ justifyContent: "center" }}>
          <Text
            style={{ textAlign: "center", fontSize: 30, fontWeight: "600" }}
          >
            ठेके का काम
          </Text>
        </View>

        <ScrollView horizontal={false} showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <View style={[styles.inputView, { height: 80 }]}>
              <Text style={styles.label}>काम का विवरण</Text>
              <TextInput
                style={styles.TextInput}
                placeholderTextColor="#848484"
                placeholder={thekejobs?.description}
              />
            </View>
            <View style={[styles.inputView, { height: 40 }]}>
              <Text style={styles.label}>गाँव</Text>
              <Text  style={[styles.TextInput,{color:'#848484'}]}>{thekejobs?.village}</Text>
              {/* <TextInput
                style={styles.TextInput}
                placeholderTextColor="#848484"
                placeholder={thekejobs?.village}
              /> */}
            </View>

            <View
              style={[
                styles.inputView,
              {flexDirection:'row', justifyContent:'space-between', alignItems:'center'}
              ]}
            >
              <Text style={styles.TextInput}>
                {moment(thekejobs?.date).format("l")}
              </Text>
              <Text style={styles.TextInput}>
                {moment(thekejobs?.time).format("HH:mm")}
              </Text>
            </View>
            <View style={[styles.inputView, styles.inputbox]}>
              <Text style={styles.label}>भूमि क्षेत्र</Text>
              <TextInput
                style={styles.TextInput}
                placeholderTextColor="#848484"
                placeholder=""
              />
              <Text style={{ marginTop: 5, right: 10, color: "#0070C0" }}>
               {thekejobs?.land_area}{thekejobs?.land_type}
              </Text>
            </View>

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
              }}
            ></View>

            <View style={[styles.inputView, styles.inputbox]}>
              <TextInput
                style={styles.TextInput}
                placeholder="किसान से वेतन"
                placeholderTextColor={"#000"}
              />
              <Text style={{ marginTop: 5, right: 10, color: "#0070C0" }}>
                2
              </Text>
            </View>

            <View style={[styles.inputView, styles.inputbox]}>
              <TextInput
                style={styles.TextInput}
                placeholder="फावड़ा की फीस"
                placeholderTextColor={"#000"}
              />
              <Text style={{ marginTop: 5, right: 10, color: "#0070C0" }}>
             {thekejobs?.fawda_fee}
              </Text>
            </View>

            <View style={[styles.inputView, styles.inputbox]}>
              <TextInput
                style={styles.TextInput}
                placeholder="आपका भुगतान"
                placeholderTextColor={"#000"}
              />
              <Text style={{ marginTop: 5, right: 10, color: "#0070C0" }}>
             {thekejobs?.total_amount_theka}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate("MeraKaam")}
              style={styles.loginBtn}
            >
              <Text style={[styles.loginText, { color: "#fff", lineHeight:40 }]}>
                बुकिंग करें
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 10,
  },
  OptionButton: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
    margin: 20,
  },

  sahayak: {
    width: "40%",
    color: "#505050",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    borderRadius: 10,
    backgroundColor: "#44A347",
  },

  machine: {
    width: "40%",
    flexDirection: "row",
    color: "#505050",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#505050",
  },

  loginText: {
    color: "#000",
    fontSize: 16,
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

  loginBtn: {
    width: "100%",
    borderRadius: 7,
    height: 40,
   
    alignItems: "center",
    textAlign: "center",
    marginTop: 20,
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
    height: 50,
    marginTop: 20,
    borderWidth: 1,
  },

  TextInput: {
    // height: 50,
    paddingHorizontal: 10,
   
    // fontFamily: "Poppin-Light"
  },

  CheckTextInput: {
    textAlign: "center",
    marginTop: 10,
  },

  TaxView: {
    borderColor: "#0070C0",
    borderRadius: 7,
    // borderBottomRightRadius: 7,
    width: "35%",
    // height: 100,
    marginTop: 20,
    borderWidth: 1,
  },

  BhumiView: {
    borderColor: "#0070C0",
    borderRadius: 7,
    // borderBottomRightRadius: 0,
    // borderTopRightRadius:0,
    width: "35%",
    height: 48,
    marginTop: 20,
    borderWidth: 1,
  },

  TimeView: {
    borderColor: "#0070C0",
    borderRadius: 7,
    // borderBottomRightRadius: 7,
    width: "35%",
    // height: 100,
    marginTop: 20,
    borderWidth: 1,
  },
  label: {
    position: "absolute",
    top: -10,
    left: 30,

    textAlign: "center",
    backgroundColor: "#fff",
  },
  inputbox: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    height: 38,
  },
});
