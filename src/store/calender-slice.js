import { createSlice } from "@reduxjs/toolkit";

const dateArray = [{thisYear: '', thisMonth: '', todayDate: '', todayDay: '', todos: []}]

const calenderSlice = createSlice({
  name: "calender",
  initialState: dateArray,
  reducers: {
    makeCalender(state, action) {
    },
  },
});
// datearray에서는 년,월, 일 그리고 todolist정보를 담아야 한다. 마지막으로 무슨 요일인지에 관한 인덱스가 필요함.
// datearray = [{thisYear, thisMonth, todayDate, todayDay, todos: []}]
// 이걸 이후에 파이어베이스 데이터베이스에 저장하여 정보를 CRUD방식으로 전환할 것임...
export const calenderActions = calenderSlice.actions;

export default calenderSlice;
