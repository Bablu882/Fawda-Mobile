import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Platform,
  Button,
  AppState,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootSiblingParent } from "react-native-root-siblings";
import store from "./store";
import { Provider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import Dashboard from "./src/Dashboard";
import Login from "./src/Login";
import { PersistGate } from "redux-persist/integration/react";
import persistStore from "redux-persist/es/persistStore";
import SplashScreen from "./src/SplashScreen";
import { useFonts } from "expo-font";
import Verification from "./src/Verification";
import Register from "./src/Register";
// import SahayakBooking from "./src/SahayakBooking";
import BottomTab from "./Component/BottomTab";
import ThekeParKaam_Form from "./src/ThekeParKaam_Form";
import SahayakForm from "./src/SahayakForm";
import MachineBooking from "./src/MachineBooking";
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
import { navigationRef } from "./service/NavigationService";
import HomeStack from "./navigations/HomeStack";
import ThankyouPayment from "./src/ThankyouPayment";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import * as Device from "expo-device";
import Homepage from "./src/HomePage";
import * as firebase from "@react-native-firebase/app";

let persistor = persistStore(store);
const Stack = createNativeStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    //alert('here registerForPushNotificationsAsync in android')
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      console.log("Failed to get push token for push notification!");
      return;
    }
    console.log(finalStatus);
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("here is token =>", token);
  } else {
    console.log("Must use physical device for Push Notifications");
  }

  return token;
}

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  // const firebaseConfig = {
  //   apiKey: "AIzaSyDCvLcOzuq_MxpYWqKOtAfGrGx4csEYuMA",
  //   authDomain: "fawda-webpage.firebaseapp.com",
  //   databaseURL: "https://fawda-webpage.firebaseio.com",
  //   projectId: "fawda-webpage",
  //   storageBucket: "fawda-webpage.appspot.com",
  //   messagingSenderId: "954820127502",
  //   appId: "1:954820127502:android:6fb96e64d865651bcc455f",
  //   measurementId: "G-BJBESTJNZ5",
  // };

  useEffect(() => {
    //registerForPushNotificationsAsync().then(token => console.log(token));
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(
        async (response) => {
          console.log(response.notification.request.content);
          const { data } = response.notification.request.content;
          console.log("notification Data ", data.key);
          console.log("state", AppState.currentState);
          if (data.key !== undefined) {
            await AsyncStorage.setItem("key", data.key);
            if (AppState.currentState === "background") {
              await AsyncStorage.removeItem("key");
            }
          }
        }
      );

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
  const [fontsLoaded] = useFonts({
    // "Poppin-Light": require("./assets/font/Devanagari.ttf"),

    "Devanagari-regular": require("./assets/font/Halant-Regular.ttf"),
    "Devanagari-bold": require("./assets/font/Halant-SemiBold.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
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
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Verification" component={Verification} />
              <Stack.Screen name="Register" component={Register} />
              <Stack.Screen
                name="UserRegistration"
                component={UserRegistration}
              />
              <Stack.Screen name="HomePage" component={Homepage} />
              <Stack.Screen name="BottomTab" component={BottomTab} />
              <Stack.Screen name="HomeStack" component={HomeStack} />
              <Stack.Screen name="MyBookingStack" component={MyBookingStack} />

              <Stack.Screen
                name="Theke_MachineForm2"
                component={Theke_MachineForm2}
              />

              <Stack.Screen name="MachineBooking" component={MachineBooking} />
              <Stack.Screen
                name="Theke_MachineForm"
                component={Theke_MachineForm}
              />
              <Stack.Screen name="Theke_k_Kaam" component={Theke_k_Kaam} />
              {/* <Stack.Screen name="MachineWork2" component={MachineWork2} /> */}
              <Stack.Screen name="ContactUs" component={ContactUs} />
              <Stack.Screen name="terms" component={Terms_Condition} />
              <Stack.Screen name="about_us" component={About_us} />
              <Stack.Screen name="privacy" component={Privacy_policy} />
              <Stack.Screen name="Thankyou" component={Thankyou} />
              <Stack.Screen
                name="ThankyouPayment"
                component={ThankyouPayment}
              />
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
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
