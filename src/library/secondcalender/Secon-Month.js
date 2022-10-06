import { useDispatch, useSelector } from "react-redux";
import { monthActions } from "../../store/month-slice";
import Calender from './Secon-Caledner';
import classes from './second.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareCaretLeft, faSquareCaretRight } from "@fortawesome/free-solid-svg-icons";

const Month = ({type}) => {
  const dispatch = useDispatch();

  const monthInfo = useSelector((state) => state.month);

  const movePrevMonthHandler = () => {
    dispatch(monthActions.prevMonth());
  };

  const moveNextMonthHandler = () => {
    dispatch(monthActions.nextMonth());
  };

  return (
    <div className={classes['date-picker']}>
      <div className={classes['month-area']}>
        <span>
          {monthInfo.year}년 {monthInfo.month + 1}월
        </span>
        <button onClick={movePrevMonthHandler}>
          <FontAwesomeIcon icon={faSquareCaretLeft} />
        </button>
        <button onClick={moveNextMonthHandler}>
          <FontAwesomeIcon icon={faSquareCaretRight} />
        </button>
      </div>
      <Calender
        year={monthInfo.year}
        month={monthInfo.month + 1}
        firstDay={monthInfo.firstDay}
        lastDate={monthInfo.lastDate}
        type={type}
      />
    </div>
  );
};

export default Month;

