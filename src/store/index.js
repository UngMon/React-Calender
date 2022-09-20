import { configureStore } from "@reduxjs/toolkit";
import monthSlice from "./month-slice";
import modalSlice from "./modal-slice";
import listSlice from "./list-slice";
import allListSlice from "./all-list-slice";

const store = configureStore({
  reducer: {
    month: monthSlice.reducer,
    modal: modalSlice.reducer,
    list: listSlice.reducer,
    all: allListSlice.reducer,
  },
});

export default store;
