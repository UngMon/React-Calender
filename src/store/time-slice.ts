import { createSlice } from "@reduxjs/toolkit";

const timeSlice = createSlice({
  name: "time",
  initialState: {
    firstIsVisible: false,
    lastIsVisible: false,
    firstTime: '',
    lastTime: '',
  },
  reducers: {
    timeToggle(state) {
      state.firstIsVisible = false;
      state.lastIsVisible = false;
    },

    selectFristTime(state, action) {
      state.firstIsVisible = !state.firstIsVisible;
      state.lastIsVisible = false;
      state.firstTime = action.payload;
    },

    selectLastTime(state, action) {
      state.lastIsVisible = !state.lastIsVisible;
      state.firstIsVisible = false;
      state.lastTime = action.payload;
    },

    resetTime(state) {
      state.firstIsVisible = false;
      state.lastIsVisible = false;
      state.firstTime = '';
      state.lastTime = '';
    }
  },
});

export const timeActions = timeSlice.actions;

export const timeReducer = timeSlice.reducer;
