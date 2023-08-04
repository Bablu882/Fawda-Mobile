import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  BackHandler,
} from "react-native";
import Icon from "react-native-vector-icons/Octicons";
import Feather from "react-native-vector-icons/Feather";
import * as Clipboard from "expo-clipboard";

import {
  selectToken,
  selectUserType,
  selectReferCode,
  setRefer,
} from "../slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import service from "../service";

export default function Refer() {
  const [referCode, setReferCode] = useState("");
  const referalCode = useSelector(selectReferCode);
  console.log("refer code", referalCode);
  console.log("Refer Code", referCode);
  const [copyReferCode, setCopyReferCode] = useState("");
  const [jobCount, setJobCount] = useState(0);
  console.log("Jobcount", jobCount);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector(selectToken);

  const checkJobCount = async () => {
    setIsLoading(true);
    setRefreshing(true);
    try {
      const response = await service.get("/api/get-job-count", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response?.data;
      console.log("data", data);
      setJobCount(data?.job_count);
      setRefreshing(false);
      setIsLoading(false);
    } catch (error) {
      console.log("error", error);
    }
  };

  const generateReferCode = async () => {
    setIsLoading(true);
    setRefreshing(true);

    try {
      const response = await service.post("/api/generate-refer-code/", null, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response?.data;
      console.log("Refer Code", data);
      setReferCode(data?.refer_code);
      dispatch(setRefer(data?.refer_code));
      setIsLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.log(error);
    }
  };

  const CopyToClipBoard = () => {
    Clipboard.setStringAsync(referalCode);
    console.log("Copy to clipboard");
  };

  useEffect(() => {
    checkJobCount();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    checkJobCount().then(() => {
      setRefreshing(false);
    });
  }, []);

  return (
    <SafeAreaView style={{ backgroundColor: "#fff", flex: 1 }}>
      <View style={{ padding: 20, marginTop: 25, alignItems: "center" }}>
        <Image
          source={require("../assets/image/Fawda-logo.png")}
          style={{ width: 100, height: 100 }}
        />
      </View>
      <View>
        {isLoading && <ActivityIndicator size="small" color="#black" />}
      </View>
      {!isLoading && (
        <ScrollView
          horizontal={false}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.container}>
            <View style={[styles.commentContainer]}>
              <Text style={styles.commentText}>
                Fawda की इस रोज़गार सुविधा के बारे में मेरे अपने साथियों को भी
                बताएं।
              </Text>
              <View style={{ alignItems: "center" }}>
                <Text
                  style={{
                    fontFamily: "Devanagari-regular",
                    fontSize: 13,
                    // fontWeight: "600",
                    color: "#0099FF",
                  }}
                >
                  <Icon name="dot-fill" size={12} /> पहली बुकिंग पर कोई फावड़ा
                  शुल्क नहीं है।{"\n"}
                  <Icon name="dot-fill" size={12} /> अगली 2 बुकिंग पर अपने
                  पार्टनर्स को Fawda रेफर करके,{"\n"} Fawda फीस पर 50% की छूट
                  प्राप्त करें।
                </Text>
              </View>
            </View>
            <View style={[styles.commentContainer, { marginTop: 10 }]}>
              <Text
                style={{
                  fontFamily: "Devanagari-regular",
                  fontSize: 15,
                  // fontWeight: "600",
                  color: "#0099FF",
                }}
              >
                <Icon name="dot-fill" size={13} /> पहली बुकिंग पूरी होने के बाद,
                आपको रेफर कोड प्रदान किया जाएगा।{"\n"}
                <Icon name="dot-fill" size={13} /> रेफर कोड प्राप्त करने के बाद
                , कृपया अपने सहयोगियों को Fawda के बारे में बताएं और रेफर कोड
                दें।
                {"\n"}
                <Icon name="dot-fill" size={13} /> इसके द्वारा अपने पार्टनर को
                रेफर करें और एक बार और छूट पाएं।
              </Text>
            </View>
            {referCode === "" || referalCode === "" ? (
              jobCount === 0 ? (
                <View style={[styles.commentContainer, { marginTop: 30 }]}>
                  <Text
                    style={{
                      fontFamily: "Devanagari-regular",
                      fontSize: 15,
                      // fontWeight: "600",
                      color: "#0099FF",
                    }}
                  >
                    रेफर कोड प्राप्त करने के लिए कृपया पहली बुकिंग पूरी करें।
                  </Text>
                </View>
              ) : (
                <View style={styles.referContainer}>
                  <View style={[styles.inputView]}>
                    <Text
                      style={{
                        height: 50,
                        padding: 10,
                        fontFamily: "Devanagari-regular",
                        color: "#0099FF",
                        fontSize: 18,
                        marginLeft: 70,
                      }}
                    >
                      {referCode}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      generateReferCode();
                    }}
                    style={{
                      position: "absolute",
                      right: 0,
                      backgroundColor: "#0099FF",
                      paddingVertical: 13,
                      bottom: 0,
                      paddingHorizontal: 18,
                      borderRadius: 8,
                      elevation: 7,
                      marginRight: -30,
                      width: "40%",
                    }}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: 12,
                        fontFamily: "Devanagari-bold",
                      }}
                    >
                      रेफर कोड जनरेट करें
                    </Text>
                  </TouchableOpacity>
                </View>
              )
            ) : (
              <View>
                <View style={[styles.referComment, { marginTop: 20 }]}>
                  <Text style={styles.label}>रेफरल कोड</Text>
                  <Text
                    style={{
                      fontFamily: "Devanagari-regular",
                      fontSize: 18,
                      fontWeight: "600",
                      color: "#0099FF",
                      alignSelf: "center",
                    }}
                  >
                    {referCode || referalCode}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={CopyToClipBoard}
                  style={[styles.loginBtn]}
                >
                  <Text style={[styles.loginText]}>कोड कॉपी करें</Text>
                </TouchableOpacity>
              </View>
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
    // backgroundColor: "#fff",
    // alignItems: "center",
    justifyContent: "center",
  },
  commentContainer: {
    padding: 10,
    // marginTop: 10,
    width: "95%",
    borderColor: "#0070C0",
    borderRadius: 9,
    borderWidth: 1,
    alignSelf: "center",
  },
  referComment: {
    padding: 10,
    // marginTop: 10,
    width: "70%",
    borderColor: "#0070C0",
    borderRadius: 9,
    borderWidth: 1,
    alignSelf: "center",
  },
  referContainer: {
    flexDirection: "row",
    flex: 1,
    position: "relative",
    alignItems: "center",
    // marginTop: 20,
    width: "90%",
  },
  inputView: {
    borderColor: "#0099FF",
    borderRadius: 7,
    // borderBottomRightRadius: 7,
    width: "65%",
    height: 48,
    marginTop: 10,
    borderWidth: 1,
    marginLeft: 10,
  },
  commentText: {
    fontFamily: "Devanagari-bold",
    fontSize: 23,
    // fontWeight: "600",
    color: "#0099FF",
  },
  label: {
    position: "absolute",
    top: -10,
    left: 10,
    marginHorizontal: 5,
    paddingHorizontal: 10,
    fontFamily: "Devanagari-bold",
    backgroundColor: "#fff",
  },
  loginBtn: {
    width: "40%",
    borderRadius: 9,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    backgroundColor: "#0099FF",
    marginBottom: 10,
    alignSelf: "center",
  },
  loginText: {
    color: "#fff",
    fontFamily: "Devanagari-regular",
    fontSize: 16,
  },
});
