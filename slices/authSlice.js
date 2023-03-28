import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: null,
    isLoggedIn: null,
    userData: null,
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload;
            state.isLoggedIn = true
        console.log('dddddd->>>', action);
        },
        setIsLoading: (state, action) => {
            state.loading = action.payload
        },
        setUserData: (state, action) => {
            state.userData = action.payload;
        },
       
      //  clearAuth: state => initialState
    }
});

export const { setToken, setUserData, clearAuth, setIsLoading } = authSlice.actions;

export const selectToken = (state) => state.auth.token;
export const selectUserData = (state) => state.auth.userData;
export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectIsLoading = (state) => state.auth.loading;

export default authSlice.reducer;