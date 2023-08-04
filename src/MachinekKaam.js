import React from "react";
import { View , Text , TouchableOpacity, SafeAreaView } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";



export default function MachinekKaam ({navigation}) {
    return(
        <>
        <SafeAreaView  style={{backgroundColor:'#fff', flex:1 }}>
        <View style={{ padding: 20, marginTop: 25 }}>
          {/* <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrowleft" size={25} />
          </TouchableOpacity> */}
        </View>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <View style={{ justifyContent: "center" }}>
            <Text
              style={{ textAlign: "center", fontSize: 30, fontWeight: "600" }}
            >
              मशीन के काम  
            </Text>
          </View>
           
          <View style={{ borderTopWidth:0.7 , borderTopColor:"#0099FF" , width:"100%" , top:40}}/>
          <View style={{display:"flex" , flexDirection:"row", width:"100%", justifyContent:"space-between", marginTop:50}} >
            <View style={{marginLeft:30}}  >
            <Text style={{fontWeight:"600", fontSize:18}}>रोटावेटर</Text>
            <Text>04/03/2023</Text>
            </View>
            <View style={{width:"30%" , height:33, backgroundColor:"#44A347", marginRight:20, marginTop:10}} >
            <TouchableOpacity onPress={() => navigation.navigate('MachineStack', {screen : "MachineWork"})}>
                <Text style={{textAlign:"center" , marginTop:7, color:"#fff", fontSize:15, fontWeight:"600"}}>विवरण देखे </Text>
                
            </TouchableOpacity>
            </View>
          </View>

           <View style={{ borderTopWidth:0.7 , borderTopColor:"#0099FF" , width:"100%" , marginTop:15}}/>
          <View style={{display:"flex" , flexDirection:"row", width:"100%", justifyContent:"space-between", marginTop:10}} >
            <View style={{marginLeft:30}}  >
            <Text style={{fontWeight:"600", fontSize:18}}>टिलर</Text>
            <Text>04/03/2023</Text>
            </View>
            <View style={{width:"30%" , height:33, backgroundColor:"#44A347", marginRight:20, marginTop:10}} >
            <TouchableOpacity >
                <Text style={{textAlign:"center" , marginTop:7, color:"#fff", fontSize:15, fontWeight:"600"}}>विवरण देखे </Text>
            </TouchableOpacity>
            </View>
          </View>
           
           
          <View style={{ borderTopWidth:0.7 , borderTopColor:"#0099FF" , width:"100%" , marginTop:15}}/>
          <View style={{display:"flex" , flexDirection:"row", width:"100%", justifyContent:"space-between", marginTop:10}} >
            <View style={{marginLeft:30}}  >
            <Text style={{fontWeight:"600", fontSize:18}}>कंप्यूटराइज्ड जंड्रा</Text>
            <Text>04/03/2023</Text>
            </View>
            <View style={{width:"30%" , height:33, backgroundColor:"#44A347", marginRight:20, marginTop:10}} >
                {/* <Text style={{textAlign:"center" , marginTop:7, color:"#fff", fontSize:15, fontWeight:"600"}}>विवरण देखे </Text> */}
                <TouchableOpacity >
                <Text style={{textAlign:"center" , marginTop:7, color:"#fff", fontSize:15, fontWeight:"600"}}>विवरण देखे </Text>
            </TouchableOpacity>
            </View>
          </View>
           
          <View style={{ borderTopWidth:0.7 , borderTopColor:"#0099FF" , width:"100%" , marginTop:15}}/>
          <View style={{display:"flex" , flexDirection:"row", width:"100%", justifyContent:"space-between", marginTop:10}} >
            <View style={{marginLeft:30}}  >
            <Text style={{fontWeight:"600", fontSize:18}}>रोटावेटर</Text>
            <Text>04/03/2023</Text>
            </View>
            <View style={{width:"30%" , height:33, backgroundColor:"#44A347", marginRight:20, marginTop:10}} >
                <Text style={{textAlign:"center" , marginTop:7, color:"#fff", fontSize:15, fontWeight:"600"}}>विवरण देखे </Text>
            </View>
          </View>
          
          
          <View style={{ borderTopWidth:0.7 , borderTopColor:"#0099FF" , width:"100%" , marginTop:15}}/>


          </View>

        </SafeAreaView>
        </>
    )
}