import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedSection: "hotposts",
};

export const selectedSectionState = createSlice({
  name: "selectedSection",
  initialState,
  reducers: {
    select: (state, action) => {
      state.selectedSection = action.payload;
    },
  },
});

export const { select } = selectedSectionState.actions;
export default selectedSectionState.reducer;
