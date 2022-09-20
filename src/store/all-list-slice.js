import { createSlice } from "@reduxjs/toolkit";

const allListSlice = createSlice({
  name: "all",
  initialState: { isVisible: false, date: "", day: "", week: "", index: "" },
  reducers: {
    toggle(state) {
      state.isVisible = !state.isVisible;
    },
    clickedListBox(state, action) {
      state.date = action.payload.date;
      state.day = action.payload.day;
      state.week = action.payload.week;
      state.index = action.payload.scheduleIndex;
    },
  },
});

export const allListActions = allListSlice.actions;

export default allListSlice;