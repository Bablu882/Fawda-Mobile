import React, { useState, useEffect, useRef } from "react";
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
import { selectToken, selectUserType } from "../slices/authSlice";
import moment from "moment";

const CustomComponent = ({ label, value }) => {
  return (
    <View
      style={[
        styles.inputView,
        styles.inputbox,
        {
          flexDirection: "row",
          justifyContent: "space-around",
          paddingHorizontal: 10,
        },
      ]}
    >
      <TextInput
        style={[styles.TextInput, { width: "100%" }]}
        placeholder={label}
        placeholderTextColor={"#000"}
      />
      <Text style={{ marginTop: 5, right: 10, color: "#0070C0" }}>{value}</Text>
    </View>
  );
};

function Theke_MachineForm({ navigation, route }) {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const usertype = useSelector(selectUserType);
  console.log("usrrjfjf", usertype);
  const [checked, setChecked] = React.useState("first");
  const [thekeperKam, setThekeperKam] = useState({ status: "pending" });
  const [amount, setAmount] = useState({});
  const [edit, setEdit] = useState(false);
  const [editable, setEditable] = useState(false);

  const textInputRef = useRef(null);
  const handleClick = () => {
    textInputRef.current.focus();
  };
  const { id, item } = route.params;

  console.log("fnfjff", item);
  const accptThekha = async () => {
    let params = {
      job_id: item?.id,
    };
    console.log("jjff", params);
    try {
      const response = await service.post("/api/accept_theka/", params, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token?.access}`,
        },
      });
      const data = response?.data;
      console.log("aaaa", data);
      setThekeperKam(data?.data);
      console.log("rrrr", thekeperKam);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const Edit = async () => {
    let params =
      // {
      // job_id:"95",
      // amount:"2221"
      // }
      {
        job_id: item?.id,
        amount: amount,
      };
    console.log(params, "params");

    try {
      const response = await service.post("/api/edit_thekepekam/", params, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token?.access}`,
        },
      });
      console.log(token?.access, "token");
      const data = response?.data;
      // setThekeperKam(data.data);
      console.log("fjfjf", data);
    } catch (error) {
      console.log("Error:", error);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ padding: 20, marginTop: 25 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrowleft" size={25} />
        </TouchableOpacity>
      </View>
      <View style={{ alignItems: "center", flex: 1 }}>
        <Text style={{ textAlign: "center", fontSize: 30, fontWeight: "600" }}>
          {item?.job_type}
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
          <Text style={[styles.TextInput]}>{item.description}</Text>
          <Image
            source={require("../assets/image/edit.png")}
            style={{ width: 20, height: 20, marginTop: 10, right: 10 }}
          />
        </View>

        <View
          style={[styles.inputView, styles.flex, styles.justifyContentBetween]}
        >
          <Text style={styles.TextInput}>{moment(item?.date).format("l")}</Text>
          <Text style={styles.TextInput}>
            {moment(item?.time).format("HH:mm")}
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
              placeholder={item?.land_area}
              placeholderTextColor={"#000"}
            />
            <Text style={{ marginTop: 13, marginRight: 8, color: "#0099FF" }}>
              {item?.land_type}
            </Text>
          </View>

          {/* <View
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
              ₹ {item?.total_amount_theka}
            </Text>
          </View> */}
          <View
            style={[
              styles.BhumiView,
              styles.flex,
              styles.justifyContentBetween,
            ]}
          >
            <TextInput
              editable={edit}
              ref={textInputRef}
              onChangeText={(amount) => setAmount(amount)}
              value={amount}
              defaultValue={item?.total_amount_theka}
            />
          </View>
        </View>
        {/* {usertype === "Grahak" && (
           
          )} */}
        {usertype && usertype === "Grahak" && (
          <>
            <View
              style={[
                styles.flex,
                { marginTop: 10, justifyContent: "space-between" },
              ]}
            >
              <View style={{ width: "40%" }}></View>
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                onPress={() => {handleClick(); setEdit(true); console.log('edit:::::',edit)}}
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
                onPress={() => Edit()}
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
            </View>
            <View
              style={[
                styles.inputView,
                styles.flex,
                styles.justifyContentBetween,
              ]}
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
                {console.log("thekeperKam?.status", thekeperKam?.status)}
                <TouchableOpacity>
                  <Text
                    style={{
                      textAlign: "center",
                      marginTop: 5,
                      color: "#fff",
                      fontSize: 15,
                      fontWeight: "600",
                    }}
                  >
                    Pending
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.BhuktanBtn}
              onPress={() =>
                navigation.navigate("Payment", {
                  item: item.job_type,
                  id: id,
                  item: item,
                })
              }
              // onPress = {() => toggleViews()}
            >
              <Text style={[styles.loginText, { color: "#fff" }]}>
                भुगतान करें
              </Text>
            </TouchableOpacity>
          </>
        )}
        <View style={styles.flex}>
          <View style={{ width: "50%" }}></View>
        </View>
        <View
          style={{
            flex: 1,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <>
            {usertype &&
              (usertype === "Sahayak" || usertype === "MachineMalik") && (
                <>
                  <CustomComponent
                    label="किसान से वेतन"
                    value={item?.salary_from_farmer}
                  />
                  <CustomComponent
                    label="फावड़ा की फीस"
                    value={item?.fawda_fee}
                  />
                  <CustomComponent
                    label="आपका भुगतान"
                    value={item?.total_amount_theka}
                  />
                  <View
                    style={[
                      styles.inputView,
                      styles.flex,
                      styles.justifyContentBetween,
                    ]}
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
                      {console.log("thekeperKam?.status", thekeperKam?.status)}
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
                </>
              )}
          </>
        </View>

        {usertype &&
          (usertype === "Sahayak" || usertype === "MachineMalik") && (
            <TouchableOpacity
              style={styles.BhuktanBtn}
              onPress={() => accptThekha()}
              // onPress = {() => toggleViews()}
            >
              <Text style={[styles.loginText, { color: "#fff" }]}>
                काम स्वीकार करें
              </Text>
            </TouchableOpacity>
          )}
      </View>

      <View style={{ marginTop: "auto", padding: 5 }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
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
  salaryAmount: {
    marginTop: 13,
    marginRight: 8,
    color: "#0099FF",
  },
});
