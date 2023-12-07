import { createSlice } from "@reduxjs/toolkit";

const today = new Date();
const todayYear = String(today.getFullYear());
const todayMonth = String(today.getMonth() + 1).padStart(2, "0");

console.log(todayYear, todayMonth)

const dateSlice = createSlice({
  name: "month",
  initialState: {
    year: todayYear,
    month: todayMonth,
  },
  reducers: {
    prevMonth(state) {
      switch (state.month) {
        case "01":
          state.month = "12";
          state.year = String(+state.year - 1);
          break;
        default:
          state.month = String(+state.month - 1).padStart(2, "0");
      }
    },

    nextMonth(state) {
      switch (state.month) {
        case "12":
          state.month = "01";
          state.year = String(+state.year + 1);
          break;
        default:
          state.month = String(+state.month + 1).padStart(2, "0");
      }
    },

    setDate(state, action) {
      state.year = action.payload.y;
      state.month = action.payload.m;
    },

    setMonth(state, action) {
      state.year = action.payload.선택날짜[0];
      state.month = action.payload.thisMonth;
    },
  },
});

export const dateActions = dateSlice.actions;

export const dateReducer = dateSlice.reducer;
