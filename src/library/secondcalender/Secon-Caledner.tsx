import React from "react";
import classes from "./second.module.css";
import MakeCaledner from "./Secon-MakeCalender";
import { ButtonRef } from "../../utils/RefType";

const date = new Date();
const fixYear = date.getFullYear();
const fixMonth = date.getMonth() + 1;
const fixDate = date.getDate();

interface T {
  year: number;
  month: number;
  firstDay: number;
  lastDate: number;
  type: string;
  dateRef: React.MutableRefObject<ButtonRef>;
  dateClose: (value: string) => void;
}

const Calender = ({
  year,
  month,
  firstDay,
  lastDate,
  type,
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
          {MakeCaledner({
            year,
            month,
            firstDay,
            lastDate,
            identify,
            type,
            dateRef,
            dateClose,
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Calender;
