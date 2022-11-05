import { useDispatch, useSelector } from "react-redux";
import { monthActions } from "../store/month-slice";
import { auth } from "../Auth/firebase";
import { signOut } from "firebase/auth";
import Calender from "./Calender";
import "./Month.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";

const Month = () => {
  const dispatch = useDispatch();

  const monthInfo = useSelector((state) => state.month);
  const scheduleInfo = useSelector(state => state.modal.userSchedule);


  const movePrevMonthHandler = () => {
    dispatch(monthActions.prevMonth());
  };

  const moveNextMonthHandler = () => {
    dispatch(monthActions.nextMonth());
  };

  const logoutHandler = () => {
    signOut(auth).catch((err) => {
      alert("로그아웃 실패");
      console.log(err);
      localStorage.clear()
      
    });
  };

  return (
    <div className="view-area">
      <header className="header">
        <div className="header-name">Your Calender</div>
        <div className="month-area">
          <button onClick={movePrevMonthHandler} style={{backgroundColor: "transparent"}}>
            {/* <span className="move-button">{'<'}</span> */}
            <FontAwesomeIcon icon={faAngleLeft} />
          </button>
          <span>
            {monthInfo.year}년 {monthInfo.month + 1}월
          </span>
          <button onClick={moveNextMonthHandler} style={{backgroundColor: "transparent"}}>
          <FontAwesomeIcon icon={faAngleRight} />
          </button>
        </div>
        <nav className="header-nav">
          <ul>
            <li className="profile">{scheduleInfo.name}</li>
            <NavLink to='/start' onClick={logoutHandler}>Logout</NavLink>
          </ul>
        </nav>
      </header>
      <main className="calender-view">
        <Calender
          year={monthInfo.year}
          month={monthInfo.month + 1}
          firstDay={monthInfo.firstDay}
          lastDate={monthInfo.lastDate}
        />
      </main>
    </div>
  );
};

export default Month;
