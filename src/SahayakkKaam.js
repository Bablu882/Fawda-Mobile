import React from "react";
import { View , Text ,TouchableOpacity , StyleSheet ,SafeAreaView ,TextInput, Image } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";



export default function SahayakkKaam ({navigation}) {
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
                    <Text style={{ textAlign: "center", fontSize: 30, fontWeight: "600" }}>सहायक </Text>
                </View>
      </View>

      <View style={{ justifyContent: "center", alignItems: "center", marginTop:20 }} >
                    <View style={[styles.inputView, {height:75, display:'flex' , flexDirection:"row", justifyContent:"space-between"}]}>
                    {/* <Text style={{position:'absolute', top:-10, left:30, width:"10%", textAlign:"center", backgroundColor:'#fff'}}>फ़ोन:</Text> */}
                    <TextInput
                        style={[styles.TextInput]}
                        placeholder="काम का विवरण "
                        placeholderTextColor={"#000"}
                    // onChangeText={(email) => setEmail(email)}
                    // defaultValue={email}
                    // value={email}
                    />
                    <Image source={require('../assets/image/edit.png')} style={{width:20, height:20 , marginTop:10 , right:10}} /> 
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

                    <View style={styles.inputView}>
                    {/* <Text style={{position:'absolute', top:-10, left:30, width:"10%", textAlign:"center", backgroundColor:'#fff'}}>फ़ोन:</Text> */}
                    <TextInput
                        style={[styles.TextInput]}
                        placeholder="काम लिखें १५ शब्दों से कम,नंबर न लिखें "
                        placeholderTextColor={"#000"}
                    // onChangeText={(email) => setEmail(email)}
                    // defaultValue={email}
                    // value={email}
                    />
                    </View>
                    
                    <View style={{display:"flex", flexDirection:"row",width:"85%" , justifyContent:"flex-start"}}>
                    <View style={[styles.TaxView, {display:'flex' , flexDirection:"row", justifyContent:"space-between"}]}>
                    {/* <Text style={{position:'absolute', top:-10, left:30, width:"18%", textAlign:"center", backgroundColor:'#fff'}}>राज्य</Text> */}
                    <TextInput
                        style={styles.TextInput}
                        placeholder="भूमि क्षेत्र"
                        placeholderTextColor={"#000"}
                    // onChangeText={(email) => setEmail(email)}
                    // defaultValue={email}
                    // value={email}
                    />
                    <Text style={{marginTop:13 , marginRight:8, color:"#0099FF"}}>8 बीघा</Text>
                    </View>
                    </View>
                    
                    <View style={{display:"flex", flexDirection:"row",width:"90%" , justifyContent:"space-evenly"}}>
                    <View style={[styles.TaxView, {display:'flex' , flexDirection:"row", justifyContent:"space-between", width:"45%"}]}>
                    {/* <Text style={{position:'absolute', top:-10, left:30, width:"18%", textAlign:"center", backgroundColor:'#fff'}}>राज्य</Text> */}
                    <TextInput
                        style={styles.TextInput}
                        placeholder="एक पुरुष का वेतन"
                        placeholderTextColor={"#000"}
                    // onChangeText={(email) => setEmail(email)}
                    // defaultValue={email}
                    // value={email}
                    />
                    <Text style={{marginTop:13 , marginRight:8, color:"#0099FF"}}>₹ 0.00</Text>
                    </View>
                    <View style={[styles.BhumiView, {display:'flex' , flexDirection:"row", justifyContent:"space-between", width:"45%"}]}>
                    {/* <Text style={{position:'absolute', top:-10, left:30, width:"20%", textAlign:"center", backgroundColor:'#fff'}}>जिला </Text> */}
                    <TextInput
                        style={styles.TextInput}
                        placeholder="एक महिला का वेतन"
                        placeholderTextColor={"#000"}
                    // onChangeText={(email) => setEmail(email)}
                    // defaultValue={email}
                    // value={email}
                    />
                    <Text style={{marginTop:13 , marginRight:20, color:"#0099FF"}}>₹ 0.00</Text>
                    </View>
                    </View>


                    <View style={{display:"flex", flexDirection:"row",width:"90%" , justifyContent:"space-evenly"}}>
                    <View style={[styles.TaxView, {display:'flex' , flexDirection:"row", justifyContent:"space-between"}]}>
                    {/* <Text style={{position:'absolute', top:-10, left:30, width:"18%", textAlign:"center", backgroundColor:'#fff'}}>राज्य</Text> */}
                    <TextInput
                        style={styles.TextInput}
                        placeholder="भूमि क्षेत्र"
                        placeholderTextColor={"#000"}
                    // onChangeText={(email) => setEmail(email)}
                    // defaultValue={email}
                    // value={email}
                    />
                    <Text style={{marginTop:13 , marginRight:8, color:"#0099FF"}}>8 बीघा</Text>
                    </View>
                    <View style={[styles.BhumiView, {display:'flex' , flexDirection:"row", justifyContent:"space-between"}]}>
                    {/* <Text style={{position:'absolute', top:-10, left:30, width:"20%", textAlign:"center", backgroundColor:'#fff'}}>जिला </Text> */}
                    <TextInput
                        style={styles.TextInput}
                        placeholder="वेतन"
                        placeholderTextColor={"#000"}
                    // onChangeText={(email) => setEmail(email)}
                    // defaultValue={email}
                    // value={email}
                    />
                    <Text style={{marginTop:13 , marginRight:8, color:"#0099FF"}}>₹ 0.00</Text>
                    </View>
                    </View>

                    <View style={{display:"flex", flexDirection:"row",width:"100%" , justifyContent:"center"}}>
                    <View style={[styles.MaleCheckView, {display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",}]}>
                    <TextInput
                        style={styles.CheckTextInput}
                        placeholder="पुरषो"
                        placeholderTextColor={"#101010"}
                        name="Male"
                    // onChangeText={(email) => setEmail(email)}
                    // defaultValue={email}
                    // value={Male}
                    />
                     <View
              style={{
                width: "35%",
                height: 25,
                backgroundColor: "#0099FF",
                marginLeft: 5,
                marginTop:15,
              }}
            >
              <TouchableOpacity>
                <Text
                  style={{
                    textAlign: "center",
                    marginTop: 5,
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: "600",
                  }}
                >
                  स्वीकार
                </Text>
              </TouchableOpacity>
            </View>
                    </View>

                    <View style={[styles.FemalecheckView, {marginTop:10, width:"27%", borderRadius:0, display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",}]}>
                    {/* <Text style={{position:'absolute', top:-10, left:30, width:"10%", textAlign:"center", backgroundColor:'#fff'}}>लिंग:</Text> */}
                    <TextInput
                        style={styles.CheckTextInput}
                        placeholder="पुरषो"
                        placeholderTextColor={"#101010"}
                        name="Female"
                    // onChangeText={(email) => setEmail(email)}
                    // defaultValue={email}
                    // value={Female} 
                    />
                    <View
              style={{
                width: "35%",
                height: 25,
                backgroundColor: "#44A347",
                marginLeft: 5,
                marginTop:15,
              }}
            >
              <TouchableOpacity>
                <Text
                  style={{
                    textAlign: "center",
                    marginTop: 5,
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: "600",
                  }}
                >
                  पेंडिंग
                </Text>
              </TouchableOpacity>
            </View>
                    </View>

                    <View style={[styles.FemalecheckView, , {
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
              }]}>
                    {/* <Text style={{position:'absolute', top:-10, left:30, width:"10%", textAlign:"center", backgroundColor:'#fff'}}>लिंग:</Text> */}
                    <TextInput
                        style={styles.CheckTextInput}
                        placeholder="महिला"
                        placeholderTextColor={"#101010"}
                        name="Female"
                    // onChangeText={(email) => setEmail(email)}
                    // defaultValue={email}
                    // value={Female} 
                    />
                    <View
              style={{
                width: "38%",
                height: 25,
                backgroundColor: "#0099FF",
                marginLeft: 5,
                marginTop:15,
              }}
            >
              <TouchableOpacity>
                <Text
                  style={{
                    textAlign: "center",
                    marginTop: 5,
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: "600",
                  }}
                >
                  स्वीकार
                </Text>
              </TouchableOpacity>
            </View>
                    </View>
                    </View>

                    <View style={{display:"flex", flexDirection:"row",width:"100%" , justifyContent:"center"}}>
                    <View style={[styles.MaleCheckView, , {
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
              }]}>
                    <TextInput
                        style={styles.CheckTextInput}
                        placeholder="पुरषो"
                        placeholderTextColor={"#101010"}
                        name="Male"
                    // onChangeText={(email) => setEmail(email)}
                    // defaultValue={email}
                    // value={Male}
                    />
                    <View
              style={{
                width: "35%",
                height: 25,
                backgroundColor: "#0099FF",
                marginLeft: 5,
                marginTop:15,
              }}
            >
              <TouchableOpacity>
                <Text
                  style={{
                    textAlign: "center",
                    marginTop: 5,
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: "600",
                  }}
                >
                  स्वीकार
                </Text>
              </TouchableOpacity>
            </View>
                    </View>
                    <View style={[styles.FemalecheckView, {marginTop:10, width:"27%", borderRadius:0, display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",}]}>
                    {/* <Text style={{position:'absolute', top:-10, left:30, width:"10%", textAlign:"center", backgroundColor:'#fff'}}>लिंग:</Text> */}
                    <TextInput
                        style={styles.CheckTextInput}
                        placeholder="पुरषो"
                        placeholderTextColor={"#101010"}
                        name="Female"
                    // onChangeText={(email) => setEmail(email)}
                    // defaultValue={email}
                    // value={Female} 
                    />
                    <View
              style={{
                width: "35%",
                height: 25,
                backgroundColor: "#44A347",
                marginLeft: 5,
                marginTop:15,
              }}
            >
              <TouchableOpacity>
                <Text
                  style={{
                    textAlign: "center",
                    marginTop: 5,
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: "600",
                  }}
                >
                  पेंडिंग
                </Text>
              </TouchableOpacity>
            </View>
                    </View>

                    <View style={[styles.FemalecheckView , {
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
              },]}>
                    {/* <Text style={{position:'absolute', top:-10, left:30, width:"10%", textAlign:"center", backgroundColor:'#fff'}}>लिंग:</Text> */}
                    <TextInput
                        style={styles.CheckTextInput}
                        placeholder="महिला"
                        placeholderTextColor={"#101010"}
                        name="Female"
                    // onChangeText={(email) => setEmail(email)}
                    // defaultValue={email}
                    // value={Female} 
                    />
                    <View
              style={{
                width: "38%",
                height: 25,
                backgroundColor: "#0099FF",
                marginLeft: 5,
                marginTop:15,
              }}
            >
              <TouchableOpacity>
                <Text
                  style={{
                    textAlign: "center",
                    marginTop: 5,
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: "600",
                  }}
                >
                  स्वीकार
                </Text>
              </TouchableOpacity>
            </View>
                    </View>
                    </View>
                      
                      {/* display when status is booked  */}

                    <View style={{display:"flex", flexDirection:"row",width:"100%" , justifyContent:"center", display:"none"}}>
                    <View style={[styles.MaleCheckView, {width:"21%"}]}>
                    <TextInput
                        style={{textAlign:"center", marginTop:12}}
                        placeholder="पुरषो"
                        placeholderTextColor={"#101010"}
                        name="Male"
                    // onChangeText={(email) => setEmail(email)}
                    // defaultValue={email}
                    // value={Male}
                    />
                    
                    </View>
                    <View style={[styles.FemalecheckView, {marginTop:10, width:"21%", borderRadius:0}]}>
                    {/* <Text style={{position:'absolute', top:-10, left:30, width:"10%", textAlign:"center", backgroundColor:'#fff'}}>लिंग:</Text> */}
                    <TextInput
                        style={{textAlign:"center", marginTop:12}}
                        placeholder="पुरषो"
                        placeholderTextColor={"#101010"}
                        name="Female"
                    // onChangeText={(email) => setEmail(email)}
                    // defaultValue={email}
                    // value={Female} 
                    />
                    
                    </View>

                    <View style={[styles.FemalecheckView, {marginTop:10, width:"21%", borderRadius:0}]}>
                    {/* <Text style={{position:'absolute', top:-10, left:30, width:"10%", textAlign:"center", backgroundColor:'#fff'}}>लिंग:</Text> */}
                    <TextInput
                        style={{textAlign:"center", marginTop:12}}
                        placeholder="महिला"
                        placeholderTextColor={"#101010"}
                        name="Female"
                    // onChangeText={(email) => setEmail(email)}
                    // defaultValue={email}
                    // value={Female} 
                    />
                    
                    </View>

                    <View style={[styles.FemalecheckView, {width:"21%"}]}>
                    {/* <Text style={{position:'absolute', top:-10, left:30, width:"10%", textAlign:"center", backgroundColor:'#fff'}}>लिंग:</Text> */}
                    <TextInput
                        style={{textAlign:"center", marginTop:12}}
                        placeholder="महिला"
                        placeholderTextColor={"#101010"}
                        name="Female"
                    // onChangeText={(email) => setEmail(email)}
                    // defaultValue={email}
                    // value={Female} 
                    />
                    
                    </View>
                    </View>

                    {/* end */}


                    <View
            style={[
              styles.inputView,
              {
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              },
            ]}
          >
            {/* <Text style={{position:'absolute', top:-10, left:30, width:"10%", textAlign:"center", backgroundColor:'#fff'}}>फ़ोन:</Text> */}
            <TextInput
              style={styles.TextInput}
              placeholder="काम की स्थिति"
              placeholderTextColor={"#000"}
              // onChangeText={(email) => setEmail(email)}
              // defaultValue={email}
              // value={email}
            />
            <View
              style={{
                width: "45%",
                height: 30,
                backgroundColor: "#44A347",
                marginRight: 10,
                marginTop:8,
              }}
            >
              <TouchableOpacity>
                <Text
                  style={{
                    textAlign: "center",
                    marginTop: 5,
                    color: "#fff",
                    fontSize: 15,
                    fontWeight: "600",
                  }}
                >
                  चार सहायक स्वीकार करें 
                </Text>
              </TouchableOpacity>
            </View>
          </View>
                    
                    <TouchableOpacity style={styles.BhuktanBtn} onPress={() => navigation.navigate("Payment")}>
                        <Text style={[styles.loginText, {color:"#fff"}]}>भुगतान करें</Text>
                    </TouchableOpacity>
                   
                
                    <TouchableOpacity
         onPress={() => navigation.navigate("Profile")}
        style={styles.loginBtn}>
        <Text style={[styles.loginText, {color:"#fff"}]}>रद्द करें </Text>
      </TouchableOpacity>
                </View>

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

    MaleCheckView: {
        borderColor: "#0070C0",
        borderRadius: 7,
        borderBottomRightRadius: 0,
        borderTopRightRadius:0,
        width: "30%",
        height: 55,
        marginTop: 10,
        borderWidth: 1, 
    },

    // FemalecheckView:{
    //     borderColor: "#0070C0",
    //     borderRadius: 7,
    //     borderBottomLeftRadius: 0,
    //     borderTopLeftRadius:0,
    //     width: "30%",
    //     height: 48,
    //     // marginTop: 30,
    //     borderWidth: 1, 
    // },

    loginText: {
        color: "#000",
        fontSize:16,
      //   flexDirection:"column",
      },

      loginBtn:
      {
        width: "30%",
        borderRadius: 7,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 50,
        backgroundColor: "#DCDCDC",
      },

      BhuktanBtn: {
        width: "85%",
        borderRadius: 7,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
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
        width: "85%",
        height: 48,
        marginTop: 10,
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
    marginTop:0
    },

    TaxView : {
        borderColor: "#0070C0",
        borderRadius: 7,
        // borderBottomRightRadius: 7,
        width: "39%",
        height: 48,
        marginTop: 10,
        borderWidth: 1, 
    },

    BhumiView: {
        borderColor: "#0070C0",
        borderRadius: 7,
        // borderBottomRightRadius: 0,
        // borderTopRightRadius:0,
        width: "52%",
        height: 48,
        marginTop: 10,
        borderWidth: 1, 
    },

    DateView:{
      borderColor: "#0070C0",
        borderRadius: 7,
        // borderBottomRightRadius: 7,
        width: "39%",
        height: 48,
        marginTop: 10,
        borderWidth: 1, 
    },

    TimeView:{
      borderColor: "#0070C0",
      borderRadius: 7,
      // borderBottomRightRadius: 0,
      // borderTopRightRadius:0,
      width: "39%",
      height: 48,
      marginTop: 10,
      borderWidth: 1,
    },

    JobStatusView: {
        borderColor: "#0070C0",
        borderRadius: 7,
        // borderBottomRightRadius: 7,
        width: "43%",
        height: 48,
        marginTop: 20,
        borderWidth: 1, 
    },

    AmountView: {
        borderColor: "#0070C0",
        borderRadius: 7,
        // borderBottomRightRadius: 0,
        // borderTopRightRadius:0,
        width: "43%",
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
        width: "27%",
        height: 55,
        marginTop: 10,
        borderWidth: 1, 
    },
})