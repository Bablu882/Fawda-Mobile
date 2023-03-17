import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: null,
    isLoggedIn: null,
    userData: null,
    date: '',
    time: '',
    description: '',
    landType: '',
    landArea: '',
    totalAmount: '',
  };

export const SahayakBookingSlice = createSlice({
        name: 'land',
        initialState,
        reducers: {
          setToken: (state, action) => {
            state.token = action.payload;
            state.isLoggedIn = true
        },
        setIsLoading: (state, action) => {
            state.loading = action.payload
        },
        setUserData: (state, action) => {
            state.userData = action.payload;
        },
          setDate: (state, action) => {
            state.date = action.payload;
          },
          setTime: (state, action) => {
            state.time = action.payload;
          },
          setDescription: (state, action) => {
            state.description = action.payload;
          },
          setLandType: (state, action) => {
            state.landType = action.payload;
          },
          setLandArea: (state, action) => {
            state.landArea = action.payload;
          },
          setTotalAmount: (state, action) => {
            state.totalAmount = action.payload;
          },
        },
      });
      
      export const {
        setDate,
        setTime,
        setDescription,
        setLandType,
        setLandArea,
        setTotalAmount  
      } = SahayakBookingSlice.actions;

//       export const selectToken = (state) => state.land.token;
// export const selectUserData = (state) => state.land.userData;
// export const selectIsLoggedIn = (state) => state.land.isLoggedIn;
// export const selectIsLoading = (state) => state.land.loading;
// // export const setDate = (state) => state.land.date;
// export const selectTime = (state) => state.land.time;
// export const selectDescription = (state) => state.land.description;
// export const selectLandArea = (state) => state.land.landArea;
// export const selectLandType = (state) => state.land.landType;
// export const selectTotalAmount = (state) => state.land.totalAmount;


      export default SahayakBookingSlice.reducer;