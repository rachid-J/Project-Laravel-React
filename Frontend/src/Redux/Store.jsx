import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./features/AuthSlice";
import darkModeSlice from "./features/themDarkmode";

const store = configureStore({
    reducer : {
        auth : AuthSlice,
        theme : darkModeSlice
    }
})

export default store;