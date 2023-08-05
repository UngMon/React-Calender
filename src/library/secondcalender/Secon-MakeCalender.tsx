import React, { useDispatch, useSelector } from "react-redux";
import { MutableRefObject } from "react";
import { dataActions } from "../../store/data-slice";
import { dateActions } from "../../store/date-slice";
import { modalActions } from "../../store/modal-slice";
import MakeIdx from "../MakeIdx";
import MakeLongArr from "../MakeLongArr";
import classes from "./second.module.css";
import { RootState } from "../../store/store";
import { ButtonRef } from "../../utils/RefType";

interface T {
  year: number;
  month: number;
  firstDay: number;
  lastDate: number;
  identify: string;
  type: string;
  dateRef: React.MutableRefObject<ButtonRef>;
  dateClose: () => void;
}

const MakeCaledner = ({
  year,
  month,
  firstDay,
  lastDate,
  identify,
  type,
  dateRef,
  dateClose,
}: T) => {
  console.log("second");

  const dispatch = useDispatch();

  const data = useSelector((state: RootState) => state.data);
  const modal = useSelector((state: RootState) => state.modal);

  const clickHandler = (idx: string, day: number, week: number, type: string) => {
    const 선택날짜 = idx.split("-"); // ['year', 'month', 'date']

    // 미니 캘린더에서 다음달로 넘어가면 메인 캘린더도 같이 다음달과 넘어가기 위함.
    if (data.startDate !== idx) {
      // 기존 modalState를 갱신해줌..
      const thisMonth = month - 1;
      dispatch(dateActions.setMonth({ 선택날짜, thisMonth }));
    }

    // 해당 날짜로 addEvnet.js가 렌더링.. 한 마디로 모달창이 이동하는 기능...
    // if (!listState.isVisible) {
    //   dispatch(modalActions.onModal());
    // }

    // 첫 번째 미니 달력 선택의 경우...
    // if (type === 'start') {
    //   const 마지막날 = data.endDate.split("-");
    //   const dateArray = MakeLongArr(선택날짜, 마지막날);
    //   dispatch(
    //     dateActions.clickedDate({ type, idx, day, week, dateArray })
    //   );
    // } else {
    //   // 두 번째 미니 달력 선택의 경우...
    //   const 시작날 = modalState.startDate.split("-");
    //   const dateArray = MakeLongArr(시작날, 선택날짜);
    //   dispatch(modalActions.clickedDate({ type, idx, dateArray }));
    // }
    dateClose();
  };

  const monthArray = [];

  /* 날짜 생성하기 */
  const makeDay = (week: number) => {
    const thisMonthArray = [];

    /* 첫 주에선 그 전 달과 이번 달을 표시하기 */
    if (week === 1) {
      const prevMonthLastDate = new Date(year, month - 1, 0).getDate();

      for (let i = 1; i <= 7; i++) {
        if (i <= firstDay) {
          const nowDate = prevMonthLastDate - firstDay + i;
          const idx = MakeIdx("prev", `${year}`, `${month}`, nowDate);
          const day = i; //모달창을 띄울 때 위치를 무슨 요일인지 저장

          thisMonthArray.push(
            <td
              key={idx}
              onClick={() => clickHandler(idx, day, week, type)}
              className={classes.date_box}
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
          const idx = MakeIdx("", `${year}`, `${month}`, nowDate);
          const day = i;

          thisMonthArray.push(
            <td
              key={idx}
              onClick={() => clickHandler(idx, day, week, type)}
              className={classes.date_box}
            >
              <div
                className={`${classes.date} ${
                  identify === idx && classes.Today
                }`}
                style={{
                  color: `${day === 1 ? "red" : day === 7 && "blue"}`,
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
          const idx = MakeIdx("", `${year}`, `${month}`, nowDate);
          const day = (i % 7) + 1;

          thisMonthArray.push(
            <td
              key={idx}
              onClick={() => clickHandler(idx, day, week, type)}
              className={classes.date_box}
            >
              <div
                className={`${classes.date} ${
                  identify === idx && classes.Today
                }`}
                style={{
                  color: `${day === 1 ? "red" : day === 7 && "blue"}`,
                }}
              >
                {nowDate}
              </div>
            </td>
          );
        } else {
          const nowDate = i - lastDate - firstDay + 1;
          const idx = MakeIdx("next", `${year}`, `${month}`, nowDate);
          const day = (i % 7) + 1;

          thisMonthArray.push(
            <td
              key={idx}
              onClick={() => clickHandler(idx, day, week, type)}
              className={classes.date_box}
            >
              <div
                className={`${classes.date} ${
                  identify === idx && classes.Today
                }`}
                style={{
                  color: `${day === 1 ? "red" : day === 7 && "blue"}`,
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
        ref={(el) => (dateRef.current[i + 3] = el)}
      >
        {makeDay(i)}
      </tr>
    );
  }

  return monthArray;
};

export default MakeCaledner;
