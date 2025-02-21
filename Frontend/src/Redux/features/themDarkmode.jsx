import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    darkMode: false ,
};

const darkModeSlice = createSlice({
    name: 'darkMode',
    initialState,
    reducers: {
        enableDarkMode: (state,action) => {
            state.darkMode = action.payload;
           
        },
       
    },
});

export const { enableDarkMode } = darkModeSlice.actions;

export default darkModeSlice.reducer;