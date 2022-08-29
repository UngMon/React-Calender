import { createSlice } from "@reduxjs/toolkit";

const modalSlice = createSlice({
  name: "modal",
  initialState: { isVisible: false, clickedDate: ''},
  reducers: {
    toggle(state, action) {
      state.isVisible = !state.isVisible;
      state.clickedDate = action.payload;
    },
  },
});

export const modalActions = modalSlice.actions;

export default modalSlice;
