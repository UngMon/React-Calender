import { useDispatch, useSelector } from "react-redux";
import { monthActions } from "../store/month-slice";
import Calender from "./Calender";
import "./Month.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareCaretLeft, faSquareCaretRight } from "@fortawesome/free-solid-svg-icons";

const Month = () => {
  const dispatch = useDispatch();

  const monthInfo = useSelector((state) => state.month);

  const movePrevMonthHandler = () => {
    dispatch(monthActions.prevMonth());
  };

  const moveNextMonthHandler = () => {
    dispatch(monthActions.nextMonth());
  };

  return (
    <>
      <div className="month-area">
        <button onClick={movePrevMonthHandler}>
          <FontAwesomeIcon icon={faSquareCaretLeft} />
        </button>
        <span>
          {monthInfo.year}년 {monthInfo.month + 1}월
        </span>
        <button onClick={moveNextMonthHandler}>
          <FontAwesomeIcon icon={faSquareCaretRight} />
        </button>
      </div>
      <Calender
        year={monthInfo.year}
        month={monthInfo.month}
        firstDay={monthInfo.firstDay}
        lastDate={monthInfo.lastDate}
      />
    </>
  );
};

export default Month;

