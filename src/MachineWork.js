import React from "react";
import { View, Text ,StyleSheet , SafeAreaView, TouchableOpacity, TextInput, Image } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import BottomTab from "../Component/BottomTab";



export default function MachineWork ({navigation}) {
    return(
        <>
        <SafeAreaView style={{backgroundColor:'#fff', flex:1 }}>
                <View style={{ padding: 20, marginTop: 25 }}>
                    <TouchableOpacity onPress={() => navigation.goBack("HomeTwo")}>
                        <Icon name="arrowleft" size={25} />
                    </TouchableOpacity>
                </View>
            <View style={{ justifyContent:"center", alignItems:"center"}}>

                <View style={{ justifyContent: "center" }}>
                    <Text style={{ textAlign: "center", fontSize: 30, fontWeight: "600" }}>मशीन का काम  </Text>
                </View>

                
      </View>

      <View style={{ justifyContent: "center", alignItems: "center" }} >
      <View style={[styles.inputView,{position:'relative'}]}>
                    <Text style={{position:'absolute', top:-10, left:30, width:"30%", textAlign:"center", backgroundColor:'#fff'}}>मशीन का प्रकार</Text>
                    <TextInput
                        style={styles.TextInput}
                        placeholder=""
                        placeholderTextColor={"#848484"}
                    // onChangeText={(email) => setEmail(email)}
                    // defaultValue={email}
                    // value={email}
                    />
                    </View>
                     

                    <View style={[styles.inputView,{position:'relative'}]}>
                    <Text style={{position:'absolute', top:-10, left:30, width:"10%", textAlign:"center", backgroundColor:'#fff'}}>गाँव</Text>
                    <TextInput
                        style={styles.TextInput}
                        placeholder=""
                        placeholderTextColor={"#848484"}
                    // onChangeText={(email) => setEmail(email)}
                    // defaultValue={email}
                    // value={email}
                    />
                    </View>

                    <View style={[styles.inputView, {display:'flex' , flexDirection:"row", justifyContent:"space-between", height:38}]}>
                    {/* <Text style={{position:'absolute', top:-10, left:30, width:"10%", textAlign:"center", backgroundColor:'#fff'}}>फ़ोन:</Text> */}
                    <TextInput
                        style={[styles.TextInput]}
                        placeholder="तारीख़   dd/mm/yyyy"
                        placeholderTextColor={"#000"}
                    // onChangeText={(email) => setEmail(email)}
                    // defaultValue={email}
                    // value={email}
                    />
                    <TextInput
                        style={[styles.TextInput]}
                        placeholder="समय    2:00 pm"
                        placeholderTextColor={"#000"}
                    // onChangeText={(email) => setEmail(email)}
                    // defaultValue={email}
                    // value={email}
                    />
                    {/* <Image source={require('../assets/image/calendar.png')} style={{width:20, height:20 , marginTop:10 , right:10}} />  */}
                    </View>
                    
                    <View style={[styles.inputView,{position:'relative', display:'flex' , flexDirection:"row", justifyContent:"space-between"}]}>
                    <Text style={{position:'absolute', top:-10, left:30, width:"20%", textAlign:"center", backgroundColor:'#fff'}}>भूमि क्षेत्र </Text>
                    <TextInput
                        style={styles.TextInput}
                        placeholder=""
                        placeholderTextColor={"#848484"}
                    // onChangeText={(email) => setEmail(email)}
                    // defaultValue={email}
                    // value={email}
                    />
                    <Text style={{marginTop:14 , right:10, color:"#0070C0"}}>8बीघा</Text>
                    </View>

                    <View style={[styles.inputView, {display:'flex' , flexDirection:"row", justifyContent:"space-between"}]}>
                    {/* <Text style={{position:'absolute', top:-10, left:30, width:"10%", textAlign:"center", backgroundColor:'#fff'}}>फ़ोन:</Text> */}
                    <TextInput
                        style={styles.TextInput}
                        placeholder="किसान से वेतन"
                        placeholderTextColor={"#000"}
                    // onChangeText={(email) => setEmail(email)}
                    // defaultValue={email}
                    // value={email}
                    />
                    <Text style={{marginTop:14 , right:10, color:"#0070C0"}}>₹ 0.00</Text>
                    </View>

                    <View style={[styles.inputView, {display:'flex' , flexDirection:"row", justifyContent:"space-between"}]}>
                    {/* <Text style={{position:'absolute', top:-10, left:30, width:"10%", textAlign:"center", backgroundColor:'#fff'}}>फ़ोन:</Text> */}
                    <TextInput
                        style={styles.TextInput}
                        placeholder="फावड़ा की फीस"
                        placeholderTextColor={"#000"}
                    // onChangeText={(email) => setEmail(email)}
                    // defaultValue={email}
                    // value={email}
                    />
                    <Text style={{marginTop:14 , right:10, color:"#0070C0"}}>₹ 0.00</Text>
                    </View>

                    <View style={[styles.inputView, {display:'flex' , flexDirection:"row", justifyContent:"space-between"}]}>
                    {/* <Text style={{position:'absolute', top:-10, left:30, width:"10%", textAlign:"center", backgroundColor:'#fff'}}>फ़ोन:</Text> */}
                    <TextInput
                        style={styles.TextInput}
                        placeholder="आपका भुगतान"
                        placeholderTextColor={"#000"}
                    // onChangeText={(email) => setEmail(email)}
                    // defaultValue={email}
                    // value={email}
                    />
                    <Text style={{marginTop:14 , right:10, color:"#0070C0"}}>₹ 0.00</Text>
                    </View>
                   

                    <TouchableOpacity
         onPress={() => navigation.navigate("MereKaam")}
        style={styles.loginBtn}>
        <Text style={[styles.loginText, {color:"#fff"}]}>काम स्वीकार करें </Text>
      </TouchableOpacity>


      <View style={[styles.inputView,{position:'relative', height:25}]}>
                    <Text style={{position:'absolute', top:-10, left:30, width:"30%", textAlign:"center", backgroundColor:'#fff'}}>ग्राहक का नाम</Text>
                    <TextInput
                        style={styles.TextInput}
                        placeholder=""
                        placeholderTextColor={"#848484"}
                    // onChangeText={(email) => setEmail(email)}
                    // defaultValue={email}
                    // value={email}
                    />
                    </View>

                    <View style={[styles.inputView,{position:'relative', height:25}]}>
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
        // borderWidth:1,
        borderRadius:10,
        // borderColor:"#505050",
        backgroundColor: "#44A347",
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
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
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
        fontFamily: "Poppin-Light"
    },

    CheckTextInput: {
    textAlign:"center",
    marginTop:10
    },

    TaxView : {
        borderColor: "#0070C0",
        borderRadius: 7,
        // borderBottomRightRadius: 7,
        width: "35%",
        // height: 100,
        marginTop: 20,
        borderWidth: 1, 
    },

    BhumiView: {
        borderColor: "#0070C0",
        borderRadius: 7,
        // borderBottomRightRadius: 0,
        // borderTopRightRadius:0,
        width: "35%",
        height: 48,
        marginTop: 20,
        borderWidth: 1, 
    },

    TimeView: {
        borderColor: "#0070C0",
        borderRadius: 7,
        // borderBottomRightRadius: 7,
        width: "35%",
        // height: 100,
        marginTop: 20,
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