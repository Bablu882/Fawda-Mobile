import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Image,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import service from "../service";
import { selectToken } from "../slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

export default function MyBook_SahayakForm({ navigation, route }) {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const [thekeperKam, setThekeperKam] = useState({});


  const { id, item } = route.params;
  console.log("fjd", item);

  const acceptSahayak = async () => {
    let params = {
      count_male: item.count_male,
      count_female: item.count_female,
      job_id: id,
    };
    console.log("paramsacceptSahayak",params);

    try {
      const response = await service.post("/api/accept_individuals/", params, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token?.access}`,
        },
      });
      const data = response?.data;
      console.log("datadata", data);
   
    } catch (error) {
      console.log("Error:", error);
    }
  };
// useEffect(() => {
//   acceptSahayak()
// }, [])
  return (
    <SafeAreaView style={{ backgroundColor: "#fff", flex: 1 }}>
      <View style={{ padding: 20, marginTop: 25 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrowleft" size={25} />
        </TouchableOpacity>
      </View>
      <View style={{ justifyContent: "center" }}>
        <Text style={{ textAlign: "center", fontSize: 30, fontWeight: "600" }}>
          {item?.job_type === "individuals_sahayak" ? "सहायक" : ""}
        </Text>
      </View>
      <ScrollView>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
            marginHorizontal: 10,
          }}
        >
          <View
            style={[
              styles.inputView,
              styles.flex,
              styles.justifyContentBetween,
            ]}
          >
            <Text style={[styles.TextInput]}>{item?.description}</Text>
            <Image
              source={require("../assets/image/edit.png")}
              style={{ width: 20, height: 20, marginTop: 10, right: 10 }}
            />
          </View>

          <View
            style={[
              styles.inputView,
              styles.flex,
              styles.justifyContentBetween,
            ]}
          >
            <Text style={styles.TextInput}>
              {moment(item?.date).format("l")}
            </Text>
            <Text style={styles.TextInput}>
              {moment(item?.time).format("HH:mm")}
            </Text>
          </View>

          <View style={styles.inputView}>
            <TextInput
              style={[styles.TextInput]}
              placeholder="काम लिखें १५ शब्दों से कम,नंबर न लिखें "
              placeholderTextColor={"#000"}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              width: "100%",
            }}
          >
            <View
              style={[
                styles.flex,
                styles.justifyContentBetween,
                styles.TaxView,
                { width: "35%" },
              ]}
            >
              <TextInput
                style={styles.TextInput}
                placeholder="भूमि क्षेत्र"
                placeholderTextColor={"#000"}
              />
              <Text style={{ marginRight: 8, color: "#0099FF" }}>
                {item?.land_area}
                {item?.land_type}
              </Text>
            </View>
            <View></View>
          </View>

          <View style={[styles.flex, styles.justifyContentBetween]}>
            <View
              style={[
                styles.TaxView,
                styles.flex,
                styles.justifyContentBetween,
                { marginRight: 5 },
              ]}
            >
              <TextInput
                style={styles.TextInput}
                placeholder="एक पुरुष का वेतन"
                placeholderTextColor={"#000"}
              />
              <Text style={{ marginRight: 8, color: "#0099FF" }}>
                ₹ {item?.pay_amount_male}
              </Text>
            </View>
            <View
              style={[
                styles.TaxView,
                styles.flex,
                styles.justifyContentBetween,
              ]}
            >
              <TextInput
                style={styles.TextInput}
                placeholder="एक महिला का वेतन"
                placeholderTextColor={"#000"}
              />
              <Text style={{ marginRight: 20, color: "#0099FF" }}>
                ₹ {item?.pay_amount_female}
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
                style={{
                  backgroundColor: "#44A347",
                  paddingHorizontal: 10,
                  padding: 5,
                }}
              >
                <Text style={[styles.TextWhite, { fontSize: 10 }]}>
                  Accept Thekha
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.flex, styles.justifyContentBetween]}>
            <View
              style={[
                styles.TaxView,
                styles.flex,
                styles.justifyContentBetween,
                ,
                { marginRight: 5 },
              ]}
            >
          
              <TextInput
                style={styles.TextInput}
                placeholder="दिनों की संख्या"
                placeholderTextColor={"#000"}
              
              />
              <Text style={{ marginTop: 13, marginRight: 8, color: "#0099FF" }}>
                {item?.num_days}
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
                ₹ {item?.total_amount_sahayak}
              </Text>
            </View>
          </View>

          <View style={[styles.flex, styles.justifyContentBetween]}></View>

          <View style={[styles.flex, styles.justifyContentBetween]}></View>

          <View
            style={[
              styles.flex,
              styles.justifyContentBetween,
              { flexWrap: "wrap" },
            ]}
          >
            {/* {[...Array(parseInt(item?.count_female)).keys()].map((index) => (
              <View
                style={[
                  styles.FemalecheckView,
                  styles.flex,
                  styles.justifyContentBetween,
                  { paddingHorizontal: 5 },
                ]}
                key={item.id}
              >
                <TextInput
                  style={styles.CheckTextInput}
                  placeholder="महिला"
                  placeholderTextColor={"#101010"}
                  name={`Female${index + 1}`}
                />
                <View
                  style={{
                    height: 25,
                    backgroundColor: "#0099FF",
                    marginLeft: 5,
                  }}
                >
                
                 
                  <TouchableOpacity onPress={() => acceptSahayak(id)}>
                    {sahayak && (
                      <Text
                        style={{
                          textAlign: "center",
                          marginTop: 5,
                          color: "#fff",
                          fontSize: 15,
                          fontWeight: "600",
                        }}
                      >
                        {sahayak?.status}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            ))} */}
            {[...Array(parseInt(item?.count_male)).keys()].map((item,index) => (
              <View
                style={[
                  styles.MaleCheckView,
                  styles.flex,
                  styles.justifyContentBetween,
                  { paddingHorizontal: 5 },
                ]}
                key={index}
              >
                <TextInput
                  style={styles.CheckTextInput}
                  placeholder="पुरषो"
                  placeholderTextColor={"#101010"}
                  name={`Male${index + 1}`}
                />
                <View
                  style={{
                    height: 25,
                    backgroundColor: "#44A347",
                    marginLeft: 5,
                  }}
                >
                <TouchableOpacity onPress={() => acceptSahayak()} style={{backgroundColor:'red'}}>
              <Text>fjfjj</Text>
            </TouchableOpacity>
                  <TouchableOpacity style={{backgroundColor:'red'}} >
                  {thekeperKam && <Text>{thekeperKam.job_type}</Text>}
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
          <View
            style={[
              styles.flex,
              styles.justifyContentBetween,
              { flexWrap: "wrap" },
            ]}
          ></View>

          {/* end */}

          <View
            style={[
              styles.inputView,
              {
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              },
            ]}
          >
            <TextInput
              style={styles.TextInput}
              placeholder="काम की स्थिति"
              placeholderTextColor={"#000"}
              // onChangeText={(email) => setEmail(email)}
              // defaultValue={email}
              // value={email}
            />
            <View
              style={{
                height: 30,
                backgroundColor: "#44A347",
                marginRight: 10,
                marginTop: 8,
              }}
            >
              <TouchableOpacity>
                <Text
                  style={{
                    textAlign: "center",
                    marginTop: 5,
                    paddingHorizontal: 10,
                    color: "#fff",
                    fontSize: 15,
                    fontWeight: "600",
                  }}
                >
                  चार सहायक स्वीकार करें
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.BhuktanBtn}
            onPress={() => navigation.navigate("Payment")}
          >
            <Text style={[styles.loginText, { color: "#fff" }]}>
              भुगतान करें
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("Profile")}
            style={styles.loginBtn}
          >
            <Text style={[styles.loginText, { color: "#fff" }]}>रद्द करें</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* <BottomTab/> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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

  // FemalecheckView:{
  //     borderColor: "#0070C0",
  //     borderRadius: 7,
  //     borderBottomLeftRadius: 0,
  //     borderTopLeftRadius:0,
  //     width: "30%",
  //     height: 48,
  //     // marginTop: 30,
  //     borderWidth: 1,
  // },

  loginText: {
    color: "#000",
    fontSize: 16,
    //   flexDirection:"column",
  },

  loginBtn: {
    width: "30%",
    borderRadius: 7,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
    backgroundColor: "#DCDCDC",
  },

  BhuktanBtn: {
    width: "85%",
    borderRadius: 7,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
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
    height: 48,
    marginTop: 10,
    borderWidth: 1,
  },

  TextInput: {
    // height: 50,
    padding: 10,

    // fontFamily: "Poppin-Light"
  },

  CheckTextInput: {
    textAlign: "center",
    marginTop: 0,
  },

  TaxView: {
    borderColor: "#0070C0",
    borderRadius: 7,
    // borderBottomRightRadius: 7,
    width: "50%",
    height: 48,
    marginTop: 10,

    borderWidth: 1,
  },

  BhumiView: {
    borderColor: "#0070C0",
    borderRadius: 7,
    // borderBottomRightRadius: 0,
    // borderTopRightRadius:0,
    width: "52%",
    height: 48,
    marginTop: 10,
    borderWidth: 1,
  },

  DateView: {
    borderColor: "#0070C0",
    borderRadius: 7,
    // borderBottomRightRadius: 7,
    width: "39%",
    height: 48,
    marginTop: 10,
    borderWidth: 1,
  },

  TimeView: {
    borderColor: "#0070C0",
    borderRadius: 7,
    // borderBottomRightRadius: 0,
    // borderTopRightRadius:0,
    width: "39%",
    height: 48,
    marginTop: 10,
    borderWidth: 1,
  },

  JobStatusView: {
    borderColor: "#0070C0",
    borderRadius: 7,
    // borderBottomRightRadius: 7,
    width: "43%",
    height: 48,
    marginTop: 20,
    borderWidth: 1,
  },

  AmountView: {
    borderColor: "#0070C0",
    borderRadius: 7,
    // borderBottomRightRadius: 0,
    // borderTopRightRadius:0,
    width: "43%",
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
    width: "27%",
    height: 55,
    marginTop: 10,
    borderWidth: 1,
  },
  flex: {
    alignItems: "center",
    flexDirection: "row",
  },
  justifyContentBetween: {
    justifyContent: "space-between",
  },
  TextWhite: {
    color: "#fff",
  },
});
