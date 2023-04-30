import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: null,
    isLoggedIn: false,
    usertype: "",
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload;
            state.isLoggedIn = true
          
       
        },
        setIsLoading: (state, action) => {
            state.loading = action.payload
        },
        setUserType: (state, action) => {
            state.usertype = action.payload;
            console.log('userdata form setUserType ', action)
        },
        
        login(state) {
            state.isLoggedIn = true;
          },
          logout(state) {
            state.isLoggedIn = false;
          },
       
      //  clearAuth: state => initialState
    }
});

export const { setToken, setUserType, clearAuth, setIsLoading,login, logout } = authSlice.actions;

export const selectToken = (state) => state.auth.token;
export const selectUserType = (state) => state.auth.usertype;
export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectIsLoading = (state) => state.auth.loading;
export const logoutAction = () => dispatch => {
    dispatch(logout());
  };
export default authSlice.reducer;