import { createSlice } from "@reduxjs/toolkit";

const listSlice = createSlice({
  name: "list",
  initialState: {
    isVisible: false,
    clickedDate: "",
    week: "",
    dayIndex: "",
    listName: "",
    listIndex: "",
    index: "",
    style: false,
  },
  reducers: {
    clickedList(state, action) {
      state.isVisible = !state.isVisible;
      state.clickedDate = action.payload.date;
      state.week = action.payload.week;
      state.dayIndex = action.payload.dayIdx;
      state.listName = action.payload.item;
      state.listIndex = action.payload.listIndex;
      state.index = action.payload.scheduleIndex;
    },
    toggle(state) {
      state.isVisible = !state.isVisible;
    },
    doneList(state) {
      state.style = !state.style;
    },
  },
});

export const listActions = listSlice.actions;

export default listSlice;
