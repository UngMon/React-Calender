import { createSlice } from "@reduxjs/toolkit";
import { Time } from "../type/ReduxType";

const initialState: Time = {
  firstIsVisible: false,
  lastIsVisible: false,
  startTime: "",
  endTime: "",
};

const timeSlice = createSlice({
  name: "time",
  initialState,
  reducers: {
    timeToggle(state) {
      state.firstIsVisible = false;
      state.lastIsVisible = false;
    },

    openStartTime(state) {
      state.firstIsVisible = !state.firstIsVisible;
      state.lastIsVisible = false;
    },

    openEndTime(state) {
      state.lastIsVisible = !state.lastIsVisible;
      state.firstIsVisible = false;
    },

    setEditTime(state, action) {
      state.startTime = action.payload.startTime;
      state.endTime = action.payload.endTime;
    },

    selectFristTime(state, action) {
      state.startTime = action.payload.startTime;
      state.firstIsVisible = !state.firstIsVisible;
      state.lastIsVisible = false;
    },

    selectLastTime(state, action) {
      state.endTime = action.payload.endTime;
      state.lastIsVisible = !state.lastIsVisible;
      state.firstIsVisible = false;
    },

    resetTime(state) {
      state.firstIsVisible = false;
      state.lastIsVisible = false;
      state.startTime = "";
      state.endTime = "";
    },
  },
});

export const timeActions = timeSlice.actions;

export const timeReducer = timeSlice.reducer;
