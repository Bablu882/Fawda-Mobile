import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import RenderHtml from "react-native-render-html";
import { WebView } from "react-native-webview";

export function Privacy_policy({ route, navigation }) {
  const [webviewHeight, setWebviewHeight] = useState(10000);
  const { terms } = route?.params ?? {};
  console.log(terms, "terms");
  const results = terms?.client_info?.privacy_policy;
  function handleMessage(event) {
    const height = parseInt(event.nativeEvent.data);
    setWebviewHeight(height);
  }

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
              marginBottom: "auto",
            }}
          />

          <Text
            style={{ textAlign: "center", fontSize: 30, fontWeight: "600" }}
          >
            प्राइवेसी नीति
          </Text>
        </View>
        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: 20,
            backgroundColor: "#fff",
            marginTop: "auto",
          }}
        >
          {/* <Text style={{fontSize:18, textAlign:"justify"}}>{terms?.client_info?.privacy_policy}</Text> */}
          {/* <Text style={{fontSize:18, textAlign:"justify"}}>{results}</Text> */}
          <ScrollView horizontal={false} showsVerticalScrollIndicator={false}>
            <WebView
              source={{ html: results }}
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
