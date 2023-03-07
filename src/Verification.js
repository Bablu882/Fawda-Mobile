import { useFocusEffect } from "@react-navigation/core";
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import Service from '../service/index';
import Toast from 'react-native-simple-toast';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsLoggedIn, setToken } from '../slices/authSlice';
import { useIsFocused } from '@react-navigation/native';
// import SupportPage from "./SupportPage";

export default function Verification({ navigation }) {
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
      <Image source={require("../assets/image/Verify.png")} style={{ width: 160, height: 200, alignItems: "center" }} resizeMode="contain" />
      <Text style={{fontFamily:"700" , fontSize:28 ,}}>वेरिफिकेशन</Text>

      <View style={{ alignItems:'center', padding:10  }}>
    <Text style={{textAlign:"center"}}>हमने आपके फ़ोन पर एक ओटीपी भेजा है</Text>


      </View>

      <View style={{marginTop:30 , width:"100%" , justifyContent:"center" , flexDirection:"row"}}>
      <TextInput
            style={[styles.TextInput,styles.inputView]}
            placeholder="ओटीपी डालें "
            placeholderTextColor={"#848484"}
            secureTextEntry={true}
            // onChangeText={(email) => setEmail(email)}
            // defaultValue={email}
            // value={email}
          />
      </View>

      <View style={{marginTop:10}}>
        <Text style={{color:"#0099FF"}}>1:30</Text>
      </View>

      <TouchableOpacity
         onPress={() => navigation.navigate("Register")}
        style={styles.loginBtn}>
        <Text style={styles.VerifyText}>वेरीफाई एंड लॉगिन </Text>
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
lineHeight:44,
fontWeight:"600"
  },
  inputView: {
    borderColor: "#0070C0",
    borderRadius: 7,
    // borderBottomRightRadius: 7,
     width: "80%",
    height: 45,
    borderWidth: 1
  },

  TextInput: {
    height: 50,
    padding: 10,
    textAlign:"center",
    color:"#505050",
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
    backgroundColor: "#0070C0",
  },
  VerifyText: {
    color: "#fff",
    fontWeight:"600",
  }

});
