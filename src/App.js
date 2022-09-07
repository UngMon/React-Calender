import { Fragment, useEffect } from "react";
import Header from "./navigation/Header";
import Month from "./calender/Month";
import { useDispatch } from "react-redux";
import { fetchScheduleData } from "./store/modal-action";
import { modalActions } from "./store/modal-slice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchScheduleData());
    console.log('effect렌더링');
  }, [dispatch]);
  console.log('app렌더링')
  
  return (
    <Fragment>
      <Header />
      <Month />
    </Fragment>
  );
}

export default App;

// let currentTime = new Date(); // UTC(1970/01/01) 기준 현재 한국 시간과 날짜(s)
// let currentTimee = currentTime.getTime(); // UTC(1970/01/01) 기준 한국 시간(ms)
// let timeZone = currentTime.getTimezoneOffset() * 60 * 1000;
// // timeZone은 현지 시간과 UTC시간 차이 (오프셋) 분으로 나타내며 1000을 곱한 것은 밀리초를 표현하기 위함
// console.log(currentTime);
// console.log(currentTimee);
// console.log(timeZone);
// console.log(currentTimee - timeZone);
// let utc = currentTimee - timeZone;
// const ktc = 9 * 60 * 60 * 1000;
// console.log(ktc);
// console.log(new Date(utc - ktc));
// let currentTime = new Date();
// console.log(new Date("2022", "01", "1").getDay());
// console.log(currentTime.getMonth());
