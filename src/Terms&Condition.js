import React from "react";
import { View ,Text , TouchableOpacity, ScrollView, Image } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import RenderHtml from 'react-native-render-html';


export function Terms_Condition ({route, navigation}) {
    const {terms} = route?.params??{};
    console.log(terms?.client_info?.terms_condition , "terms");
    console.log(terms , "terms");
    const results = terms?.client_info?.terms_condition;
    return(
        <>
        <View style={{ backgroundColor:"#fff", flex:1}}>
        <View style={{ padding: 20, marginTop: 25 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrowleft" size={25} />
          </TouchableOpacity>
        </View>
      
        <ScrollView horizontal={false} showsVerticalScrollIndicator={false}>
        <View style={{ justifyContent: "center", alignItems:'center' }}>
        <Image source={require('../assets/image/Fawda-logo.png')} style={{width:120, height:120, alignItems:"center" , justifyContent:"center" }}/>
          <Text
            style={{ textAlign: "center", fontSize: 30, fontWeight: "600" }}
          >
           नियम और शर्तें 
          </Text>
        </View>
        <View style={{paddingHorizontal:20, marginTop:20}}>
            {/* <Text style={{fontSize:18, textAlign:"justify"}}>{terms?.client_info?.privacy_policy}</Text> */}
            {/* <Text style={{fontSize:18, textAlign:"justify"}}>{results}</Text> */}
            <RenderHtml contentWidth={300} source={{html: results}} />
        </View>
        </ScrollView>
        </View>
        </>
    )
}