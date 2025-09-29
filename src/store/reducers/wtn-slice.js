import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    platform: "browser",
};

const wtnSlice = createSlice({
    name: "wtn",
    initialState,
    reducers: {
        setMobileConfig: (state, action) => {
            state.platform = action.payload.platform;
        },
    },
});

export const { setMobileConfig } = wtnSlice.actions;
export default wtnSlice.reducer;