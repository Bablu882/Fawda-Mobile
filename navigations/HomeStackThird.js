import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MachinekKaam from "../src/MachinekKaam";

export default function HomeStackThird () {
    const Stack = createNativeStackNavigator();
    return(
        <>
         <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Homethird" component={MachinekKaam} />
          {/* <Stack.Screen name="ThekekkKaam" component={Theke_k_Kaam} />  */}
          {/* <Stack.Screen name="SahayakBooking" component={SahayakBooking} /> */}
          
          {/* <Stack.Screen name="Thekeparkaam" component={ThekeParKaam_Form} />  */}
          {/* <Stack.Screen name="SahayakForm" component={SahayakForm} /> */}
          {/* <Stack.Screen name="MachineBooking" component={MachineBooking} /> */}
         </Stack.Navigator>
        
        </>
    )
}