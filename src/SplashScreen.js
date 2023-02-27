import React from "react";
import { View , StyleSheet , Text , Image, Button, TouchableOpacity} from "react-native";
import { useNavigation } from "@react-navigation/core";
import { useDispatch, useSelector } from 'react-redux';
import { selectIsLoggedIn, setToken } from '../slices/authSlice';
import { translate } from '@vitalets/google-translate-api';



export default function SplashScreen ({navigation}) {
    // const isLoggedIn = useSelector(selectIsLoggedIn);
    // const { text } = await translate('Привет мир');


    // React.useEffect(() => {
    //     if(isLoggedIn) {
    //       // alert(isLoggedIn)
    //       setTimeout(() => {
    //         navigation.replace('Home')
    //       }, 0)
    //     }
    //   },[isLoggedIn])
     


    
    return(
        <>
   <View style={{flex:1 , justifyContent:"center", alignItems:"center", backgroundColor:"#fff" }}>
    <Image source={require('../assets/image/fawda-logo.png')} style={{width:200, height:200, alignItems:"center" , justifyContent:"center" }}/>
    
    <TouchableOpacity onPress={() => navigation.navigate("Home")}>
   <Text style={{fontFamily:'Poppin-Light'}}>स्वागत</Text>
   </TouchableOpacity>
   </View>
   </>
    )
}

const styles = StyleSheet.create({
    
})