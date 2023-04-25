import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import service from "../service";
import Toast from 'react-native-root-toast';

import Icon from "react-native-vector-icons/AntDesign";
import { selectToken } from "../slices/authSlice";

export default function Payment({ route, navigation }) {
  const token = useSelector(selectToken);
  const { totalamount, fawdafee, useramount, item } = route.params ?? {};

  console.log("payment page",  item);

  const [amount, setAmount] = useState(route?.params?.totalamount?.toString());
  const [upiId, setUpiId] = useState("");
  const [name, setName] = useState("");

  const paymentStatus = async () => {
    try {
      const params = {
        job_id: JSON.stringify(item?.job_id),
        job_number: item?.job_number,
        amount: amount,
        upi_id: upiId,
        beneficiary_name: name,
      };
      console.log("oadkfdjkdd", params);

      const response = await service.post("/api/payment_test/", params, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;
    
      console.log("Data: ", data);
      if (item.job_type === "individuals_sahayak") {
        navigation.navigate("Mybooking_Sahayak2", {
          data: item.booking_id,
          payment_status: data.payment_status,
          item,
          amount: amount,
          useramount: useramount
        });
      } else if (item.job_type === "theke_pe_kam") {
        navigation.navigate("Theke_MachineForm2", {
          data: data.booking_id,
          payment_status: data.payment_status,
          item,
          amount: amount,
          useramount: useramount
        });
      } else if (item.job_type === "machine_malik") {
        navigation.navigate("MachineWork2", {
          data: data.booking_id,
          payment_status: data.payment_status,
          item,
          amount: amount,
          useramount: useramount
        });
      }

      Toast.show("Payment Updated Successfully!!!", Toast.SHORT);
    } catch (error) {
      console.error("Error: ", error);
      throw new Error("Unable to process payment");
    }
  };

  return (
    <>
      <SafeAreaView style={{ backgroundColor: "#fff", flex: 1 }}>
        <View style={{ padding: 20, marginTop: 25 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrowleft" size={25} />
          </TouchableOpacity>
        </View>

        <View>
          <ScrollView horizontal={false} showsVerticalScrollIndicator={false}>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <View style={{ justifyContent: "center" }}>
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 30,
                    fontWeight: "600",
                  }}
                >
                  भुगतान का विवरण
                </Text>
              </View>

              <View
                style={{
                  borderWidth: 1,
                  width: "90%",
                  paddingHorizontal: 10,
                  height: 'auto',
                  borderColor: "#0099FF",
                  marginTop: 30,
                  borderWidth: 0.6,
                  borderRadius: 4,
                }}
              >
                <View style={styles.flex}>
                  <Text>Upi Id</Text>

                  <TextInput
                    placeholder="उपि आईडी"
                    autoCapitalize="none"
                    value={upiId}
                    onChangeText={setUpiId}
                  />
                </View>
                {item?.job_type === "theke_pe_kam" ||
                item?.job_type === "individuals_sahayak" ? (
                  <View style={styles.flex}>
                    <Text>{item?.job_type === "theke_pe_kam" ?  "ठेकेदार को वेतन" : "सहायक या सहायकों को वेतन "}  </Text>

                    <Text>₹{useramount}</Text>
                  </View>
                ) : (
                  <View style={styles.flex}>
                    <Text>मशीन मालिक को वेतन</Text>

                    <Text>₹{useramount}</Text>
                  </View>
                )}

                <View style={styles.flex}>
                  <Text>ठेकेदार/सहायक</Text>

                  <TextInput
                    placeholder="लाभार्थी का नाम"
                    autoCapitalize="none"
                    value={name}
                    onChangeText={setName}
                  />
                </View>

                <View style={styles.flex}>
                  <Text>फावड़ा की फीस</Text>
                  <Text style={{ color: "#0099FF" }}>₹{fawdafee}</Text>
                </View>

                <View style={styles.flex}>
                  <Text>कुल भुगतान</Text>
                  <TextInput
                    placeholder="राशि"
                    keyboardType="numeric"
                    autoCapitalize="none"
                    value={amount}
                    onChangeText={setAmount}
                  />
                </View>
              </View>
            </View>
            {/* <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: "#44A347",
              marginRight: 20,
              width: "33%",
              marginTop: 20,
              height: 33,
            }}
          >
            <Text style={{ textAlign: "center", marginTop: 6, color: "#fff" }}>
              चालान डाउनलोड करें
            </Text>
          </View>
        </View> */}

            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <TouchableOpacity
                style={styles.BhuktanBtn}
                onPress={paymentStatus}
              >
                <Text style={[styles.loginText, { color: "#fff" }]}>
                  अभी भुगतान करें
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  BhuktanBtn: {
    width: "85%",
    borderRadius: 10,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    backgroundColor: "#0099FF",
  },
  loginText: {
    color: "#000",
    fontSize: 16,
    //   flexDirection:"column",
  },
  flex: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
});
