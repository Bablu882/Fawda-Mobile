import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SahayakkKaam from "../src/SahayakkKaam";
import Theke_k_Kaam from "../src/Theke_k_Kaam";
import MeraKaam from "../src/MeraKaam";
// import Homepage from "../src/HomePage";

export default function MyNaukariStack () {
    const Stack = createNativeStackNavigator();
    return(
        <>
         <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          
        <Stack.Screen name="ThekekkKaam" component={Theke_k_Kaam} />
        <Stack.Screen name="MeraKaam" component={MeraKaam} />
        <Stack.Screen name="SahayakkKaam" component={SahayakkKaam} />    

         </Stack.Navigator>
        
        </>
    )
}