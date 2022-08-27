import { useState } from "react";
import Calender from "./Calender";

let thisYear = new Date().getFullYear(); // 이번 년도
let thisMonth = new Date().getMonth(); // 이번 달
console.log('랜더링확인')

const Month = () => {
  const [monthState, setMonthState] = useState({ thisYear, thisMonth });

  const lastDayOfThisMonth = new Date(
    monthState.thisYear,
    monthState.thisMonth + 1,
    0
  ).getDate(); // 이 달 말일

  const prevDate = new Date(
    monthState.thisYear,
    monthState.thisMonth,
    0
  ).getDate(); // 저번 달 마지막 날

  const prevDay = new Date(
    monthState.thisYear,
    monthState.thisMonth,
    0
  ).getDay(); // 저번 달 마지막 날 요일 0~6

  const prevMonthHandler = () => {
    if (thisMonth === 0) {
      thisYear -= 1;
      thisMonth = 11;
      setMonthState({ thisYear, thisMonth });
    } else {
      thisMonth -= 1;
      setMonthState({ thisYear, thisMonth });
    }
  };

  const nextMonthHandler = () => {
    if (thisMonth === 11) {
      thisYear += 1;
      thisMonth = 0;
      setMonthState({ thisYear, thisMonth });
    } else {
      thisMonth += 1;
      setMonthState({ thisYear, thisMonth });
    }
  };

  return (
    <div>
      <button onClick={prevMonthHandler}>prev</button>
      <span>
        {monthState.thisYear}년 {monthState.thisMonth + 1}월
      </span>
      <button onClick={nextMonthHandler}>next</button>
      <Calender
        lastDayOfThisMonth={lastDayOfThisMonth}
        prevDate={prevDate}
        prevDay={prevDay}
      />
    </div>
  );
};

export default Month;
