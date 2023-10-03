import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { ButtonRef } from "../../type/RefType";
import { modalActions } from "../../redux/modal-slice";
import MakeLongArr from "../MakeLongArr";
import classes from "./second.module.css";

interface T {
  type: string;
  year: number;
  month: number;
  firstDay: number;
  lastDate: number;
  identify: string;
  dateRef: React.MutableRefObject<ButtonRef>;
  dateClose?: (value: string) => void;
}

const MakeCaledner = ({
  type,
  year,
  month,
  firstDay,
  lastDate,
  identify,
  dateRef,
  dateClose,
}: T) => {
  console.log("second");

  const dispatch = useDispatch();
  const modal = useSelector((state: RootState) => state.modal);

  const clickHandler = (date: string, day: number, week: number) => {
    const 선택날짜 = date.split("-"); // ['year', 'month', 'date']
    let startDate: string = modal.startDate;
    let endDate: string = modal.endDate;
    // 미니 캘린더에서 날짜를 클릭하면,
    // 해당 날짜로 MakeEvent.tsx가 렌더링, 한 마디로 모달창이 이동하는 기능
    if (!modal.listModalOpen && window.innerWidth > 500)
      dispatch(modalActions.onAdd());

    // 첫 번째 미니 달력 선택의 경우...

    let dateArray: string[] = [];

    switch (type) {
      case "start": // 첫 번째 미니 달력에서 날짜 클릭
        const 마지막날: string[] = modal.endDate.split("-");
        dateArray = MakeLongArr(선택날짜, 마지막날);
        startDate = date;
        break;
      case "end": // 두 번째 미니 달력에서 날짜 클릭
        const 시작날: string[] = modal.startDate.split("-");
        dateArray = MakeLongArr(시작날, 선택날짜);
        endDate = date;
        break;
      default:
    }

    dispatch(
      modalActions.clickedDate({
        type: 'Edit',
        startDate,
        endDate,
        day: String(day),
        week: String(week),
        dateArray,
      })
    );
    if (dateClose) dateClose(type);
  };

  const monthArray = [];

  /* 날짜 생성하기 */
  const makeDay = (week: number) => {
    const thisMonthArray: React.ReactNode[] = [];

    let move: number;

    if (week === 1) move = -24 * 60 * 60 * 1000 * firstDay;
    else move = 24 * 60 * 60 * 1000 * ((week - 2) * 7 + (7 - firstDay));

    const thisDate = new Date(new Date(+year, +month - 1, 1).getTime() + move)
      .toISOString()
      .split("T")[0];

    for (let i = 1; i <= 7; i++) {
      let next: number = i * 24 * 60 * 60 * 1000;
      const date = new Date(new Date(thisDate).getTime() + next)
        .toISOString()
        .split("T")[0];

      const 일 = date.split("-")[2];

      thisMonthArray.push(
        <td
          key={date}
          onClick={() => clickHandler(date, i, week)}
          className={classes.date_box}
        >
          <div
            className={`${classes["date-h"]} ${
              identify === date && classes["Today"]
            } ${
              date === modal.startDate &&
              type === "start" &&
              classes["startDate"]
            } ${
              date === modal.endDate && type === "end" && classes["endDate"]
            }`}
          >
            <span
              className={`${
                i === 1 ? classes.sunday : i === 7 && classes.saturday
              }`}
            >
              {일}
            </span>
          </div>
        </td>
      );
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
        ref={(el) => (dateRef.current![i + 3] = el)}
      >
        {makeDay(i)}
      </tr>
    );
  }

  return <>{monthArray}</>;
};

export default MakeCaledner;
