import Calender from "./Secon-Caledner";
import classes from "./second.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faSquareCaretLeft, faSquareCaretRight} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const Month = ({ type, year, month }) => {
  const [thisYear, setYear] = useState(+year);
  const [thisMonth, setMonth] = useState(+month);

  const firstDay = new Date(thisYear, thisMonth - 1, 1).getDay();
  const lastDate = new Date(thisYear, thisMonth - 1 + 1, 0).getDate();

  const movePrevMonthHandler = () => {
    if (thisMonth === 1) {
      setMonth(12);
      setYear((prevState) => prevState - 1);
    } else {
      setMonth(prevState => prevState - 1 );
    }
  };

  const moveNextMonthHandler = () => {
    if (thisMonth === 12) {
      setYear(prevState => prevState + 1);
      setMonth(1);
    } else {
      setMonth(prevState => prevState + 1);
    }
  };

  return (
    <div className={classes["date-picker"]}>
      <div className={classes["month-area"]}>
        <span>
          {thisYear}년 {thisMonth}월
        </span>
        <button onClick={movePrevMonthHandler} type='button'>
          <FontAwesomeIcon icon={faSquareCaretLeft} />
        </button>
        <button onClick={moveNextMonthHandler} type='button'>
          <FontAwesomeIcon icon={faSquareCaretRight} />
        </button>
      </div>
      <Calender
        year={thisYear}
        month={thisMonth}
        firstDay={firstDay}
        lastDate={lastDate}
        type={type}
      />
    </div>
  );
};

export default Month;
