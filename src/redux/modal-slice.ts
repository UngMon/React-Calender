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
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    setPosition(state, action) {
      state.day = action.payload.day;
      state.week = action.payload.week;
    },

    toggleMobilModal(state) {
      state.mobileModalOpen = !state.mobileModalOpen;
    },

    onAdd(state) {
      state.addModalOpen = true;
    },

    onOffModal(state, action) {
      switch (action.payload.type) {
        case "mobile":
          state.mobileModalOpen = !state.mobileModalOpen;
          break;
        case "make":
          state.addModalOpen = !state.addModalOpen;
          break;
        case "list":
          state.listModalOpen = !state.listModalOpen;
          break;
        default:
          state.moreModalOpen = !state.moreModalOpen;
      }
    },

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

    onList(state) {
      state.listModalOpen = true;
      state.addModalOpen = false;
      state.moreModalOpen = false;
      state.mobileModalOpen = false;
    },

    clickedMore(state, action) {
      state.moreModalOpen = true;
      state.date = action.payload.date;
      state.day = action.payload.day;
      state.week = action.payload.week;
      state.mouseType = "More";
    },

    // toggleMore(state) {
    //   state.moreModalOpen = !state.moreModalOpen;
    //   state.mouseType = "";
    // },

    clearSet(state) {
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
    },

    setStartEndDate(state, action) {
      state.startDate = action.payload.date;
      state.endDate = action.payload.date;
    },

    clickedEdit(state) {
      state.openEdit = !state.openEdit;
    },
  },
});

export const modalActions = modalSlice.actions;

export const modalReducer = modalSlice.reducer;
