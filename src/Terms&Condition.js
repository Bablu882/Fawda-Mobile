import React from "react";
import { View ,Text , TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";



export function Terms_Condition ({route, navigation}) {
    const {terms} = route?.params??{};
    console.log(terms?.client_info?.terms_condition , "terms");
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
           नियम और शर्तें 
          </Text>
        </View>
        <View style={{paddingHorizontal:20, marginTop:20}}>
            <Text style={{fontSize:18, textAlign:"justify"}}>{terms?.client_info?.terms_condition}</Text>
        </View>
        </View>
        </>
    )
}