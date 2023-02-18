import { createSlice } from "@reduxjs/toolkit";

const modalSlice = createSlice({
  name: "modal",
  initialState: {
    isVisible: false,
    isLogin: false,
    isLoading: true,
    isCreated: "",
    startDate: "",
    endDate: "",
    week: "",
    day: "",
    uid: "",
    dummyData: {},
    userSchedule: {},
    longArr: [],
    longArrChanged: false,
    changed: false,
  },
  reducers: {
    fetchFromData(state, action) {
      if (action.payload.userData === undefined) {
        // 신규 가입자라 realTimeDB에 정보가 없을 때,
        state.isCreated = false;
        return;
      }

      state.dummyData = { ...action.payload.userData };

      // 새로고침시 localStorage의 userInfo 정보를 이용해서
      // state.userSchedule에 object 저장
      if (action.payload.loginData !== undefined) {
        state.userSchedule = {
          ...action.payload.userData[action.payload.loginData.uid],
        };
        state.dummyData = {};
        state.isLogin = true;
        state.isLoading = false;
        state.uid = action.payload.loginData.uid;
      }
    },

    setUser(state, action) {
      // 신규 가입자 or 이메일 미인증 유저
      console.log("confirm");

      state.isLogin = true;
      state.isLoading = false;
      state.uid = action.payload.uid;

      if (state.dummyData[state.uid]) {
        state.userSchedule = { ...state.dummyData[state.uid] };
      } else {
        // 신규 가입자일 때, 유저 data를 생성하고 이후 app.js에서 sendScheduleData()에서
        // data 생성 요청을 수행함.
        state.changed = true;
        state.userSchedule = {
          email: action.payload.email,
          name: action.payload.name,
          schedule: { dummy: 1 },
        };
        state.isCreated = true;
      }
      state.dummyData = {};
    },

    toggleChanged(state) {
      state.changed = false;
    },

    logout(state) {
      state.isLogin = false;
      state.isCreated = "";
      state.startDate = "";
      state.endDate = "";
      state.week = "";
      state.day = "";
      state.uid = "";
      state.userSchedule = {};
    },

    LoadingState(state) {
      state.isLoading = true;
    },

    listDone(state, action) {
      const schedule = { ...state.userSchedule.schedule };
      const clickedDate = action.payload.date.split("-");
      const key = action.payload.key;

      const year = clickedDate[0];
      const month = clickedDate[1];
      const date = action.payload.date;

      const dateArray = schedule[year][month][date][key].arr;

      for (const item of dateArray) {
        const arr = item.split("-");
        const year = arr[0];
        const month = arr[1];

        schedule[year][month][item][key].style =
          !schedule[year][month][item][key].style;
      }

      state.userSchedule = {
        email: state.userSchedule.email,
        name: state.userSchedule.name,
        schedule,
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
      state.day = "";
      state.longArrChanged = false;
      state.longArr = [];
    },

    setDate(state, action) {
      state.day = action.payload.day;
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
      state.day = action.payload.day;

      // makeCalender.js에서 addClickHandler type = 'add'
      //type, idx, day, week
      if (action.payload.type === "add") {
        state.isVisible = true;
        return;
      }
      // type === 'start' 인 경우에 longArr 설정해준다.
      state.longArr = action.payload.longArr;
    },

    inputList(state, action) {
      state.changed = true;

      const array = { ...state.userSchedule.schedule };

      const startDate = state.startDate.split("-");
      const startTimeSplit = action.payload.startTime.split(" ");
      const endTimeSplit = action.payload.endTime.split(" ");

      const year = startDate[0];
      const month = startDate[1];
      const date = state.startDate;

      const startTime =
        `${startTimeSplit[0] === "오전" ? 1 : 2}` +
        startTimeSplit[1].split(":").join("") +
        "0";
      const endTime =
        `${endTimeSplit[0] === "오전" ? 1 : 2}` +
        endTimeSplit[1].split(":").join("");

      const start = startDate[0] + startDate[1] + startDate[2];
      const nowDate = action.payload.timeArr.slice(0, 3).join("");
      const nowTime = action.payload.timeArr[3].slice(0, 8).split(":").join("");

      const key =
        start +
        9999 +
        startTime +
        (30000 - endTime) +
        nowDate +
        (256161 - nowTime);

      const object = {
        startDate: state.startDate,
        endDate: state.endDate,
        startTime: action.payload.startTime,
        endTime: action.payload.endTime,
        title: action.payload.title,
        style: false,
        color: action.payload.color,
        key,
        arr: [state.startDate],
        length: 1,
        isStart: false,
        isMiddle: false,
        isEnd: false,
        isLong: false,
      };

      // 해당 연도에 아무런 일정이 없을 때,
      if (array[year] === undefined) {
        array[year] = {};
      }
      //해당 월에 아무런 일정이 없을 때,
      if (array[year][month] === undefined) {
        array[year][month] = {};
      }

      if (array[year][month][date] === undefined) {
        // 해당 날에 일정이 없을 때,
        array[year][month][date] = {};
        array[year][month][date][key] = { ...object };
      } else {
        //해당 날에 기존 일정이 있을 때,
        array[year][month][date][key] = { ...object };
        const newObj = Object.fromEntries(
          Object.entries(array[year][month][date]).sort(([a], [b]) => (a < b ? -1 : 1))
        );
        array[year][month][date] = newObj;
      }

      state.userSchedule = {
        email: state.userSchedule.email,
        name: state.userSchedule.name,
        schedule: { ...array },
      };
      state.longArrChanged = false;
    },

    longDateList(state, action) {
      state.changed = true;

      let schedule = { ...state.userSchedule.schedule };

      const startTimeSplit = action.payload.startTime.split(" ");
      const endTimeSplit = action.payload.endTime.split(" ");

      const startTime =
        `${startTimeSplit[0] === "오전" ? 1 : 2}` +
        startTimeSplit[1].split(":").join("");

      const endTime =
        `${endTimeSplit[0] === "오전" ? 1 : 2}` +
        endTimeSplit[1].split(":").join("");

      const nowDate = action.payload.timeArr.slice(0, 3).join("");
      const nowTime = action.payload.timeArr[3].slice(0, 8).split(":").join("");

      const arr = state.longArr;

      let leng = arr.length;

      let count = state.day;

      const key =
      state.startDate +
      (9999 - arr.length) +
      startTime +
      (30000 - endTime) +
      nowDate +
      (256161 - nowTime);

      const object = {
        startDate: state.startDate,
        endDate: state.endDate,
        startTime: action.payload.startTime,
        endTime: action.payload.endTime,
        title: action.payload.title,
        style: false,
        color: action.payload.color,
        key,
        arr,
      };

      for (const i of arr) {
        const dateInfo = i.split("-");
        const year = dateInfo[0];
        const month = dateInfo[1];

        if (!schedule[year]) schedule[year] = {};

        if (!schedule[year][month]) schedule[year][month] = {};

        // schedule에서 longArr배열에 있는 i 가 존재할 때, 즉 기존 일정이 있을 때!
        if (schedule[year][month][i]) {
          if (i === state.startDate) {
            // longDate의 첫 째날 일 때,
            const Leng = leng - 8 + count > 0 ? 8 - count : leng;

            schedule[year][month][i][key] = {
              ...object,
              length: Leng,
              count,
              isLong: true,
              isStart: true,
              isMiddle: false,
              isEnd: false,
            };
          } else {
            // 첫 째날이 아닌 그 이후 Date일 때,
            if (count === 1) {
              // 시작 날 기준 다음주로 넘어갈 때, 일요일의 경우(count = 1) 남은 length만큼 표시
              const Leng = leng >= 7 ? 7 : leng; //시작 날 기준 다다음주 까지 넘어가는지

              schedule[year][month][i][key] = {
                ...object,
                length: Leng,
                count,
                isLong: true,
                isStart: leng === 1 ? false : true,
                isMiddle: false,
                isEnd: true,
              };
            } else {
              // 일요일이 아닌 요일
              schedule[year][month][i][key] = {
                ...object,
                length: 1,
                count,
                isLong: true,
                isStart: false,
                isMiddle: leng === 1 ? false : true,
                isEnd: leng === 1 ? true : false,
              };
            }
          }
          const newObj = Object.fromEntries(
            Object.entries(schedule[year][month][i]).sort(([a], [b]) => (a < b ? -1 : 1))
          );
          schedule[year][month][i] = newObj;
        }

        // 다시 돌아와서, schedule에 longArr에 있는 날짜에 일정이 없을 때,
        if (!schedule[year][month][i]) {
          schedule[year][month][i] = {};
          // i가 longDate의 첫 째날 일 때,
          if (i === state.startDate) {
            const Leng = leng - 8 + count > 0 ? 8 - count : leng;

            schedule[year][month][i][key] = {
              ...object,
              length: Leng,
              count,
              isLong: true,
              isStart: true,
              isMiddle: false,
              isEnd: false,
            };
          } else {
            if (count === 1) {
              const Leng = leng >= 7 ? 7 : leng;

              schedule[year][month][i][key] = {
                ...object,
                length: Leng,
                count,
                isLong: true,
                isStart: leng === 1 ? false : true,
                isMiddle: false,
                isEnd: leng === 1 ? true : false,
              };
            } else {
              schedule[year][month][i][key] = {
                ...object,
                length: 1,
                count,
                isLong: true,
                isStart: false,
                isMiddle: leng === 1 ? false : true,
                isEnd: leng === 1 ? true : false,
              };
            }
          }
        }
        leng -= 1;
        count = count === 7 ? 1 : count + 1;
      } // for 문 끝.

      state.userSchedule = {
        email: state.userSchedule.email,
        name: state.userSchedule.name,
        schedule: { ...schedule },
      };
      state.longArrChanged = false;
    },

    removeList(state, action) {
      state.changed = true; // fetch (put)

      let schedule = { ...state.userSchedule.schedule };

      const dateInfo = action.payload.date.split("-");
      const year = dateInfo[0];
      const month = dateInfo[1];
      const date = action.payload.date;
      const key = action.payload.key;
      const dateArray = schedule[year][month][date][key].arr;

      for (const item of dateArray) {
        // item = '2023-01-01
        const date = item.split("-");

        delete schedule[date[0]][date[1]][item][key];

        if (schedule[date[0]][date[1]][item] === {}) {
          delete schedule[date[0]][date[1]][item];
        }
      }

      state.userSchedule = {
        email: state.userSchedule.email,
        name: state.userSchedule.name,
        schedule,
      };
    },
  },
});

export const modalActions = modalSlice.actions;

export default modalSlice;
