import { createSlice } from "@reduxjs/toolkit";
import { ModalType } from "../type/ReduxType";

const initialState: ModalType = {
  addModalOpen: false,
  listModalOpen: false,
  moreModalOpen: false,
  mobileModalOpen: false,
  date: "",
  week: "",
  day: "",
  isDone: false,
  color: "",
  newStart: "",
  newEnd: "",
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
  dateArray: [],
  openEdit: false,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    clickedDate(state, action) {
      state.dateArray = action.payload.dateArray || [action.payload.startDate];
      state.mouseType = action.payload.type || state.mouseType;
      if (action.payload.type === "start") {
        state.startDate = action.payload.startDate;
        state.day = action.payload.day;
        state.week = action.payload.week;
        return;
      }

      if (action.payload.type === "end") {
        state.endDate = action.payload.endDate;
        state.dateArray = action.payload.dateArray;
        return;
      }

      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
      state.day = action.payload.day;
      state.week = action.payload.week;

      state.dateArray = action.payload.dateArray || [action.payload.startDate];
    },

    toggleMobilModal(state) {
      state.mobileModalOpen = !state.mobileModalOpen;
    },

    onAdd(state) {
      state.addModalOpen = true;
    },

    offAdd(state) {
      state.addModalOpen = false;
    },

    clickedList(state, action) {
      state.color = action.payload.object.color;
      state.startDate = action.payload.object.startDate;
      state.endDate = action.payload.object.endDate;
      state.startTime = action.payload.object.startTime;
      state.endTime = action.payload.object.endTime;
      state.title = action.payload.object.title;
      state.index = action.payload.index;
      state.key = action.payload.object.key;
      state.isDone = action.payload.object.isDone;
      state.week = action.payload.week;
      state.day = action.payload.day;
      state.mouseType = "List";
      state.click = action.payload.click;
    },

    onList(state) {
      state.listModalOpen = true;
    },

    offList(state) {
      state.listModalOpen = false;
      state.openEdit = false;
    },

    clickedMore(state, action) {
      state.moreModalOpen = true;
      state.date = action.payload.date;
      state.week = action.payload.week;
      state.day = action.payload.day;
      state.mouseType = "More";
    },

    mouseMove(state, action) {
      state.startDate = action.payload.date;
      state.endDate = action.payload.date;
      state.day = action.payload.day;
      state.week = action.payload.week;
      state.mouseType = action.payload.type;
    },

    toggleMore(state) {
      state.moreModalOpen = !state.moreModalOpen;
      state.mouseType = "";
    },

    offMore(state) {
      state.moreModalOpen = false;
    },

    onoffModal(state, action) {
      if (action.payload.type === "More")
        state.moreModalOpen = !state.moreModalOpen;
      else state.listModalOpen = !state.listModalOpen;

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
    },

    allOffModal(state) {
      state.addModalOpen = false;
      state.listModalOpen = false;
      state.moreModalOpen = false;
    },

    clickedListInMobile(state, action) {
      state.title = action.payload.title;
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
      state.startTime = action.payload.startTime;
      state.endTime = action.payload.endTime;
    },

    addEvent(state, action) {
      state.title = action.payload.title;
      state.date = "";
      state.isDone = false;
      state.color = "";
      state.startTime = "";
      state.endTime = "";
      state.key = "";
      state.index = 0;
      state.mouseType = "";
      state.click = "";
    },

    setStartEndDate(state, action) {
      state.startDate = action.payload.date;
      state.endDate = action.payload.date;
    },

    실시간좌표설정(state, action) {
      state.실시간좌표 = [action.payload.day, action.payload.week];
    },

    clickedEdit(state) {
      state.openEdit = !state.openEdit;
    },

    moveDate(state, action) {
      state.startDate = action.payload.start;
      state.endDate = action.payload.end;
    }
  },
});

export const modalActions = modalSlice.actions;

export const modalReducer = modalSlice.reducer;
