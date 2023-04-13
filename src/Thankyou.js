import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ImageBackground
} from "react-native";


export default function Thankyou() {
  return (
    <SafeAreaView style={{ backgroundColor: "#D8EEFD", flex: 1 }}>
      <View style={styles.container}>
        <ImageBackground
          source={require("../assets/image/thankyou.png")}
          // style={{ width: 200, height: 200, alignItems: "center" }}
          style={styles.image}
          resizeMode="contain"
        />

        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 28, fontWeight: "600", color: "#000" }}>
            जल्दी ही आ रहा है
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 200,
    height: 200,
    alignItems: "center",
    
  },
});
