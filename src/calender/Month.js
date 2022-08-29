import Calender from "./Calender";
import { useDispatch, useSelector } from "react-redux";
import { monthActions } from "../store/month-slice";

const Month = () => {
  const dispatch = useDispatch();

  const monthInfo = useSelector(state => state.month);


  const movePrevMonthHandler = () => {
    dispatch(monthActions.prevMonth());
  };

  const moveNextMonthHandler = () => {
    dispatch(monthActions.nextMonth());
  };

  return (
    <div>
      <button onClick={movePrevMonthHandler}>prev</button>
      <span>
        {monthInfo.thisYear}년 {monthInfo.thisMonth + 1}월
      </span>
      <button onClick={moveNextMonthHandler}>next</button>
      <Calender
        lastDateOfThisMonth={monthInfo.lastDateOfThisMonth}
        prevDate={monthInfo.prevMonthLastDate}
        prevDay={monthInfo.prevMonthLastDay}
        todayYear={monthInfo.thisYear}
        todayMonth={monthInfo.thisMonth}
      />
    </div>
  );
};

export default Month;

// const today = new Date(); // 현재 날짜 객체 생성
// let thisYear = today.getFullYear(); // 이번 년도
// let thisMonth = today.getMonth(); // 이번 달

// const [thisMonthState, setThisMonthState] = useState({ thisYear, thisMonth });
// const endOfThisMonthInfo = new Date(
//   thisMonthState.thisYear,
//   thisMonthState.thisMonth + 1,
//   0
// ); // 이달 말일
// const lastDayOfThisMonth = endOfThisMonthInfo.getDate(); //

// const prevMonthInfo = new Date(
//   thisMonthState.thisYear,
//   thisMonthState.thisMonth,
//   0
// ); // 저번 달에 대한 정보
// const prevDate = prevMonthInfo.getDate(); // 저번 달 마지막 날
// const prevDay = prevMonthInfo.getDay(); // 저번 달 마지막 날 요일 0~6

// const movePrevMonthHandler = () => {
//   if (thisMonth === 0) {
//     thisYear -= 1;
//     thisMonth = 11;
//     setThisMonthState({ thisYear, thisMonth });
//     console.log(thisMonthState);
//   } else {
//     thisMonth -= 1;
//     setThisMonthState({ thisYear, thisMonth });
//     console.log(thisMonthState);
//   }
// };

// const moveNextMonthHandler = () => {};
