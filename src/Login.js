import { useFocusEffect } from "@react-navigation/core";
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import Service from '../service/index';
import Toast from 'react-native-simple-toast';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsLoggedIn, setToken } from '../slices/authSlice';
import { useIsFocused } from '@react-navigation/native';
// import SupportPage from "./SupportPage";

export default function Login({ navigation,route }) {
const {user} = route?.params??{}
console.log('userr', user)
  const [phone , setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [tokenn, setTokenn] = useState()
  const [loading, setloading] = useState('');
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const dispatch = useDispatch();
  const isfocused = useIsFocused()

  // useEffect(() => {
  //   if(isLoggedIn) {
  //       navigation.replace('Verification')
  //   }
  // },[isLoggedIn])

  // const redirect = (to) => {
  //   alert(to)
  //   navigation.replace(to)
  // }
  
  const login = value => {
    setloading(true);
    let params = {
      
      phone: phone
      
    };
   
    console.log('paramsverify pin:', params);
    Service.post('/api/login/', params, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then(response => {
        setloading(false);
        let data = response.data;

        console.log('login', data);
        if (data?.token) {
          dispatch(setToken(data.token))
          Toast.show(JSON.stringify(data.otp) , Toast.LONG)

          // Toast.show('Login successfully.', Toast.SHORT);
          navigation.replace("Verification")
        }
        else{
          
          Toast.show("User is not Registered", Toast.SHORT);
          navigation.replace("Register")

        }

      })
      .catch(error => {
        console.log(error);
        setloading(false);
        Toast.show('Invalid Credentials', Toast.SHORT);

      });
    };
      
      // handleSubmit = () => {
      //   if (!phone) {
      //     // setPhoneError('Please enter your name');
      //     Toast.show('enter no.', Toast.SHORT);
      //     return;
      //   }
      // }
        

  return (
    <View style={styles.container}>
      <View style={{justifyContent:"center", alignItems:"center", width:"100%" , flex:1}}>
      <Image source={require("../assets/image/Fawda-logo.png")} style={{ width: 220, height: 200, alignItems: "center", marginBottom:30 }} />

      <View style={{ flexDirection: "row", alignItems:'center' , marginTop:30 }}>
      {/* <Text >(+91)</Text> */}
      <Image source={require("../assets/image/Flag.png")} style={[styles.codeText,styles.CountryCode]} />
      <TextInput
            style={[styles.TextInput,styles.inputView]}
            placeholder="फ़ोन नंबर लिखें"
            required={true}
            keyboardType="numeric"
            placeholderTextColor={"#000"}
            onChangeText={(phone) => setPhone(phone)}
            // defaultValue={email}
            value={phone}
          />
          <Text>{phoneError}</Text>

      </View>

      <TouchableOpacity
        //  onPress={() => login()}
        onPress={() => {login()}}
        style={styles.loginBtn}>
        <Text style={styles.loginText}>आगे बढ़ें</Text>
      </TouchableOpacity>
      </View>

         <View style={{display:"flex" , flexDirection:"row", width:"70%", marginBottom:20}}>
          <View style={{backgroundColor:"#0099FF", height:18, width:20, justifyContent:"center", alignItems:"center"}}>
          <Image source={require('../assets/image/check.png')} style={{ width:15, height:20}} resizeMode="contain" />
          </View>
          <Text style={{textAlign:"center"}}>अगर आप आगे बढ़ते है आप हमारी नियम और शर्तों और प्राइवेसी नीति से सहमत हैं</Text>
         </View>



    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  CountryCode: {
    borderColor: "#0070C0",
    // backgroundColor: "#0070C0",
    borderTopLeftRadius: 7,
    borderBottomLeftRadius: 7,
    width: "15%",
    resizeMode:"contain",
    height: 45,
    alignItems: "center",
    borderWidth:1
  },
  codeText: {
    color: "#000",
    textAlign: "center",
    justifyContent: "center",
lineHeight:44,
fontWeight:"600"
  },
  inputView: {
    borderColor: "#0070C0",
    borderTopRightRadius: 7,
    borderBottomRightRadius: 7,
     width: "65%",
    height: 45,
    borderWidth: 1
  },

  TextInput: {
    height: 50,
    padding: 10,
   
    // fontFamily: "Poppin-Light"
  },

  loginBtn:
  {
    width: "80%",
    // borderRadius: 7,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    backgroundColor: "#0099FF",
  },
  loginText: {
    color: "#fff"
  }

});
