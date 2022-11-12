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
      if (state.endDate === action.payload.idx || state.endDate.length === 0) {
        state.endDate = action.payload.idx;
      }
    },

    clickedLastDate(state, action) {
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
              state.dayIndex +
              "99" +
              action.payload.startTime +
              action.payload.endTime,
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
                  state.dayIndex +
                  "99" +
                  action.payload.startTime +
                  action.payload.endTime,
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
      const fixDayIndex = state.dayIndex;

      // {email: '', name: '', schedule: [...]}
      let userSchedule = state.userData[state.userIndex];

      if (userSchedule.schedule[0] === "") {
        userSchedule.schedule.splice(0, 1);
      }

      for (let i of state.longArr) {
        const index = userSchedule.schedule.findIndex((item) => item.idx === i);

        if (index !== -1) {
          // schedule에서 longArr배열에 있는 i 가 존재할 때, 즉 기존 일정이 있을 때!
          if (i === state.startDate) {
            // longDate의 첫 째날 일 때,
            const Leng = leng - 8 + count > 0 ? 8 - count : leng;
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
                  (100 - state.longArr.length) +
                  action.payload.startTime +
                  action.payload.endTime,
                arr: state.longArr,
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
                  isStart: false,
                  isFake: false,
                  isEnd: leng === 1 ? true : false,
                  isLong: true,
                  style: false,
                  index:
                  `${fixDayIndex}` +
                    (100 - state.longArr.length) +
                    action.payload.startTime +
                    action.payload.endTime,
                  arr: state.longArr,
                },
              ];
            } else {
              console.log(current(userSchedule.schedule[index]));
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
                  `${fixDayIndex}` +
                    (100 - state.longArr.length) +
                    action.payload.startTime +
                    action.payload.endTime,
                  arr: [i],
                },
              ];
              console.log(current(userSchedule.schedule[index]));
            }
          }

          userSchedule.schedule[index].todo.sort((a, b) =>
            a.index < b.index ? -1 : 1
          );
        } else {
          // 다시 돌아와서, schedule에 longArr에 있는 날짜에 일정이 없을 때,
          if (i === state.startDate) {
            // i가 longDate의 첫 째날 일 때,
            const Leng =
              leng - 8 + state.dayIndex > 0 ? 8 - state.dayIndex : leng;

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
                    `${fixDayIndex}` +
                      (100 - state.longArr.length) +
                      action.payload.startTime +
                      action.payload.endTime,
                    arr: state.longArr,
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
                      `${fixDayIndex}` +
                        (100 - state.longArr.length) +
                        action.payload.startTime +
                        action.payload.endTime,
                      arr: state.longArr,
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
                      `${fixDayIndex}` +
                        (100 - state.longArr.length) +
                        action.payload.startTime +
                        action.payload.endTime,
                      arr: [i],
                    },
                  ],
                },
              ];
            }
          }
        }
        leng -= 1;
        console.log(count);
        count = count === 7 ? 1 : count + 1;
        console.log(current(userSchedule));
      }
      state.userSchedule = userSchedule;
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

        let result;
        let listObject;
        let idx;

        Array.forEach((items) => {
          if (items === Array[0]) {
            // Array[0] === startDate, 즉 시작 날일 때 삭제
            userSchedule[index].todo.splice(listIndex, 1);

            // todo가 비어있는 배열이라면 {idx: '', todo: []} 삭제
            userSchedule[index].todo.length === 0 &&
              userSchedule.splice(index, 1);
          } else {
            result = userSchedule.find((item) => item.idx === items);

            listObject = result.todo.find(
              (item) => item.index === identifyIndex
            );

            idx = userSchedule.indexOf(result);

            const listIdx = result.todo.indexOf(listObject);

            userSchedule[idx].todo.splice(listIdx, 1);

            userSchedule[idx].todo.length === 0 && userSchedule.splice(idx, 1);
          }
          // console.log(current(userSchedule));
        });
      }

      // firebase realtimeDB에서 schedule: ['']을 남기기 위함
      if (userSchedule.length === 0) {
        userSchedule = [""];
      } else {
        //longDate를 삭제한 후, todo 배열안에 longDate가 있다면
        // todo.listIndex를 수정해줘야함.
        // userSchedule[listIndex].todo.map((item, index) => item.isLong ? );
        // console.log(result);
      }

      dummyUserData[state.userIndex].schedule = userSchedule;
      state.userData = [...dummyUserData];
      state.userSchedule.schedule = userSchedule;
    },

    // editList(state, action) {
    //   state.changed = true;

    //   const index = action.payload.index;
    //   const listIndex = action.payload.listIndex;
    //   console.log(index)
    //   console.log(listIndex);
    //   const userIndex = state.userIndex;

    //   let dummyUserData = [...state.userData];

    //   dummyUserData[userIndex].schedule[index].todo[listIndex] = {
    //     startDate: action.payload.startDate,
    //     endDate: action.payload.endDate,
    //     firstTime: action.payload.firstTime,
    //     lastTime: action.payload.lastTime,
    //     list: action.payload.inputList,
    //     length: "1",
    //     style: false,
    //     isFake: false,
    //     isLong: false,
    //     index: action.payload.firstTime + action.payload.lastTime,
    //     arr: [action.payload.startDate],
    //   };

    //   dummyUserData[userIndex].schedule[index].todo.sort((a, b) =>
    //     a.firstTime < b.firstTime ? -1 : a.firstTime > b.firstTime ? 1 : 0
    //   );

    //   state.userData = [...dummyUserData];
    //   state.userSchedule = dummyUserData[userIndex];
    // },

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
  },
});

export const modalActions = modalSlice.actions;

export default modalSlice;
