import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ThekedarkKaam from "../src/ThekedarkKaam";

export default function HomeStackTwo () {
    const Stack = createNativeStackNavigator();
    return(
        <>
         <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="HomeTwo" component={ThekedarkKaam} />
          {/* <Stack.Screen name="ThekekkKaam" component={Theke_k_Kaam} />  */}
          {/* <Stack.Screen name="SahayakBooking" component={SahayakBooking} /> */}
          
          {/* <Stack.Screen name="Thekeparkaam" component={ThekeParKaam_Form} />  */}
          {/* <Stack.Screen name="SahayakForm" component={SahayakForm} /> */}
          {/* <Stack.Screen name="MachineBooking" component={MachineBooking} /> */}
         </Stack.Navigator>
        
        </>
    )
}