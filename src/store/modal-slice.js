import { createSlice, current } from "@reduxjs/toolkit";

const modalSlice = createSlice({
  name: "modal",
  initialState: {
    isVisible: false,
    isLogin: false,
    isLoading: true,
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
    fetchFromData(state, action) {
      console.log("패치");
      if (action.payload.length !== 0) {
        state.userData = action.payload;
      }
      console.log(action.payload);
    },

    createUser(state, action) {
      state.changed = true;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.isLogin = true;

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
      state.isLoading = false;
    },

    confirmUser(state, action) {
      console.log('??')
      console.log(current(state.userData))
      const userIndex = state.userData.findIndex(
        (item) => item.email === action.payload.email
      );
      console.log(userIndex)
      console.log(state.userData);
      console.log(action.payload.email);
      console.log(userIndex);

      if (userIndex !== -1) {
        state.isLogin = true;
        state.userIndex = userIndex;
        state.userSchedule = state.userData[userIndex];
        state.isLoading = false;
      }
    },

    toggleChanged(state) {
      state.changed = false;
    },

    logout(state) {
      state.isLogin = false;
    },

    LoadingState(state) {
      state.isLoading = true;
    },

    listDone(state, action) {
      state.changed = true;

      const index = action.payload.index;
      const listIndex = action.payload.listIndex;

      let dummyUserData = [...state.userData];
      let userSchedule = [...state.userSchedule.schedule];

      const dateArr = userSchedule[index].todo[listIndex].arr;
      const identifyIndex = userSchedule[index].todo[listIndex].index;

      let itemsIdx;
      let listIdx;

      for (const items of dateArr) {
        itemsIdx = userSchedule.findIndex((item) => item.idx === items);

        listIdx = userSchedule[itemsIdx].todo.findIndex(
          (item) => item.index === identifyIndex
        );

        userSchedule[itemsIdx].todo[listIdx].style =
          !userSchedule[itemsIdx].todo[listIdx].style;
      }

      dummyUserData[state.userIndex].schedule = userSchedule;

      state.userData = [...dummyUserData];
      state.userSchedule = {
        email: state.userSchedule.email,
        name: state.userSchedule.name,
        schedule: [...userSchedule],
      };
    },

    resetState(state) {
      state.longArr = "";
      state.dayIndex = "";
      // state.endDate = "";
    },

    onModal(state) {
      state.isVisible = true;
    },

    offModal(state) {
      state.isVisible = false;
      state.startDate = '';
      state.endDate = '';
      state.week = '';
      state.dayIndex = '';
      state.longArrChanged = false;
    },

    setDate(state, action) {
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
    },

    clickedStartDate(state, action) {
      if (action.payload.type === 'add') {
        state.isVisible = true;
      }
      
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

    inputList(state, action) {
      state.changed = true;
      const arr = [...state.userData];

      const startDate = state.startDate.split('-') // ['year', 'month', 'date']
      
      //우선 파이어베이스 realtime db때문에 schedule: ['']라고 정의한 첫 번째 요소 삭제
      if (arr[state.userIndex].schedule[0] === "") {
        arr[state.userIndex].schedule.splice(0, 1);
      }

      // return { idx : '~~', todo: []} or undefined
      const index = arr[state.userIndex].schedule.findIndex(
        (item) => item.idx === state.startDate
      );

      const key =
        `${startDate[0]}` + // startDate Year
        `${99 - +startDate[1]}` + // startDate month
        `${99 - +startDate[2]}` + // startDate date
        '1000' +
        `${action.payload.key[0]}` + //now year
        `${87 + action.payload.key[1]}` + //now month
        `${68 + action.payload.key[2]}` + //now date
        action.payload.key[3]; // now time

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
            color: action.payload.color,
            length: 1,
            isStart: false,
            isMiddle: false,
            isEnd: false,
            isLong: false,
            isShort: true,
            index: key,
            arr: [state.startDate],
          },
        ];

        arr[state.userIndex].schedule[index].todo.sort((a, b) =>
          a.index < b.index ? 1 : -1
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
                color: action.payload.color,
                length: 1,
                isStart: false,
                isMiddle: false,
                isEnd: false,
                isLong: false,
                isShort: true,
                index: key,
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

      const startDate = state.startDate.split('-');
      // 일정을 입력할 때, 날짜 조정이 없을 경우 액션값, 날짜 조정을 하면 state.longArr의 값을..
      const arr = state.longArrChanged
        ? state.longArr || action.payload.longArr
        : action.payload.longArr;
      console.log(action.payload.longArr);
      console.log(state.longArr)
      let leng = arr.length;

      // longDateList는 AddEvent와 List.js에서 사용됨
      // AddEvent.js에서는 리스트를 첫 생성하므로 state.dayIndex의 값을 사용.
      // List.js는 클릭한 리스트의 dayIndex를 받아와야 함. 안 그러면 마지막으로 생성했던 state.dayIndex 값이 사용됨.
      let count = state.longArrChanged
        ? state.dayIndex || action.payload.dayIndex
        : action.payload.dayIndex;

      console.log(leng);
      console.log(action.payload.dayIndex);
      console.log(state.dayIndex);
      console.log(count);
 
      // {email: '', name: '', schedule: [...]} 깊은 복사
      let userSchedule = JSON.parse(JSON.stringify(state.userSchedule));
      console.log(userSchedule)
      const key = 
        `${startDate[0]}` + // startDate Year
        `${99 - +startDate[1]}` + // startDate month
        `${99 - +startDate[2]}` + // startDate date
        `${1000 + arr.length}` +
        `${action.payload.key[0]}` + //now year
        `${87 + action.payload.key[1]}` + //now month
        `${68 + action.payload.key[2]}` + //now date
        action.payload.key[3]; // now time

      if (userSchedule.schedule[0] === '') {
        console.log("working");
        userSchedule.schedule.splice(0, 1);
      }
      console.log(userSchedule)
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
                color: action.payload.color,
                length: Leng,
                isStart: true,
                isEnd: false,
                isMiddle: false,
                isLong: true,
                isShort: false,
                index: key,
                arr,
              },
            ];
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
                  isStart: leng === 1 ? false : true,
                  isMiddle: false,
                  isEnd: true,
                  isLong: true,
                  style: false,
                  color: action.payload.color,
                  index: key,
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
                  isMiddle: true,
                  isLong: false,
                  isShort: false,
                  style: false,
                  color: action.payload.color,
                  index: key,
                  arr,
                },
              ];
              // console.log(current(schedule));
            }
          }

          userSchedule.schedule[index].todo.sort((a, b) =>
            a.index < b.index ? 1 : -1
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
                    color: action.payload.color,
                    isStart: leng === 1 ? false : true,
                    isMiddle: false,
                    isEnd: true,
                    isLong: true,
                    isShort: false,
                    index: key,
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
                      color: action.payload.color,
                      isStart: leng === 1 ? false : true,
                      isMiddle: false,
                      isEnd: true,
                      isLong: true,
                      isShort: false,
                      index: key,
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
                      color: action.payload.color,
                      isStart: false,
                      isMiddle: true,
                      isEnd: leng === 1 ? true : false,
                      isLong: false,
                      isShort: false,
                      index: key,
                      arr,
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
      console.log("remove!");
      let dummyUserData = [...state.userData];
      //{email: '', name: '', schedule: [~~]} 에서 schedule
      // userSchedule = [{idx: '~', todo: [...] }, ...]
      let userSchedule = JSON.parse(
        JSON.stringify(state.userSchedule.schedule)
      );

      // userSchedule 내부 {idx: '', todo: []}의 인덱스
      const index = action.payload.index;
      const listIndex = action.payload.listIndex; // todo 내부 {~~}의 인덱스

      //당일 계획 삭제할 때,
      if (userSchedule[index].todo[listIndex].arr.length === 1) {
        userSchedule[index].todo.splice(listIndex, 1);
        // todo가 비어있는 배열이라면 ex){idx: '~', todo: []} 필요가 없으니 삭제
        userSchedule[index].todo.length === 0 && userSchedule.splice(index, 1);
      } else {
        // 하루가 아닌 여러 날짜를 삭제할 때,
        const Array = userSchedule[index].todo[listIndex].arr;
        const identifyIndex = userSchedule[index].todo[listIndex].index;

        let itemsIdx;
        let listIdx;

        for (const items of Array) {
          itemsIdx = userSchedule.findIndex((item) => item.idx === items);

          listIdx = userSchedule[itemsIdx].todo.findIndex(
            (item) => item.index === identifyIndex
          );

          userSchedule[itemsIdx].todo.splice(listIdx, 1);

          userSchedule[itemsIdx].todo.length === 0 &&
            userSchedule.splice(itemsIdx, 1);
        }
      }

      // firebase realtimeDB에서 (schedule: [''])형태를 남기기 위함
      if (userSchedule.length === 0) {
        userSchedule = [""];
      }

      dummyUserData[state.userIndex].schedule = userSchedule;
      state.userData = [...dummyUserData];
      state.userSchedule = {
        email: state.userSchedule.email,
        name: state.userSchedule.name,
        schedule: [...userSchedule],
      };
    },
  },
});

export const modalActions = modalSlice.actions;

export default modalSlice;
