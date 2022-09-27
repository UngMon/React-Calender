import { createSlice } from "@reduxjs/toolkit";

const today = new Date();
const todayYear = today.getFullYear();
const todayMonth = today.getMonth();

const initialDateInfo = {
  year: todayYear,
  month: todayMonth,
  firstDay: new Date(todayYear, todayMonth, 1).getDay(),
  lastDate: new Date(todayYear, todayMonth + 1, 0).getDate(),
};

const monthSlice = createSlice({
  name: 'date',
  initialState: initialDateInfo,
  reducers: {
    prevMonth(state) {
      if (state.month === 0) {
        state.month = 11;
        state.year -= 1;
        state.firstDay = new Date(state.year, state.month, 1).getDay();
        state.lastDate = new Date(state.year, state.month + 1, 0).getDate();
      } else {
        state.month -= 1;
        state.firstDay = new Date(state.year, state.month, 1).getDay();
        state.lastDate = new Date(state.year, state.month + 1, 0).getDate();
      }
    },
    nextMonth(state) {
      if (state.month === 11) {
        state.year += 1;
        state.month = 0;
        state.firstDay = new Date(state.year, state.month, 1).getDay();
        state.lastDate = new Date(state.year, state.month + 1, 0).getDate();
      } else {
        state.month += 1;
        state.firstDay = new Date(state.year, state.month, 1).getDay();
        state.lastDate = new Date(state.year, state.month + 1, 0).getDate();
      }
    },
  },
});

export const monthActions = monthSlice.actions;

export default monthSlice;
