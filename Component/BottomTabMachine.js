import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Homepage from "../src/HomePage";
//import SahayakBooking from "../src/SahayakBooking";
// import RegisterForm from "../src/GrahakResgiterForm";
import Profile from "../src/Profile";
import HomePageStack from "../navigations/HomePageStack";
// import SahayakBooking from "../src/SahayakBooking";
import SahayakBookStack from "../navigations/SahayakBookStack";
import Refer from "../src/Refer";
// import MyBookingStack from "../navigations/MyBookingStack";
import MyNaukariStack from "../navigations/MyNaukariStack";
import HomeStackTwo from "../navigations/HomeStackTwo";
import HomeStackThird from "../navigations/HomeStackThird";
import MachineStack from "../navigations/MachineStack";

const Tab = createBottomTabNavigator();

export default function BottomTabMachine() {

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: Platform.OS == "ios" ? 88 : 76,
          //   backgroundColor: darkMode ? "#000" : "#fff",
          borderTopWidth: 0,
          paddingTop: 15,
          paddingBottom: 15,
        },
      })}
    >
      <Tab.Screen
        name="HomeStackThird"
        component={HomeStackThird}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <View style={{ alignItems: "center" }}>
              <Image
                source={require('../assets/image/home.png')
                  // focused
                  //   ? require("../assets/imgs/home-active.png")
                  //    : require("../assets/imgs/home.png")
                }
                style={{
                  width: 20,
                  height: 20,
                  marginBottom: 6,
                  resizeMode: "contain",
                  // tintColor: darkMode
                  //   ? focused
                  //     ? "#fff"
                  //     : "#888888"
                  //   : focused
                  //   ? "#000"
                  //   : "#888888",
                }}
              />
              <Text
                style={{
                  fontSize: 12,
                  color: focused ? 'red':'blue',
                }}
              >
                होम
              </Text>
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="MachineStack"
        component={MachineStack}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <View style={{ alignItems: "center" }}>
              <Image
                source={require('../assets/image/jobs.png')
                  // focused
                  //   ? require("../assets/imgs/home-active.png")
                  //    : require("../assets/imgs/home.png")
                }
                style={{
                  width: 20,
                  height: 20,
                  marginBottom: 6,
                  resizeMode: "contain",
                  // tintColor: darkMode
                  //   ? focused
                  //     ? "#fff"
                  //     : "#888888"
                  //   : focused
                  //   ? "#000"
                  //   : "#888888",
                }}
              />
              <Text
                style={{
                  fontSize: 12,
                  color: focused ? 'red':'blue',
                }}
              >
                नौकरियां 
              </Text>
            </View>
          ),
        }}
      />

<Tab.Screen
        name="Refer"
        component={Refer}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <View style={{ alignItems: "center" }}>
              <Image
                source={require('../assets/image/refer.png')
                  // focused
                  //   ? require("../assets/imgs/home-active.png")
                  //    : require("../assets/imgs/home.png")
                }
                style={{
                  width: 20,
                  height: 20,
                  marginBottom: 6,
                  resizeMode: "contain",
                  // tintColor: darkMode
                  //   ? focused
                  //     ? "#fff"
                  //     : "#888888"
                  //   : focused
                  //   ? "#000"
                  //   : "#888888",
                }}
              />
              <Text
                style={{
                  fontSize: 12,
                  color: "#000",
                }}
              >
                रेफर 
              </Text>
            </View>
          ),
        }}
      />

<Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <View style={{ alignItems: "center" }}>
             <Image
                source={require('../assets/image/call.png')
                  // focused
                  //   ? require("../assets/imgs/home-active.png")
                  //    : require("../assets/imgs/home.png")
                }
                style={{
                  width: 20,
                  height: 20,
                  marginBottom: 6,
                  resizeMode: "contain",
                  // tintColor: darkMode
                  //   ? focused
                  //     ? "#fff"
                  //     : "#888888"
                  //   : focused
                  //   ? "#000"
                  //   : "#888888",
                }}
              />
              <Text
                style={{
                  fontSize: 12,
                  color: "#000",
                }}
              >
                संपर्क करें 
              </Text>
            </View>
          ),
        }}
      />









    </Tab.Navigator>
  )
}