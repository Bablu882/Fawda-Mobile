import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";

export default function Theke_MachineForm({ navigation }) {
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
              ठेके पर काम
            </Text>
          </View>
        </View>

        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <View
            style={[
              styles.inputView,
              {
                height: 90,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              },
            ]}
          >
            {/* <Text style={{position:'absolute', top:-10, left:30, width:"10%", textAlign:"center", backgroundColor:'#fff'}}>फ़ोन:</Text> */}
            <TextInput
              style={styles.TextInput}
              placeholder="काम का विवरण "
              placeholderTextColor={"#000"}
              // onChangeText={(email) => setEmail(email)}
              // defaultValue={email}
              // value={email}
            />
            <Image
              source={require("../assets/image/edit.png")}
              style={{ width: 20, height: 20, marginTop: 10, right: 10 }}
            />
          </View>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              width: "92%",
              justifyContent: "space-evenly",
            }}
          >
            <View style={styles.TaxView}>
              {/* <Text style={{position:'absolute', top:-10, left:30, width:"18%", textAlign:"center", backgroundColor:'#fff'}}>राज्य</Text> */}
              <TextInput
                style={styles.TextInput}
                placeholder="टेक्स्ट "
                placeholderTextColor={"#000"}
                // onChangeText={(email) => setEmail(email)}
                // defaultValue={email}
                // value={email}
              />
            </View>
            <View style={styles.BhumiView}>
              {/* <Text style={{position:'absolute', top:-10, left:30, width:"20%", textAlign:"center", backgroundColor:'#fff'}}>जिला </Text> */}
              <TextInput
                style={styles.TextInput}
                placeholder="भूमि क्षेत्र "
                placeholderTextColor={"#000"}
                // onChangeText={(email) => setEmail(email)}
                // defaultValue={email}
                // value={email}
              />
            </View>
          </View>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              width: "92%",
              justifyContent: "space-evenly",
            }}
          >
            <View
              style={[
                styles.TaxView,
                {
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                },
              ]}
            >
              {/* <Text style={{position:'absolute', top:-10, left:30, width:"18%", textAlign:"center", backgroundColor:'#fff'}}>राज्य</Text> */}
              <TextInput
                style={styles.TextInput}
                placeholder="भूमि क्षेत्र"
                placeholderTextColor={"#000"}
                // onChangeText={(email) => setEmail(email)}
                // defaultValue={email}
                // value={email}
              />
              <Text style={{ marginTop: 13, marginRight: 8, color: "#0099FF" }}>
                8 बीघा
              </Text>
            </View>
            <View
              style={[
                styles.BhumiView,
                {
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                },
              ]}
            >
              {/* <Text style={{position:'absolute', top:-10, left:30, width:"20%", textAlign:"center", backgroundColor:'#fff'}}>जिला </Text> */}
              <TextInput
                style={styles.TextInput}
                placeholder="वेतन"
                placeholderTextColor={"#000"}
                // onChangeText={(email) => setEmail(email)}
                // defaultValue={email}
                // value={email}
              />
              <Text style={{ marginTop: 13, marginRight: 8, color: "#0099FF" }}>
                ₹ 0.00
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.inputView,
              {
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              },
            ]}
          >
            {/* <Text style={{position:'absolute', top:-10, left:30, width:"10%", textAlign:"center", backgroundColor:'#fff'}}>फ़ोन:</Text> */}
            <TextInput
              style={styles.TextInput}
              placeholder="काम की स्थिति"
              placeholderTextColor={"#000"}
              // onChangeText={(email) => setEmail(email)}
              // defaultValue={email}
              // value={email}
            />
            <View
              style={{
                width: "30%",
                height: 30,
                backgroundColor: "#44A347",
                marginRight: 10,
                marginTop:8,
              }}
            >
              <TouchableOpacity>
                <Text
                  style={{
                    textAlign: "center",
                    marginTop: 5,
                    color: "#fff",
                    fontSize: 15,
                    fontWeight: "600",
                  }}
                >
                  पेंडिंग
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.inputView,{position:'relative', height:40}]}>
                    <Text style={{position:'absolute', top:-10, left:30, width:"18%", textAlign:"center", backgroundColor:'#fff'}}>ठेकेदार</Text>
                    <TextInput
                        style={styles.TextInput}
                        placeholder=""
                        placeholderTextColor={"#848484"}
                    // onChangeText={(email) => setEmail(email)}
                    // defaultValue={email}
                    // value={email}
                    />
                    </View>

                    <View style={[styles.inputView,{position:'relative', height:40}]}>
                    <Text style={{position:'absolute', top:-10, left:30, width:"10%", textAlign:"center", backgroundColor:'#fff'}}>गाँव</Text>
                    <TextInput
                        style={styles.TextInput}
                        placeholder=""
                        placeholderTextColor={"#848484"}
                    // onChangeText={(email) => setEmail(email)}
                    // defaultValue={email}
                    // value={email}
                    />
                    </View>

                    <View style={[styles.inputView,{position:'relative', height:40}]}>
                    <Text style={{position:'absolute', top:-10, left:30, width:"25%", textAlign:"center", backgroundColor:'#fff'}}>मोबाइल नंबर</Text>
                    <TextInput
                        style={styles.TextInput}
                        placeholder=""
                        placeholderTextColor={"#848484"}
                    // onChangeText={(email) => setEmail(email)}
                    // defaultValue={email}
                    // value={email}
                    />
                    </View>




          

          <TouchableOpacity
            style={styles.BhuktanBtn}
            onPress={() => navigation.navigate("Payment")}
          >
            <Text style={[styles.loginText, { color: "#fff" }]}>
              काम शुरू करें
            </Text>
          </TouchableOpacity>

          {/* <TouchableOpacity
         onPress={() => navigation.navigate("Profile")}
        style={styles.loginBtn}>
        <Text style={[styles.loginText, {color:"#fff"}]}>रद्द करें </Text>
      </TouchableOpacity> */}
        </View>

        {/* <BottomTab/> */}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  OptionButton: {
    // flex:1,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
    //   margin:20,
    //   padding:20
  },

  sahayak: {
    width: "40%",
    // flexDirection:"column",
    // borderRadius: 7,
    color: "#505050",
    height: 50,
    alignItems: "center",
    //   justifyContent:"",
    justifyContent: "center",
    marginTop: 30,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#505050",
    // backgroundColor: "#44A347",
  },

  machine: {
    width: "40%",
    flexDirection: "row",
    // borderRadius: 7,
    color: "#505050",
    height: 50,
    alignItems: "center",
    //   justifyContent:"",
    justifyContent: "center",
    marginTop: 30,
    // borderWidth:1,
    borderRadius: 10,
    // borderColor:"#505050"
    backgroundColor: "#44A347",
  },

  loginText: {
    color: "#000",
    fontSize: 16,
    //   flexDirection:"column",
  },

  loginBtn: {
    width: "85%",
    borderRadius: 7,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    backgroundColor: "#0099FF",
  },

  BhuktanBtn: {
    width: "85%",
    borderRadius: 7,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    backgroundColor: "#0099FF",
  },

  VerifyText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 18,
  },

  inputView: {
    borderColor: "#0070C0",
    borderRadius: 7,
    // borderBottomRightRadius: 7,
    width: "80%",
    height: 48,
    marginTop: 20,
    borderWidth: 1,
  },

  TextInput: {
    height: 50,
    padding: 10,
    lineHeight: 50,
    fontFamily: "Poppin-Light",
  },

  CheckTextInput: {
    textAlign: "center",
    marginTop: 10,
  },

  TaxView: {
    borderColor: "#0070C0",
    borderRadius: 7,
    // borderBottomRightRadius: 7,
    width: "40%",
    height: 48,
    marginTop: 20,
    borderWidth: 1,
  },

  BhumiView: {
    borderColor: "#0070C0",
    borderRadius: 7,
    // borderBottomRightRadius: 0,
    // borderTopRightRadius:0,
    width: "40%",
    height: 48,
    marginTop: 20,
    borderWidth: 1,
  },

  DoubleView: {
    borderColor: "#0070C0",
    borderRadius: 7,
    // borderBottomRightRadius: 7,
    width: "42%",
    height: 48,
    marginTop: 10,
    borderWidth: 1,
  },

  FemalecheckView: {
    borderColor: "#0070C0",
    borderRadius: 7,
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 0,
    width: "40%",
    height: 48,
    marginTop: 30,
    borderWidth: 1,
  },
});
