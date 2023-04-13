import axios from "axios";
import store, { getToken } from "../../store";
import authSlice from "../../slices/authSlice";
import { selectToken } from "../../slices/authSlice";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector } from "react-redux";

// import {se}

const state = store.getToken()
// const

let loginToken = await getToken();
console.log(loginToken , "login token");
getToken().then(token => {loginToken = token;} );
    // async function reduxtoken() {
 
let tok = "";
getToken().then((token) => {
  tok = token;
  console.log("ad1", token);
  console.log("tok3", tok);
});

// console.log("loginToken ", tok);

// console.log();

const api = axios.create({
  baseURL: "https://fawda.demoserver.in/",
  headers: {
    "Content-Type": "application/json",
    // Authorization: "Bearer " + selectToken(store.getState()),
  },
});
getToken().then(token => console.log("tstingNew",token));

getToken().then((token) => {
api.interceptors.request.use(
  (config) => {
    // const token = useSelector(selectToken);
    console.log(token , "toknnnnnnn");
    // if (token) {
      config.headers.Authorization = "Bearer " + token;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // if (error.response.status === 401) {
    //   localStorage.clear();
    //   const history = createBrowserHistory({ forceRefresh: true });
    //   if (checkUnauthRoute(history.location.pathname) === false) {
    //     history.push("/");
    //   }
    // }
    const generic_error = "Something went wrong.";
    if (error.response && error.response.data) {
      if (typeof error.response.data === "string") {
        const newData = {
          error: generic_error,
          info: error.response.data,
        };
        return Promise.reject(newData);
      }
      return Promise.reject(error.response);
    }
    return Promise.reject(error.message);
  }
);
});

// function checkUnauthRoute(params) {
//   if (
//     params === "/" ||
//     params === "/forgotPassword" ||
//     params.includes("changePassword") ||
//     params.includes("create-blank-app")
//   ) {
//     return true;
//   } else {
//     return false;
//   }
// }
// }
export default api;