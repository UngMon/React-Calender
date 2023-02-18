import { createSlice } from "@reduxjs/toolkit";

const allListSlice = createSlice({
  name: "all",
  initialState: {
    isVisible: false,
    date: "",
    day: "",
    week: "",
    key: "",
  },
  reducers: {
    offModal(state) {
      state.isVisible = false;
    },

    clickedListBox(state, action) {
      state.isVisible = true;
      state.date = action.payload.date;
      state.day = action.payload.day;
      state.week = action.payload.week;
    },
  },
});

export const allListActions = allListSlice.actions;

export default allListSlice;
