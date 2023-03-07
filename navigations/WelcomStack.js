import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeStack from "./HomePageStack";
import HomePageStack from "./HomePageStack";




export default function WelcomStack () {
    const Stack = createNativeStackNavigator();

    return(
        <>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
        {/* <Stack.Screen name="Home" component={HomePageStack} /> */}
        </Stack.Navigator>
        </>
    )
}