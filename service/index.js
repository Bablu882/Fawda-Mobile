
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Toast from 'react-native-simple-toast';
import { CommonActions, navigation } from '@react-navigation/native';
import { navigate } from './NavigationService';
// import { DevSettings } from 'react-native';


class Service {
  baseUrl = 'https://fawda.demoserver.in/';
 
  constructor() {
    let service = axios.create({
      baseURL: this.baseUrl,
    });
    service.interceptors.response.use(this.handleSuccess, this.handleError);
    this.service = service;
  }

  isLoggedIn = async () => {
    const valueString = await AsyncStorage.getItem('@storage_Key');

    if (valueString == null || valueString == undefined || valueString == '') {
      return false;
    } else {
      return valueString;
    }
  };

  toFixed = number => {
    number = parseFloat(number);
    return number.toFixed(2);
  };

  handleSuccess(response) {
    return response;
  }

  handleError = async error => {
    console.log("Error object:", error);
    console.log("Error message:", error.message);
    console.log("Error status:", error.status);
    switch (error.response.status) {
      case 401:
        console.log("hsdfdsfdsfdsfdsfsdf");
        await AsyncStorage.clear();
        console.log('AsyncStorage successfully cleared.');
        navigate('Login');
        break;
      case 404:
        Toast.show(error.toString(), Toast.LONG);
        break;
      case 500:
        Toast.show(error.toString(), Toast.LONG);
        break;
      default:
      // Toast.show(error.toString(), Toast.LONG);
    }
    return Promise.reject(error.response);
  };

  async get(path, params = {}) {
    return this.service.get(path, {...params});
  }

  async patch(path, payload, callback) {
    return this.service
      .request({
        method: 'PATCH',
        url: path,
        responseType: 'json',
        data: payload,
      })
      .then(response => callback(response.data, response.status));
  }

  async post(path, payload, config = {}) {
    return this.service.request({
      method: 'POST',
      url: path,
      responseType: 'json',
      data: payload,
      headers: {
        'channel-type': 'mobile',
        'Content-Type': 'application/json;',
        identified: 'costipro-app',
        version: '1.4.1.01.01',
        'zone-offset': '+05:30',
      },
      ...config,
    });
  }

  async put(path, payload, config = {}) {
    return this.service.request({
      method: 'PUT',
      url: path,
      responseType: 'json',
      data: payload,
      ...config,
    });
  }

  customConsole = obj => {
    if (debug) {
      console.log('console log=>', obj);
    }
  };
}


export default new Service();
