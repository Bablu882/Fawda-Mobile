import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { RootSiblingParent } from 'react-native-root-siblings';
import store from "./store";
import { Provider } from "react-redux";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import Dashboard from "./src/Dashboard";
import Login from "./src/Login";
import { PersistGate } from "redux-persist/integration/react";
import persistStore from "redux-persist/es/persistStore";
import SplashScreen from "./src/SplashScreen";
import { useFonts } from "expo-font";
// import { translate } from '@vitalets/google-translate-api';
// import SupportPage from "./src/SupportPage";
import Verification from "./src/Verification";
import Register from "./src/Register";

import Homepage from "./src/HomePage";
// import SahayakBooking from "./src/SahayakBooking";
import BottomTab from "./Component/BottomTab";
// import Profile from "./src/Profile";
import ThekeParKaam_Form from "./src/ThekeParKaam_Form";
// import HomePageStack from "./navigations/HomePageStack";

import SahayakRegisterForm from "./src/SahayakRegisterForm";
import BottomTabSahayak from "./Component/BottomTabSahayak";
import MachineMachine_Registration from "./src/MachineMalik_Registration";
import BottomTabMachine from "./Component/BottomTabMachine";
import GrahakRegisterForm from "./src/GrahakRegisterForm";
import SahayakForm from "./src/SahayakForm";
import MachineBooking from "./src/MachineBooking";


let persistor = persistStore(store);
const Stack = createNativeStackNavigator();
export default function App() {

 const [fontsLoaded] = useFonts({
    // "Poppin-Light": require("./assets/font/Devanagari.ttf"),
    });
    
    if (!fontsLoaded) {
    return(null) 
    }
    
    return(
      <RootSiblingParent>
    <NavigationContainer>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="SplashScreen" component={SplashScreen} />
                    <Stack.Screen name="Login" component={Login} />
                             <Stack.Screen name="Verification" component={Verification} /> 
                             <Stack.Screen name="Register" component={Register} /> 

                             <Stack.Screen name="GrahakRegisterForm" component={GrahakRegisterForm} />
                             <Stack.Screen name="SahayakRegisterForm" component={SahayakRegisterForm} />
                             <Stack.Screen name="MachineMalik_Registration" component={MachineMachine_Registration} />
                             <Stack.Screen name="Home" component={BottomTab} />
                             <Stack.Screen name="HomeTwo" component={BottomTabSahayak} />
                             <Stack.Screen name="Homethird" component={BottomTabMachine} />
                             <Stack.Screen name="Thekeparkaam" component={ThekeParKaam_Form} /> 
                             <Stack.Screen name="SahayakForm" component={SahayakForm} />
                             <Stack.Screen name="MachineBooking" component={MachineBooking} />
          {/* <Stack.Screen name="Dashboard" component={Dashboard} />
          
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="Verify" component={Verification} />
                             <Stack.Screen name="SahayakBooking" component={SahayakBooking} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Home" component={BottomTab} />
         
          <Stack.Screen name="Thekeparkaam" component={ThekeParKaam_Form} /> */}
        </Stack.Navigator>
      </PersistGate>
    </Provider>
  </NavigationContainer>
  </RootSiblingParent>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});