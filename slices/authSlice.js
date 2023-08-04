import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: "",
  isLoggedIn: false,
  usertype: "",
  referCode: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setIsLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUserType: (state, action) => {
      state.usertype = action.payload;
      console.log("userdata form setUserType ", action);
    },
    setRefer: (state, action) => {
      state.referCode = action.payload;
    },
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },

    clearAuth: (state) => initialState,
  },
});

export const {
  setToken,
  setUserType,
  clearAuth,
  setIsLoading,
  setRefer,
  setIsLoggedIn,
} = authSlice.actions;

export const selectToken = (state) => state.auth.token;
export const selectUserType = (state) => state.auth.usertype;
export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectIsLoading = (state) => state.auth.loading;
export const selectReferCode = (state) => state.auth.referCode;

export default authSlice.reducer;
