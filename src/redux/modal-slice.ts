import { createSlice } from "@reduxjs/toolkit";
import { ModalType } from "../type/ReduxType";

const initialState: ModalType = {
  listModalOpen: false,
  moreModalOpen: false,
  year: "",
  month: "",
  date: "",
  week: "",
  day: "",
  isDone: false,
  color: "",
  startDate: "",
  endDate: "",
  startTime: "",
  endTime: "",
  title: "",
  key: "",
  index: 0,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    clickedList(state, action) {
      state.week = action.payload.week;
      state.day = action.payload.day;
      console.log(action.payload.parameter)
      switch (action.payload.type) {
        case "list":
          state.listModalOpen = true;
          state.isDone = action.payload.parameter.object.isDone
          state.color = action.payload.parameter.object.color;
          state.startDate = action.payload.parameter.object.startDate;
          state.endDate = action.payload.parameter.object.endDate;
          state.startTime = action.payload.parameter.object.startTime;
          state.endTime = action.payload.parameter.object.endTime;
          state.title = action.payload.parameter.object.title;
          state.day = action.payload.day;
          state.index = action.payload.index;
          state.key = action.payload.parameter.object.key;
          break;
        default:
          state.moreModalOpen = true;
          state.date = action.payload.date;
      }
    },

    offModal(state) {
      state.listModalOpen = false;
      state.moreModalOpen = false;
      state.year = "";
      state.month = "";
      state.date = "";
      state.week = "";
      state.day = "";
      state.isDone = false;
      state.color = "";
      state.startDate = "";
      state.endDate = "";
      state.startTime = "";
      state.endTime = "";
      state.title = "";
      state.key = "";
      state.index = 0;
    },
  },
});

export const modalActions = modalSlice.actions;

export const modalReducer = modalSlice.reducer;
