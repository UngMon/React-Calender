import { createSlice } from "@reduxjs/toolkit";
import { DataType } from "../type/ReduxType";
import { getUserData, sendUserData } from "./fetch-action";

const initialState: DataType = {
  // addModalOpen: false,
  isLogin: false,
  isLoading: false,
  isCreated: false,
  isSending: false,
  succesGetData: false,
  succesSendData: false,
  // startDate: "",
  // endDate: "",
  // week: "",
  // day: "",
  dataChanged: false,
  userSchedule: {},
  dateArray: [],
};

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    fetchFromData(state, action) {
      // 새로고침시 localStorage의 userInfo 정보를 이용해서
      // state.userSchedule에 object 저장
      if (!action.payload.loginData) return;
      console.log(action.payload.userData);
      state.userSchedule = action.payload.userData;
      state.isLogin = true;
      state.isLoading = false;
    },

    setUser(state, action) {
      // 신규 가입자 or 이메일 미인증 유저
      console.log("confirm");
      console.log(action.payload);
      state.isLogin = true;
      state.isLoading = false;
      state.isCreated = true;
      state.dataChanged = true;

      state.userSchedule = {};

      // if (state.dummyData[state.uid]) {
      //   state.userSchedule = { ...state.dummyData[state.uid] };
      // } else {
      //   // 신규 가입자일 때, 유저 data를 생성하고 이후 app.js에서 sendScheduleData()에서
      //   // data 생성 요청을 수행함.
      //   state.dataChanged = true;
      //   state.userSchedule = {
      //     email: action.payload.email,
      //     name: action.payload.name,
      //     schedule: { dummy: 1 },
      //   };
      //   state.isCreated = true;
      // }
      // state.dummyData = {};
    },

    toggleChanged(state) {
      state.dataChanged = false;
    },

    logout(state) {
      state.isLogin = false;
      state.isCreated = false;
      // state.startDate = "";
      // state.endDate = "";
      // state.week = "";
      // state.day = "";
      state.userSchedule = {};
    },

    LoadingState(state) {
      state.isLoading = true;
    },

    // onModal(state) {
    //   state.addModalOpen = true;
    // },

    // offModal(state) {
    //   // state.addModalOpen = false;
    //   // state.startDate = "";
    //   // state.endDate = "";
    //   // state.week = "";
    //   // state.day = "";
    //   state.dateArray = [];
    //   state.dataChanged = false;
    // },

    setDate(state, action) {
      // state.day = action.payload.day;
      // state.week = action.payload.week;
      // state.startDate = action.payload.startDate;
      // state.endDate = action.payload.endDate;
      state.dateArray = action.payload.dateArray;
    },

    // clickedDate(state, action) {
    //   switch (action.payload.type) {
    //     case "MakeCalender":
    //       // state.startDate = action.payload.date;
    //       // state.endDate = action.payload.date;
    //       // state.day = action.payload.day;
    //       // state.week = action.payload.week;
    //       return;
    //     case "MakeList":
    //       // state.startDate = action.payload.newStart;
    //       // state.endDate = action.payload.newEnd;
    //       state.dateArray = action.payload.array;
    //       // state.day = String(action.payload.day);
    //       // state.week = String(action.payload.week);
    //       // state.addModalOpen = true;
    //       return;
    //     case "end":
    //       // state.endDate = action.payload.date;
    //       state.dateArray = action.payload.dateArray;
    //       return;
    //     case "add":
    //       // state.addModalOpen = true;
    //       // state.endDate = action.payload.date;
    //       break;
    //   }

    //   // state.startDate = action.payload.date;
    //   // state.week = action.payload.week.toString();
    //   // state.day = action.payload.day.toString();
    //   state.dateArray = action.payload.dateArray;
    // },
  },
  extraReducers: (builder) => {
    builder.addCase(getUserData.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getUserData.fulfilled, (state, action) => {
      state.isLoading = false;
      state.userSchedule = action.payload.schedule;
    });
    builder.addCase(getUserData.rejected, (state, action) => {
      state.isLoading = false;
      console.log(action.error);
    });
    // sending (POST)
    builder.addCase(sendUserData.pending, (state, action) => {
      state.isSending = true;
      state.succesSendData = false;
    });
    builder.addCase(sendUserData.fulfilled, (state, action) => {
      state.isSending = false;
      state.succesSendData = true;
      state.userSchedule = action.payload.newSchedule;
    });
    builder.addCase(sendUserData.rejected, (state, action) => {
      console.log(action.error);
      state.isSending = false;
      state.succesSendData = false;
    });
  },
});

export const dataActions = dataSlice.actions;

export const dataReducer = dataSlice.reducer;
