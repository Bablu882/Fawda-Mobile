import React, {useState} from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, TextInput } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import { useDispatch, useSelector } from "react-redux";
import { selectIsLoggedIn, setToken } from "../slices/authSlice";
import Service from "../service/index";
import Toast from "react-native-simple-toast";
import { RadioButton } from "react-native-paper";

export default function MachineMachine_Registration ({navigation}) {
    const [userType, setUserType] = useState("Machine Malik");
  const [checked, setChecked] = React.useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [village, setVillage] = useState("");
  const [mohalla, setMohalla] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");

  const dispatch = useDispatch();

  const RegisterServices = () => {
    // setloading(true);
    let params = {
      name: name,
      gender: gender,
      phone: phone,
      village: village,
      mohalla: mohalla,
      state: state,
      district: district,
      status: userType,
    };
    console.log("registerparams", params);
    Service.post("/api/register/", params, {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        // setloading(false);
        let data = response?.data;
        console.log("register", data);
        if (data.success == true) {
          let token = data?.data?.token;
          dispatch(setToken(token));
          Toast.show("Registration successfully", Toast.SHORT);

          navigation.replace("HomeThird");
        } else {
          Toast.show(data.error , Toast.SHORT);
        }
      })
      .catch((error) => {
        console.log(error);
        // setloading(false);
      });
  };

//   const [input, setInput] = useState({
//     name: "",
//     gender: "",
//     phone: "",
//     village: " ",
//     mohalla: "",
//     state: "",
//     district: "",
//   });
  const [error, setError] = useState({});

  const validate = () => {
    let isValid = true;

    if (!name) {
      handleError("Please enter firstname", "firstname");
      isValid = false;
    }
    if (!gender) {
      handleError("Please enter lastname", "lastname");
      isValid = false;
    }
    if (!phone) {
      handleError("Please enter phone number", "phone");
      isValid = false;
    }
    if (!village) {
      handleError("please enter your email", "email");
      isValid = false;
    }

    if (!mohalla) {
      handleError("Please input password", "password");
      isValid = false;
    }

    if (!state) {
        handleError("Please input password", "password");
        isValid = false;
      }

      if (!district) {
        handleError("Please input password", "password");
        isValid = false;
      }
  

    // if (isValid) {
    //   register();
    // }
  };

  const handleOnchange = (text, input) => {
    setInput((prevState) => ({ ...prevState, [input]: text }));
  };
  const handleError = (error, input) => {
    setError((prevState) => ({ ...prevState, [input]: error }));
  };
  
  const handleGenderSelection = (value) => {
    setGender(value);
  }

    return(
        <>
        <SafeAreaView style={{backgroundColor:'#fff', flex:1}}>
                <View style={{ padding: 20, marginTop: 25 }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name="arrowleft" size={25} />
                    </TouchableOpacity>
                </View>

                <View style={{ justifyContent: "center" }}>
                    <Text style={{ textAlign: "center", fontSize: 30, fontWeight: "600" }}>मशीन मालिक रजिस्ट्रेशन</Text>
                </View>

                <View style={{ justifyContent: "center", alignItems: "center", marginTop: 30,  }} >
                    <View style={[styles.inputView,{position:'relative'}]}>
                    <Text style={{position:'absolute', top:-10, left:30, width:"10%", textAlign:"center", backgroundColor:'#fff'}}>नाम:</Text>
                    <TextInput
                        style={styles.TextInput}
                        placeholder=""
                        placeholderTextColor={"#848484"}
                    onChangeText={(text) => setName(text, "name")}
                    // defaultValue={email}
                    value={name}
                    />
                    </View>
                     

                    <View style={[styles.inputView,{position:'relative'}]}>
                    <Text style={{position:'absolute', top:-10, left:30, width:"10%", textAlign:"center", backgroundColor:'#fff'}}>फ़ोन:</Text>
                    <TextInput
                        style={styles.TextInput}
                        placeholder=""
                        placeholderTextColor={"#848484"}
                        onChangeText={(phone) => setPhone(phone, "name")}
                    // defaultValue={email}
                    value={phone}
                    />
                    </View>
                    
                    <View style={{display:"flex", flexDirection:"row",width:"90%" , justifyContent:"space-evenly"}}>
                    <View style={[styles.DoubleView,{position:'relative'}]}>
                    <Text style={{position:'absolute', top:-10, left:30, width:"30%", textAlign:"center", backgroundColor:'#fff'}}>मोहल्ला</Text>
                    <TextInput
                        style={styles.TextInput}
                        placeholder=""
                        placeholderTextColor={"#848484"}
                        onChangeText={(text) => setMohalla(text, "name")}
                    // defaultValue={email}
                    value={mohalla}
                    />
                    </View>
                    <View style={[styles.DoubleView,{position:'relative'}]}>
                    <Text style={{position:'absolute', top:-10, left:30, width:"18%", textAlign:"center", backgroundColor:'#fff'}}>गांव</Text>
                    <TextInput
                        style={styles.TextInput}
                        placeholder=""
                        placeholderTextColor={"#848484"}
                        onChangeText={(text) => setVillage(text, "name")}
                    // defaultValue={email}
                    value={village}
                    />
                    </View>
                    </View>

                    <View style={{display:"flex", flexDirection:"row",width:"90%" , justifyContent:"space-evenly"}}>
                    <View style={[styles.DoubleView,{position:'relative'}]}>
                    <Text style={{position:'absolute', top:-10, left:30, width:"18%", textAlign:"center", backgroundColor:'#fff'}}>राज्य</Text>
                    <TextInput
                        style={styles.TextInput}
                        placeholder=""
                        placeholderTextColor={"#848484"}
                        onChangeText={(text) => setState(text, "name")}
                    // defaultValue={email}
                    value={state}
                    />
                    </View>
                    <View style={[styles.DoubleView,{position:'relative'}]}>
                    <Text style={{position:'absolute', top:-10, left:30, width:"20%", textAlign:"center", backgroundColor:'#fff'}}>जिला </Text>
                    <TextInput
                        style={styles.TextInput}
                        placeholder=""
                        placeholderTextColor={"#848484"}
                        onChangeText={(text) => setDistrict(text, "name")}
                    // defaultValue={email}
                    value={district}
                    />
                    </View>
                    </View>

                    <TouchableOpacity
         onPress={() => {RegisterServices(); validate()}}
        style={styles.loginBtn}>
        <Text style={styles.loginText}>आगे बढ़ें</Text>
      </TouchableOpacity>

                </View>
            </SafeAreaView>
        </>
    )
}

const styles = StyleSheet.create({
    inputView: {
        borderColor: "#0099FF",
        borderRadius: 7,
        // borderBottomRightRadius: 7,
        width: "80%",
        height: 48,
        marginTop: 30,
        borderWidth: 1
    },

    TextInput: {
        height: 50,
        padding: 10,

        // fontFamily: "Poppin-Light"
    },

    CheckTextInput: {
    textAlign:"center",
    marginTop:10
    },

    DoubleView : {
        borderColor: "#0099FF",
        borderRadius: 7,
        // borderBottomRightRadius: 7,
        width: "42%",
        height: 48,
        marginTop: 30,
        borderWidth: 1, 
    },

    MaleCheckView: {
        borderColor: "#0099FF",
        borderRadius: 7,
        borderBottomRightRadius: 0,
        borderTopRightRadius:0,
        width: "40%",
        height: 48,
        marginTop: 30,
        borderWidth: 1, 
    },

    FemalecheckView:{
        borderColor: "#0099FF",
        borderRadius: 7,
        borderBottomLeftRadius: 0,
        borderTopLeftRadius:0,
        width: "40%",
        height: 48,
        marginTop: 30,
        borderWidth: 1, 
    },

    loginBtn:
  {
    width: "80%",
    // borderRadius: 7,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    backgroundColor: "#0099FF",
  },
  loginText: {
    color: "#fff",
    fontSize:18,
  }
})