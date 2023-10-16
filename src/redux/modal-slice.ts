import { createSlice } from "@reduxjs/toolkit";
import { ModalType } from "../type/ReduxType";

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

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    setPosition(state, action) {
      state.day = action.payload.day;
      state.week = action.payload.week;
    },

    clickedDate(state, action) {
      state.mouseType = action.payload.type || state.mouseType;
      if (action.payload.type === "start") {
        state.startDate = action.payload.startDate;
        state.day = action.payload.day;
        state.week = action.payload.week;
        return;
      }

      if (action.payload.type === "end") {
        if (state.startDate > action.payload.endDate) {
          console.log("redux end < start");
          state.startDate = action.payload.endDate;
        }
        state.endDate = action.payload.endDate;
        return;
      }

      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
      state.day = action.payload.day;
      state.week = action.payload.week;
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

    setListInfo(state, action) {
      state.color = action.payload?.object?.color || action.payload.color;
      state.startDate =
        action.payload?.object?.startDate || action.payload.startDate;
      state.endDate = action.payload?.object?.endDate || action.payload.endDate;
      state.startTime =
        action.payload?.object?.startTime || action.payload.startTime;
      state.endTime = action.payload?.object?.endTime || action.payload.endTime;
      state.title = action.payload?.object?.title || action.payload.title;
      state.isDone = action.payload?.object?.isDone || action.payload.isDone;
      state.key = action.payload?.object?.key || action.payload.key;
      state.index = action.payload.index;
      state.week = action.payload.week;
      state.day = action.payload.day;
      state.mouseType = action.payload.type;
      state.click = action.payload.click;
    },

    onList(state) {
      state.listModalOpen = true;
      state.addModalOpen = false;
      state.moreModalOpen = false;
      state.mobileModalOpen = false;
    },

    offList(state) {
      state.listModalOpen = false;
      state.openEdit = false;
    },

    clickedMore(state, action) {
      state.moreModalOpen = true;
      state.date = action.payload.date;
      state.day = action.payload.day;
      state.week = action.payload.week;
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

    offModal(state) {
      state.addModalOpen = false;
      state.listModalOpen = false;
      state.moreModalOpen = false;
      state.mobileModalOpen = false;
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
      state.openEdit = false;
    },

    clickedListInMobile(state, action) {
      state.title = action.payload.title;
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
      state.startTime = action.payload.startTime;
      state.endTime = action.payload.endTime;
      state.key = action.payload.key;
      state.color = action.payload.color;
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
    },
  },
});

export const modalActions = modalSlice.actions;

export const modalReducer = modalSlice.reducer;
