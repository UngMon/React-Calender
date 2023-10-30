import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { ButtonRef } from "../../type/RefType";
import { cloneActions } from "../../redux/clone-slice";
import pc from "./pc.module.css";
import mobile from "./mobile.module.css";

interface T {
  platform: string;
  type: string;
  year: number;
  month: number;
  firstDay: number;
  lastDate: number;
  identify: string;
  dateRef: React.MutableRefObject<ButtonRef>;
  dateOpenHandler?: (value: string) => void;
}

const MakeCaledner = ({
  platform,
  type,
  year,
  month,
  firstDay,
  lastDate,
  identify,
  dateRef,
  dateOpenHandler,
}: T) => {
  console.log("second");

  const dispatch = useDispatch();
  const clone = useSelector((state: RootState) => state.clone);

  const clickHandler = (date: string, day: number, week: number) => {
    let startDate: string = type === "start" ? date : clone.startDate;
    let endDate: string = type === "end" ? date : clone.endDate;

    dispatch(
      cloneActions.clickedDate({
        type,
        startDate,
        endDate,
        day: String(day),
        week: String(week),
      })
    );
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
          className={platform === "pc" ? pc.date_box : mobile.date_box}
        >
          <div
            className={` ${identify === date && pc["Today"]} ${
              date === clone.startDate && type === "start" && pc["startDate"]
            } ${date === clone.endDate && type === "end" && pc["endDate"]}`}
          >
            <span
              className={`${i === 1 ? pc["sunday"] : ""}${
                i === 7 ? pc["saturday"] : ""
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
        className={pc["week-box"]}
        ref={(el) => (dateRef.current![i + 3] = el)}
      >
        {makeDay(i)}
      </tr>
    );
  }

  return <>{monthArray}</>;
};

export default MakeCaledner;
