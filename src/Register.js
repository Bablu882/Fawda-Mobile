import React from "react";
import { View , Text , StyleSheet, Image, TouchableOpacity } from "react-native";
import { useIsFocused } from '@react-navigation/native';



export default function Register ({navigation}) {
  const isfocused = useIsFocused()

    return(
        <>
        
        <View style={styles.container}>
        <View style={{ alignItems:'center' , marginBottom:30 }}>
      <Text style={{fontSize:28 , fontWeight:"600" , color:"#000"}}>आपका स्वागत है </Text>

      </View>
      <Image source={require("../assets/image/Register.png")} style={{ width: 150, height: 150, alignItems: "center" }} resizeMode="contain" />

      <View style={{ alignItems:'center' ,marginTop:10  }}>
      <Text style={{fontSize:28 , fontWeight:"600" , color:"#000"}}> रजिस्ट्रेशन</Text>

      </View>

      <View style={styles.OptionButton}>
      <TouchableOpacity style={[styles.sahayak, {borderColor:"none"}]} onPress={() => navigation.navigate("RegisterForm")}>
        <Text style={[styles.loginText, {color:"#fff"}]}>ग्राहक</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.machine} >
        <Text style={styles.loginText}>सहायक </Text>
        <Text style={styles.loginText}>(मजदूर ) </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.machine}>
        <Text style={styles.loginText}>मशीन मालिक </Text>
      </TouchableOpacity>


      </View>

      <TouchableOpacity
         onPress={() => navigation.navigate("RegisterForm")}
        style={styles.loginBtn}>
        <Text style={styles.VerifyText}>आगे बढ़ें</Text>
      </TouchableOpacity>






    </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    OptionButton: {
        // flex:1,
      flexDirection:"row",
      width:'100%',
      justifyContent:"space-evenly",
      margin:20,
    //   padding:20
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
  
    sahayak:
    {
        width: "30%",
        flexDirection:"row",
        // borderRadius: 7,
        // color:"#505050",
        // color:"#fff",
        height: 50,
        alignItems: "center",
      //   justifyContent:"",
      justifyContent:"center",
        marginTop: 30,
        // borderWidth:1,
        borderRadius:10,
        // borderColor:"#505050",
        backgroundColor: "#44A347",
    },

    machine: {
        width: "30%",
        flexDirection:"column",
        // borderRadius: 7,
        color:"#505050",
        height: 50,
        alignItems: "center",
      //   justifyContent:"",
      justifyContent:"center",
        marginTop: 30,
        borderWidth:1,
        borderRadius:10,
        borderColor:"#505050"
        // backgroundColor: "#44A347",
    },
    loginText: {
      color: "#000",
      fontSize:16
    },

    loginBtn:
    {
      width: "50%",
      // borderRadius: 7,
      height: 50,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 30,
      backgroundColor: "#0099FF",
    },


    VerifyText: {
        color:"#fff",
        fontWeight:"600",
        fontSize:18
    }
  
  });
  