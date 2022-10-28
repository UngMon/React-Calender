import { useDispatch, useSelector } from "react-redux";
import { monthActions } from "../store/month-slice";
import { auth } from "../Auth/firebase";
import { signOut } from "firebase/auth";
import Calender from "./Calender";
import "./Month.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquareCaretLeft,
  faSquareCaretRight,
} from "@fortawesome/free-solid-svg-icons";

const Month = () => {
  const dispatch = useDispatch();

  const monthInfo = useSelector((state) => state.month);

  const movePrevMonthHandler = () => {
    dispatch(monthActions.prevMonth());
  };

  const moveNextMonthHandler = () => {
    dispatch(monthActions.nextMonth());
  };

  const logoutHandler = () => {
    signOut(auth)
      .then((data) => console.log(data))
      .catch((err) => {
        alert("로그아웃 실패");
        console.log(err);
      });
  };

  return (
    <header className='header'>
      <div>Your Calender</div>
      <div></div>
      <nav>
        <ul>
          <li>프로필</li>
          <li onClick={logoutHandler}>Logout</li>
        </ul>
      </nav>
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
      <main>
        <Calender
          year={monthInfo.year}
          month={monthInfo.month + 1}
          firstDay={monthInfo.firstDay}
          lastDate={monthInfo.lastDate}
        />
      </main>
    </header>
  );
};

export default Month;
