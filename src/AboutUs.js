import React from "react";
import { View ,Text , TouchableOpacity, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";



export function About_us ({route, navigation}) {
    const {terms} = route?.params??{};
    console.log(terms?.client_info?.about_us , "terms");
    return(
        <>
        <View style={{ backgroundColor:"#fff", flex:1}}>
        <View style={{ padding: 20, marginTop: 25 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrowleft" size={25} />
          </TouchableOpacity>
        </View>
        <View style={{ justifyContent: "center" }}>
          <Text
            style={{ textAlign: "center", fontSize: 30, fontWeight: "600" }}
          >
          हमारे बारे में 
          </Text>
        </View>
        <ScrollView horizontal={false} showsVerticalScrollIndicator={false}>
        <View style={{paddingHorizontal:20, marginTop:20}}>
            <Text style={{fontSize:18, textAlign:"justify"}}>{terms?.client_info?.about_us}</Text>
        </View>
        </ScrollView>
        </View>
        </>
    )
}