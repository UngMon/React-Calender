import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { newYear, newMonth } from "../utils/nowDate";
import "./NotFound.css";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="Not-Found-Container">
      <NavLink to={`/calender/date?year=${newYear}&month=${newMonth}`}>
        <span>Your Calender</span>
      </NavLink>
      <h2>
        죄송합니다. <br /> 요청하신 페이지를 찾을 수 없습니다.
      </h2>
      <p>페이지의 주소가 잘못 입력되었거나,</p>
      <p>
        페이지의 주소가 변경 혹은 삭제되어 요청하신 페이지를 찾을 수 없습니다.
      </p>
      <button onClick={() => navigate(-1)}>
        <span>뒤로 가기</span>
      </button>
    </div>
  );
};

export default NotFound;
