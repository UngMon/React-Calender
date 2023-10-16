import { ModalType } from "../type/ReduxType";
import { createSlice } from "@reduxjs/toolkit";

const initialState: ModalType = {
  addModalOpen: false,
  listModalOpen: false,
  moreModalOpen: false,
  mobileModalOpen: false,
  openEdit: false,
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
  click: "",
  실시간좌표: [0, 0],
};

const cloneSlice = createSlice({
  name: "clone",
  initialState,
  reducers: {
    setListInfo(state, action) {
      state.color = action.payload.color;
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
      state.startTime = action.payload.startTime;
      state.endTime = action.payload.endTime;
      state.title = action.payload.title;
      state.isDone = action.payload.isDone;
      state.key = action.payload.key;
      state.index = action.payload.index;
      state.week = action.payload.week;
      state.day = action.payload.day;
      state.mouseType = action.payload.type;
      state.click = action.payload.click;
    },

    setDate(state, action) {
      switch (action.payload.type) {
        case "Move":
          state.startDate = action.payload.start;
          state.endDate = action.payload.end;
          break;
        case "Start":
          state.startDate = action.payload.start;
          break;
        default:
          state.endDate = action.payload.end;
      }
    },

    clickedDate(state, action) {
      state.mouseType = action.payload.type;

      switch (action.payload.type) {
        case "MakeList":
          state.startDate = action.payload.startDate;
          state.endDate = action.payload.endDate;
          state.day = action.payload.day;
          state.week = action.payload.week;
          break;
        case "start":
          state.startDate = action.payload.startDate;
          state.day = action.payload.day;
          state.week = action.payload.week;
          break;
        case "end":
          state.endDate = action.payload.endDate;
          if (state.startDate > action.payload.endDate)
            state.startDate = action.payload.endDate;
          break;
      }
    },

    clear(state) {
      state.addModalOpen = false;
      state.listModalOpen = false;
      state.moreModalOpen = false;
      state.mobileModalOpen = false;
      state.openEdit = false;
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
      state.index = 0; // 그 날 일정에서 몇 번째 항목인지
      state.mouseType = "";
      state.click = "";
      state.실시간좌표 = [0, 0];
    },
  },
});

export const cloneActions = cloneSlice.actions;

export const cloneReducer = cloneSlice.reducer;
