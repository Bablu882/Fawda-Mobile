import React from "react";
import { View , Text ,TouchableOpacity , StyleSheet ,SafeAreaView ,TextInput, Image } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";



export default function ThekeForm1 ({navigation}) {
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
                    <Text style={{ textAlign: "center", fontSize: 30, fontWeight: "600" }}>ठेके पर काम</Text>
                </View>
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
    //   margin:20,
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
        // borderWidth:1,
        borderRadius:10,
        // borderColor:"#505050"
        backgroundColor: "#44A347",
    },

    loginText: {
        color: "#000",
        fontSize:16,
      //   flexDirection:"column",
      },

      loginBtn:
      {
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
          color:"#fff",
          fontWeight:"600",
          fontSize:18
      },

      inputView: {
        borderColor: "#0070C0",
        borderRadius: 7,
        // borderBottomRightRadius: 7,
        width: "80%",
        height: 48,
        marginTop: 20,
        borderWidth: 1
    },

    TextInput: {
        // height: 50,
        padding: 10,
        lineHeight:50,
        //fontFamily: "Poppin-Light"
    },

    CheckTextInput: {
    textAlign:"center",
    marginTop:10
    },

    TaxView : {
        borderColor: "#0070C0",
        borderRadius: 7,
        // borderBottomRightRadius: 7,
        width: "51%",
        height: 48,
        marginTop: 20,
        borderWidth: 1, 
    },

    BhumiView: {
        borderColor: "#0070C0",
        borderRadius: 7,
        // borderBottomRightRadius: 0,
        // borderTopRightRadius:0,
        width: "31  %",
        height: 48,
        marginTop: 20,
        borderWidth: 1, 
    },

    DoubleView : {
        borderColor: "#0070C0",
        borderRadius: 7,
        // borderBottomRightRadius: 7,
        width: "42%",
        height: 48,
        marginTop: 10,
        borderWidth: 1, 
    },


    FemalecheckView:{
        borderColor: "#0070C0",
        borderRadius: 7,
        borderBottomLeftRadius: 0,
        borderTopLeftRadius:0,
        width: "40%",
        height: 48,
        marginTop: 30,
        borderWidth: 1, 
    },
})