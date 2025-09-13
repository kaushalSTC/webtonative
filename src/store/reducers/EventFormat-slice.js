import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    eventFormat: "",
}

const EventFormatSlice = createSlice({
  name: 'EventFormat',
  initialState,
  reducers: {
    setEventFormat: (state, action) => {
      state.eventFormat = action.payload;
    },
  },
});

export const { setEventFormat } = EventFormatSlice.actions;
export default EventFormatSlice.reducer;