import React, {useEffect} from "react";
import { View , StyleSheet , Text , Image, Button, TouchableOpacity} from "react-native";
import { useNavigation } from "@react-navigation/core";
import { useDispatch, useSelector } from 'react-redux';
import { selectIsLoggedIn, setToken } from '../slices/authSlice';
import { translate } from '@vitalets/google-translate-api';



export default function SplashScreen ({navigation}) {

    useEffect(() => {
        setTimeout(() => {
          navigation.replace("Login");
        }, 3000);
      }, []);
    
    return(
        <>
   <View style={{flex:1 , justifyContent:"center", alignItems:"center", backgroundColor:"#fff" }}>
    <Image source={require('../assets/image/Fawda-logo.png')} style={{width:220, height:200, alignItems:"center" , justifyContent:"center" }}/>
    
    {/* <TouchableOpacity onPress={() => navigation.navigate("Home")}>
   <Text style={{fontFamily:'Poppin-Light'}}>स्वागत</Text>
   </TouchableOpacity> */}
   </View>
   </>
    )
}

const styles = StyleSheet.create({
    
})