import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { monthActions } from "../store/month-slice";
import "./Month.css";
import Calender from "./Calender";
import UserInfo from "../modal/UserInfo";

const Month = () => {
  console.log("month");

  const dispatch = useDispatch();

  const monthState = useSelector((state) => state.month);
  const [openUserInfo, setOpenUserInfo] = useState(false);
  const delayRef = useRef({ delay: true });

  const firstDay = new Date(monthState.year, monthState.month, 1).getDay();
  const lastDate = new Date(monthState.year, monthState.month + 1, 0).getDate();

  const userInfo = useSelector((state) => state.modal.userSchedule);
  const viewRef= useRef();
  console.log(userInfo);

  const movePrevMonth = () => {
    dispatch(monthActions.prevMonth());
    setTimeout(() => {
      delayRef.current.delay = true;
    }, 350);
  };

  const moveNextMonth = () => {
    dispatch(monthActions.nextMonth());
    setTimeout(() => {
      delayRef.current.delay = true;
    }, 350);
  };

  const wheelHandler = (e) => {
    delayRef.current.delay = false;
    if (e.deltaY > 0) {
      movePrevMonth();
    }
    if (e.deltaY < 0) {
      moveNextMonth();
    }
  };

  const openUserInfoHandler = () => {
    setOpenUserInfo((prevState) => !prevState);
  };

  return (
    <div
      className="view-area"
      onWheel={(e) => delayRef.current.delay && wheelHandler(e)}
      ref={viewRef}
    >
      <header className="header">
        <div className="header-box">
          <div className="header-name">
            <span>Calender</span>
          </div>
          <div className="select-month">
            <button onClick={movePrevMonth}>
              <FontAwesomeIcon icon={faAngleLeft} />
            </button>
            <span>
              {monthState.year}년 {monthState.month + 1}월
            </span>
            <button onClick={moveNextMonth}>
              <FontAwesomeIcon icon={faAngleRight} />
            </button>
          </div>
          <div className="header-user-info">
            <div className="user-info-circle" onClick={openUserInfoHandler}>
              {userInfo.name}
            </div>
            {openUserInfo && (
              <UserInfo userInfo={userInfo} setOpenUserInfo={setOpenUserInfo} />
            )}
          </div>
        </div>
      </header>
      <Calender
        year={monthState.year}
        month={monthState.month + 1}
        firstDay={firstDay}
        lastDate={lastDate}
        scheduleInfo={userInfo}
        viewRef={viewRef}
      />
    </div>
  );
};

export default Month;
