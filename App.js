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
import Verification from "./src/Verification";
import Register from "./src/Register";
import Homepage from "./src/HomePage";
// import SahayakBooking from "./src/SahayakBooking";
import BottomTab from "./Component/BottomTab";
import ThekeParKaam_Form from "./src/ThekeParKaam_Form";
import SahayakForm from "./src/SahayakForm";
import MachineBooking from "./src/MachineBooking";
import MyBooking from "./src/MyBooking";
import Theke_MachineForm from "./src/Theke_MachineForm";
import MyBook_SahayakForm from "./src/MyBook_SahayakForm";
import Theke_k_Kaam from "./src/Theke_k_Kaam";
import MachineWork from "./src/MachineWork";
import Payment from "./src/Payment";
import Theke_MachineForm2 from "./src/Theke_MachineForm2";
import MachineWork2 from "./src/MachineWork2";
import ContactUs from "./src/ContactUs";
import UserRegistration from "./src/UserRegistration";
import MyBookingStack from "./navigations/MyBookingStack";
import { Terms_Condition } from "./src/Terms&Condition";
import { About_us } from "./src/AboutUs";
import { Privacy_policy } from "./src/PrivacyPolicy";
import Thankyou from "./src/Thankyou";
import { navigationRef } from './service/NavigationService';
import HomeStack from "./navigations/HomeStack";



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
    <NavigationContainer ref={navigationRef}>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        
        >
          <Stack.Screen name="SplashScreen" component={SplashScreen} />
          <Stack.Screen name="Login" component={Login}/>
          <Stack.Screen name="Verification" component={Verification} /> 
          <Stack.Screen name="Register" component={Register} /> 
          <Stack.Screen name="UserRegistration" component={UserRegistration} />
          <Stack.Screen name="HomePage" component={BottomTab} />
          <Stack.Screen name="BottomTab" component={BottomTab} />
          <Stack.Screen name="HomeStack" component={HomeStack} />
          <Stack.Screen name="MyBookingStack" component={MyBookingStack} />

          <Stack.Screen name="Theke_MachineForm2" component={Theke_MachineForm2} />
        
          <Stack.Screen name="MachineBooking" component={MachineBooking} />
          <Stack.Screen name="Theke_MachineForm" component={Theke_MachineForm} />
          <Stack.Screen name="Theke_k_Kaam" component={Theke_k_Kaam} />
          {/* <Stack.Screen name="MachineWork2" component={MachineWork2} /> */}
          <Stack.Screen name="ContactUs" component={ContactUs} />
          <Stack.Screen name="terms" component={Terms_Condition} />
          <Stack.Screen name="about_us" component={About_us} />
          <Stack.Screen name="privacy" component={Privacy_policy} />
          <Stack.Screen name="Thankyou" component={Thankyou} />
       

         
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