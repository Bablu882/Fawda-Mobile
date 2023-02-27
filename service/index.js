
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Toast from 'react-native-simple-toast';



class Service {
  baseUrl = 'https://reqres.in/api';
  // assetUrl = 'https://actively-black.demoserver.in/';
  // assetBannerUrl = 'https://actively-black.demoserver.in';
  // checkoutBaseUrl = 'https://actively-black-demo.myshopify.com/';
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

  customIosFilterValue = filterValue => {
    let finalString = 'Filter';
    switch (filterValue) {
      case 'BEST_SELLING':
        finalString = 'Best Selling';
        break;

      case 'RELEVANCE':
        finalString = 'Featured';
        break;
      case 'CREATED_AT':
        finalString = 'Newest';
        break;
      case 'PRICE1':
        finalString = 'Price,low to high';
        break;
      case 'PRICE':
        finalString = 'Price,high to low';
        break;
      default:
        finalString = 'Filter';
    }
    return finalString;
  };

  handleSuccess(response) {
    return response;
  }

  handleError = error => {
    switch (error.status) {
      case 401:
        Toast.show(error.toString(), Toast.LONG);
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

  get(path, params = {}) {
    return this.service.get(path, {...params});
  }

  patch(path, payload, callback) {
    return this.service
      .request({
        method: 'PATCH',
        url: path,
        responseType: 'json',
        data: payload,
      })
      .then(response => callback(response.data, response.status));
  }

  post(path, payload, config = {}) {
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

  put(path, payload, config = {}) {
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
