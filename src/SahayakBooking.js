import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, TextInput , Image} from "react-native";
import Header from "./Header";
// import Back from "react-native-vector-icons/AntDesign"
import Icon from "react-native-vector-icons/AntDesign";

export default function SahayakBooking () {
    return(
        <>
        <SafeAreaView style={{backgroundColor:'#fff', flex:1 }}>
                <View style={{ padding: 20, marginTop: 25 }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name="arrowleft" size={25} />
                    </TouchableOpacity>
                </View>
            <View style={{ justifyContent:"center", alignItems:"center"}}>

                <View style={{ justifyContent: "center" }}>
                    <Text style={{ textAlign: "center", fontSize: 30, fontWeight: "600" }}>सहायक बुकिंग</Text>
                </View>
                
                <View style={{justifyContent:"center", alignItems:"center"}}>
                <Image source={require('../assets/image/fawda-logo.png')} style={{width:200 , height:200}}/>
                </View>

                <View style={styles.OptionButton}>
      <TouchableOpacity style={styles.sahayak}>
        <Text style={styles.loginText}>ठेके पर काम</Text>
        {/* <Text style={styles.loginText}>(मजदूर )</Text> */}
      </TouchableOpacity>

      <TouchableOpacity style={styles.machine} onPress={() => navigation.navigate("SahayakBooking")}>
        <Text style={styles.loginText}>सहायक</Text>
      </TouchableOpacity>

      </View>

      <TouchableOpacity
         onPress={() => navigation.navigate("RegisterForm")}
        style={styles.loginBtn}>
        <Text style={styles.VerifyText}>आगे बढ़ें</Text>
      </TouchableOpacity>
      </View>

                </SafeAreaView>
        </>
    )
}

const styles = StyleSheet.create({
    OptionButton: {
        // flex:1,
      flexDirection:"row",
      width:'100%',
      justifyContent:"space-evenly",
      margin:20,
    //   padding:20
    },

    sahayak:
    {
        width: "40%",
        // flexDirection:"column",
        // borderRadius: 7,
        color:"#505050",
        height: 50,
        alignItems: "center",
      //   justifyContent:"",
      justifyContent:"center",
        marginTop: 30,
        borderWidth:1,
        borderRadius:10,
        borderColor:"#505050",
        // backgroundColor: "#44A347",
    },

    machine: {
        width: "40%",
        flexDirection:"row",
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
        fontSize:16,
      //   flexDirection:"column",
      },

      loginBtn:
      {
        width: "80%",
        borderRadius: 7,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 30,
        backgroundColor: "#0070C0",
      },
  
  
      VerifyText: {
          color:"#fff",
          fontWeight:"600",
          fontSize:18
      }
})