import { createSlice } from "@reduxjs/toolkit";

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
        // 회원일 때,
        state.userIndex = userIndex;
      }
      state.userSchedule = state.userData[state.userIndex];
      state.isLoading = false;
    },

    confirmUser(state, action) {
      const userIndex = state.userData.findIndex(
        (item) => item.email === action.payload.email
      );

      if (userIndex !== -1) {
        state.userSchedule = state.userData[userIndex];
        state.userIndex = userIndex;
        state.isLogin = true;
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

    onModal(state) {
      state.isVisible = true;
    },

    offModal(state) {
      state.isVisible = false;
      state.startDate = "";
      state.endDate = "";
      state.week = "";
      state.dayIndex = "";
      state.longArrChanged = false;
      state.longArr = [];
    },

    setDate(state, action) {
      state.week = action.payload.week;
      state.dayIndex = action.payload.day;
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
      state.longArr = action.payload.arr;
    },

    clickedDate(state, action) {
      state.longArrChanged = true;

      // second-makeCaldner.js에서 endDate 설정시
      if (action.payload.type === "end") {
        state.endDate = action.payload.idx;
        state.longArr = action.payload.longArr;
        return; // 리듀서 함수 종료
      }
      // 모달창 생성시 endDate는 ''이므로 startDate === endDate로 설정해준다.
      if (state.endDate === "") {
        state.endDate = action.payload.idx;
      }

      state.startDate = action.payload.idx;
      state.week = action.payload.week;
      state.dayIndex = action.payload.dayIndex;

      // makeCalender.js에서 addClickHandler type = 'add'
      //type, idx, dayIndex, week
      if (action.payload.type === "add") {
        state.isVisible = true;
        return;
      }
      // type === 'start' 인 경우에 longArr 설정해준다.
      state.longArr = action.payload.longArr;
    },

    inputList(state, action) {
      state.changed = true;
      const array = [...state.userData];

      const startDate = state.startDate.split("-"); // ['year', 'month', 'date']
      const timeArray = action.payload.key[3].slice(0, 8).split(":");

      //우선 파이어베이스 realtime db때문에 schedule: ['']라고 정의한 첫 번째 요소 삭제
      if (array[state.userIndex].schedule[0] === "") {
        array[state.userIndex].schedule.splice(0, 1);
      }

      // return { idx : '~~', todo: []} or undefined
      const index = array[state.userIndex].schedule.findIndex(
        (item) => item.idx === state.startDate
      );

      const key =
        `${startDate[0]}` + // startDate Year
        `${10 + +startDate[1]}` + // startDate month
        `${10 + +startDate[2]}` + // startDate date
        "9999" +
        action.payload.startTime +
        action.payload.endTime +
        `${action.payload.key[0]}` + //now year
        `${99 - action.payload.key[1]}` + //now month
        `${99 - action.payload.key[2]}` + //now date
        `${24 - +timeArray[0]}` +
        `${60 - +timeArray[1]}` +
        `${60 - +timeArray[2]}`;

      const object = {
        startDate: state.startDate,
        endDate: state.endDate,
        startTime: action.payload.startTime,
        endTime: action.payload.endTime,
        title: action.payload.title,
        style: false,
        color: action.payload.color,
        index: key,
        arr: [state.startDate],
        length: 1,
        isShort: true,
        isStart: false,
        isMiddle: false,
        isEnd: false,
        isLong: false,
      };

      if (index !== -1) {
        // 존재하면
        array[state.userIndex].schedule[index].todo = [
          ...array[state.userIndex].schedule[index].todo,
          {
            ...object,
          },
        ];

        array[state.userIndex].schedule[index].todo.sort((a, b) =>
          a.index < b.index ? -1 : 1
        );
      } else {
        // 해당 날짜가 schedule 배열에 없을 때, 즉 해당 날짜에 처음 일정을 입력할 때

        array[state.userIndex].schedule = [
          ...array[state.userIndex].schedule,
          {
            idx: state.startDate,
            todo: [
              {
                ...object,
              },
            ],
          },
        ];
      }
      state.userData = [...array];
      state.userSchedule = array[state.userIndex];
      state.longArrChanged = false;
    },

    longDateList(state, action) {
      state.changed = true;

      let dummyUserData = [...state.userData];

      const startDate = state.startDate.split("-");
      const timeArray = action.payload.key[3].slice(0, 8).split(":");

      // 일정을 입력할 때, 날짜 조정이 없을 경우 액션값, 날짜 조정을 하면 state.longArr의 값을..
      const arr = state.longArr;

      let leng = arr.length;

      let count = state.dayIndex;

      // {email: '', name: '', schedule: [...]} 깊은 복사
      let userSchedule = JSON.parse(JSON.stringify(state.userSchedule));

      const key =
        `${startDate[0]}` + // startDate Year
        `${10 + +startDate[1]}` + // startDate month
        `${10 + +startDate[2]}` + // startDate date
        `${5000 - arr.length}` +
        action.payload.startTime +
        action.payload.endTime +
        `${action.payload.key[0]}` + //now year
        `${99 - action.payload.key[1]}` + //now month
        `${99 - action.payload.key[2]}` + //now date
        `${24 - +timeArray[0]}` +
        `${60 - +timeArray[1]}` +
        `${60 - +timeArray[2]}`;

      if (userSchedule.schedule[0] === "") {
        console.log("working");
        userSchedule.schedule.splice(0, 1);
      }

      const object = {
        startDate: state.startDate,
        endDate: state.endDate,
        startTime: action.payload.startTime,
        endTime: action.payload.endTime,
        title: action.payload.title,
        style: false,
        color: action.payload.color,
        isShort: false,
        index: key,
        arr,
      };

      for (let i of arr) {
        const index = userSchedule.schedule.findIndex((item) => item.idx === i);

        // schedule에서 longArr배열에 있는 i 가 존재할 때, 즉 기존 일정이 있을 때!
        if (index !== -1) {
          if (i === state.startDate) {
            // longDate의 첫 째날 일 때,
            const Leng = leng - 8 + count > 0 ? 8 - count : leng;
            // console.log(count);
            // { idx: '', todo: [~~] }
            userSchedule.schedule[index].todo = [
              ...userSchedule.schedule[index].todo,
              {
                ...object,
                length: Leng,
                isLong: true,
                isStart: true,
                isMiddle: false,
                isEnd: false,
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
                  ...object,
                  length: Leng,
                  isLong: true,
                  isStart: leng === 1 ? false : true,
                  isMiddle: false,
                  isEnd: true,
                },
              ];
            } else {
              // 일요일이 아닌 요일
              userSchedule.schedule[index].todo = [
                ...userSchedule.schedule[index].todo,
                {
                  ...object,
                  length: 1,
                  isLong: false,
                  isStart: false,
                  isMiddle: true,
                  isEnd: leng === 1 ? true : false,
                },
              ];
            }
          }
          // 오름차순 정렬
          userSchedule.schedule[index].todo.sort((a, b) =>
            a.index < b.index ? -1 : 1
          );
        }

        // 다시 돌아와서, schedule에 longArr에 있는 날짜에 일정이 없을 때,
        if (index === -1) {
          // i가 longDate의 첫 째날 일 때,
          if (i === state.startDate) {

            const Leng = leng - 8 + count > 0 ? 8 - count : leng;

            userSchedule.schedule = [
              ...userSchedule.schedule,
              {
                idx: i,
                todo: [
                  {
                    ...object,
                    length: Leng,
                    isLong: true,
                    isStart: leng === 1 ? false : true,
                    isMiddle: false,
                    isEnd: true,
                  },
                ],
              },
            ];
          } else {
            if (count === 1) {

              const Leng = leng >= 7 ? 7 : leng;

              userSchedule.schedule = [
                ...userSchedule.schedule,
                {
                  idx: i,
                  todo: [
                    {
                      ...object,
                      length: Leng,
                      isLong: true,
                      isStart: leng === 1 ? false : true,
                      isMiddle: false,
                      isEnd: true,
                    },
                  ],
                },
              ];
            } else {

              userSchedule.schedule = [
                ...userSchedule.schedule,
                {
                  idx: i,
                  todo: [
                    {
                      ...object,
                      color: action.payload.color,
                      length: 1,
                      isLong: false,
                      isStart: false,
                      isMiddle: true,
                      isEnd: leng === 1 ? true : false,
                    },
                  ],
                },
              ];
            }
          }
        }
        leng -= 1;
        count = count === 7 ? 1 : count + 1;
      } // for 문 끝.
      // userSchedule.schedule.sort((a, b) => a.idx <)
      state.userSchedule = userSchedule;
      dummyUserData[state.userIndex] = userSchedule;
      state.userData = [...dummyUserData];
      state.longArrChanged = false;
    },

    removeList(state, action) {
      state.changed = true; // fetch (put)

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
