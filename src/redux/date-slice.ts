import { createSlice } from "@reduxjs/toolkit";

const today = new Date();
const todayYear = String(today.getFullYear());
const todayMonth = String(today.getMonth() + 1).padStart(2, "0");

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
      state.year = action.payload.year;
      state.month = action.payload.month;
    },
  },
});

export const dateActions = dateSlice.actions;

export const dateReducer = dateSlice.reducer;
