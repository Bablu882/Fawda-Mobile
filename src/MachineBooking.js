import React, { useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Image
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
// import SelectDropdown from "react-native-select-dropdown";
// import DropDownPicker from "react-native-dropdown-picker";
import { Picker } from "@react-native-picker/picker";

export default function MachineBooking({navigation}) {
  
    const [bhumiValue, setBhumiValue] = useState();
    const [buayiValue , setBuayiValue] = useState();
    const [katayiValue , setKatayiValue] = useState();
    const [anyeValue , setAnyeValue] = useState();

    const pickerRef = useRef();

function open() {
  pickerRef.current.focus();
}

function close() {
  pickerRef.current.blur();
}

  const onSubmit = (data) => {
    console.log(data, "data");
  };
  return (
    <>
      <SafeAreaView style={{ backgroundColor: "#fff", flex: 1 }}>
        <View style={{ padding: 20, marginTop: 25 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrowleft" size={25} />
          </TouchableOpacity>
        </View>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <View style={{ justifyContent: "center" }}>
            <Text
              style={{ textAlign: "center", fontSize: 30, fontWeight: "600" }}
            >
              सहायक बुकिंग
            </Text>
          </View>

          <View style={styles.dropdownGender}>
            <Picker
              ref={pickerRef}
              selectedValue={bhumiValue}
              onValueChange={(itemValue, itemIndex) =>
                setBhumiValue(itemValue)
              }
            >
              <Picker.Item enabled={false} label="-भूमि तैयार करना-" value="" />
              <Picker.Item label="रोटावेटर" value="रोटावेटर" />
              <Picker.Item label="टिलर" value="टिलर" />
              <Picker.Item label="कंप्यूटराइज्ड जन्द्र" value="कंप्यूटराइज्ड जन्द्र" />
              <Picker.Item label="हैरो" value="हैरो" />
            </Picker>
          </View>

          <View style={styles.dropdownGender}>
            <Picker
              ref={pickerRef}
              selectedValue={buayiValue}
              onValueChange={(itemValue, itemIndex) =>
                setBuayiValue(itemValue)
              }
            >
              <Picker.Item enabled={false} label="-बुआई-" value="" />
              <Picker.Item label="लेज़र" value="लेज़र" />
              <Picker.Item label="ज़ेरोड्रिल" value="ज़ेरोड्रिल" />
              <Picker.Item label="सुपर सीडर" value="सुपर सीडर" />
            </Picker>
          </View>

          <View style={styles.dropdownGender}>
            <Picker
              ref={pickerRef}
              selectedValue={katayiValue}
              onValueChange={(itemValue, itemIndex) =>
                setKatayiValue(itemValue)
              }
            >
              <Picker.Item enabled={false} label="-कटाई-" value="" />
              <Picker.Item label="रीपर" value="रीपर" />
              <Picker.Item label="कंबाइन मशीन " value="कंबाइन मशीन " />
              <Picker.Item label="हार्वेस्टर" value="हार्वेस्टर" />
            </Picker>
          </View>

          <View style={styles.dropdownGender}>
            <Picker
              ref={pickerRef}
              selectedValue={anyeValue}
              onValueChange={(itemValue, itemIndex) =>
                setAnyeValue(itemValue)
              }
            >
              <Picker.Item enabled={false} label= "-अन्य-" value="अन्य"/>
              <Picker.Item label="ट्रैक्टर-ट्रॉली" value="ट्रैक्टर-ट्रॉली" />
              <Picker.Item label="बग्गी आदि" value="बग्गी आदि" />
            </Picker>
          </View>

          <View style={[styles.inputView, {display:'flex' , flexDirection:"row", justifyContent:"space-between"}]}>
                    {/* <Text style={{position:'absolute', top:-10, left:30, width:"10%", textAlign:"center", backgroundColor:'#fff'}}>नाम:</Text> */}
                    <TextInput
                        style={[styles.TextInput]}
                        placeholder="तारीख़ चुनें  dd/mm/yyyy"
                        placeholderTextColor={"#000"}
                    // onChangeText={(email) => setEmail(email)}
                    // defaultValue={email}
                    // value={email}
                    />
                    <Image source={require('../assets/image/calendar.png')} style={{width:20, height:20 , marginTop:14 , right:10}} />
                    </View>

                    <View style={[styles.inputView, {display:'flex' , flexDirection:"row", justifyContent:"space-between"}]}>
                    {/* <Text style={{position:'absolute', top:-10, left:30, width:"10%", textAlign:"center", backgroundColor:'#fff'}}>फ़ोन:</Text> */}
                    <TextInput
                        style={styles.TextInput}
                        placeholder="समय चुनें  1-12 AM / PM"
                        placeholderTextColor={"#000"}
                    // onChangeText={(email) => setEmail(email)}
                    // defaultValue={email}
                    // value={email}
                    />
                   <Image source={require('../assets/image/clock.png')} style={{width:20, height:20 , marginTop:14 , right:10}} />
                    </View>

                    <View style={styles.dropdownGender}>
            <Picker
              ref={pickerRef}
              selectedValue={anyeValue}
              onValueChange={(itemValue, itemIndex) =>
                setAnyeValue(itemValue)
              }
            > 
              <Picker.Item enabled={false} label= "-भूमि क्षेत्र -" value=""/>
              <Picker.Item label="बीघा" value="बीघा" />
              <Picker.Item label="किल्ला" value="किल्ला" />
            </Picker>
          </View>

          <View style={[styles.inputView, {display:'flex' , flexDirection:"row", justifyContent:"space-between"}]}>
                    {/* <Text style={{position:'absolute', top:-10, left:30, width:"10%", textAlign:"center", backgroundColor:'#fff'}}>फ़ोन:</Text> */}
                    <TextInput
                        style={styles.TextInput}
                        placeholder="वेतन"
                        placeholderTextColor={"#000"}
                    // onChangeText={(email) => setEmail(email)}
                    // defaultValue={email}
                    // value={email}
                    />
                    <Text style={{marginTop:14 , right:10, color:"#0070C0"}}>₹ 0.00</Text>
                    </View>

                    <TouchableOpacity
         onPress={() => navigation.navigate("Profile")}
        style={styles.loginBtn}>
        <Text style={[styles.loginText, {color:"#fff"}]}>बुकिंग करें</Text>
      </TouchableOpacity>

        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    borderStyle: "solid",
    borderColor: "#B7B7B7",
    borderRadius: 7,
    borderWidth: 1,
    fontSize: 15,
    height: 50,
    marginHorizontal: 10,
    paddingStart: 10,
    marginBottom: 15,
  },
  label: {
    marginBottom: 7,
    marginStart: 10,
  },
  placeholderStyles: {
    color: "#000",
  },
  dropdownGender: {
    borderColor: "#0070C0",
    borderRadius: 7,
    // borderBottomRightRadius: 7,
    width: "80%",
    height: 48,
    marginTop: 15,
    borderWidth: 1
  },
 
  dropdown: {
    borderColor: "#B7B7B7",
    height: 50,
  },
 
  inputView: {
    borderColor: "#0070C0",
    borderRadius: 7,
    // borderBottomRightRadius: 7,
    width: "80%",
    height: 48,
    marginTop: 20,
    borderWidth: 1
},

TextInput: {
    // height: 50,
    padding: 10,
    lineHeight:50,
    fontFamily: "Poppin-Light"
},

loginText: {
    color: "#000",
    fontSize:16,
  //   flexDirection:"column",
  },

  loginBtn:
  {
    width: "85%",
    borderRadius: 7,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    backgroundColor: "#0099FF",
  },




});
