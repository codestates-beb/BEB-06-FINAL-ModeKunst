import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentScreenMode: null,
};

export const currentScreenModeState = createSlice({
  name: "currentScreenMode",
  initialState,
  reducers: {
    convert: (state, action) => {
      state.currentScreenMode = action.payload;
    },
  },
});
export const { convert } = currentScreenModeState.actions;
export default currentScreenModeState.reducer;
