import { createSlice } from "@reduxjs/toolkit";

const modalSlice = createSlice({
  name: "modal",
  initialState: {
    isStart: false,
    isVisible: false,
    startDate: "",
    endDate: "",
    week: "",
    dayIndex: "",
    userIndex: "",
    userData: [],
    userSchedule: [],
    longArr: [],
    changed: false,
  },
  reducers: {
    onModal(state) {
      state.isVisible = true;
    },

    offModal(state) {
      state.isVisible = false;
      state.startDate = "";
      state.endDate = "";
    },

    clickedStartDate(state, action) {
      state.startDate = action.payload.idx;
      console.log(action.payload.idx);
      state.week = action.payload.week;
      state.dayIndex = action.payload.dayIndex;
      state.longArr = action.payload.longArr;
      if (state.endDate === action.payload.idx || state.endDate.length === 0) {
        state.endDate = action.payload.idx;
      }
    },

    clickedLastDate(state, action) {
      console.log(state.startDate);
      state.endDate = action.payload.idx;
      if (state.startDate !== action.payload.idx) {
        state.longArr = action.payload.longArr;
      }
    },

    setDate(state, action) {
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
    },

    inputList(state, action) {
      state.changed = true;
      const arr = [...state.userData];
      console.log(state.userData);
      console.log(arr);
      console.log(state.userIndex);
      console.log(arr[state.userIndex]);
      // return { idx : '~~', todo: []} or undefined
      const result = arr[state.userIndex].schedule.find(
        (item) => item.idx === state.startDate
      );

      const index = arr[state.userIndex].schedule.indexOf(result);

      if (result) {
        // 존재하면
        result.todo = [
          ...result.todo,
          {
            startDate: state.startDate,
            endDate: state.endDate,
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

        result.todo.sort((a, b) => (a.index < b.index ? -1 : 1));
        arr[state.userIndex].schedule[index] = result;
      } else {
        // 해당 날짜가 schedule 배열에 없을 때, 즉 처음

        arr[state.userIndex].schedule = [
          ...arr[state.userIndex].schedule,
          {
            idx: state.startDate,
            todo: [
              {
                startDate: state.startDate,
                endDate: state.endDate,
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
      state.userData = [...arr];
      state.userSchedule = arr[state.userIndex];
    },

    longDateList(state, action) {
      state.changed = true;
      let leng = state.longArr.length;
      let count = state.dayIndex;

      console.log(state.startDate);
      console.log(state.endDate);

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
                startDate: state.startDate,
                endDate: state.endDate,
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
                  (100 - state.longArr.length),
                arr: state.longArr,
              },
            ];
            console.log("이곳인가??");
          } else {
            // 첫 째날이 아닌 그 이후 Date일 때,

            if (count === 1) {
              // 시작 날 기준 다음주로 넘어갈 때, 일요일의 경우(count = 1) 남은 length만큼 표시
              const Leng = leng >= 7 ? 7 : leng; //시작 날 기준 다다음주 까지 넘어가는지

              state.schedule[index].todo = [
                ...state.schedule[index].todo,
                {
                  startDate: state.startDate,
                  endDate: state.endDate,
                  firstTime: action.payload.firstTime,
                  lastTime: action.payload.lastTime,
                  list: action.payload.list,
                  length: Leng,
                  isFake: false,
                  isLong: true,
                  style: false,
                  index:
                    "long" +
                    action.payload.firstTime +
                    action.payload.lastTime +
                    (100 - state.longArr.length),
                  arr: state.longArr,
                },
              ];
              console.log("이곳인가??");
            } else {
              state.schedule[index].todo = [
                ...state.schedule[index].todo,
                {
                  startDate: state.startDate,
                  endDate: state.endDate,
                  firstTime: action.payload.firstTime,
                  lastTime: action.payload.lastTime,
                  list: action.payload.list,
                  length: 1,
                  isFake: true,
                  isLong: true,
                  style: false,
                  index: "1",
                  arr: [i],
                },
              ];
              console.log("이곳인가??");
            }
          }
          state.schedule[index].todo.sort((a, b) =>
            a.index < b.index ? -1 : 1
          );
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
                    startDate: state.startDate,
                    endDate: state.endDate,
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
                      (100 - state.longArr.length),
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
                      startDate: state.startDate,
                      endDate: state.endDate,
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
                        (100 - state.longArr.length),
                      arr: state.longArr,
                    },
                  ],
                },
              ];
              console.log("hi!");
            } else {
              state.schedule = [
                ...state.schedule,
                {
                  idx: i,
                  todo: [
                    {
                      startDate: state.startDate,
                      endDate: state.endDate,
                      firstTime: action.payload.firstTime,
                      lastTime: action.payload.lastTime,
                      list: action.payload.list,
                      length: 1,
                      style: false,
                      isFake: true,
                      isLong: true,
                      index: "1",
                      arr: [i],
                    },
                  ],
                },
              ];
              console.log("hi!");
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

      console.log(state.startDate);
      console.log(state.endDate);

      if (state.schedule[index].todo[listIndex].arr.length === 1) {
        state.schedule[index].todo.splice(listIndex, 1);

        state.schedule[index].todo.length === 0 &&
          state.schedule.splice(index, 1);
      } else {
        const arr = state.schedule[index].todo[listIndex].arr;

        arr.map((items) => {
          let result;
          let listObject;
          let idx;
          if (items === arr[0]) {
            state.schedule[index].todo.splice(listIndex, 1);

            state.schedule[index].todo.length === 0 &&
              state.schedule.splice(index, 1);
          } else {
            result = state.schedule.find((item) => item.idx === items);
            listObject = result.todo.find((item) => item.isLong === true);

            idx = state.schedule.indexOf(result);
            const listIdx = result.todo.indexOf(listObject);

            state.schedule[idx].todo.splice(listIdx, 1);

            state.schedule[idx].todo.length === 0 &&
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
        startDate: action.payload.startDate,
        endDate: action.payload.endDate,
        firstTime: action.payload.firstTime,
        lastTime: action.payload.lastTime,
        list: action.payload.inputList,
        length: "1",
        style: false,
        isFake: false,
        isLong: false,
        index: action.payload.firstTime + action.payload.lastTime,
        arr: [action.payload.startDate],
      };

      arr[action.payload.index].todo.sort((a, b) =>
        a.firstTime < b.firstTime ? -1 : a.firstTime > b.firstTime ? 1 : 0
      );

      state.schedule = [...arr];
    },

    fetchFromData(state, action) {
      if (action.payload.length !== 0) {
        state.userData = action.payload;
      }
      console.log(state.userData);
    },

    createUser(state, action) {
      state.changed = true;
      state.isStart = true;
      state.name = action.payload.name;
      state.email = action.payload.email;
      const userIndex = state.userData.findIndex(
        (item) => item.email === action.payload.email
      );

      if (userIndex === -1) {
        // 신규 가입자 일 때,

        state.userData = [
          ...state.userData,
          {
            email: action.payload.email,
            name: action.payload.name,
            schedule: [""],
          },
        ];

        state.userIndex = state.userData.length - 1;
      } else {
        state.userIndex = userIndex;
      }
      state.userSchedule = state.userData[state.userIndex];
      console.log(state.userSchedule);
    },

    confirmUser(state, action) {
      console.log("login 작동");
      // state.isStart = true;
      const userIndex = state.userData.findIndex(
        (item) => item.email === action.payload.email
      );

      state.userIndex = userIndex;
      state.userSchedule = state.userData[userIndex];

      console.log(state.userIndex);
      console.log(state.userIndex);
      console.log(state.userSchedule);
    },

    setUserInfo(state, action) {
      const userIndex = state.userData.findIndex(
        (item) => item.email === action.payload.userEmail
      );

      state.userIndex = userIndex;
      state.userSchedule = state.userData[userIndex];

    },

    toggleChanged(state) {
      state.changed = false;
      state.isStart = false;
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
