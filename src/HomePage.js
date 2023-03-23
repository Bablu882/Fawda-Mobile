import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

export default function Homepage({ navigation }) {
  const [show, setShow] = useState(false);
  const [activeButton, setActiveButton] = useState("");
  const [sahayak, setSahayak] = useState("");
  const isfocused = useIsFocused();

  return (
    <View style={styles.container}>
        <Image
          source={require("../assets/image/Fawda-logo.png")}
          style={{ width: 200, height: 200, alignItems: "center" }}
        />

        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 28, fontWeight: "600", color: "#000" }}>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
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
