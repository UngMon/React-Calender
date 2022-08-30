import { createSlice } from "@reduxjs/toolkit";

const today = new Date();
const todayYear = today.getFullYear();
const todayMonth = today.getMonth();

const initialDateInfo = {
  thisYear: todayYear,
  thisMonth: todayMonth,
  lastDateOfThisMonth: new Date(todayYear, todayMonth + 1, 0).getDate(),
  prevMonthLastDate: new Date(todayYear, todayMonth, 0).getDate(),
  prevMonthLastDay: new Date(todayYear, todayMonth, 0).getDay(),
};

const monthSlice = createSlice({
  name: 'date',
  initialState: initialDateInfo,
  reducers: {
    prevMonth(state) {
      if (state.thisMonth === 0) {
        state.thisMonth = 11;
        state.thisYear -= 1;
        state.lastDateOfThisMonth = new Date(state.thisYear, state.thisMonth + 1, 0).getDate();
        state.prevMonthLastDate = new Date(state.thisYear, state.thisMonth, 0).getDate();
        state.prevMonthLastDay = new Date(state.thisYear, state.thisMonth, 0).getDay();
      } else {
        state.thisMonth -= 1;
        state.lastDateOfThisMonth = new Date(state.thisYear, state.thisMonth + 1, 0).getDate();
        state.prevMonthLastDate = new Date(state.thisYear, state.thisMonth, 0).getDate();
        state.prevMonthLastDay = new Date(state.thisYear, state.thisMonth, 0).getDay();
      }
    },
    nextMonth(state) {
      if (state.thisMonth === 11) {
        state.thisYear += 1;
        state.thisMonth = 0;
        state.lastDateOfThisMonth = new Date(state.thisYear, state.thisMonth + 1, 0).getDate();
        state.prevMonthLastDate = new Date(state.thisYear, state.thisMonth, 0).getDate();
        state.prevMonthLastDay = new Date(state.thisYear, state.thisMonth, 0).getDay();
      } else {
        state.thisMonth += 1;
        state.lastDateOfThisMonth = new Date(state.thisYear, state.thisMonth + 1, 0).getDate();
        state.prevMonthLastDate = new Date(state.thisYear, state.thisMonth, 0).getDate();
        state.prevMonthLastDay = new Date(state.thisYear, state.thisMonth, 0).getDay();
      }
    },
  },
});

export const monthActions = monthSlice.actions;

export default monthSlice;
