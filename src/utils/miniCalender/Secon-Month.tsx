import React from "react";
import Calender from "./Secon-Caledner";
import { RootState, useAppDispatch } from "../../redux/store";
import { useSelector } from "react-redux";
import { dateActions } from "../../redux/date-slice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { ButtonRef } from "../../type/RefType";
import classes from "./second.module.css";

interface T {
  type: string;
  dateRef: React.MutableRefObject<ButtonRef>;
  dateClose: (value: string) => void;
}

const Month = ({ type, dateRef, dateClose }: T) => {
  console.log("secondMonth");

  const dispatch = useAppDispatch();
  const date = useSelector((state: RootState) => state.date);

  const firstDay = new Date(+date.year, +date.month - 1, 1).getDay();
  const lastDate = new Date(+date.year, +date.month, 0).getDate();

  const movePrevMonthHandler = () => {
    dispatch(dateActions.prevMonth());
  };

  const moveNextMonthHandler = () => {
    dispatch(dateActions.nextMonth());
  };

  return (
    <div className={classes["second-month-box"]}>
      <div className={classes["month-area"]}>
        <span>
          {date.year}년 {+date.month}월
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
        type={type}
        year={+date.year}
        month={+date.month}
        firstDay={firstDay}
        lastDate={lastDate}
        dateRef={dateRef}
        dateClose={dateClose}
      />
    </div>
  );
};

export default Month;
