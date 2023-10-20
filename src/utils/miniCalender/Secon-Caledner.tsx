import React from "react";
import MakeCaledner from "./Secon-MakeCalender";
import { ButtonRef } from "../../type/RefType";
import style from "./second.module.css";

const date = new Date();
const fixYear = date.getFullYear();
const fixMonth = String(date.getMonth() + 1).padStart(2, '0');
const fixDate = date.getDate();

interface T {
  type: string;
  year: number;
  month: number;
  firstDay: number;
  lastDate: number;
  dateRef: React.MutableRefObject<ButtonRef>;
  dateOpenHandler?: (value: string) => void;
}

const Calender = ({
  type,
  year,
  month,
  firstDay,
  lastDate,
  dateRef,
  dateOpenHandler,
}: T) => {
  const identify = fixYear + "-" + fixMonth + "-" + fixDate;

  return (
    <div className={style.calender}>
      <table className={style.table}>
        <thead className={style.weekname}>
          <tr>
            <th>일</th>
            <th>월</th>
            <th>화</th>
            <th>수</th>
            <th>목</th>
            <th>금</th>
            <th>토</th>
          </tr>
        </thead>
        <tbody className={style.presentation}>
          <MakeCaledner
            type={type}
            year={year}
            month={month}
            firstDay={firstDay}
            lastDate={lastDate}
            identify={identify}
            dateRef={dateRef}
            dateOpenHandler={dateOpenHandler}
          />
        </tbody>
      </table>
    </div>
  );
};

export default Calender;
