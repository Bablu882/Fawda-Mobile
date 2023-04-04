import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import service from "../service";
import Toast from "react-native-simple-toast";
import Icon from "react-native-vector-icons/AntDesign";
import { selectToken } from "../slices/authSlice";

export default function Payment({ route, navigation }) {

  const [amount, setAmount] = useState(0);
  const [upiId, setUpiId] = useState("");
  const [name, setName] = useState("");
  const token = useSelector(selectToken);
  const { item } = route.params ?? {};

  console.log("payment page", item);

  const paymentStatus = async () => {
    try {
      const params = {
        booking_id: JSON.stringify(item?.booking_id),
        amount: amount,
        upi_id: upiId,
        beneficiary_name: name,
      };
console.log('oadkfdjkdd', params)
      const response = await service.post("/api/payment_test/", params, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token?.access}`,
        },
      });

      const data = response.data;
      console.log("Data: ",  data);
      if (item.job_type === "individuals_sahayak") {
        navigation.navigate("Mybooking_Sahayak2", {
         data : data.booking_id,
         payment_status: data.payment_status
         
        });
      } else if (item.job_type === "theke_pe_kam") {
        navigation.navigate("Theke_MachineForm2", {
          data : data.booking_id,
          payment_status: data.payment_status
        });
      }
      else if (item.job_type === "MachineMalik") {
        navigation.navigate("MachineWork2"), {
          data : data.booking_id,
          payment_status: data.payment_status
        }
      }
      Toast.show('Payment Updated Successfully!!!', Toast.SHORT);
  
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
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <View style={{ justifyContent: "center" }}>
            <Text
              style={{ textAlign: "center", fontSize: 30, fontWeight: "600" }}
            >
              भुगतान का विवरण
            </Text>
          </View>

          <View
            style={{
              borderWidth: 1,
              width: "90%",
              paddingHorizontal: 10,
              height: 200,
              borderColor: "#0099FF",
              marginTop: 30,
            }}
          >
            <View
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ marginTop: 20, marginLeft: 15 }}>Upi Id</Text>

              {/* <TextInput  placeholder="" value={amount} onC /> */}
              {/* <Text
                style={{ marginTop: 20, color: "#0099FF", marginRight: 25 }}
              >
                ₹ 1200.00
              </Text> */}
              <TextInput
                placeholder="उपि आईडी"
                autoCapitalize="none"
                value={upiId}
                onChangeText={setUpiId}
              />
            </View>
            <View
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ marginTop: 20, marginLeft: 15 }}>
                ठेकेदार/सहायक
              </Text>

              {/* <TextInput  placeholder="" value={amount} onC /> */}
              {/* <Text
                style={{ marginTop: 20, color: "#0099FF", marginRight: 25 }}
              >
                ₹ 1200.00
              </Text> */}
              <TextInput
                placeholder="लाभार्थी का नाम"
                autoCapitalize="none"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ marginTop: 20, marginLeft: 15 }}>
                फावड़ा की फीस
              </Text>
              <Text
                style={{ marginTop: 20, color: "#0099FF", marginRight: 25 }}
              >
                ₹{item?.fawda_fee}
              </Text>
            </View>

            <View
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ marginTop: 20, marginLeft: 15 }}>कुल भुगतान</Text>
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
        <View
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
        </View>

        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <TouchableOpacity
            style={styles.BhuktanBtn}
            onPress={ paymentStatus}
          >
            <Text style={[styles.loginText, { color: "#fff" }]}>
              अभी भुगतान करें
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  BhuktanBtn: {
    width: "85%",
    borderRadius: 7,
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
});
