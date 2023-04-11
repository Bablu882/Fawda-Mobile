import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  ScrollView,
  Button,
  //   RadioButton
} from "react-native";

import Icon from "react-native-vector-icons/AntDesign";
import { useDispatch, useSelector } from "react-redux";
import { selectIsLoggedIn, selectToken, setToken } from "../slices/authSlice";
import Service from "../service/index";
import * as Linking from 'expo-linking';

import Toast from "react-native-simple-toast";

// import * as Location from "expo-location";

export default function ContactUs({ navigation, route }) {
  // const { user  } = route.params;
  // console.log("fnkfjk", user);
  const token = useSelector(selectToken);
  const [phoneno, setphoneno] = useState("");
  const [state, setState] = useState("");
  // const [termsCondition , setTermsCondition] = useState("");
  // const [privacy , setPrivacy] = useState("");
  // const [appVersion , setAppVersion] = useState("");
  const [Data , setData] = useState("")
  // const [location, setLocation] = useState({ latitude: "", longitude: "" });

  
  function handleCallPress() {
    const url = `tel:${phoneno}`;
    Linking.canOpenURL(url)?.then(supported => {
      if (!supported) {
        console.log('Phone number is not available');
      } else {
        return Linking.openURL(url);
      }
    }).catch(err => console.error('An error occurred', err));
  }

  const validatePhone = () => {
    const phoneRegex = /^\d{10}$/;
    if (!phoneno) {
      setErrors({ phoneno: "Please enter a phone number" });
    } else if (!phoneRegex.test(phoneno)) {
      setErrors({ phoneno: "Please enter a valid phone number" });
    } else {
      setErrors({});
    }
  };


 const detailList = async() => {
  try {
    const response = await Service.get("/api/client_user_info/", {
      headers: {
        "Content-Type" : "application/json",
        Authorization : `Bearer ${token}`,
      }
    });

    const data = response.data;
    console.log(data , "data response");
    setState(data.user_details);
    setphoneno(data?.client_info?.phone_no)
    console.log(phoneno, "checkhone");
    // setAppVersion(data.app_version);
    // setPrivacy(data.privacy_policy);
    // setTermsCondition(data.client_info.terms_condition);
    setData(data)
    console.log(Data , "terms");  
    
  } catch (error) {
    console.log("error" , error);
  }
};

  
  useEffect(() => {
   detailList()
  }, [0]);

  console.log(token , 'token');
  const Logout = async() => {
    try {
      const response = await Service.post("/api/logout/", {
        headers: {
          "Content-Type" : "application/json",
          'Authorization': `Bearer b4712bfa89ee5211f5a7a066997502ae76a90726`,
        }
      });
  
      const data = response.data;
      console.log(data , "data response");
      if(data?.success) {
         navigation.replace("Login")
      }
      // console.log(phoneno, "checkhone");
      // setAppVersion(data.app_version);
      // setPrivacy(data.privacy_policy);
      // setTermsCondition(data.client_info.terms_condition);
      // setData(data)
      // console.log(Data , "terms");  
      
    } catch (error) {
      console.log("error" , error);
    }
  }
 
  return (
    <SafeAreaView style={{ backgroundColor: "#fff", flex: 1 }}>
      <View style={{ padding: 20, marginTop: 25 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrowleft" size={25} />
        </TouchableOpacity>
      </View>
      <ScrollView horizontal={false} showsVerticalScrollIndicator={false}>
        <View>
          <View style={{ justifyContent: "center" }}>
            <Text
              style={{ textAlign: "center", fontSize: 30, fontWeight: "600" }}
            >
              संपर्क करें
            </Text>
          </View>
          <View
            style={{
              marginHorizontal: 13,
            }}
          >
            {/* <View style={{ display: "none" }}>
          <Text>Latitude: {JSON.stringify(location.latitude)}</Text>
         
          {console.log("location", location.latitude)}
        </View> */}
            <View
              style={{
                flexDirection: "row",
                flex: 1,
                position: "relative",
                alignItems: "center",
              }}
            >
              <View style={[styles.inputView]}>
                <Text style={styles.label}>फ़ोन:</Text>
                <Text
                  style={[
                    styles.TextInput,
                    { width: "90%", marginHorizontal: 10, marginTop:3 },
                  ]}
               
                  placeholder=""
                  placeholderTextColor={"#848484"}
                  // onChangeText={(phoneno) => setphoneno(phoneno, "phone")}
                  // // defaultValue={email}
                  // value={phoneno}
                >{phoneno}</Text>
                {/* {!!errors.phoneno && (
                  <Text style={styles.error}>{errors.phoneno}</Text>
                )} */}
              </View>
              <TouchableOpacity
              onPress={() => {handleCallPress()}}
                style={{
                  position: "absolute",
                  right: 0,
                  backgroundColor: "#0099FF",
                  paddingVertical: 13,
                  bottom: 0,
                  paddingHorizontal: 18,
                  borderRadius: 8,
                  elevation: 7,
                }}
              >
                <Text style={{ color: "#fff", fontSize: 16 }}>कॉल करें </Text>
              </TouchableOpacity>
            </View>

            <View style={{ justifyContent: "center", marginTop: 20 }}>
              <Text
                style={{ textAlign: "center", fontSize: 30, fontWeight: "600" }}
              >
                रजिस्ट्रेशन
              </Text>
            </View>
            <View style={[styles.inputView, { position: "relative" }]}>
              <Text
                style={{
                  position: "absolute",
                  top: -10,
                  left: 30,
                  width: "10%",
                  textAlign: "center",
                  backgroundColor: "#fff",
                }}
              >
                नाम:
              </Text>
              <Text
                style={styles.TextInput}
                placeholder=""
                placeholderTextColor={"#848484"}
                >{state.name}</Text>
              {/* {!!errors.name && <Text style={styles.error}>{errors.name}</Text>} */}
            </View>
            <View style={[styles.inputView, { position: "relative" }]}>
              <Text style={styles.label}>लिंग:</Text>
              <Text
                style={styles.TextInput}
                placeholder=""
                placeholderTextColor={"#848484"}
              >{state.gender}</Text>
              {/* {!!errors.phoneno && (
                <Text style={styles.error}>{errors.phoneno}</Text>
              )} */}
            </View>
            <View style={[styles.inputView, { position: "relative" }]}>
              <Text style={styles.label}>फ़ोन:</Text>
              <Text
                style={styles.TextInput}
                placeholder=""
                placeholderTextColor={"#848484"}
               >{state.phone}</Text>
              {/* {!!errors.phoneno && (
                <Text style={styles.error}>{errors.phoneno}</Text>
              )} */}
            </View>

            <View style={styles.flex}>
              <View style={[styles.DoubleView, { position: "relative" }]}>
                <Text style={styles.label}>मोहल्ला</Text>
                <Text
                  style={styles.TextInput}
                  placeholder=""
                  placeholderTextColor={"#848484"}  
                >{state.mohalla}</Text>
                {/* {!!errors.mohalla && (
                  <Text style={styles.error}>{errors.mohalla}</Text>
                )} */}
              </View>
              <View style={[styles.DoubleView, { position: "relative" }]}>
                <Text style={styles.label}>गांव</Text>
                <Text
                  style={styles.TextInput}
                  placeholder=""
                  placeholderTextColor={"#848484"}
              >{state.village}</Text>
                {/* {!!errors.village && (
                  <Text style={styles.error}>{errors.village}</Text>
                )} */}
              </View>
            </View>

            <View style={styles.flex}>
              <View style={[styles.DoubleView, { position: "relative" }]}>
                <Text style={styles.label}>राज्य</Text>
                <Text style={styles.TextInput}>{state.state}</Text>
              </View>
              <View style={[styles.DoubleView, { position: "relative" }]}>
                <Text style={styles.label}>जिला</Text>
                <Text style={styles.TextInput}>{state.district}</Text>
          
              </View>
            </View>
            <View style={{paddingTop:30}}>
              <View style={styles.flexbetween}>
                <Text>हमारे बारे में </Text>
                <TouchableOpacity 
                onPress={() => navigation.navigate("about_us" , {
                  terms : Data,
                })}
                >
                <Icon name="right" size={18} color="#0099FF" />
                </TouchableOpacity>
              </View>
              <View style={styles.flexbetween}>
                <Text>नियम और शर्तें </Text>
                <TouchableOpacity 
                onPress={() => navigation.navigate("terms" , {
                  terms : Data,
                })}>
                <Icon name="right" size={18} color="#0099FF" />
                </TouchableOpacity>
              </View>
              <View style={styles.flexbetween}>
                <Text>प्राइवेसी नीति</Text>
                <TouchableOpacity
                onPress={() => navigation.navigate("privacy" , {
                  terms : Data,
                })}>
                <Icon name="right" size={18} color="#0099FF" />
                </TouchableOpacity>
              </View>
              <View style={styles.flexbetween}>
                <Text>वरजन</Text>
                <TouchableOpacity
                // onPress={() => navigation.navigate("version" , {
                //   terms : Data,
                // })}
                >
                <Icon name="right" size={18} color="#0099FF" />
                </TouchableOpacity>
              </View>
              <View>
                
                </View>
                <View>
                
                </View>
                <View>
                
                </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                Logout()
                  // navigation.navigate("Home")
                
              }}
              style={styles.loginBtn}
            >
              <Text style={styles.loginText}>लॉग आउट करें </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  inputView: {
    borderColor: "#0099FF",
    borderRadius: 7,
    // borderBottomRightRadius: 7,
    width: "100%",
    height: 48,
    marginTop: 30,
    borderWidth: 1,
  },
  label: {
    position: "absolute",
    top: -10,
    left: 30,

    textAlign: "center",
    backgroundColor: "#fff",
  },
  TextInput: {
    height: 50,
    padding: 10,

    // fontFamily: "Poppin-Light",
  },

  CheckTextInput: {
    textAlign: "center",
    marginTop: 10,
  },

  DoubleView: {
    borderColor: "#0099FF",
    borderRadius: 7,
    // borderBottomRightRadius: 7,
    width: "50%",
    height: 48,
    marginHorizontal: 10,
    marginTop: 30,
    borderWidth: 1,
  },
  justifyContent: {
    justifyContent: "center",
  },
  alignItems: {
    flexDirection: "row",
    alignItems: "center",
  },
  flex: {
    flexDirection: "row",

    justifyContent: "space-evenly",
  },

  MaleCheckView: {
    borderColor: "#0099FF",
    borderRadius: 7,
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
    width: "50%",
    height: 48,
    marginTop: 30,
    borderWidth: 1,
  },

  FemalecheckView: {
    borderColor: "#0099FF",
    borderRadius: 7,
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 0,
    width: "50%",
    height: 48,
    marginTop: 30,
    borderWidth: 1,
  },

  loginBtn: {
    width: "100%",

    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    backgroundColor: "#0099FF",
  },
  loginText: {
    color: "#fff",
    fontSize: 18,
  },
  error: {
    color: "red",
    fontSize: 12,
  },
  flexbetween:{
    flexDirection:'row', justifyContent:'space-between',paddingBottom:10, alignItems:'center'
  }
});
