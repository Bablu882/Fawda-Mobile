import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MachinekKaam from "../src/MachinekKaam";
import MachineWork from "../src/MachineWork";

import MachineWork2 from "../src/MachineWork2";
// import Homepage from "../src/HomePage";

export default function MachineStack () {
    const Stack = createNativeStackNavigator();
    return(
        <>
         <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          
          <Stack.Screen name="MachineWork" component={MachineWork} />
          <Stack.Screen name="MachineWork2" component={MachineWork2} />
>

         </Stack.Navigator>
        
        </>
    )
}