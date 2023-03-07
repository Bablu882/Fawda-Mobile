import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Verification from "../src/Verification";
import Homepage from "../src/HomePage";
import SahayakBooking from "../src/SahayakBooking";
import ThekeParKaam_Form from "../src/ThekeParKaam_Form";
import SahayakForm from "../src/SahayakForm";
import MachineBooking from "../src/MachineBooking";

export default function HomePageStack () {
    const Stack = createNativeStackNavigator();
    return(
        <>
         <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Home" component={Homepage} /> 
          {/* <Stack.Screen name="SahayakBooking" component={SahayakBooking} /> */}
          <Stack.Screen name="Thekeparkaam" component={ThekeParKaam_Form} /> 
          <Stack.Screen name="SahayakForm" component={SahayakForm} />
          <Stack.Screen name="MachineBooking" component={MachineBooking} />
         </Stack.Navigator>
        
        </>
    )
}