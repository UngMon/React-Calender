import { createSlice } from "@reduxjs/toolkit";

const dateArray = [];

const calenderSlice = createSlice({
  name: "calender",
  initialState: dateArray,
  reducers: {},
});

export const calenderActions = calenderSlice.actions;

export default calenderSlice;