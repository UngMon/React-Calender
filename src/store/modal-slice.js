import { createSlice } from "@reduxjs/toolkit";

const modalSlice = createSlice({
  name: "modal",
  initialState: {
    isVisible: false,
    startDate: "",
    endDate: "",
    week: "",
    year: "",
    month: "",
    date: "",
    secondYear: "",
    secondMonth: "",
    secondDate: "",
    type: true,
    dayIndex: "",
    schedule: [],
    longArr: [],
    changed: false,
  },
  reducers: {
    onModal(state) {
      state.isVisible = true;
    },

    offModal(state) {
      state.isVisible = false;
      state.secondMonth = "";
      state.secondDate = "";
      state.type = true;
    },

    clickedData(state, action) {
      state.startDate = action.payload.idx;
      state.endDate = action.payload.idx;
      state.week = action.payload.week;
      state.dayIndex = action.payload.dayIndex;
      state.year = action.payload.year;
      state.month = action.payload.month;
      state.date = action.payload.date;
      if (state.type === true) {
        state.secondMonth = action.payload.month;
        state.secondDate = action.payload.date;
      }
    },

    clickedSecondDate(state, action) {
      state.type = false;
      state.secondYear = action.payload.year;
      state.secondMonth = action.payload.month;
      state.secondDate = action.payload.date;
      state.endDate = action.payload.idx;
      if (action.payload.idx === state.startDate) {
        state.type = true; // 두 번째 날짜가 첫 번째 날자와 같을 시, 같은 날짜 변화
      } else {
        state.longArr = action.payload.longArr;
      }
    },

    inputList(state, action) {
      state.changed = true;
      const result = state.schedule.find(
        (item) => item.idx[0] === state.startDate
      ); // schedule 배열에서 해당 날짜에 요소가 있을 때, true 와 해당 {} return

      if (result) {
        // 존재하면
        state.schedule.map((item) => {
          if (item.idx[0] === state.startDate) {
            item.todo = [
              ...item.todo,
              {
                firstTime: action.payload.firstTime,
                lastTime: action.payload.lastTime,
                list: action.payload.list,
                style: false,
                length: 1,
                isFake: false,
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
            idx: [state.startDate],
            todo: [
              {
                firstTime: action.payload.firstTime,
                lastTime: action.payload.lastTime,
                list: action.payload.list,
                style: false,
                length: 1,
                isFake: false,
              },
            ],
          },
        ];
      }
    },

    longDateList(state, action) {
      state.changed = true;
      let length = state.longArr.length - state.dayIndex;
      for (let i of state.longArr) {
        const result = state.schedule.find((item) => item.idx[0] === i);
        const index = state.schedule.indexOf(result);

        if (result) {
          // schedule에서 longArr배열에 있는 i 가 존재할 때, 즉 일정이 있을 때!
          if (i === state.startDate) {
            // longDate의 첫 째날 일 때,
            state.schedule[index].idx = state.longArr;
            state.schedule[index].todo = [
              ...state.schedule[index].todo,
              {
                firstTime: action.payload.firstTime,
                lastTime: action.payload.lastTime,
                list: action.payload.list,
                style: false,
                length: length,
                isFake: false,
              },
            ];
            state.schedule[index].todo.sort((a, b) =>
              a.firstTime < b.firstTime ? -1 : a.firstTime > b.firstTime ? 1 : 0
            );
          } else {
            // 첫 째날이 아닌 그 이후 Date일 때,
            state.schedule[index].todo = [
              ...state.schedule[index].todo,
              {
                firstTime: action.payload.firstTime,
                lastTime: action.payload.lastTime,
                list: action.payload.list,
                length: state.longArr.length,
                isFake: true,
              },
            ];
          }
        } else { // 다시 돌아와서, schedule에 longArr에 있는 날짜에 일정이 없을 때,
          if (i === state.startDate) { // i가 longDate의 첫 째날 일 때,
            state.schedule = [
              ...state.schedule,
              {
                idx: state.longArr,
                todo: [
                  {
                    firstTime: action.payload.firstTime,
                    lastTime: action.payload.lastTime,
                    list: action.payload.list,
                    length: state.longArr.length,
                    style: false,
                    isFake: false,
                  },
                ],
              },
            ];
          } else {
            state.schedule = [
              ...state.schedule,
              {
                idx: [i],
                todo: [
                  {
                    firstTime: "1",
                    lastTime: "1",
                    list: "",
                    length: state.longArr.length,
                    style: false,
                    isFake: true,
                  },
                ],
              },
            ];
          }
        }
      }
      console.log(state.schedule);
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
        firstTime: action.payload.firstTime,
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
