import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Verification from "../src/Verification";

import MyBooking from "../src/MyBooking";
import Theke_MachineForm from "../src/Theke_MachineForm";
import MyBook_SahayakForm from "../src/MyBook_SahayakForm";
import Payment from "../src/Payment";
import ThekeForm1 from "../src/ThekeForm1";
// import Homepage from "../src/HomePage";

export default function MyBookingStack () {
    const Stack = createNativeStackNavigator();
    return(
        <>
         <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
        <Stack.Screen name="MyBooking" component={MyBooking} />
        {/* <Stack.Screen name="ThekeForm1" component={ThekeForm1} /> */}
        <Stack.Screen name="Theke_MachineForm" component={Theke_MachineForm} />
        <Stack.Screen name="MyBook_SahayakForm" component={MyBook_SahayakForm} />
        <Stack.Screen name="Payment" component={Payment} />

          

         </Stack.Navigator>
        
        </>
    )
}