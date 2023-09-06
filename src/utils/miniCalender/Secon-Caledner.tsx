import React from "react";
import classes from "./second.module.css";
import MakeCaledner from "./Secon-MakeCalender";
import { ButtonRef } from "../../type/RefType";

const date = new Date();
const fixYear = date.getFullYear();
const fixMonth = date.getMonth() + 1;
const fixDate = date.getDate();

interface T {
  type: string;
  year: number;
  month: number;
  firstDay: number;
  lastDate: number;
  dateRef: React.MutableRefObject<ButtonRef>;
  dateClose: (value: string) => void;
}

const Calender = ({
  type,
  year,
  month,
  firstDay,
  lastDate,
  dateRef,
  dateClose,
}: T) => {
  const identify = fixYear + "." + fixMonth + "." + fixDate;

  return (
    <div className={classes.calender}>
      <table className={classes.table}>
        <thead className={classes.weekname}>
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
        <tbody className={classes.presentation}>
          <MakeCaledner
            type={type}
            year={year}
            month={month}
            firstDay={firstDay}
            lastDate={lastDate}
            identify={identify}
            dateRef={dateRef}
            dateClose={dateClose}
          />
        </tbody>
      </table>
    </div>
  );
};

export default Calender;
