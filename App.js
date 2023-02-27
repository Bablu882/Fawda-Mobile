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
import store from "./store";
import { Provider } from "react-redux";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Dashboard from "./src/Dashboard";
import Login from "./src/Login";
import { PersistGate } from "redux-persist/integration/react";
import persistStore from "redux-persist/es/persistStore";
import SplashScreen from "./src/SplashScreen";
import { useFonts } from "expo-font";
import { translate } from '@vitalets/google-translate-api';
import SupportPage from "./src/SupportPage";
import Verification from "./src/Verification";
import Register from "./src/Register";
import RegisterForm from "./src/ResgiterForm";
import Homepage from "./src/HomePage";
import SahayakBooking from "./src/SahayakBooking";
import BottomTab from "./Component/BottomTab";


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
  
    <NavigationContainer>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="SplashScreen" component={SplashScreen} initialRouteName="SplashScreen" />
                    <Stack.Screen name="Home" component={Login} />

          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="SupportPage" component={SupportPage} />
          <Stack.Screen name="Verify" component={Verification} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="RegisterForm" component={RegisterForm} />
          <Stack.Screen name="Homepage" component={BottomTab} />
          <Stack.Screen name="SahayakBooking" component={SahayakBooking} />
        </Stack.Navigator>
      </PersistGate>
    </Provider>
  </NavigationContainer>
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