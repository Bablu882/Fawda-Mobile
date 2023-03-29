import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import { useDispatch, useSelector } from "react-redux";
import service from "../service";
import { selectIsLoggedIn, setToken, selectToken } from "../slices/authSlice";
import moment from "moment";

export default function MyBooking({ navigation, route }) {
  const { user } = route?.params ?? {};
  console.log("djdfjf", user);
  const dispatch = useDispatch();
  const token = useSelector(selectToken);

  const [machineBooking, setMachineBooking] = useState([]);
  const [machinePending, setMachinePending] = useState([]);
  const [sahayakPending, setSahayakPending] = useState([]);
  const [sahaykBooking, setSahayakBooking] = useState([]);

  //=====api integration of MyBooking======//
  const booking = async () => {
    try {
      const response = await service.get("api/my_booking_details/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token?.access,
        },
      });
      const data = response.data;
      setSahayakPending(data?.sahayak_pending_booking_details);
      setSahayakBooking(data?.sahayk_booking_details?.bookings);
      setMachineBooking(data?.machine_malik_booking_details);
      setMachinePending(data?.machine_malik_pending_booking_details);
      console.log("data:::", data);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  
  useEffect(() => {
    booking();
  }, [0]);

  return (
    <SafeAreaView style={{ backgroundColor: "#fff", flex: 1 }}>
      <View style={{ padding: 20, marginTop: 25 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrowleft" size={25} />
        </TouchableOpacity>
      </View>
      <ScrollView horizontal={false} showsVerticalScrollIndicator={false}>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <View style={{ justifyContent: "center" }}>
            <Text
              style={{ textAlign: "center", fontSize: 30, fontWeight: "600" }}
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
              {sahayakPending?.length > 0 && sahayakPending?.map((item, index) => (
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
                      {item.job_type}
                    </Text>
                    <Text style={{ color: "black" }}>
                      {moment(item.date).format("l")}
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
                          item.status === "Pending"
                        ) {
                          navigation.navigate("MyBook_SahayakForm", {
                            id: item.id,
                            item,
                          });
                        } else if (
                          item.job_type === "theke_pe_kam" &&
                          item.status === "Pending"
                        ) {
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
                        {item.status}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
              {sahaykBooking?.length > 0 && sahaykBooking?.map((item) => (
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
                      {item.job_type}
                    </Text>
                    <Text style={{ color: "black" }}>{item.count_female}</Text>
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
                    <TouchableOpacity>
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
                  </View>
                </View>
              ))}
              {machinePending?.length > 0 && machinePending?.map((item, index) => (
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
                      {item.job_type}
                    </Text>
                    <Text style={{ color: "black" }}>
                      {moment(item.date).format("l")}
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
                    // onPress={() => navigation.navigate("Theke_MachineForm")}
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
                  </View>
                </View>
              ))}
              {machineBooking?.length > 0 && machineBooking?.map((item, index) => (
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
                      {item.job_type}
                    </Text>
                    <Text style={{ color: "black" }}>
                      {moment(item.date).format("l")}
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
                    //onPress={() => navigation.navigate("Theke_MachineForm")}
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
      </ScrollView>
    </SafeAreaView>
  );
}
