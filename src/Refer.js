import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";

export default function Refer() {
  return (
    <SafeAreaView style={{ backgroundColor: "#fff", flex: 1 }}>
      <View style={styles.container}>
        <Image
          source={require("../assets/image/Fawda-logo.png")}
          style={{ width: 200, height: 200, alignItems: "center" }}
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
})