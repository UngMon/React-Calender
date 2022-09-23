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
      console.log(action.payload);
      state.changed = true;
      const result = state.schedule.find(
        (item) => item.idx === state.clickedDate
      ); // schedule 배열에서 해당 날짜에 요소가 있을 때, true 와 해당 {} return

      if (result) {
        // 존재하면
        state.schedule.map((item) => {
          if (item.idx === state.clickedDate) {
            item.todo = [
              ...item.todo,
              [
                action.payload.timeData,
                action.payload.lastTime,
                action.payload.inputList,
              ],
            ];
          }
          item.todo.sort((a, b) => a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0 );
          return state.schedule;
        });
      } else {
        // 해당 날짜가 schedule 배열에 없을 때, 즉 처음
        state.schedule = [
          ...state.schedule,
          {
            idx: state.clickedDate,
            todo: [
              [
                action.payload.timeData,
                action.payload.lastTime,
                action.payload.inputList,
              ],
            ],
          },
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
