import React from "react";
import { View, Text ,StyleSheet , SafeAreaView, TouchableOpacity, TextInput , Image, ScrollView} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import BottomTab from "../Component/BottomTab";



export default function SahayakForm ({navigation}) {
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

                <View style={styles.OptionButton}>
      <TouchableOpacity style={styles.sahayak} >
        <Text style={styles.loginText}>ठेके पर काम</Text>
        {/* <Text style={styles.loginText}>(मजदूर )</Text> */}
      </TouchableOpacity>

      <TouchableOpacity style={styles.machine} onPress={() => navigation.navigate("SahayakForm")}>
        <Text style={[styles.loginText, {color:"#fff"}]}>सहायक</Text>
      </TouchableOpacity>

      </View>
      </View>

      <ScrollView>
      <View style={{ justifyContent: "center", alignItems: "center" }} >
                    <View style={[styles.inputView, {display:'flex' , flexDirection:"row", justifyContent:"space-between"}]}>
                    {/* <Text style={{position:'absolute', top:-10, left:30, width:"10%", textAlign:"center", backgroundColor:'#fff'}}>नाम:</Text> */}
                    <TextInput
                        style={[styles.TextInput]}
                        placeholder="तारीख़   dd/mm/yyyy"
                        placeholderTextColor={"#000"}
                    // onChangeText={(email) => setEmail(email)}
                    // defaultValue={email}
                    // value={email}
                    />
                    <Image source={require('../assets/image/calendar.png')} style={{width:20, height:20 , marginTop:14 , right:10}} />
                    </View>
                     
                     

                    <View style={[styles.inputView, {display:'flex' , flexDirection:"row", justifyContent:"space-between"}]}>
                    {/* <Text style={{position:'absolute', top:-10, left:30, width:"10%", textAlign:"center", backgroundColor:'#fff'}}>फ़ोन:</Text> */}
                    <TextInput
                        style={styles.TextInput}
                        placeholder="समय    1-12 AM / PM"
                        placeholderTextColor={"#000"}
                    // onChangeText={(email) => setEmail(email)}
                    // defaultValue={email}
                    // value={email}
                    />
                   <Image source={require('../assets/image/clock.png')} style={{width:20, height:20 , marginTop:14 , right:10}} />
                    </View>

                    <View style={[styles.inputView, {display:'flex' , flexDirection:"row", justifyContent:"space-between"}]}>
                    {/* <Text style={{position:'absolute', top:-10, left:30, width:"10%", textAlign:"center", backgroundColor:'#fff'}}>फ़ोन:</Text> */}
                    <TextInput
                        style={styles.TextInput}
                        placeholder="काम लिखें १५ शब्दों से कम,नंबर न लिखें "
                        placeholderTextColor={"#000"}
                    // onChangeText={(email) => setEmail(email)}
                    // defaultValue={email}
                    // value={email}
                    />
                   {/* <Image source={require('../assets/image/clock.png')} style={{width:20, height:20 , marginTop:14 , right:10}} /> */}
                    </View>
                    
                    <View style={{display:"flex", flexDirection:"row",width:"100%" , justifyContent:"space-evenly"}}>
                    <View style={styles.TaxView}>
                    {/* <Text style={{position:'absolute', top:-10, left:30, width:"18%", textAlign:"center", backgroundColor:'#fff'}}>राज्य</Text> */}
                    <TextInput
                        style={styles.TextInput}
                        placeholder="भूमि क्षेत्र"
                        placeholderTextColor={"#000"}
                    // onChangeText={(email) => setEmail(email)}
                    // defaultValue={email}
                    // value={email}
                    />
                    </View>
                    <View style={styles.BhumiView}>
                    {/* <Text style={{position:'absolute', top:-10, left:30, width:"20%", textAlign:"center", backgroundColor:'#fff'}}>जिला </Text> */}
                    <TextInput
                        style={styles.TextInput}
                        placeholder="किल्ला/बीघा"
                        placeholderTextColor={"#B4B4B4"}
                    // onChangeText={(email) => setEmail(email)}
                    // defaultValue={email}
                    // value={email}
                    />
                    </View>
                    </View>

                    <View style={{display:"flex", flexDirection:"row",width:"90%" , justifyContent:"space-evenly"}}>
                    <View style={[styles.DoubleView, {marginTop:20}]}>
                    {/* <Text style={{position:'absolute', top:-10, left:30, width:"18%", textAlign:"center", backgroundColor:'#fff'}}>राज्य</Text> */}
                    <TextInput
                        style={styles.TextInput}
                        placeholder="पुरुषों की संख्या"
                        placeholderTextColor={"#000"}
                    // onChangeText={(email) => setEmail(email)}
                    // defaultValue={email}
                    // value={email}
                    />
                    </View>
                    <View style={[styles.DoubleView, {marginTop:20}]}>
                    {/* <Text style={{position:'absolute', top:-10, left:30, width:"20%", textAlign:"center", backgroundColor:'#fff'}}>जिला </Text> */}
                    <TextInput
                        style={styles.TextInput}
                        placeholder="महिलाओं की संख्या"
                        placeholderTextColor={"#000"}
                    // onChangeText={(email) => setEmail(email)}
                    // defaultValue={email}
                    // value={email}
                    />
                    </View>
                    </View>

                    <View style={{display:"flex", flexDirection:"row",width:"90%" , justifyContent:"space-evenly"}}>
                    <View style={[styles.DoubleView, {display:'flex' , flexDirection:"row", justifyContent:"space-between"}]}>
                    {/* <Text style={{position:'absolute', top:-10, left:30, width:"18%", textAlign:"center", backgroundColor:'#fff'}}>राज्य</Text> */}
                    <TextInput
                        style={styles.TextInput}
                        placeholder="एक पुरुष का वेतन "
                        placeholderTextColor={"#000"}
                    // onChangeText={(email) => setEmail(email)}
                    // defaultValue={email}
                    // value={email}
                    />
                    <Text style={{color:"#0099FF", marginTop:14, right:10}}>₹ 0.00</Text>
                    </View>
                    <View style={[styles.DoubleView, {display:'flex' , flexDirection:"row", justifyContent:"space-between"}]}>
                    {/* <Text style={{position:'absolute', top:-10, left:30, width:"20%", textAlign:"center", backgroundColor:'#fff'}}>जिला </Text> */}
                    <TextInput
                        style={styles.TextInput}
                        placeholder="एक महिला का वेतन"
                        placeholderTextColor={"#000"}
                    // onChangeText={(email) => setEmail(email)}
                    // defaultValue={email}
                    // value={email}
                    />
                     <Text style={{color:"#0099FF", marginTop:14, right:10}}>₹ 0.00</Text>
                    </View>
                    </View>

                    <View style={[styles.inputView, {display:'flex' , flexDirection:"row", justifyContent:"space-between"}]}>
                    {/* <Text style={{position:'absolute', top:-10, left:30, width:"10%", textAlign:"center", backgroundColor:'#fff'}}>फ़ोन:</Text> */}
                    <TextInput
                        style={styles.TextInput}
                        placeholder="दिनों की संख्या"
                        placeholderTextColor={"#000"}
                    // onChangeText={(email) => setEmail(email)}
                    // defaultValue={email}
                    // value={email}
                    />
                   <Text style={{color:"#0099FF", marginTop:14, right:10}}>1-5</Text>
                    </View>

                    <View style={[styles.inputView, {display:'flex' , flexDirection:"row", justifyContent:"space-between"}]}>
                    {/* <Text style={{position:'absolute', top:-10, left:30, width:"10%", textAlign:"center", backgroundColor:'#fff'}}>फ़ोन:</Text> */}
                    <TextInput
                        style={styles.TextInput}
                        placeholder="वेतन "
                        placeholderTextColor={"#000"}
                    // onChangeText={(email) => setEmail(email)}
                    // defaultValue={email}
                    // value={email}
                    />
                   <Text style={{color:"#0099FF", marginTop:14, right:10}}>₹ 0.00</Text>
                    </View>
                    
                   
                
                    <TouchableOpacity
         onPress={() => navigation.navigate("MyBooking")}
        style={styles.loginBtn}>
        <Text style={[styles.loginText, {color:"#fff"}]}>बुकिंग  करें</Text>
      </TouchableOpacity>
                </View>
                </ScrollView>

                {/* <BottomTab/> */}


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
        marginTop: 30,
        backgroundColor: "#0070C0",
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
        width: "85%",
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
        width: "39%",
        height: 48,
        marginTop: 20,
        borderWidth: 1, 
    },

    BhumiView: {
        borderColor: "#0070C0",
        borderRadius: 7,
        // borderBottomRightRadius: 0,
        // borderTopRightRadius:0,
        width: "39%",
        height: 48,
        marginTop: 20,
        borderWidth: 1, 
    },

    DoubleView : {
        borderColor: "#0070C0",
        borderRadius: 7,
        // borderBottomRightRadius: 7,
        width: "46%",
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