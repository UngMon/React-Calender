import { createSlice } from "@reduxjs/toolkit";
import { MoreType } from "../utils/ReduxType";

const initialState: MoreType = {
  isVisible: false,
  date: "",
  day: "",
  week: "",
  key: "",
};

const moreSlice = createSlice({
  name: "all",
  initialState,
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

export const moreActions = moreSlice.actions;

export const moreReducer = moreSlice.reducer;
