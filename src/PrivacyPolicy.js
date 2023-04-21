import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import RenderHtml from "react-native-render-html";
import { WebView } from "react-native-webview";

export function Privacy_policy({ route, navigation }) {
  const { terms } = route?.params ?? {};
  console.log(terms, "terms");
  const results = terms?.client_info?.privacy_policy;
  
  return (
    <>
      <View style={{ backgroundColor: "#fff", flex: 1 }}>
        <View style={{ padding: 20, marginTop: 25 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrowleft" size={25} />
          </TouchableOpacity>
        </View>

        <ScrollView horizontal={false} showsVerticalScrollIndicator={false}>
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
            <Text
              style={{
                textAlign: "center",
                fontSize: 30,
                fontWeight: "600",
                marginTop: 10,
              }}
            >
              प्राइवेसी नीति
            </Text>
          </View>
          <View style={{ paddingHorizontal: 20, marginTop: 20, flex: 1 }}>
            <WebView
              source={{ html: results }}
              style={{
                flex: 1,
                color: "#000",
                height:500,
                paddingVertical: 10,
              }}
              textZoom={260}
              pullToRefreshEnabled={true}
            />
          </View>
        </ScrollView>
      </View>
    </>
  );
}
