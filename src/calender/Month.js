import { useDispatch, useSelector } from "react-redux";
import { monthActions } from "../store/month-slice";
import { auth } from "../Auth/firebase";
import { signOut } from "firebase/auth";
import Calender from "./Calender";
import "./Month.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import { modalActions } from "../store/modal-slice";

const Month = () => {
  console.log("month");
  const dispatch = useDispatch();

  const monthInfo = useSelector((state) => state.month);
  const scheduleInfo = useSelector((state) => state.modal.userSchedule);

  const movePrevMonthHandler = () => {
    dispatch(monthActions.prevMonth());
  };

  const moveNextMonthHandler = () => {
    dispatch(monthActions.nextMonth());
  };

  const logoutHandler = () => {
    signOut(auth)
      .then((res) => {
        localStorage.removeItem("email");
        dispatch(modalActions.logout());
      })
      .catch((err) => {
        alert("로그아웃 실패");
        localStorage.clear();
      });
  };

  return (
    <div className="view-area">
      <header className="header">
        <div className="header-name">
          <span>{scheduleInfo.name} Calender</span>
        </div>
        <div className="select-month">
          <button onClick={movePrevMonthHandler}>
            <FontAwesomeIcon icon={faAngleLeft} />
          </button>
          <span>
            {monthInfo.year}년 {monthInfo.month + 1}월
          </span>
          <button onClick={moveNextMonthHandler}>
            <FontAwesomeIcon icon={faAngleRight} />
          </button>
        </div>
        <div className="header-Logout">
          <NavLink className={"Logout"} to="/login" onClick={logoutHandler}>
            Logout
          </NavLink>
        </div>
      </header>
      <Calender
        year={monthInfo.year}
        month={monthInfo.month + 1}
        firstDay={monthInfo.firstDay}
        lastDate={monthInfo.lastDate}
        scheduleInfo={scheduleInfo}
      />
    </div>
  );
};

export default Month;
