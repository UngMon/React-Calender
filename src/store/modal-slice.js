import { createSlice } from "@reduxjs/toolkit";

const modalSlice = createSlice({
  name: "modal",
  initialState: {
    isVisible: false,
    clickedDate: "",
    schedule: [],
  },
  reducers: {
    toggle(state, action) {
      state.isVisible = !state.isVisible;
      state.clickedDate = action.payload;
    },

    inputList(state, action) {
      console.log(action.payload);
      const result = state.schedule.find(
        (item) => item.idx === state.clickedDate
      );
      if (result) {
        console.log("true");
        state.schedule.map((item) => {
          if (item.idx === state.clickedDate) {
            item.todo = [...item.todo, action.payload];
          }
          return state.schedule;
        });
      } else {
        console.log("false");
        console.log(state.clickedDate);
        state.schedule = [
          ...state.schedule,
          { idx: state.clickedDate, todo: [action.payload] },
        ];
      }
    },
    fetchFromData(state, action) {
      if (action.payload.length !== 0) {
        state.schedule = action.payload;
      }
    },
  },
});

export const modalActions = modalSlice.actions;

export default modalSlice;
