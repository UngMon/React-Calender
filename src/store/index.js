import { configureStore } from "@reduxjs/toolkit";
import modalSlice from "./modal-slice";
import listSlice from "./list-slice";
import allListSlice from "./all-list-slice";
import timeSlice from "./time-slice";

const store = configureStore({
  reducer: {
    modal: modalSlice.reducer,
    list: listSlice.reducer,
    all: allListSlice.reducer,
    time: timeSlice.reducer,
  },
});

export default store;
