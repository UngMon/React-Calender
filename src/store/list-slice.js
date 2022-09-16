import { createSlice } from "@reduxjs/toolkit";

const listSlice = createSlice({
  name: "list",
  initialState: {
    isVisible: false,
    clickedDate: "",
    dayIndex: "",
    listName: "",
    listIndex: "",
    index: "",
  },
  reducers: {
    clickedList(state, action) {
      state.isVisible = !state.isVisible;
      state.clickedDate = action.payload.date;
      state.dayIndex = action.payload.dayIdx;
      state.listName = action.payload.item;
      state.listIndex = action.payload.listIndex;
      state.index = action.payload.scheduleIndex;
    },
    toggle(state) {
      state.isVisible = !state.isVisible;
    },
  },
});

export const listActions = listSlice.actions;

export default listSlice;
