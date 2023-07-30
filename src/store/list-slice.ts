import { createSlice } from "@reduxjs/toolkit";

const listSlice = createSlice({
  name: "list",
  initialState: {
    isVisible: false,
    isDone: false,
    color: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    title: "",
    key: "",
    week: "",
    day: "",
    index: 0,
  },
  reducers: {
    clickedList(state, action) {
      state.isVisible = true;
      state.isDone = action.payload.object.style;
      state.color = action.payload.object.color;
      state.startDate = action.payload.object.startDate;
      state.endDate = action.payload.object.endDate;
      state.startTime = action.payload.object.startTime;
      state.endTime = action.payload.object.endTime;
      state.title = action.payload.object.title;
      state.key = action.payload.object.key;
      state.week = action.payload.week;
      state.day = action.payload.day;
      state.index = action.payload.index;
    },

    offModal(state) {
      state.isVisible = false;
      state.isDone = false;
      state.color = "";
      state.startDate = "";
      state.endDate = "";
      state.startTime = "";
      state.endTime = "";
      state.title = "";
      state.key = "";
      state.week = "";
      state.day = "";
      state.index = 0;
    },
  },
});

export const listActions = listSlice.actions;

export default listSlice;
