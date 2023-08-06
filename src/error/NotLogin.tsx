import React from "react";
import { useNavigate } from "react-router-dom";
import "./NotLogin.module.css";

const NotLogin = () => {
  const naviagte = useNavigate();

  return (
    <div className="NotLogin">
      <h2>404 Not Found!</h2>
      <p>로그인 하시면 이용하실 수 있습니다!</p>
      <button onClick={() => naviagte("/")}>로그인 하기</button>
    </div>
  );
};

export default NotLogin;
