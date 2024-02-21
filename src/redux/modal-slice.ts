import { createSlice } from "@reduxjs/toolkit";
import { ModalType } from "../type/ReduxType";

const initialState: ModalType = {
  addModalOpen: false,
  listModalOpen: false,
  moreModalOpen: false,
  mobileModalOpen: false,
  listInMoreOpen: false,
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
  offsetTop: 0, // result 페이지에서 사용될 index
  mouseType: "",
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    toggleMobilModal(state) {
      state.mobileModalOpen = !state.mobileModalOpen;
    },

    offModal(state, action) {
      switch (action.payload.type) {
        case "Mobile":
          state.mobileModalOpen = false;
          break;
        case "Make":
          state.addModalOpen = false;
          break;
        case "List":
          state.listModalOpen = false;
          break;
        default:
          state.moreModalOpen = false;
      }
    },

    onModal(state, action) {
      switch (action.payload.type) {
        case "Mobile":
          state.mobileModalOpen = true;
          break;
        case "Make":
          state.addModalOpen = true;
          break;
        case "List":
          state.listModalOpen = true;
          break;
        default:
          state.moreModalOpen = true;
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
      state.offsetTop = action.payload.offsetTop || 0;
      if (action.payload.type !== "More") {
        state.week = action.payload.week || "";
        state.day = action.payload.day || "";
        state.mouseType = action.payload.type;
        state.addModalOpen = false;
        state.moreModalOpen = false;
      }
    },

    clickedMore(state, action) {
      state.moreModalOpen = true;
      state.addModalOpen = false;
      state.listModalOpen = false;
      state.date = action.payload.date;
      state.day = action.payload.day;
      state.week = action.payload.week;
      state.mouseType = "More";
      state.key = "";
    },

    clickedEdit(state) {
      state.openEdit = !state.openEdit;
      if (state.moreModalOpen) state.listInMoreOpen = true;
      state.addModalOpen = false;
      state.moreModalOpen = false;
      state.mobileModalOpen = false;
    },

    clearSet(state, action) {
      if (action.payload.type === "list") {
        state.listModalOpen = false;
        return;
      } else {
        state.addModalOpen = false;
        state.listModalOpen = false;
        state.moreModalOpen = false;
        state.mobileModalOpen = false;
        state.openEdit = false;
      }

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
      state.offsetTop = 0;
      state.mouseType = "";
      state.listInMoreOpen = false;
    },
  },
});

export const modalActions = modalSlice.actions;

export const modalReducer = modalSlice.reducer;
