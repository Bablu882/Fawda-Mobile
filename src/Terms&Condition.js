import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import { WebView } from "react-native-webview";

export function Terms_Condition({ route, navigation }) {
  const { terms } = route?.params ?? {};
  const termsConditionHtml = terms?.client_info?.terms_condition;

  return (
    <View style={{ backgroundColor: "#fff", flex: 1 }}>
      <View style={{ padding: 20, marginTop: 25 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrowleft" size={25} />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal={false}
        showsVerticalScrollIndicator={false}
        style={{ paddingHorizontal: 20, marginTop: 20 }}
      >
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Image
            source={require("../assets/image/Fawda-logo.png")}
            style={{
              width: 120,
              height: 120,
              alignItems: "center",
              justifyContent: "center",
            }}
          />
          <Text style={{ textAlign: "center", fontSize: 30, fontWeight: "600" }}>
            नियम और शर्तें
          </Text>
        </View>

        <WebView
          source={{ html: termsConditionHtml }}
          style={{ flex: 1, color: "#000", height: 500 }}
          textZoom={260}
          domStorageEnabled={true}
          onError={() => console.log("Error loading terms and conditions")}
        />
      </ScrollView>
    </View>
  );
}
