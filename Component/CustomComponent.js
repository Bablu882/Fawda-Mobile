import { View, Text, StyleSheet, TextInput, } from 'react-native'
import React from 'react'

export default function CustomComponent({ label, value }) {
  return (
    <View
    style={[
      styles.inputView,
      styles.inputbox,
      {
        flexDirection: "row",
        justifyContent: "space-around",
        paddingHorizontal: 10,
      },
    ]}
  >
    <TextInput
      style={[styles.TextInput, { width: "100%" }]}
      placeholder={label}
      editable={false}
      placeholderTextColor={"#000"}
    />
    <Text style={{ marginTop: 13, right: 10, color: "#0070C0" }}> ₹ {value}</Text>
  </View>
  )
}

const styles = StyleSheet.create({
    TextInput: {
        padding: 10,
      },
      inputView: {
        borderColor: "#0070C0",
        borderRadius: 7,
        // borderBottomRightRadius: 7,
        width: "100%",
        height: 48,
        marginTop: 20,
        borderWidth: 1,
      },
    
})