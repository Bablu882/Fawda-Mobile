import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Verification from "../src/Verification";

import MyBooking from "../src/MyBooking";
import Theke_MachineForm from "../src/Theke_MachineForm";
import MyBook_SahayakForm from "../src/MyBook_SahayakForm";
import Payment from "../src/Payment";

import ThekeParKaam_Form from "../src/ThekeParKaam_Form";
import SahayakForm from "../src/SahayakForm";
import MachineBooking from "../src/MachineBooking";
import Mybooking_Sahayak2 from "../src/Mybooking_Sahayak2";
import Theke_MachineForm2 from "../src/Theke_MachineForm2";
import MachineWork from "../src/MachineWork";
import MachineWork2 from "../src/MachineWork2";


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
        <Stack.Screen name="Thekeparkaam" component={ThekeParKaam_Form} />
        {/* <Stack.Screen name="SahayakForm" component={SahayakForm} /> */}
        {/* <Stack.Screen name="MachineBooking" component={MachineBooking} /> */}
        <Stack.Screen name="Theke_MachineForm" component={Theke_MachineForm} />
        <Stack.Screen name="Theke_MachineForm2" component={Theke_MachineForm2} />
        <Stack.Screen name="MyBook_SahayakForm" component={MyBook_SahayakForm} />
        <Stack.Screen name="Payment" component={Payment} />
        <Stack.Screen name="Mybooking_Sahayak2" component={Mybooking_Sahayak2} />
        <Stack.Screen name="MachineWork" component={MachineWork} />
        <Stack.Screen name="MachineWork2" component={MachineWork2} />

          

         </Stack.Navigator>
        
        </>
    )
}