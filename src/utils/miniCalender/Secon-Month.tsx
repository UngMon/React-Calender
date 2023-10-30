import React from "react";
import Calender from "./Secon-Caledner";
import { RootState, useAppDispatch } from "../../redux/store";
import { useSelector } from "react-redux";
import { dateActions } from "../../redux/date-slice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { ButtonRef } from "../../type/RefType";
import pc from "./pc.module.css";
import mobile from "./mobile.module.css";

interface T {
  platform: string;
  type: string;
  dateRef: React.MutableRefObject<ButtonRef>;
  dateOpenHandler?: (value: string) => void;
}

const Month = ({ platform, type, dateRef, dateOpenHandler }: T) => {
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
    <div
      className={`${
        platform === "pc" ? pc["container"] : mobile["container"]
      } ${platform === "pc" && pc["platform-pc"]}`}
    >
      <div
        className={
          platform === "pc" ? pc["month-picker"] : mobile["month-picker"]
        }
      >
        <div>
          <span>
            {date.year}년 {+date.month}월
          </span>
        </div>
        <div>
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
      </div>
      <Calender
        platform={platform}
        type={type}
        year={+date.year}
        month={+date.month}
        firstDay={firstDay}
        lastDate={lastDate}
        dateRef={dateRef}
        dateOpenHandler={dateOpenHandler}
      />
    </div>
  );
};

export default Month;
