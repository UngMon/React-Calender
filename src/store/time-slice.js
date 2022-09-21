import { createSlice } from "@reduxjs/toolkit";

const timeSlice = createSlice({
  name: "time",
  initialState: { firstIsVisible: false, lastVisible: false },
  reducers: {
    startTimetoggle(state) {
      state.firstIsVisible = !state.firstIsVisible;
    },
    lastTimetoggle(state) {
        state.lastVisible = !state.lastVisible;
    }
  },
});

export const timeActions = timeSlice.actions;

export default timeSlice;
