import { configureStore } from "@reduxjs/toolkit";
import monthSlice from "./month-slice";
import modalSlice from "./modal-slice";
import listSlice from "./list-slice";

const store = configureStore({
  reducer: {
    month: monthSlice.reducer,
    modal: modalSlice.reducer,
    list: listSlice.reducer,
  },
});

export default store;
