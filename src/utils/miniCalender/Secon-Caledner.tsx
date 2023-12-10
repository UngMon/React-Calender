import React from "react";
import MakeCaledner from "./Secon-MakeCalender";
import { ButtonRef } from "../../type/RefType";
import pc from "./pc.module.css";
import mobile from "./mobile.module.css";

const date = new Date();
const fixYear = date.getFullYear();
const fixMonth = String(date.getMonth() + 1).padStart(2, "0");
const fixDate = String(date.getDate()).padStart(2, "0");

interface T {
  platform: string;
  type: string;
  year: number;
  month: number;
  dateRef: React.MutableRefObject<ButtonRef>;
  // dateOpenHandler?: (value: string) => void;
}

const Calender = ({
  platform,
  type,
  year,
  month,
  dateRef,
  // dateOpenHandler,
}: T) => {
  const identify = fixYear + "-" + fixMonth + "-" + fixDate;

  return (
    <div className={platform === "pc" ? pc.calender : mobile.calender}>
      <table className={platform === "pc" ? pc.table : mobile.table}>
        <thead className={platform === "pc" ? pc.weekname : mobile.weekname}>
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
        <tbody className={platform === "pc" ? pc.tbody : mobile.tbody}>
          <MakeCaledner
            platform={platform}
            type={type}
            year={year}
            month={month}
            identify={identify}
            dateRef={dateRef}
            // dateOpenHandler={dateOpenHandler}
          />
        </tbody>
      </table>
    </div>
  );
};

export default Calender;
