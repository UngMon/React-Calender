import React, { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { auth } from "../../auth/firebase";
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
    if (type === "search") navigate(-1);
    else setOpenSearch(false);
  };

  const menuClickHandler = () => {
    setOpenMenu(!openMenu);
  };

  useEffect(() => {
    if (type === "search" && !openSearch) return setOpenSearch(true);
    if (type === "search" || !openSearch) return;

    const clickHandler = (e: MouseEvent) => {
      const target = e.target as Node;

      if (backRef.current!.contains(target)) return;

      if (!formRef.current!.contains(target)) setOpenSearch(false);
    };

    window.addEventListener("click", clickHandler);

    return () => window.removeEventListener("click", clickHandler);
  }, [openSearch, type]);

  return (
    <header className="header">
      <div className="header-box">
        <Menu openMenu={openMenu} setOpenMenu={setOpenMenu} />
        <div className="menu-icon">
          <FontAwesomeIcon icon={faBars} onClick={menuClickHandler} />
        </div>
        {!openSearch && type === "calender" && (
          <NavLink
            className="header-title"
            to={`/calender/date?year=${year}&month=${month}`}
          >
            <span>Your Calender</span>
          </NavLink>
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
            <button onClick={movePrevMonth}>
              <FontAwesomeIcon icon={faAngleLeft} />
            </button>
            <div>
              <span>
                {+year! === fixYear ? `${+month!}월` : `${year}년 ${+month!}월`}
              </span>
            </div>
            <button onClick={moveNextMonth}>
              <FontAwesomeIcon icon={faAngleRight} />
            </button>
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
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenSearch(true);
              }}
            >
              <FontAwesomeIcon icon={faSearch} />
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
