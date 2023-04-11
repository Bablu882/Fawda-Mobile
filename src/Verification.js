import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import Service from "../service/index";
import Toast from "react-native-simple-toast";
import { useDispatch, useSelector } from "react-redux";
import { selectToken, setUserType } from "../slices/authSlice";
import { selectIsLoggedIn, setToken } from "../slices/authSlice";

export default function Verification({ navigation, route }) {
  const { user_type } = route?.params??{};
  // console.log("hddjdj", user_type);
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const [otp, setOtp] = useState("");
  const [Timer, setTimer] = useState(true);
  const [counter, setCounter] = useState(90);

  

  const verify = async () => {
    try {
      // Send verification request to server
      const verifyResponse = await Service.post(
        "/api/verify/",
        { otp },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      // Extract data from server response
      const verifyData = verifyResponse?.data;
      console.log("verifyData", verifyData);
      // Check if verification was successful
      dispatch(setToken(verifyData?.token));
      console.log('token',verifyData?.token)
      if (verifyData?.verified == true) {
        // Show success message
        Toast.show("Login successful", Toast.SHORT);
        // Dispatch user type and navigate to homepage
        dispatch(setUserType(user_type));
      
        navigation.replace("HomePage");
      } else {
        // Show error message
        Toast.show(verifyData?.error || "Unknown error", Toast.SHORT);
      }
    } catch (error) {
      console.log(error);
      // Show error message
      Toast.show("Error verifying OTP", Toast.SHORT);
    }
  };

  // const verify = () =>{
  //  let params ={
  //   otp,
  //  } 
  //  console.log('fhjhsdfjhf',params)


  //  Service.post('/api/verify/', params,{
  //   headers: {
  //     "Content-Type": "application/json",
  //     Accept: "application/json",
  //   },
  //  }).then((res)=>{

  //    let data = res?.data;
  //    console.log('rtertr',data)
  //    dispatch(setUserType(user_type));
  //   if(data.verified == true){
  //     console.log('fhjhsdfjhf',data.verified)
      
  //     navigation.navigate("HomePage");
     
  //   }else if(data?.status == 401){
  //     navigation.navigate("Login");
  //   }
  //  }).catch((error)=>{
  //   console.log('error', error)
  //  })
  // }

  // useEffect(() => {
  //   const timer = counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
  //   console.log(timer , 'timer');
  //   // setCounter(59)
  //   // setTimer(true)
  //   return () => clearInterval(timer)
  // }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      if (counter > 0) {
        setCounter((prevCount) => prevCount - 1);
      } else {
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [counter]);




  return (
    <View style={styles.verificationContainer}>
      <Image
        source={require("../assets/image/Verify.png")}
        style={[styles.image, { resizeMode: "contain" }]}
      />
      <Text style={styles.title}>वेरिफिकेशन</Text>

      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          हमने आपके फ़ोन पर एक ओटीपी भेजा है
        </Text>
      </View>

      <View>
        <TextInput
          style={[
            // styles.TextInput,
             styles.inputView,
             styles.textInputContainer ,
            //{ width: "100%", marginHorizontal: "auto", textAlign: "center",borderWidth:1, paddingHorizontal:100, paddingVertical:5},
          ]}
          placeholder="ओटीपी डालें"
          placeholderTextColor={"#848484"}
          secureTextEntry={true}
          onChangeText={(text) => setOtp(text, "otp")}
        />
      </View>

      <View style={styles.otpText}>
        {Timer && (
          <Text style={{ color: "#0099FF" }}>
            {Math.floor(counter / 60)}:
            {(counter % 60).toString().padStart(2, "0")}
          </Text>
        )}
      </View>

      <TouchableOpacity
        onPress={() => {
          verify();
        }}
        style={styles.loginBtn}
      >
        <Text style={styles.verifyText}>वेरीफाई एंड लॉगिन </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  verificationContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ffff",
    alignItems: "center",
  },
  container: {
    alignItems: "center",
    padding: 20,
  },
  image: {
    width: 160,
    height: 200,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
  },
  textInputContainer: {
   
    borderColor: "#0070C0",
    borderRadius: 7,
    // borderBottomRightRadius: 7,
 marginHorizontal: "auto", textAlign: "center",borderWidth:1, paddingHorizontal:100, paddingVertical:5,
    height: 45,
    borderWidth: 1,
    textAlign: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  textInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    color: "#000",
  },
  otpText: {
    marginTop: 10,
    color: "#0099FF",
  },
  loginBtn: {
    backgroundColor: "#0099FF",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    width: "80%",
  },
  verifyText: {
    color: "#fff",
    fontSize: 16,
  },
});
