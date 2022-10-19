import { createSlice } from "@reduxjs/toolkit";

const listSlice = createSlice({
  name: "list",
  initialState: {
    isVisible: false,
    key: "",
    clickedDate: "",
    week: "",
    year: '',
    month: '',
    date: '',
    dayIndex: "",
    listName: "",
    listIndex: "",
    index: "",
    style: false,
  },
  reducers: {
    clickedList(state, action) {
      state.key = action.payload.key;
      state.clickedDate = action.payload.clickedDate;
      state.week = action.payload.week;
      state.year = action.payload.year;
      state.month = action.payload.month;
      state.date = action.payload.date;
      state.dayIndex = action.payload.dayIdx;
      state.listName = action.payload.listName;
      state.listIndex = action.payload.listIndex;
      state.index = action.payload.scheduleIndex;
    },

    onModal(state) {
      state.isVisible = true;
    },
    offModal(state) {
      state.isVisible = false;
    }
  },
});

export const listActions = listSlice.actions;

export default listSlice;
