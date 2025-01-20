import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("access_token") || null,
  stock: JSON.parse(localStorage.getItem("stock")) || {},
}
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.token = action.payload.token;
      state.stock = action.payload.stock;

      localStorage.setItem("access_token", action.payload.token);
      localStorage.setItem("stock", JSON.stringify(action.payload.stock));
    },
    setStoreInfo(state, action) {
        state.stock = action.payload;
    },
    logOut(state) {
      state.token = null 
      state.stock = {} ;
      localStorage.removeItem("access_token");
      localStorage.removeItem("stock")
    }
  },

});

export const { loginSuccess, setStoreInfo ,logOut } = authSlice.actions;
export default authSlice.reducer;

