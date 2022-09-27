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
      ); // schedule 배열에서 해당 날짜에 요소가 있을 때, true 와 해당 {} return

      if (result) {
        // 존재하면
        state.schedule.map((item) => {
          if (item.idx === state.clickedDate) {
            item.todo = [
              ...item.todo,
              {
                firstTime: action.payload.timeData,
                lastTime: action.payload.lastTime,
                list: action.payload.inputList,
                style: false,
              },
            ];
          }
          item.todo = item.todo.sort((a, b) =>
            a.firstTime < b.firstTime ? -1 : a.firstTime > b.firstTime ? 1 : 0
          );
          return state.schedule;
        });
      } else {
        // 해당 날짜가 schedule 배열에 없을 때, 즉 처음
        state.schedule = [
          ...state.schedule,
          {
            idx: state.clickedDate,
            todo: [
              {
                firstTime: action.payload.timeData,
                lastTime: action.payload.lastTime,
                list: action.payload.inputList,
                style: false,
              },
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

    editList(state, action) {
      state.changed = true;
      let arr = [...state.schedule];
      arr[action.payload.index].todo[action.payload.listIndex] = {
        firstTime: action.payload.timeData,
        lastTime: action.payload.lastTime,
        list: action.payload.inputList,
        style: false,
      };
      arr[action.payload.index].todo.sort((a, b) =>
        a.firstTime < b.firstTime ? -1 : a.firstTime > b.firstTime ? 1 : 0
      );
      state.schedule = [...arr];
    },

    fetchFromData(state, action) {
      if (action.payload.length !== 0) {
        state.schedule = action.payload;
      }
    },

    toggleChanged(state) {
      state.changed = false;
    },

    listDone(state, action) {
      state.changed = true;
      let arr = [...state.schedule];

      arr[action.payload.index].todo[action.payload.listIndex].style =
        !arr[action.payload.index].todo[action.payload.listIndex].style;

      state.schedule = [...arr];
    },
  },
});

export const modalActions = modalSlice.actions;

export default modalSlice;
