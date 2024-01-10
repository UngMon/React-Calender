import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { auth } from "../../Auth/firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faArrowLeft,
  faSearch,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import Menu from "./Menu";
import UserInfo from "./UserInfo";
import "./Header.css";

interface T {
  type: string;
  year?: string;
  month?: string;
  movePrevMonth?: () => void;
  moveNextMonth?: () => void;
}

const fixYear = new Date().getFullYear();

const Header = ({ type, year, month, movePrevMonth, moveNextMonth }: T) => {
  const navigate = useNavigate();
  const param = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);

  const [openUserInfo, setOpenUserInfo] = useState<boolean>(false);
  const [openSearch, setOpenSearch] = useState<boolean>(false);
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    setOpenSearch(false);
    navigate(`/search?result=${inputRef.current!.value}`);
  };

  const backButton = () => {
    if (param.pathname === "/search") navigate(-1);
    else setOpenSearch(false);
  };

  const logoClickHandler = () => {
    navigate(`/calender/date?year=${year}&month=${month}`);
  };

  const menuClickHandler = () => {
    setOpenMenu(!openMenu);
  };

  useEffect(() => {
    if (type === "search" && !openSearch) {
      setOpenSearch(true);
      return;
    }

    if (param.pathname === "/search" || !openSearch) return;

    const clickHandler = (e: MouseEvent) => {
      const target = e.target as Node;

      if (backRef.current!.contains(target)) return;

      if (!formRef.current!.contains(target)) setOpenSearch(false);
    };

    window.addEventListener("click", clickHandler);

    return () => window.removeEventListener("click", clickHandler);
  }, [param, openSearch, type]);

  return (
    <header className="header">
      <div className="header-box">
        <Menu openMenu={openMenu} setOpenMenu={setOpenMenu} />
        <div className="menu-icon">
          <FontAwesomeIcon icon={faBars} onClick={menuClickHandler} />
        </div>
        {!openSearch && type === "calender" && (
          <div className="header-title" onClick={logoClickHandler}>
            <span>Your Calender</span>
          </div>
        )}
        {openSearch && (
          <div className="search-b">
            <button className="back-button" onClick={backButton} ref={backRef}>
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <div>
              <span>검색</span>
            </div>
          </div>
        )}
        {!openSearch && type === "calender" && (
          <div className="select-month">
            {window.innerWidth > 500 && (
              <button onClick={movePrevMonth}>
                <FontAwesomeIcon icon={faAngleLeft} />
              </button>
            )}
            <div>
              <span>
                {+year! === fixYear ? `${+month!}월` : `${year}년 ${+month!}월`}
              </span>
            </div>
            {window.innerWidth > 500 && (
              <button onClick={moveNextMonth}>
                <FontAwesomeIcon icon={faAngleRight} />
              </button>
            )}
          </div>
        )}
        {openSearch && (
          <form className="search-form" onSubmit={submitHandler} ref={formRef}>
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
        <div className="search">
          {!openSearch && type === "calender" && (
            <button>
              <FontAwesomeIcon
                icon={faSearch}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenSearch(true);
                }}
              />
            </button>
          )}
        </div>
        <UserInfo
          auth={auth}
          openUserInfo={openUserInfo}
          setOpenUserInfo={setOpenUserInfo}
        />
      </div>
    </header>
  );
};

export default Header;
