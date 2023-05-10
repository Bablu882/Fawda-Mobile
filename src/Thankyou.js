import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ImageBackground,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";


export default function Thankyou({navigation}) {
  return (
    <SafeAreaView style={{ backgroundColor: "#D8EEFD", flex: 1 }}>
      <View style={styles.container}>
        <ImageBackground
          source={require("../assets/image/thankyou.png")}
          // style={{ width: 200, height: 200, alignItems: "center" }}
          style={styles.image}
          resizeMode="contain"
        >
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 45 }}>धन्यवाद!</Text>
              <Text style={{ fontSize: 14 }}>
                आपका सुझाव हमारे लिए महत्त्वपूर्ण है
              </Text>
            </View>
            <View style={{paddingTop:30}}>
              <TouchableOpacity 
              onPress={() => {navigation.navigate('HomePage')}}
                style={{
                  width: "100%",
                  maxWidth: 300,
                  backgroundColor: "#0099FF",
                  paddingHorizontal: 20,
                  height: 27,
                }}
              >
                <Text style={{ color: "#fff", lineHeight:27, fontSize:12 }}>होम पेज  <Icon name="arrowright" type="AntDesign"   /></Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
        <View style={{ alignItems: "center", paddingTop:20}}>
        <ImageBackground
          source={require("../assets/image/circle.png")}
          // style={{ width: 200, height: 200, alignItems: "center" }}
          style={styles.circleimage}
          resizeMode="contain"
        >
          <Image  source={require("../assets/image/checkmark.png")} style={styles.checkmark}/>
          </ImageBackground>
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  checkmark:{
  width:40,
  height:40,
  marginHorizontal:'auto'
  },
  circleimage:{
width:80,
height:80,
resizeMode:'contain',
alignItems:'center',
justifyContent:'center'
  },
  image: {
    width: 300,
    height: 300,
    alignItems: "center",
  },
});
