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
      state.secondYear = "";
      state.secondMonth = "";
      state.secondDate = "";
      state.type = true;
    },

    clickedData(state, action) {
      state.startDate = action.payload.idx;
      state.endDate = action.payload.idx;
      state.week = action.payload.week;
      state.year = action.payload.year;
      state.month = action.payload.month;
      state.date = action.payload.date;
      state.dayIndex = action.payload.dayIndex;
      if (state.type === true) {
        state.secondYear = action.payload.year;
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
        (item) => item.idx === state.startDate
      ); // schedule 배열에서 해당 날짜에 요소가 있을 때, true 와 해당 {} return
      const index = state.schedule.indexOf(result);

      if (result) {
        // 존재하면
        state.schedule.map((item) => {
          if (item.idx === state.startDate) {
            item.todo = [
              ...item.todo,
              {
                firstTime: action.payload.firstTime,
                lastTime: action.payload.lastTime,
                list: action.payload.list,
                style: false,
                length: 1,
                isFake: false,
                isLong: false,
                index: action.payload.firstTime + action.payload.lastTime,
                arr: [state.startDate],
              },
            ];
          }
          state.schedule[index].todo.sort((a, b) =>
            a.index[0] === "l" && b.index[0] === "l"
              ? a.index > b.index
                ? -1
                : 1
              : a.index < b.index
              ? -1
              : 1
          );

          return state.schedule;
        });
      } else {
        // 해당 날짜가 schedule 배열에 없을 때, 즉 처음
        state.schedule = [
          ...state.schedule,
          {
            idx: state.startDate,
            todo: [
              {
                firstTime: action.payload.firstTime,
                lastTime: action.payload.lastTime,
                list: action.payload.list,
                style: false,
                length: 1,
                isFake: false,
                isLong: false,
                index: action.payload.firstTime + action.payload.lastTime,
                arr: [state.startDate],
              },
            ],
          },
        ];
      }
    },

    longDateList(state, action) {
      state.changed = true;
      let leng = state.longArr.length;
      let count = state.dayIndex;
      console.log(state.longArr);

      for (let i of state.longArr) {
        const result = state.schedule.find((item) => item.idx === i);
        const index = state.schedule.indexOf(result);

        if (result) {
          // schedule에서 longArr배열에 있는 i 가 존재할 때, 즉 기존 일정이 있을 때!
          if (i === state.startDate) {
            // longDate의 첫 째날 일 때,
            const Leng =
              leng - 8 + state.dayIndex > 0 ? 8 - state.dayIndex : leng;

            state.schedule[index].todo = [
              ...state.schedule[index].todo,
              {
                firstTime: action.payload.firstTime,
                lastTime: action.payload.lastTime,
                list: action.payload.list,
                style: false,
                length: Leng,
                isFake: false,
                isLong: true,
                index:
                  "long" +
                  action.payload.firstTime +
                  action.payload.lastTime +
                  state.longArr.length,
                arr: state.longArr,
              },
            ];
            state.schedule[index].todo.sort((a, b) =>
              a.index[0] === "l" && b.index[0] === "l"
                ? a.index > b.index
                  ? -1
                  : 1
                : a.index < b.index
                ? -1
                : 1
            );
          } else {
            // 첫 째날이 아닌 그 이후 Date일 때,

            if (count === 1) {
              // 시작 날 기준 다음주로 넘어갈 때, 일요일의 경우(count = 1) 남은 length만큼 표시
              const Leng = leng >= 7 ? 7 : leng; //시작 날 기준 다다음주 까지 넘어가는지

              state.schedule[index].todo = [
                ...state.schedule[index].todo,
                {
                  firstTime: action.payload.firstTime,
                  lastTime: action.payload.lastTime,
                  list: action.payload.list,
                  length: Leng,
                  isFake: false,
                  isLong: true,
                  index:
                    "long" +
                    action.payload.firstTime +
                    action.payload.lastTime +
                    state.longArr.length,
                  arr: state.longArr,
                },
              ];
            } else {
              state.schedule[index].todo = [
                ...state.schedule[index].todo,
                {
                  firstTime: 1,
                  lastTime: 1,
                  list: "",
                  length: 1,
                  isFake: true,
                  isLong: false,
                  index: "1",
                  arr: [i],
                },
              ];
            }
            state.schedule[index].todo.sort((a, b) =>
              a.index[0] === "l" && b.index[0] === "l"
                ? a.index > b.index
                  ? -1
                  : 1
                : a.index < b.index
                ? -1
                : 1
            );
          }
        } else {
          // 다시 돌아와서, schedule에 longArr에 있는 날짜에 일정이 없을 때,
          if (i === state.startDate) {
            // i가 longDate의 첫 째날 일 때,
            const Leng =
              leng - 8 + state.dayIndex > 0 ? 8 - state.dayIndex : leng;

            state.schedule = [
              ...state.schedule,
              {
                idx: i,
                todo: [
                  {
                    firstTime: action.payload.firstTime,
                    lastTime: action.payload.lastTime,
                    list: action.payload.list,
                    length: Leng,
                    style: false,
                    isFake: false,
                    isLong: true,
                    index:
                      "long" +
                      action.payload.firstTime +
                      action.payload.lastTime +
                      state.longArr.length,
                    arr: state.longArr,
                  },
                ],
              },
            ];
          } else {
            if (count === 1) {
              const Leng = leng >= 7 ? 7 : leng;
              state.schedule = [
                ...state.schedule,
                {
                  idx: i,
                  todo: [
                    {
                      firstTime: action.payload.firstTime,
                      lastTime: action.payload.lastTime,
                      list: action.payload.list,
                      length: Leng,
                      style: false,
                      isFake: false,
                      isLong: true,
                      index:
                        "long" +
                        action.payload.firstTime +
                        action.payload.lastTime +
                        state.longArr.length,
                      arr: state.longArr,
                    },
                  ],
                },
              ];
            } else {
              state.schedule = [
                ...state.schedule,
                {
                  idx: i,
                  todo: [
                    {
                      firstTime: "1",
                      lastTime: "1",
                      list: "",
                      length: 1,
                      style: false,
                      isFake: true,
                      isLong: false,
                      index: "1",
                      arr: [i],
                    },
                  ],
                },
              ];
            }
          }
        }
        leng -= 1;
        count = count === 7 ? 1 : count + 1;
      }
    },

    removeList(state, action) {
      state.changed = true;
      const index = action.payload.index;
      const listIndex = action.payload.listIndex;
      if (state.schedule[index].todo[listIndex].arr.length === 1) {
        state.schedule[index].todo.splice(listIndex, 1);

        if (state.schedule[action.payload.index].todo.length === 0) {
          state.schedule.splice(action.payload.index, 1);
        }
      } else {
        const arr = state.schedule[index].todo[listIndex].arr;
        arr.map((items) => {
          const result = state.schedule.find((item) => item.idx === items);
          const listObject = result.todo.find((item) => item.isLong === true);
          const idx = state.schedule.indexOf(result);
          const listIdx = state.schedule[idx].todo.indexOf(listObject);
          state.schedule[idx].todo.splice(listIdx, 1);
          if (state.schedule[idx].todo.length === 0) {
            state.schedule.splice(idx, 1);
          }
          return state.schedule;
        });
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
