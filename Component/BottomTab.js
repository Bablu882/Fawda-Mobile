import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Homepage from "../src/HomePage";
import Refer from "../src/Refer";
import MyBookingStack from "../navigations/MyBookingStack";
import { selectIsLoggedIn, selectUserType } from "../slices/authSlice";
import { useSelector } from "react-redux";
import ContactUs from "../src/ContactUs";
import Thankyou from "../src/Thankyou";
import HomeStack from "../navigations/HomeStack";
const Tab = createBottomTabNavigator();

export default function BottomTab() {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const usertype = useSelector(selectUserType);
  console.log("usrrjfjf", usertype);

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
        name="HomeStack"
        component={HomeStack}
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            e.preventDefault();
            if (isLoggedIn == true) {
              navigation.replace("HomePage", usertype);
            } else {
              navigation.navigate("Login", usertype);
            }
          },
        })}
        options={{
          tabBarIcon: ({ focused, color, size, user }) => (
            <View style={{ alignItems: "center" }}>
                            <Image
                source={
                  focused
                    ? require("../assets/image/home.png")
                    : require("../assets/image/homeicon.png")
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
                  color: '#000',
                }}
              >
                होम
              </Text>
            </View>
          ),
        }}
      />
      {usertype === "Grahak" ? (
        <>
          <Tab.Screen
            name="MyBookingStack"
            component={MyBookingStack}
            options={{
              tabBarIcon: ({ focused, color, size }) => (
                <View style={{ alignItems: "center" }}>
                  <Image
                    source={
                      //require("../assets/image/open-book.png")
                      focused
                        ? require("../assets/image/open-book.png")
                         : require("../assets/image/booking.png")
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
                      color: '#000',
                    }}
                  >
                    बुकिंग्स
                  </Text>
                </View>
              ),
            }}
          />
        </>
      ) : (
        <>
          <Tab.Screen
            name="MyBookingStack"
            component={MyBookingStack}
            options={{
              tabBarIcon: ({ focused, color, size }) => (
                <View style={{ alignItems: "center" }}>
                  <Image
                    source={
                      // require("../assets/image/open-book.png")
                      focused
                        ? require("../assets/image/jobs-active.png")
                         : require("../assets/image/myjobs.png")
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
                      color: '#000',
                    }}
                  >
                    नौकरियां
                  </Text>
                </View>
              ),
            }}
          />
        </>
      )}

      {/* <Tab.Screen
        name="MyNaukariStack"
        component={MyNaukariStack}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <View style={{ alignItems: "center" }}>
              <Image
                source={require('../assets/image/open-book.png')
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
      /> */}
      <Tab.Screen
        name="Refer"
        component={Refer}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <View style={{ alignItems: "center" }}>
              <Image
                source={
                  // require("../assets/image/refer.png")
                  focused
                    ? require("../assets/image/refer.png")
                     : require("../assets/image/refer-active.png")
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
  {/* <Tab.Screen
        name="Thankyou"
        component={Thankyou}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <View style={{ alignItems: "center" }}>
              <Image
                source={
                  // require("../assets/image/refer.png")
                  focused
                    ? require("../assets/image/refer.png")
                     : require("../assets/image/refer-active.png")
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
               Thank you
              </Text>
            </View>
          ),
        }}
      /> */}
      <Tab.Screen
        name="ContactUs"
      component={ContactUs}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <View style={{ alignItems: "center" }}>
              <Image
                source={
                 // require("../assets/image/call.png")
                  focused
                    ? require("../assets/image/call.png")
                     : require("../assets/image/contact.png")
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
  );
}
