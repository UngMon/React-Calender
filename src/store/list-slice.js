import { createSlice } from "@reduxjs/toolkit";

const listSlice = createSlice({
  name: "list",
  initialState: {
    isVisible: false,
    week: "",
    dayIndex: "",
    listName: "",
    listIndex: "",
    index: "",
    key: '',
    style: false,
  },
  reducers: {
    clickedList(state, action) {
      state.week = action.payload.week;
      state.dayIndex = action.payload.dayIndex;
      state.listName = action.payload.listName;
      state.listIndex = action.payload.listIndex;
      state.index = action.payload.scheduleIndex;
      state.key = action.payload.key;
      state.isVisible = true;
    },

    offModal(state) {
      state.isVisible = false;
    }
  },
});

export const listActions = listSlice.actions;

export default listSlice;
