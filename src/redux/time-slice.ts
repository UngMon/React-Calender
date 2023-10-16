import { createSlice } from "@reduxjs/toolkit";
import { Time } from "../type/ReduxType";

const initialState: Time = {
  firstIsVisible: false,
  lastIsVisible: false,
  firstTime: "",
  lastTime: "",
};

const timeSlice = createSlice({
  name: "time",
  initialState,
  reducers: {
    timeToggle(state) {
      state.firstIsVisible = false;
      state.lastIsVisible = false;
    },

    selectFristTime(state, action) {
      state.firstIsVisible = !state.firstIsVisible;
      state.lastIsVisible = false;
      state.firstTime = action.payload.firstTime;
    },

    selectLastTime(state, action) {
      state.lastIsVisible = !state.lastIsVisible;
      state.firstIsVisible = false;
      state.lastTime = action.payload.lastTime;
    },

    resetTime(state) {
      state.firstIsVisible = false;
      state.lastIsVisible = false;
      state.firstTime = "";
      state.lastTime = "";
    },
  },
});

export const timeActions = timeSlice.actions;

export const timeReducer = timeSlice.reducer;
