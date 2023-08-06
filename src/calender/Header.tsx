import React, { useState } from "react";
import UserInfo from "../modal/UserInfo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { auth } from "../Auth/firebase";

interface T {
  year: string;
  month: string;
  movePrevMonth: () => void;
  moveNextMonth: () => void;
}

const Header = ({ year, month, movePrevMonth, moveNextMonth }: T) => {
  const [openUserInfo, setOpenUserInfo] = useState(false);

  return (
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
            {year}년 {+month}월
          </span>
          <button onClick={moveNextMonth}>
            <FontAwesomeIcon icon={faAngleRight} />
          </button>
        </div>
        <div className="header-user-info">
          <div
            className="user-info-circle"
            onClick={() => setOpenUserInfo((prevState) => !prevState)}
          >
            {auth.currentUser?.displayName}
          </div>
          {openUserInfo && (
            <UserInfo auth={auth} setOpenUserInfo={setOpenUserInfo} />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
