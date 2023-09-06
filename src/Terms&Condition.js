import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import { WebView } from "react-native-webview";

export function Terms_Condition({ route, navigation }) {
  const { terms } = route?.params ?? {};
  // const termsConditionHtml = terms?.client_info?.terms_condition;
  const customFont = require("../assets/font/Halant-Regular.ttf");
  const termsConditionHtml = `
  <html>
    <head>
      <style>
        @font-face {
          font-family: 'CustomFont';
          src: url('${customFont}');
        }

        body {
          font-family: 'CustomFont', sans-serif;
        }
      </style>
    </head>
    <body>
      ${terms?.client_info?.terms_condition}
    </body>
  </html>
`;

  return (
    <>
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={{ paddingTop: 50, paddingLeft: 20 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrowleft" size={25} />
          </TouchableOpacity>
        </View>
        {/* <ScrollView horizontal={false} showsVerticalScrollIndicator={false}> */}
        <View
          style={{
            justifyContent: "center",
            flex: 1,
            backgroundColor: "#fff",
          }}
        >
          <Image
            source={require("../assets/image/Fawda-logo.png")}
            style={{
              width: 120,
              height: 120,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          />

          <Text
            style={{
              textAlign: "center",
              fontSize: 30,
              fontWeight: "600",
            }}
          >
            नियम और शर्तें
          </Text>
        </View>
        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: 20,
            backgroundColor: "#fff",
            marginTop: 15,
          }}
        >
          <ScrollView horizontal={false} showsVerticalScrollIndicator={false}>
            <WebView
              source={{ html: termsConditionHtml }}
              style={{
                flex: 1,
                color: "#000",
                height: 500,
                paddingVertical: 10,
              }}
              textZoom={260}
              domStorageEnabled={true}
            />
          </ScrollView>
        </View>
        {/* </ScrollView> */}
      </View>
    </>
  );
}
