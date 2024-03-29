import { createSlice } from "@reduxjs/toolkit";
import { DataType, HoliDay } from "../type/ReduxType";
import { getNationalDay, getUserData, sendUserData } from "./fetch-action";

const initialState: DataType = {
  isLogin: false,
  isLoading: false,
  isCreated: false,
  isSending: false,
  succesGetNationalDayData: false,
  succesGetScheduleData: false,
  succesSendScheduleData: false,
  dataChanged: false,
  userSchedule: {},
  holiday: {},
};

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    fetchFromData(state, action) {
      // 새로고침시 localStorage의 userInfo 정보를 이용해서
      // state.userSchedule에 object 저장
      if (!action.payload.loginData) return;
      state.userSchedule = action.payload.userData;
      state.isLogin = true;
      state.isLoading = false;
    },

    setUser(state, action) {
      // 신규 가입자 or 이메일 미인증 유저
      state.isLogin = true;
      state.isLoading = false;
      state.isCreated = true;
      state.dataChanged = true;
      state.userSchedule = {};
    },

    toggleChanged(state) {
      state.dataChanged = false;
    },

    logout(state) {
      state.isLogin = false;
      state.isCreated = false;
      state.userSchedule = {};
    },

    LoadingState(state) {
      state.isLoading = true;
    },
  },
  extraReducers: (builder) => {
    // get National Day
    builder.addCase(getNationalDay.pending, (state, action) => {});
    builder.addCase(getNationalDay.fulfilled, (state, action) => {
      // 첫 마운트, 세션스토리지에 데이터가 있다면 저장하기
      const result: { [key: string]: HoliDay } = {};
      const year = action.payload.year;
      const data = action.payload.data;

      // data.legnth === 0 => 세션스토리지에 데이터가 존재하는 경우
      if (data.length === 0) {
   
        if (!state.holiday[year]) {
          const arr = [String(+year - 1), year, String(+year + 1)];
          arr.forEach(
            (index) =>
              (result[index] = JSON.parse(sessionStorage.getItem(index)!))
          );
          state.holiday = result;
        }
        return;
      }

      const yearArray: string[] = action.payload.yearArray;

      for (let y = 0; y < yearArray.length; y++) {
        result[yearArray[y]] = {};
        if (data[y].response.body.items === "") {
          // 한국천문연구원 특일정보에 없는 데이터임.. 2023년 기준 2026년 데이터가 없다.
          return;
        }

        for (let obj of data[y].response.body.items.item) {
          result[yearArray[y]][obj.locdate] = {
            isHoliday: obj.isHoliday,
            dateName: obj.dateName,
          };
        }
        state.holiday = { ...state.holiday, ...result };
        sessionStorage.setItem(
          yearArray[y],
          JSON.stringify(result[yearArray[y]])
        );
      }
    });
    builder.addCase(getNationalDay.rejected, (state, action) => {
      console.log(action.error);
    });

    // get USer Data
    builder.addCase(getUserData.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getUserData.fulfilled, (state, action) => {
      state.isLoading = false;
      state.succesGetScheduleData = true;
      state.userSchedule = action.payload.schedule;
    });
    builder.addCase(getUserData.rejected, (state, action) => {
      state.isLoading = false;
      state.succesGetScheduleData = false;
    });
    // sending (POST)
    builder.addCase(sendUserData.pending, (state, action) => {
      state.isSending = true;
    });
    builder.addCase(sendUserData.fulfilled, (state, action) => {
      state.isSending = false;
      state.succesSendScheduleData = true;
      state.userSchedule = action.payload.newSchedule;
    });
    builder.addCase(sendUserData.rejected, (state, action) => {
      console.log(action.error);
      state.isSending = false;
      state.succesSendScheduleData = false;
    });
  },
});

export const dataActions = dataSlice.actions;

export const dataReducer = dataSlice.reducer;
