import { createSlice } from "@reduxjs/toolkit";

const today = new Date();
const todayYear = today.getFullYear();
const todayMonth = today.getMonth();

const monthSlice = createSlice({
  name: "month",

  initialState: {
    year: todayYear,
    month: todayMonth,
  },

  reducers: {
    prevMonth(state) {
      if (state.month === 0) {
        state.month = 11;
        state.year = +state.year - 1;
      } else {
        state.month = +state.month - 1;
      }
    },
    nextMonth(state) {
      if (state.month === 11) {
        state.year = +state.year + 1;
        state.month = 0;
      } else {
        state.month = +state.month + 1;
      }
    },

    setMonth(state, action) {
      state.year = action.payload.날짜정보[0];
      state.month = action.payload.thisMonth;
    },
  },
});

export const monthActions = monthSlice.actions;

export default monthSlice;
