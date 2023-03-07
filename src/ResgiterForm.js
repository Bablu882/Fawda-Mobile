import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, TextInput } from "react-native";
import Header from "./Header";
// import Back from "react-native-vector-icons/AntDesign"
import Icon from "react-native-vector-icons/AntDesign";

export default function RegisterForm({ navigation }) {
    const [active , setActive] = useState(false);
    return (
        <>
            {/* <Header/> */}
            <SafeAreaView style={{backgroundColor:'#fff', flex:1}}>
                <View style={{ padding: 20, marginTop: 25 }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name="arrowleft" size={25} />
                    </TouchableOpacity>
                </View>

                <View style={{ justifyContent: "center" }}>
                    <Text style={{ textAlign: "center", fontSize: 30, fontWeight: "600" }}>ग्राहक रजिस्ट्रेशन</Text>
                </View>

                <View style={{ justifyContent: "center", alignItems: "center", marginTop: 30,  }} >
                    <View style={[styles.inputView,{position:'relative'}]}>
                    <Text style={{position:'absolute', top:-10, left:30, width:"10%", textAlign:"center", backgroundColor:'#fff'}}>नाम:</Text>
                    <TextInput
                        style={styles.TextInput}
                        placeholder=""
                        placeholderTextColor={"#848484"}
                    // onChangeText={(email) => setEmail(email)}
                    // defaultValue={email}
                    // value={email}
                    />
                    </View>
                     
                     <View style={{display:"flex", flexDirection:"row",width:"100%" , justifyContent:"center"}}>
                    <View style={[styles.MaleCheckView,{position:'relative'}]}>
                    <Text style={{position:'absolute', top:-10, left:30, width:"18%", textAlign:"center", backgroundColor:'#fff'}}>लिंग:</Text>
                    <TextInput
                        style={styles.CheckTextInput}
                        placeholder="पुरुष "
                        placeholderTextColor={"#848484"}
                        name="Male"
                    // onChangeText={(email) => setEmail(email)}
                    // defaultValue={email}
                    // value={Male}
                    />
                    </View>
                    <View style={[styles.FemalecheckView,{position:'relative'}]}>
                    {/* <Text style={{position:'absolute', top:-10, left:30, width:"10%", textAlign:"center", backgroundColor:'#fff'}}>लिंग:</Text> */}
                    <TextInput
                        style={styles.CheckTextInput}
                        placeholder="महिला"
                        placeholderTextColor={"#848484"}
                        name="Female"
                    // onChangeText={(email) => setEmail(email)}
                    // defaultValue={email}
                    // value={Female} 
                    />
                    </View>
                    </View>

                    <View style={[styles.inputView,{position:'relative'}]}>
                    <Text style={{position:'absolute', top:-10, left:30, width:"10%", textAlign:"center", backgroundColor:'#fff'}}>फ़ोन:</Text>
                    <TextInput
                        style={styles.TextInput}
                        placeholder=""
                        placeholderTextColor={"#848484"}
                    // onChangeText={(email) => setEmail(email)}
                    // defaultValue={email}
                    // value={email}
                    />
                    </View>
                    
                    <View style={{display:"flex", flexDirection:"row",width:"90%" , justifyContent:"space-evenly"}}>
                    <View style={[styles.DoubleView,{position:'relative'}]}>
                    <Text style={{position:'absolute', top:-10, left:30, width:"30%", textAlign:"center", backgroundColor:'#fff'}}>मोहल्ला</Text>
                    <TextInput
                        style={styles.TextInput}
                        placeholder=""
                        placeholderTextColor={"#848484"}
                    // onChangeText={(email) => setEmail(email)}
                    // defaultValue={email}
                    // value={email}
                    />
                    </View>
                    <View style={[styles.DoubleView,{position:'relative'}]}>
                    <Text style={{position:'absolute', top:-10, left:30, width:"18%", textAlign:"center", backgroundColor:'#fff'}}>गांव</Text>
                    <TextInput
                        style={styles.TextInput}
                        placeholder=""
                        placeholderTextColor={"#848484"}
                    // onChangeText={(email) => setEmail(email)}
                    // defaultValue={email}
                    // value={email}
                    />
                    </View>
                    </View>

                    <View style={{display:"flex", flexDirection:"row",width:"90%" , justifyContent:"space-evenly"}}>
                    <View style={[styles.DoubleView,{position:'relative'}]}>
                    <Text style={{position:'absolute', top:-10, left:30, width:"18%", textAlign:"center", backgroundColor:'#fff'}}>राज्य</Text>
                    <TextInput
                        style={styles.TextInput}
                        placeholder=""
                        placeholderTextColor={"#848484"}
                    // onChangeText={(email) => setEmail(email)}
                    // defaultValue={email}
                    // value={email}
                    />
                    </View>
                    <View style={[styles.DoubleView,{position:'relative'}]}>
                    <Text style={{position:'absolute', top:-10, left:30, width:"20%", textAlign:"center", backgroundColor:'#fff'}}>जिला </Text>
                    <TextInput
                        style={styles.TextInput}
                        placeholder=""
                        placeholderTextColor={"#848484"}
                    // onChangeText={(email) => setEmail(email)}
                    // defaultValue={email}
                    // value={email}
                    />
                    </View>
                    </View>

                    <TouchableOpacity
         onPress={() => navigation.navigate("Home")}
        style={styles.loginBtn}>
        <Text style={styles.loginText}>आगे बढ़ें</Text>
      </TouchableOpacity>

                </View>
            </SafeAreaView>
        </>
    )
}

const styles = StyleSheet.create({
    inputView: {
        borderColor: "#0099FF",
        borderRadius: 7,
        // borderBottomRightRadius: 7,
        width: "80%",
        height: 48,
        marginTop: 30,
        borderWidth: 1
    },

    TextInput: {
        height: 50,
        padding: 10,

        fontFamily: "Poppin-Light"
    },

    CheckTextInput: {
    textAlign:"center",
    marginTop:10
    },

    DoubleView : {
        borderColor: "#0099FF",
        borderRadius: 7,
        // borderBottomRightRadius: 7,
        width: "42%",
        height: 48,
        marginTop: 30,
        borderWidth: 1, 
    },

    MaleCheckView: {
        borderColor: "#0099FF",
        borderRadius: 7,
        borderBottomRightRadius: 0,
        borderTopRightRadius:0,
        width: "40%",
        height: 48,
        marginTop: 30,
        borderWidth: 1, 
    },

    FemalecheckView:{
        borderColor: "#0099FF",
        borderRadius: 7,
        borderBottomLeftRadius: 0,
        borderTopLeftRadius:0,
        width: "40%",
        height: 48,
        marginTop: 30,
        borderWidth: 1, 
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
    color: "#fff",
    fontSize:18,
  }
})