import MakeKey from "../MakeKey";
import MakeLongArr from "../MakeLongArr";
import { useDispatch, useSelector } from "react-redux";
import { monthActions } from "../../store/month-slice";
import { modalActions } from "../../store/modal-slice";
import classes from "./second.module.css";

const MakeCaledner = ({
  year,
  month,
  firstDay,
  lastDate,
  identify,
  type,
  dateRef,
  dateClose,
}) => {
  console.log("second");

  const dispatch = useDispatch();

  const modalState = useSelector((state) => state.modal);
  const listState = useSelector((state) => state.list);

  const clickHandler = (idx, dayIndex, week, type) => {
    // 미니 캘린더에서 다음달로 넘어가면 메인 캘린더도 같이 다음달과 넘어가기 위함.
    const 날짜정보 = idx.split("-"); // ['year', 'month', 'date']

    if (modalState.startDate !== idx) {
      console.log('???')
      // 기존 modalState를 갱신해줌..
      const thisMonth = month - 1;
      dispatch(monthActions.setMonth({ 날짜정보, thisMonth }));
    }

    if (!listState.isVisible) {
      console.log('????????????')
      dispatch(modalActions.onModal());
    }

    // 첫 번째 미니 달력 선택의 경우...
    if (type) {
      const 마지막날 = modalState.endDate.split("-");
      const longArr = MakeLongArr(날짜정보, 마지막날);
      const type = "second";
      dispatch(
        modalActions.clickedStartDate({ type, idx, dayIndex, week, longArr })
      );
    } else {
      // 두 번째 미니 달력 선택의 경우...
      const 시작날 = modalState.startDate.split("-");
      console.log(시작날);
      const longArr = MakeLongArr(시작날, 날짜정보);
      dispatch(modalActions.clickedLastDate({ idx, longArr }));
    }
    dateClose();
  };

  const monthArray = [];

  /* 날짜 생성하기 */
  const makeDay = (week) => {
    const thisMonthArray = [];

    /* 첫 주에선 그 전 달과 이번 달을 표시하기 */
    if (week === 1) {
      const prevMonthLastDate = new Date(year, month - 1, 0).getDate();

      for (let i = 1; i <= 7; i++) {
        if (i <= firstDay) {
          const nowDate = prevMonthLastDate - firstDay + i;
          const idx = MakeKey("prev", year, month, nowDate);
          const dayIdx = i; //모달창을 띄울 때 위치를 무슨 요일인지 저장

          thisMonthArray.push(
            <td
              key={idx}
              onClick={() => clickHandler(idx, dayIdx, week, type)}
              className={classes.date_box}
              day-index={dayIdx}
            >
              <div
                className={`${classes.date} ${
                  identify === idx && classes.Today
                }`}
                style={{
                  color: `${i === 1 ? "red" : i === 7 && "blue"}`,
                }}
              >
                {nowDate}
              </div>
            </td>
          );
        } else {
          const nowDate = i - firstDay;
          const idx = MakeKey("", year, month, nowDate);
          const dayIdx = i;

          thisMonthArray.push(
            <td
              key={idx}
              onClick={() => clickHandler(idx, dayIdx, week, type)}
              className={classes.date_box}
              day-index={dayIdx}
            >
              <div
                className={`${classes.date} ${
                  identify === idx && classes.Today
                }`}
                style={{
                  color: `${dayIdx === 1 ? "red" : dayIdx === 7 && "blue"}`,
                }}
              >
                {nowDate}
              </div>
            </td>
          );
        }
      }
    } else {
      const startDate = (week - 1) * 7;

      for (let i = startDate; i <= week * 7 - 1; i++) {
        if (i - firstDay < lastDate) {
          const nowDate = i - firstDay + 1;
          const idx = MakeKey("", year, month, nowDate);
          const dayIdx = (i % 7) + 1;

          thisMonthArray.push(
            <td
              key={idx}
              onClick={() => clickHandler(idx, dayIdx, week, type)}
              className={classes.date_box}
              day-index={dayIdx}
            >
              <div
                className={`${classes.date} ${
                  identify === idx && classes.Today
                }`}
                style={{
                  color: `${dayIdx === 1 ? "red" : dayIdx === 7 && "blue"}`,
                }}
              >
                {nowDate}
              </div>
            </td>
          );
        } else {
          const nowDate = i - lastDate - firstDay + 1;
          const idx = MakeKey("next", year, +month, nowDate);
          const dayIdx = (i % 7) + 1;

          thisMonthArray.push(
            <td
              key={idx}
              onClick={() => clickHandler(idx, dayIdx, week, type)}
              className={classes.date_box}
              day-index={dayIdx}
            >
              <div
                className={`${classes.date} ${
                  identify === idx && classes.Today
                }`}
                style={{
                  color: `${dayIdx === 1 ? "red" : dayIdx === 7 && "blue"}`,
                }}
              >
                {nowDate}
              </div>
            </td>
          );
        }
      }
    }
    return thisMonthArray;
  };
  /* 주 만들기, 달 마다 5주 6주 다르므로...*/
  const week = Math.ceil((firstDay + lastDate) / 7);
  for (let i = 1; i <= week; i++) {
    monthArray.push(
      <tr
        key={i}
        className={classes["week-box"]}
        weekindex={i}
        ref={(el) => (dateRef.current[i + 3] = el)}
      >
        {makeDay(i)}
      </tr>
    );
  }

  return monthArray;
};

export default MakeCaledner;
