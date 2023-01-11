import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../Auth/firebase";
import { signOut } from "firebase/auth";
import Calender from "./Calender";
import "./Month.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import { modalActions } from "../store/modal-slice";

const newDate = new Date();

const Month = () => {
  console.log("month");
  console.log(localStorage.getItem("email"))
  const dispatch =  useDispatch();

  const [year, setYear] = useState(newDate.getFullYear());
  const [month, setMonth] = useState(newDate.getMonth());

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  const scheduleInfo = useSelector((state) => state.modal.userSchedule);
  
  const movePrevMonthHandler = () => {
    if (month === 0) {
      setYear(year - 1);
      setMonth(11);
      return;
    }
    setMonth(month - 1);
  };

  const moveNextMonthHandler = () => {
    if (month === 11) {
      setYear(year + 1);
      setMonth(0);
      return;
    }
    setMonth(month + 1);
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
            {year}년 {month + 1}월
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
        year={year}
        month={month + 1}
        firstDay={firstDay}
        lastDate={lastDate}
        scheduleInfo={scheduleInfo}
      />
    </div>
  );
};

export default Month;
