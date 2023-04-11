import React from "react";
import { View ,Text , TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";



export function Privacy_policy ({route, navigation}) {
    const {terms} = route?.params??{};
    console.log(terms?.client_info?.privacy_policy , "terms");
    return(
        <>
        <View style={{ backgroundColor:"#fff", flex:1}}>
        <View style={{ padding: 20, marginTop: 25 }}>
          <TouchableOpacity onPress={() => navigation.goBack("HomeTwo")}>
            <Icon name="arrowleft" size={25} />
          </TouchableOpacity>
        </View>
        <View style={{ justifyContent: "center" }}>
          <Text
            style={{ textAlign: "center", fontSize: 30, fontWeight: "600" }}
          >
         प्राइवेसी नीति
          </Text>
        </View>
        <View style={{paddingHorizontal:20, marginTop:20}}>
            <Text style={{fontSize:18, textAlign:"justify"}}>{terms?.client_info?.privacy_policy}</Text>
        </View>
        </View>
        </>
    )
}