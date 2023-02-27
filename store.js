import {configureStore} from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice"
import {persistReducer} from 'redux-persist'
import {combineReducers} from "redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

const persistConfig = {
    key: "root",
    storage: AsyncStorage,
    whitelist: ['auth']
};

const reducer = combineReducers({
    auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, reducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            immutableCheck: false,
            serializableCheck: false,
        }),
});

export default store;