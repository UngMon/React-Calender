import React, { useState } from "react";
import Calender from "./Secon-Caledner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { ButtonRef } from "../../type/RefType";
import classes from "./second.module.css";

interface T {
  type: string;
  year: string;
  month: string;
  dateRef: React.MutableRefObject<ButtonRef>;
  dateClose: (value: string) => void;
}

const Month = ({ type, year, month, dateRef, dateClose }: T) => {
  console.log("secondMonth");
  // console.log(dateRef.current);
  const [thisYear, setYear] = useState<number>(+year);
  const [thisMonth, setMonth] = useState<number>(+month);

  const firstDay = new Date(thisYear, thisMonth - 1, 1).getDay();
  const lastDate = new Date(thisYear, thisMonth, 0).getDate();

  const movePrevMonthHandler = () => {
    if (thisMonth === 1) {
      setMonth(12);
      setYear((prevState) => prevState - 1);
    } else {
      setMonth((prevState) => prevState - 1);
    }
  };

  const moveNextMonthHandler = () => {
    if (thisMonth === 12) {
      setYear((prevState) => prevState + 1);
      setMonth(1);
    } else {
      setMonth((prevState) => prevState + 1);
    }
  };

  return (
    <div className={classes["second-month-box"]}>
      <div className={classes["month-area"]}>
        <span>
          {thisYear}년 {thisMonth}월
        </span>
        <button
          onClick={movePrevMonthHandler}
          type="button"
          ref={(el: HTMLButtonElement) => (dateRef.current[2] = el)}
        >
          <FontAwesomeIcon
            icon={faAngleLeft}
            style={{ backgroundColor: "transparent" }}
          />
        </button>
        <button
          onClick={moveNextMonthHandler}
          type="button"
          ref={(el: HTMLButtonElement) => (dateRef.current[3] = el)}
        >
          <FontAwesomeIcon
            icon={faAngleRight}
            style={{ backgroundColor: "transparent" }}
          />
        </button>
      </div>
      <Calender
        year={thisYear}
        month={thisMonth}
        firstDay={firstDay}
        lastDate={lastDate}
        type={type}
        dateRef={dateRef}
        dateClose={dateClose}
      />
    </div>
  );
};

export default Month;