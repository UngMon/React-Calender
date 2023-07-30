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
    firstTimetoggle(state) {
      state.firstIsVisible = !state.firstIsVisible;
    },

    lastTimetoggle(state) {
      state.lastIsVisible = !state.lastIsVisible;
    },

    timeToggle(state) {
      state.firstIsVisible = false;
      state.lastIsVisible = false;
    },

    selectFristTime(state, action) {
      state.firstTime = action.payload;
    },

    selectLastTime(state, action) {
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
