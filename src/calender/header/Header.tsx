import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../Auth/firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import UserInfo from "../../modal/UserInfo";
import "./Header.css";

interface T {
  type: string;
  year?: string;
  month?: string;
  movePrevMonth?: () => void;
  moveNextMonth?: () => void;
}

const Header = ({ type, year, month, movePrevMonth, moveNextMonth }: T) => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const [openUserInfo, setOpenUserInfo] = useState<boolean>(false);
  const [openSearch, setOpenSearch] = useState<boolean>(false);

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    setOpenSearch(false);
    navigate(`/search?result=${inputRef.current!.value}`);
  };

  return (
    <header className="header">
      <div className="header-box">
        <div className="header-name">
          <span>Calender</span>
        </div>
        {type === "calender" && (
          <div className="select-month">
            <button onClick={movePrevMonth}>
              <FontAwesomeIcon icon={faAngleLeft} />
            </button>
            <span>
              {year}년 {+month!}월
            </span>
            <button onClick={moveNextMonth}>
              <FontAwesomeIcon icon={faAngleRight} />
            </button>
          </div>
        )}
        <div className="search">
          {!openSearch && type === "calender" && (
            <button>
              <FontAwesomeIcon
                icon={faSearch}
                onClick={() => setOpenSearch(true)}
              />
            </button>
          )}
          {openSearch && (
            <form onSubmit={submitHandler}>
              <button type="submit">
                <FontAwesomeIcon icon={faSearch} />
              </button>
              <label title="search" />
              <input
                id="search"
                type="text"
                placeholder="검색어를 입력해주세요!"
                ref={inputRef}
              />
            </form>
          )}
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
