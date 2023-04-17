import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Platform,
  Button
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
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
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import * as Device from 'expo-device';

let persistor = persistStore(store);
const Stack = createNativeStackNavigator();

// This function can be defined outside the App component
// async function registerForPushNotificationsAsync() {
//   let token;
//   if (Constants.isDevice) {
//     const { status: existingStatus } = await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;
//     if (existingStatus !== 'granted') {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }
//     if (finalStatus !== 'granted') {
//       alert('Failed to get push token for push notification!');
//       return;
//     }
//     token = (await Notifications.getExpoPushTokenAsync()).data;
//     console.log(token);
//   } else {
//     alert('Must use a physical device for push notifications');
//   }

//   if (Platform.OS === 'android') {
//     Notifications.setNotificationChannelAsync('default', {
//       name: 'default',
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: '#FF231F7C',
//     });
//   }

//   return token;
// }

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: 'Here is the notification body',
      data: { data: 'goes here' },
    },
    trigger: { seconds: 2 },
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}

export default function App() {

  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  // Call the function inside a useEffect within the App component
  useEffect(() => {
    //registerForPushNotificationsAsync().then(token => console.log(token));
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
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
              initialRouteName="Login"
            >
              <Stack.Screen name="SplashScreen" component={SplashScreen} />
              <Stack.Screen name="Login" component={Login}/>
              <Stack.Screen name="Verification" component={Verification} /> 
              <Stack.Screen name="Register" component={Register} /> 
              <Stack.Screen name="UserRegistration" component={UserRegistration} />
              <Stack.Screen name="HomePage" component={BottomTab} />
              <Stack.Screen name="MyBooking" component={MyBookingStack} />
              <Stack.Screen name="Payment" component={Payment} />
              <Stack.Screen name="Theke_MachineForm2" component={Theke_MachineForm2} />
              <Stack.Screen name="Thekeparkaam" component={ThekeParKaam_Form} /> 
              <Stack.Screen name="SahayakForm" component={SahayakForm} />
              <Stack.Screen name="MachineBooking" component={MachineBooking} />
              <Stack.Screen name="Theke_MachineForm" component={Theke_MachineForm} />
              <Stack.Screen name="MyBook_SahayakForm" component={MyBook_SahayakForm} />
              <Stack.Screen name="Theke_k_Kaam" component={Theke_k_Kaam} />
              <Stack.Screen name="MachineWork" component={MachineWork} />
              <Stack.Screen name="MachineWork2" component={MachineWork2} />
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

  //   return(
  //     <View
  //     style={{
  //       flex: 1,
  //       alignItems: 'center',
  //       justifyContent: 'space-around',
  //     }}>
  //     <Text>Your expo push token: {expoPushToken}</Text>
  //     <View style={{ alignItems: 'center', justifyContent: 'center' }}>
  //       <Text>Title: {notification && notification.request.content.title} </Text>
  //       <Text>Body: {notification && notification.request.content.body}</Text>
  //       <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
  //     </View>
  //     <Button
  //       title="Press to schedule a notification"
  //       onPress={async () => {
  //         await schedulePushNotification();
  //       }}
  //     />
  //   </View>
  // );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});