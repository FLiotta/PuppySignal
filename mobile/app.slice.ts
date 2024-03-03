// @ Packages
import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  authenticated: false
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setAuthenticated: (state, action) => {
      state.authenticated = action.payload;
    }
  }
})

export default appSlice.reducer;
export const { setAuthenticated } = appSlice.actions;