import { createSlice } from "@reduxjs/toolkit";

const modalSlice = createSlice({
  name: "modal",
  initialState: {
    isVisible: false,
    clickedDate: "",
    week: "",
    dayIndex: "",
    schedule: [],
    changed: false,
  },
  reducers: {
    toggle(state) {
      state.isVisible = !state.isVisible;
    },

    clickedData(state, action) {
      state.clickedDate = action.payload.idx;
      state.week = action.payload.week;
      state.dayIndex = action.payload.dayIndex;  
    },

    inputList(state, action) {
      state.changed = true;
      const result = state.schedule.find(
        (item) => item.idx === state.clickedDate
      );

      if (result) {
        state.schedule.map((item) => {
          if (item.idx === state.clickedDate) {
            item.todo = [...item.todo, action.payload];
          }
          return state.schedule;
        });
      } else {
        state.schedule = [
          ...state.schedule,
          { idx: state.clickedDate, todo: [action.payload] },
        ];
      }
    },

    removeList(state, action) {
      state.changed = true;
      state.schedule[action.payload.index].todo.splice(
        action.payload.listIndex,
        1
      );

      if (state.schedule[action.payload.index].todo.length === 0) {
        state.schedule.splice(action.payload.index, 1);
      }
    },

    fetchFromData(state, action) {
      if (action.payload.length !== 0) {
        state.schedule = action.payload;
      }
    },

    toggleChanged(state) {
      state.changed = false;
    },
  },
});

export const modalActions = modalSlice.actions;

export default modalSlice;
