import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import service from "../service";
import Toast from "react-native-simple-toast";

import Icon from "react-native-vector-icons/AntDesign";
import { selectToken, selectUserType } from "../slices/authSlice";
import { WebView } from "react-native-webview";

export default function Payment({ route, navigation }) {
  const token = useSelector(selectToken);
  const {
    totalamount,
    fawdafee,
    useramount,
    item,
    countprice,
    acceptmale,
    acceptfemale,
    fawdafees,
    totalamounts,
  } = route.params ?? {};

  console.log("params", route.params);

  const [amount, setAmount] = useState(route?.params?.totalamount?.toString());
  const [isLoading, setIsLoading] = useState(false);
  const [upiId, setUpiId] = useState("");
  const [name, setName] = useState("");
  const [paymentEncryptedParams, setPaymentEncryptedParams] = useState("");
  console.log("encrypted params", paymentEncryptedParams);
  const [webViewLoaded, setWebViewLoaded] = useState(false);
  const [htmlResponse, setHtmlResponse] = useState(null);
  const usertype = useSelector(selectUserType);
  const numBookings = route?.params?.bookings;

  const paymentStatus = async () => {
    try {
      const params = {
        job_id: JSON.stringify(item?.job_id),
        job_number: item?.job_number,
        amount: amount,
        upi_id: upiId,
        beneficiary_name: name,
      };

      const response = await service.post("/api/payment_test/", params, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;
      if (item.job_type === "individuals_sahayak") {
        // navigation.replace("HomeStack", { screen: "BottomTab" });
        navigation.navigate("MyBookingStack", { screen: "MyBooking" });
      } else if (item.job_type === "theke_pe_kam") {
        // navigation.replace("HomeStack", { screen: "BottomTab" });
        navigation.navigate("MyBookingStack", { screen: "MyBooking" });
      } else if (item.job_type === "machine_malik") {
        // navigation.replace("HomeStack", { screen: "BottomTab" });
        navigation.navigate("MyBookingStack", { screen: "MyBooking" });
      }

      Toast.show("भुगतान सफलतापूर्वक अपडेट किया गया है!", Toast.LONG);
    } catch (error) {
      console.error("Error: ", error);
      navigation.replace("HomeStack", { screen: "BottomTab" });
      Toast.show("भुगतान विफल हो गया है! कृपया पुन: प्रयास करें !", Toast.LONG);
      // throw new Error("Unable to process payment");
    }
  };

  useEffect(() => {
    const encryptedParams = async () => {
      setIsLoading(true);

      let params = {
        job_id: JSON.stringify(item?.job_id),
        job_number: item?.job_number,
        amount: amount,
      };
      console.log(params);

      try {
        const response = await service.post(`/api/payment/`, params, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response?.data;
        console.log("encrypted data", data);
        setPaymentEncryptedParams(data);
      } catch (error) {
        console.log("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    encryptedParams();
  }, []);

  const checkStatus = async () => {
    setIsLoading(true);
    let params = {};
    if (item?.job_type !== "machine_type") {
      params = {
        sahayak_job_id: JSON.stringify(item?.job_id),
        sahayak_job_number: item?.job_number,
      };
    } else {
      params = {
        machine_job_id: JSON.stringify(item?.job_id),
        machine_job_number: item?.job_number,
      };
    }

    try {
      const cacheBuster = new Date().getTime();
      const response = await service.post(
        `api/refresh-my-booking/?cacheBuster=${cacheBuster}`,
        params,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response?.data;

      if (usertype && usertype === "Grahak") {
        if (item?.job_type === "individuals_sahayak") {
          if (response?.data?.sahayk_booking_details?.bookings.length > 0) {
            const bookingsNumber =
              response?.data?.sahayk_booking_details?.bookings.length;

            if (numBookings > bookingsNumber) {
              navigation.replace("HomeStack", { screen: "BottomTab" });
              Toast.show(
                "यह बुकिंग सहायक द्वारा रद्द कर दी गई है।कृपया बुकिंग पुनः लोड करें!",
                Toast.LONG
              );
            } else if (numBookings < bookingsNumber) {
              navigation.replace("HomeStack", { screen: "BottomTab" });
              Toast.show(
                "यह बुकिंग एक अन्य सहायक द्वारा स्वीकार की गई है। कृपया बुकिंग पुनः लोड करें!",
                Toast.LONG
              );
            } else if (numBookings === bookingsNumber) {
              fetchPaymentHtml();
              // paymentStatus();
            }
          } else {
            navigation.replace("HomeStack", { screen: "BottomTab" });
            Toast.show(
              "यह बुकिंग सहायक द्वारा रद्द कर दी गई है।कृपया नौकारी पुनः लोड करें!",
              Toast.LONG
            );
          }
        } else if (item?.job_type === "theke_pe_kam") {
          const statusCheck =
            data?.sahayak_pending_booking_details[0]?.status || "";
          const accept_data = data?.booking_theke_pe_kam[0] || {};
          if (statusCheck === "Pending") {
            navigation.replace("HomeStack", { screen: "BottomTab" });
            Toast.show("यह बुकिंग सहायक द्वारा रद्द कर दी गई है।", Toast.LONG);
          } else {
            fetchPaymentHtml();
            // paymentStatus();
          }
        } else if (item?.job_type === "machine_malik") {
          const statusCheck =
            data?.machine_malik_pending_booking_details[0]?.status || "";
          const accept_data = data?.machine_malik_booking_details[0] || {};
          if (statusCheck === "Pending") {
            navigation.replace("HomeStack", { screen: "BottomTab" });
            Toast.show(
              "यह बुकिंग मशीन मलिक द्वारा रद्द कर दी गई है।",
              Toast.LONG
            );
          } else {
            fetchPaymentHtml();
            // paymentStatus();
          }
        }
      }
      setIsLoading(false);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const fetchPaymentHtml = async () => {
    setIsLoading(true);
    let params = {
      merchant_data: paymentEncryptedParams,
    };
    try {
      const response = await service.post("/ccavRequestHandler/", params, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const html = response.data;
      // console.log("HTML", html);
      setHtmlResponse(html);
      setWebViewLoaded(true);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onWebViewMessage = (event) => {
    setIsLoading(true);
    const html = event.nativeEvent.data;
    const sanitizedHtml = html.replace(/\\/g, "");

    // Extract the JSON string from the HTML within the <pre> tag
    const jsonMatch = sanitizedHtml.match(/<pre[^>]*>(.*?)<\/pre>/s);
    if (jsonMatch) {
      try {
        const jsonString = jsonMatch[1];
        const jsonData = JSON.parse(jsonString);
        console.log(jsonData.message);
        const status = jsonData.data.order_status;
        console.log("status", status);
        if (status === "Success") {
          setWebViewLoaded(false);
          navigation.replace("ThankyouPayment");
        } else {
          setWebViewLoaded(false);
          navigation.replace("HomeStack", { screen: "BottomTab" });
          Toast.show(
            "भुगतान विफल हो गया है! कृपया पुन: प्रयास करें !",
            Toast.LONG
          );
        }
        // Use the jsonData object as needed
      } catch (err) {
        console.warn("Error:", err);
        setWebViewLoaded(false);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleWebViewLoad = () => {
    setWebViewLoaded(true);
  };

  if (webViewLoaded && htmlResponse) {
    return (
      <View style={{ flex: 1 }}>
        <WebView
          source={{ html: htmlResponse }}
          onLoad={handleWebViewLoad}
          injectedJavaScript={`window.ReactNativeWebView.postMessage(JSON.stringify(document.body.innerHTML));`}
          onMessage={onWebViewMessage}
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ backgroundColor: "#fff", flex: 1 }}>
      <View style={{ padding: 20, marginTop: 25 }}>
        <View>
          {isLoading && <ActivityIndicator size="small" color="#black" />}
        </View>
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
                height: "auto",
                borderColor: "#0099FF",
                marginTop: 30,
                borderWidth: 0.6,
                borderRadius: 4,
              }}
            >
              {/* <View style={styles.flex}>
                  <Text>Upi Id</Text>

                  <TextInput
                    placeholder="उपि आईडी"
                    autoCapitalize="none"
                    value={upiId}
                    onChangeText={setUpiId}
                  />
                </View> */}
              {item?.job_type === "theke_pe_kam" ||
              item?.job_type === "individuals_sahayak" ? (
                <View style={styles.flex}>
                  <Text>
                    {item?.job_type === "theke_pe_kam"
                      ? "ठेकेदार को वेतन"
                      : "सहायक या सहायकों को वेतन "}{" "}
                  </Text>

                  {item.job_type === "theke_pe_kam" ? (
                    <Text>₹{useramount}</Text>
                  ) : (
                    <Text>₹{countprice}</Text>
                  )}
                </View>
              ) : (
                <View style={styles.flex}>
                  <Text>मशीन मालिक को वेतन</Text>

                  {item.job_type === "theke_pe_kam" ? (
                    <Text>₹ {useramount}</Text>
                  ) : (
                    <Text>₹ {useramount}</Text>
                  )}
                </View>
              )}
              <View style={styles.flex}>
                <Text>फावड़ा की फीस</Text>
                {fawdafee === "0.0" ? (
                  <Text>पहली बुकिंग मुफ़्त</Text>
                ) : (
                  <Text>₹ {fawdafee}</Text>
                )}
              </View>

              <View style={styles.flex}>
                <Text>कुल भुगतान</Text>
                {item.job_type === "theke_pe_kam" ? (
                  <Text>₹ {amount}</Text>
                ) : (
                  <Text>₹ {amount}</Text>
                )}
              </View>
            </View>
          </View>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <TouchableOpacity style={styles.BhuktanBtn} onPress={checkStatus}>
              <Text style={[styles.loginText, { color: "#fff" }]}>
                अभी भुगतान करें
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
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
