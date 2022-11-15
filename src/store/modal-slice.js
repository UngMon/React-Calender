import { createSlice, current } from "@reduxjs/toolkit";

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
    longArrChanged: false,
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
      state.week = action.payload.week;
      state.dayIndex = action.payload.dayIndex;
      state.longArr = action.payload.longArr;
      state.longArrChanged = true;
      if (state.endDate === action.payload.idx || state.endDate.length === 0) {
        state.endDate = action.payload.idx;
      }
    },

    clickedLastDate(state, action) {
      state.endDate = action.payload.idx;
      state.longArrChanged = true;
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

      // ['year', 'month', 'date']
      const startDateArr = state.startDate.split(".");

      //우선 파이어베이스 realtime db때문에 schedule: ['']라고 정의한 첫 번째 요소 삭제
      if (arr[state.userIndex].schedule[0] === "") {
        arr[state.userIndex].schedule.splice(0, 1);
      }

      // return { idx : '~~', todo: []} or undefined
      const index = arr[state.userIndex].schedule.findIndex(
        (item) => item.idx === state.startDate
      );

      if (index !== -1) {
        // 존재하면
        arr[state.userIndex].schedule[index].todo = [
          ...arr[state.userIndex].schedule[index].todo,
          {
            startDate: state.startDate,
            endDate: state.endDate,
            startTime: action.payload.startTime,
            endTime: action.payload.endTime,
            title: action.payload.title,
            style: false,
            length: 99,
            isStart: false,
            isFake: false,
            isEnd: false,
            isLong: false,
            index:
              startDateArr[0] +
              (87 + +startDateArr[1]) +
              (68 + +startDateArr[2]) +
              "99" +
              action.payload.startTime +
              action.payload.endTime +
              action.payload.title,
            arr: [state.startDate],
          },
        ];

        arr[state.userIndex].schedule[index].todo.sort((a, b) =>
          a.index < b.index ? -1 : 1
        );
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
                startTime: action.payload.startTime,
                endTime: action.payload.endTime,
                title: action.payload.title,
                style: false,
                length: 1,
                isStart: false,
                isFake: false,
                isEnd: false,
                isLong: false,
                index:
                  startDateArr[0] +
                  (87 + +startDateArr[1]) +
                  (68 + +startDateArr[2]) +
                  "99" +
                  action.payload.startTime +
                  action.payload.endTime +
                  action.payload.title,
                arr: [state.startDate],
              },
            ],
          },
        ];
      }
      state.userData = [...arr];
      state.userSchedule = arr[state.userIndex];
      state.longArrChanged = false;
    },

    longDateList(state, action) {
      state.changed = true;

      let dummyUserData = [...state.userData];
      // 일정을 입력할 때, 날짜 조정이 없을 경우 액션값, 날짜 조정을 하면 state.longArr의 값을..
      const arr = state.longArrChanged
        ? state.longArr || action.payload.longArr
        : action.payload.longArr;
      let leng = arr.length;

      const startDateArr = arr[0].split(".");

      // longDateList는 AddEvent와 List.js에서 사용됨
      // AddEvent.js에서는 리스트를 첫 생성하므로 state.dayIndex의 값을 사용.
      // List.js는 클릭한 리스트의 dayIndex를 받아와야 함. 안 그러면 마지막으로 생성했던 state.dayIndex 값이 사용됨.
      let count = state.longArrChanged
        ? state.dayIndex || action.payload.dayIndex
        : action.payload.dayIndex;
      const fixDayIndex = state.longArrChanged
        ? state.dayIndex || action.payload.dayIndex
        : action.payload.dayIndex;

      // console.log(action.payload.longArr);
      // console.log(current(state.longArr));
      // console.log(leng);
      // console.log(action.payload.dayIndex);
      // console.log(state.dayIndex);
      // console.log(count);

      // {email: '', name: '', schedule: [...]}
      let userSchedule = JSON.parse(JSON.stringify(state.userSchedule));

      if (userSchedule.schedule[0] === "") {
        userSchedule.schedule.splice(0, 1);
      }

      for (let i of arr) {
        const index = userSchedule.schedule.findIndex((item) => item.idx === i);
        // console.log(i);
        if (index !== -1) {
          // schedule에서 longArr배열에 있는 i 가 존재할 때, 즉 기존 일정이 있을 때!
          if (i === state.startDate) {
            // longDate의 첫 째날 일 때,
            const Leng = leng - 8 + count > 0 ? 8 - count : leng;
            // console.log(count);
            // { idx: '', todo: [~~] }
            userSchedule.schedule[index].todo = [
              ...userSchedule.schedule[index].todo,
              {
                startDate: state.startDate,
                endDate: state.endDate,
                startTime: action.payload.startTime,
                endTime: action.payload.endTime,
                title: action.payload.title,
                style: false,
                length: Leng,
                isStart: true,
                isEnd: false,
                isFake: false,
                isLong: true,
                index:
                  `${fixDayIndex}` +
                  (100 - arr.length) +
                  action.payload.startTime +
                  action.payload.endTime +
                  state.endDate +
                  action.payload.title,
                arr,
              },
            ];
            // console.log(current(schedule));
          } else {
            // 첫 째날이 아닌 그 이후 Date일 때,

            if (count === 1) {
              // 시작 날 기준 다음주로 넘어갈 때, 일요일의 경우(count = 1) 남은 length만큼 표시
              const Leng = leng >= 7 ? 7 : leng; //시작 날 기준 다다음주 까지 넘어가는지

              userSchedule.schedule[index].todo = [
                ...userSchedule.schedule[index].todo,
                {
                  startDate: state.startDate,
                  endDate: state.endDate,
                  startTime: action.payload.startTime,
                  endTime: action.payload.endTime,
                  title: action.payload.title,
                  length: Leng,
                  isStart: false,
                  isFake: false,
                  isEnd: leng === 1 ? true : false,
                  isLong: true,
                  style: false,
                  index:
                    startDateArr[0] +
                    (87 + +startDateArr[1]) +
                    (68 + +startDateArr[2]) +
                    (100 - arr.length) +
                    action.payload.startTime +
                    action.payload.endTime +
                    state.endDate +
                    action.payload.title,
                  arr,
                },
              ];
              // console.log(current(schedule));
            } else {
              userSchedule.schedule[index].todo = [
                ...userSchedule.schedule[index].todo,
                {
                  startDate: state.startDate,
                  endDate: state.endDate,
                  startTime: action.payload.startTime,
                  endTime: action.payload.endTime,
                  title: action.payload.title,
                  length: 1,
                  isStart: false,
                  isEnd: leng === 1 ? true : false,
                  isFake: true,
                  isLong: false,
                  style: false,
                  index:
                    startDateArr[0] +
                    (87 + +startDateArr[1]) +
                    (68 + +startDateArr[2]) +
                    (100 - arr.length) +
                    action.payload.startTime +
                    action.payload.endTime +
                    state.endDate +
                    action.payload.title,
                  arr: [i],
                },
              ];
              // console.log(current(schedule));
            }
          }

          userSchedule.schedule[index].todo.sort((a, b) =>
            a.index < b.index ? -1 : 1
          );
        } else {
          // 다시 돌아와서, schedule에 longArr에 있는 날짜에 일정이 없을 때,
          if (i === state.startDate) {
            // i가 longDate의 첫 째날 일 때,

            const Leng = leng - 8 + count > 0 ? 8 - count : leng;

            userSchedule.schedule = [
              ...userSchedule.schedule,
              {
                idx: i,
                todo: [
                  {
                    startDate: state.startDate,
                    endDate: state.endDate,
                    startTime: action.payload.startTime,
                    endTime: action.payload.endTime,
                    title: action.payload.title,
                    length: Leng,
                    style: false,
                    isStart: true,
                    isEnd: false,
                    isFake: false,
                    isLong: true,
                    index:
                      startDateArr[0] +
                      (87 + +startDateArr[1]) +
                      (68 + +startDateArr[2]) +
                      (100 - arr.length) +
                      action.payload.startTime +
                      action.payload.endTime +
                      state.endDate +
                      action.payload.title,
                    arr,
                  },
                ],
              },
            ];
            // console.log(current(schedule));
          } else {
            if (count === 1) {
              const Leng = leng >= 7 ? 7 : leng;
              userSchedule.schedule = [
                ...userSchedule.schedule,
                {
                  idx: i,
                  todo: [
                    {
                      startDate: state.startDate,
                      endDate: state.endDate,
                      startTime: action.payload.startTime,
                      endTime: action.payload.endTime,
                      title: action.payload.title,
                      length: Leng,
                      style: false,
                      isStart: false,
                      isEnd: leng === 1 ? true : false,
                      isFake: false,
                      isLong: true,
                      index:
                        startDateArr[0] +
                        (87 + +startDateArr[1]) +
                        (68 + +startDateArr[2]) +
                        (100 - arr.length) +
                        action.payload.startTime +
                        action.payload.endTime +
                        state.endDate +
                        action.payload.title,
                      arr,
                    },
                  ],
                },
              ];
              // console.log(current(schedule));
            } else {
              userSchedule.schedule = [
                ...userSchedule.schedule,
                {
                  idx: i,
                  todo: [
                    {
                      startDate: state.startDate,
                      endDate: state.endDate,
                      startTime: action.payload.startTime,
                      endTime: action.payload.endTime,
                      title: action.payload.title,
                      length: 1,
                      style: false,
                      isStart: false,
                      isEnd: leng === 1 ? true : false,
                      isFake: true,
                      isLong: false,
                      index:
                        startDateArr[0] +
                        (87 + +startDateArr[1]) +
                        (68 + +startDateArr[2]) +
                        (100 - arr.length) +
                        action.payload.startTime +
                        action.payload.endTime +
                        state.endDate +
                        action.payload.title,
                      arr: [i],
                    },
                  ],
                },
              ];
              // console.log(current(schedule));
            }
          }
        }
        leng -= 1;
        count = count === 7 ? 1 : count + 1;
      }
      state.userSchedule = userSchedule;
      dummyUserData[state.userIndex] = userSchedule;
      state.userData = [...dummyUserData];
      state.longArrChanged = false;
    },

    removeList(state, action) {
      state.changed = true; // fetch (put)

      let dummyUserData = [...state.userData];
      //{email: '', name: '', schedule: [~~]} 에서 schedule
      // userSchedule = [... {idx: '~', todo: [...] }, ...]
      let userSchedule = state.userSchedule.schedule;

      // userSchedule 내부 {idx: '', todo: []}의 인덱스
      const index = action.payload.index;
      const listIndex = action.payload.listIndex; // todo 내부 {~~}의 인덱스

      //하루를 삭제할 때,
      if (userSchedule[index].todo[listIndex].arr.length === 1) {
        userSchedule[index].todo.splice(listIndex, 1);
        console.log("여기?");
        // todo가 비어있는 배열이라면 ex){idx: '~', todo: []} 필요가 없으니 삭제
        userSchedule[index].todo.length === 0 && userSchedule.splice(index, 1);
      } else {
        // 하루가 아닌 여러 날짜를 삭제할 때,
        const Array = userSchedule[index].todo[listIndex].arr;
        const identifyIndex = userSchedule[index].todo[listIndex].index;
        console.log(Array);
        console.log(index);
        console.log(listIndex);
        let itemsIdx;
        let listIdx;

        Array.forEach((items) => {
          if (items === Array[0]) {
            // Array[0] === startDate, 즉 시작 날일 때 삭제
            userSchedule[index].todo.splice(listIndex, 1);
            // console.log(items);
            // todo가 비어있는 배열이라면 {idx: '', todo: []} 삭제
            userSchedule[index].todo.length === 0 &&
              userSchedule.splice(index, 1);
          } else {
            itemsIdx = userSchedule.findIndex((item) => item.idx === items);
            // console.log(identifyIndex);

            listIdx = userSchedule[itemsIdx].todo.findIndex(
              (item) => item.index === identifyIndex
            );

            userSchedule[itemsIdx].todo.splice(listIdx, 1);
            // console.log(current(userSchedule));
            // console.log(itemsIdx);
            // console.log(listIdx);
            // console.log(current(slice));

            userSchedule[itemsIdx].todo.length === 0 &&
              userSchedule.splice(itemsIdx, 1);
          }
        });
      }

      // firebase realtimeDB에서 schedule: ['']을 남기기 위함
      if (userSchedule.length === 0) {
        userSchedule = [""];
      }

      dummyUserData[state.userIndex].schedule = userSchedule;
      state.userData = [...dummyUserData];
      state.userSchedule.schedule = userSchedule;
    },

    fetchFromData(state, action) {
      if (action.payload.length !== 0) {
        state.userData = action.payload;
      }
      console.log(action.payload);
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
    },

    confirmUser(state, action) {
      console.log("login 작동");
      // state.isStart = true;
      const userIndex = state.userData.findIndex(
        (item) => item.email === action.payload.email
      );

      state.userIndex = userIndex;
      state.userSchedule = state.userData[userIndex];
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
      const index = action.payload.index;
      const listIndex = action.payload.listIndex;
      const userIndex = state.userIndex;
      let dummyUserData = [...state.userData];

      dummyUserData[userIndex].schedule[index].todo[listIndex].style =
        !dummyUserData[userIndex].schedule[index].todo[listIndex].style;

      state.userData = [...dummyUserData];
      state.userSchedule = dummyUserData[userIndex];
    },

    resetState(state) {
      state.longArr = "";
      state.dayIndex = "";
      state.endDate = "";
    },
  },
});

export const modalActions = modalSlice.actions;

export default modalSlice;
