
import { StyleSheet, Text, View,Image,TextInput,TouchableOpacity } from 'react-native';
import React, { useState , useEffect} from 'react';
import { useSelector,useDispatch } from 'react-redux';
import {selectIsLoggedIn ,   clearAuth,
  selectToken } from '../slices/authSlice';
  import AsyncStorage from "@react-native-async-storage/async-storage";




export default function Dashboard({navigation}) {
  const dispatch = useDispatch();

  const [loading, setloading] = useState('');
  const token = useSelector(selectToken)
  const isLoggedIn = useSelector(selectIsLoggedIn);
 

  useEffect(() => {
    if (!isLoggedIn) {
      navigation.replace("Home");
    }
  },[!isLoggedIn]);

  const Logout = async () => {
    await AsyncStorage.clear();
    dispatch(clearAuth());
    navigation.replace("Home");
  };


  return (
    <View style={styles.container}>

<Text>djcjdffjdfjhf</Text>
<Text>Token is: {token}</Text>



<TouchableOpacity
          onPress={() => {
            Logout();
          }}
          style={{  backgroundColor: '#df7f17',
          padding: 10,
          borderRadius: 4,
          width: '100%',
          maxWidth: 90,
          alignItems: 'center',
          elevation: 4,
        marginTop:20 }}
        >
          
          <Text style={styles.profileOption}>Log out</Text>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputView: {
    borderColor: "lightgreen",
    borderRadius: 30,
    width: "70%",
    height: 45,
    marginBottom: 20,
    alignItems: "center",
    borderWidth:1
  },
  
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
  },

  forgot_button: {
    height: 30,
    marginBottom: 30,
  },
  loginBtn:
 {
   width:"80%",
   borderRadius:25,
   height:50,
   alignItems:"center",
   justifyContent:"center",
   marginTop:40,
   backgroundColor:"lightgreen",
 }
});
