import { createSlice } from "@reduxjs/toolkit";

const listSlice = createSlice({
  name: "list",
  initialState: {
    isVisible: false,
    style: false,
    color: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    week: "",
    day: "",
    title: "",
    key: "",
    arr: "",
  },
  reducers: {
    clickedList(state, action) {
      state.isVisible = true;
      state.style = action.payload.style;
      state.color = action.payload.color;
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
      state.startTime = action.payload.startTime;
      state.endTime = action.payload.endTime;
      state.week = action.payload.week;
      state.day = action.payload.day;
      state.title = action.payload.title;
      state.key = action.payload.key;
      state.arr = action.payload.arr;
    },

    offModal(state) {
      state.isVisible = false;
      state.style = false;
      state.color = "";
      state.startDate = "";
      state.endDate = "";
      state.startTime = "";
      state.endTime = "";
      state.week = "";
      state.day = "";
      state.title = "";
      state.key = "";
      state.arr = "";
    },
  },
});

export const listActions = listSlice.actions;

export default listSlice;
