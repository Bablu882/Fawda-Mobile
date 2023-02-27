import { useFocusEffect } from "@react-navigation/core";
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import Service from '../service/index';
import Toast from 'react-native-simple-toast';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsLoggedIn, setToken } from '../slices/authSlice';
import { useIsFocused } from '@react-navigation/native';
// import SupportPage from "./SupportPage";

export default function Login({ navigation }) {
  const [email, setEmail] = useState('eve.holt@reqres.in');
  const [password, setPassword] = useState('cityslicka');
  const [tokenn, setTokenn] = useState()
  const [loading, setloading] = useState('');
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const dispatch = useDispatch();
  const isfocused = useIsFocused()

  // React.useEffect(() => {
  //   if (isLoggedIn) {
  //     // alert(isLoggedIn)
  //     setTimeout(() => {
  //       navigation.replace('SupportPage')
  //     }, 0)
  //   }
  // }, [isLoggedIn])

  // const redirect = (to) => {
  //   alert(to)
  //   navigation.replace(to)
  // }

  // const login = value => {
  //   setloading(true);
  //   let params = {

  //     email,
  //     password

  //   };
  //   console.log('paramsverify pin:', params);
  //   Service.post('login', params, {
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Accept: 'application/json',
  //     },
  //   })
  //     .then(response => {
  //       setloading(false);
  //       let data = response.data;

  //       console.log('login', data);
  //       if (data?.token) {
  //         dispatch(setToken(data.token))


  //         Toast.show('Login successfully.', Toast.SHORT);
  //         navigation.replace('Dashboard')
  //       }
  //       else {
  //         Toast.show(data?.error, Toast.SHORT);

  //       }

  //     })
  //     .catch(error => {
  //       console.log(error);
  //       setloading(false);
  //       Toast.show('Invalid Credentials', Toast.SHORT);

  //     });
  // };



  return (
    <View style={styles.container}>
      <Image source={require("../assets/image/fawda-logo.png")} style={{ width: 200, height: 200, alignItems: "center", marginBottom:30 }} />

      <View style={{ flexDirection: "row", alignItems:'center' , marginTop:30 }}>
      <Text style={[styles.codeText,styles.CountryCode]}>(+91)</Text>
      <TextInput
            style={[styles.TextInput,styles.inputView]}
            placeholder="फ़ोन नंबर लिखें"
            placeholderTextColor={"#000"}
            // onChangeText={(email) => setEmail(email)}
            // defaultValue={email}
            // value={email}
          />

      </View>

      <TouchableOpacity
         onPress={() => navigation.navigate("SupportPage")}
        style={styles.loginBtn}>
        <Text style={styles.loginText}>LOGIN</Text>
      </TouchableOpacity>





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
   
    fontFamily: "Poppin-Light"
  },

  loginBtn:
  {
    width: "80%",
    // borderRadius: 7,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    backgroundColor: "#44A347",
  },
  loginText: {
    color: "#fff"
  }

});
