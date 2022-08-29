import { configureStore } from "@reduxjs/toolkit";
import monthSlice from "./month-slice";
import modalSlice from "./modal-slice";

const store = configureStore({
  reducer: { month: monthSlice.reducer, modal: modalSlice.reducer },
});

export default store;
