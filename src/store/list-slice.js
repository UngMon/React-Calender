import { createSlice } from "@reduxjs/toolkit";

const listSlice = createSlice({
  name: "list",
  initialState: { isVisible: false, clickedIndex: "" },
  reducers: {
    toggle(state, action) {
      state.isVisible = !state.isVisible;
      state.clickedIndex = action.payload;
    },
  },
});

export const listActions = listSlice.actions;

export default listSlice;
