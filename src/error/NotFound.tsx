import React from "react";
import { useNavigate } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="NF-Container">
      <ul>
        <li>
          <span>Error&nbsp;404</span>
        </li>
        <li>
          <span>이런!😅&nbsp;&nbsp;페이지를 찾을 수 없습니다</span>
        </li>
        <li>
          <button onClick={() => navigate(-1)}>뒤로 가기</button>
        </li>
      </ul>
    </div>
  );
};

export default NotFound;
