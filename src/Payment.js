import React from "react";
import { View , Text , TouchableOpacity , StyleSheet, SafeAreaView , TextInput} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";


export default function Payment ({route,navigation}) {



  const {  item, bookingid } = route.params;
  console.log("payment page", item, bookingid);

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
                    <Text style={{ textAlign: "center", fontSize: 30, fontWeight: "600" }}>भुगतान का विवरण</Text>
                </View>

                <View style={{borderWidth:1 , width:"90%" , height:150, borderColor:"#0099FF", marginTop:30}}>
               <View style={{width:"100%" , display:"flex", flexDirection:"row", justifyContent:"space-between"}}>
               <Text style={{marginTop:20, marginLeft:15}}>ठेकेदार/सहायक </Text>
               <Text style={{marginTop:20, color:"#0099FF",  marginRight:25}}>₹ 1200.00</Text>
               
               </View>

               <View style={{width:"100%" , display:"flex", flexDirection:"row", justifyContent:"space-between"}}>
               <Text style={{marginTop:20, marginLeft:15}}>फावड़ा की फीस </Text>
               <Text style={{marginTop:20, color:"#0099FF" ,  marginRight:25}}>₹ xxx.xx</Text>
               
               </View>

               <View style={{width:"100%" , display:"flex", flexDirection:"row", justifyContent:"space-between"}}>
               <Text style={{marginTop:20, marginLeft:15}}>कुल भुगतान</Text>
               <Text style={{marginTop:20, color:"#0099FF", marginRight:25}}>₹ xxx.xx</Text>
               
               </View>
                </View>

                
      </View>
                <View style={{ display:"flex", flexDirection:"row", justifyContent:"flex-end"}}>
                    <View style={{backgroundColor:"#44A347", marginRight:20, width:"33%", marginTop:20, height:33}}>
                    <Text style={{ textAlign:"center", marginTop:6, color:"#fff"}}>चालान डाउनलोड करें</Text>
                    </View>
                </View>
 
                <View style={{justifyContent:'center', alignItems:'center'}}>
                <TouchableOpacity style={styles.BhuktanBtn} onPress={() => { 
                    if (item.job_type === "individuals_sahayak") {
                        navigation.navigate("Mybooking_Sahayak2", {
                         
                          item: item
                        });
                      } else if (item.job_type === "theke_pe_kam") {
                        navigation.navigate("Theke_MachineForm2", {
                        
                          item: item
                        });
                      
                    }}}>
                        <Text style={[styles.loginText, {color:"#fff"}]}>अभी भुगतान करें </Text>
                    </TouchableOpacity>
                    </View>
      </SafeAreaView>
        </>
    )
}

const styles = StyleSheet.create({
    BhuktanBtn: {
        width: "85%",
        borderRadius: 7,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 30,
        backgroundColor: "#0099FF",
      },
      loginText: {
        color: "#000",
        fontSize:16,
      //   flexDirection:"column",
      },
})