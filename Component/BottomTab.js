import React from "react";
import {View , Text ,StyleSheet , Image , TouchableOpacity} from 'react-native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Homepage from "../src/HomePage";


const Tab = createBottomTabNavigator();

export default function BottomTab () {

    return(
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
        name="Homepage"
        component={Homepage}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <View style={{ alignItems: "center" }}>
              {/* <Image
                source={
                  focused
                    ? require("../assets/imgs/home-active.png")
                    : require("../assets/imgs/home.png")
                }
                style={{
                  width: 20,
                  height: 20,
                  marginBottom: 6,
                  resizeMode: "contain",
                  tintColor: darkMode
                    ? focused
                      ? "#fff"
                      : "#888888"
                    : focused
                    ? "#000"
                    : "#888888",
                }}
              /> */}
              <Text
                style={{
                  fontSize: 12,
                  color:"#000",
                }}
              >
                Home
              </Text>
            </View>
          ),
        }}
      />



    </Tab.Navigator>
    )
}