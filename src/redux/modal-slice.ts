import { createSlice } from "@reduxjs/toolkit";
import { ModalType } from "../type/ReduxType";

const initialState: ModalType = {
  listModalOpen: false,
  moreModalOpen: false,
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
  index: 0, // 그 날 일정에서 몇 번째 항목인지
  mouseType: "",
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    clickedList(state, action) {
      state.week = action.payload.week;
      state.day = action.payload.day;
      state.mouseType = action.payload.type;
      switch (action.payload.type) {
        case "More":
          state.date = action.payload.date;
          return;
        case "List":
          break;
        // case "ListInMore":
        //   state.listModalOpen = !state.listModalOpen;
        //   break;
        default:
      }
      state.isDone = action.payload.object.isDone;
      state.color = action.payload.object.color;
      state.startDate = action.payload.object.startDate;
      state.endDate = action.payload.object.endDate;
      state.startTime = action.payload.object.startTime;
      state.endTime = action.payload.object.endTime;
      state.title = action.payload.object.title;
      state.key = action.payload.object.key;
      state.index = action.payload.index;
    },

    mouseMove(state, action) {
      state.startDate = action.payload.date;
      state.endDate = action.payload.date;
      state.day = action.payload.day;
      state.week = action.payload.week;
      state.mouseType = action.payload.type;
    },

    toggleList(state) {
      state.listModalOpen = !state.listModalOpen;
      state.mouseType = '';
    },

    toggleMore(state) {
      state.moreModalOpen = !state.moreModalOpen;
      state.mouseType = '';
    },

    onoffModal(state, action) {
      switch (action.payload.type) {
        case "more":
          state.moreModalOpen = !state.moreModalOpen;
          break;
        default:
          state.listModalOpen = false;
      }
      // state.date = "";
      // state.week = "";
      // state.day = "";
      // state.isDone = false;
      // state.color = "";
      // state.startDate = "";
      // state.endDate = "";
      // state.startTime = "";
      // state.endTime = "";
      // state.title = "";
      // state.key = "";
      // state.index = 0;
    },
  },
});

export const modalActions = modalSlice.actions;

export const modalReducer = modalSlice.reducer;
