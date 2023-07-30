import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import rootReducer from "./rootReducer";
import monthSlice from "./month-slice";
import modalSlice from "./modal-slice";
import listSlice from "./list-slice";
import allListSlice from "./all-list-slice";
import timeSlice from "./time-slice";

const store = configureStore({
  reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>
export const useAppDispatch: () => AppDispatch = useDispatch;
export default store;
