import { createSlice } from "@reduxjs/toolkit";

const timeSlice = createSlice({
  name: "time",
  initialState: {
    firstIsVisible: false,
    lastVisible: false,
    firstTime: "",
    lastTime: "",
  },
  reducers: {
    startTimetoggle(state) {
      state.firstIsVisible = !state.firstIsVisible;
    },

    lastTimetoggle(state) {
      state.lastVisible = !state.lastVisible;
    },

    selecFristTime(state, action) {
      state.firstTime = action.payload;
      console.log(state.firstTime)
    },

    // selecLastTime(state, action) {
    //   state.lastTime = 0;
    // },

    closeModal(state) {
      state.firstIsVisible = false;
      state.lastVisible = false;
      state.firstTime = '';
      state.lastTime = '';
    }
  },
});

export const timeActions = timeSlice.actions;

export default timeSlice;
