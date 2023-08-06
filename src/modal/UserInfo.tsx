import React, { useEffect, useRef } from "react";
import { Auth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./UserInfo.css";

interface T {
  auth: Auth;
  setOpenUserInfo: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserInfo = ({ auth, setOpenUserInfo }: T) => {
  const navigagte = useNavigate();

  const userInfoBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeModalHandler = (e: MouseEvent) => {
      if (!userInfoBoxRef.current!.contains(e.target as HTMLElement)) {
        setTimeout(() => {
          setOpenUserInfo(false);
        }, 100);
      }
    };

    document.addEventListener("mousedown", closeModalHandler);
    return () => {
      document.removeEventListener("mousedown", closeModalHandler);
    };
  });

  const logoutHandler = () => {
    signOut(auth)
      .then(() => {
        navigagte("/");
      })
      .catch((err) => {
        console.log(err);
        alert("로그아웃 실패 했습니다!");
      });
  };

  return (
    <div className="user-info-box" ref={userInfoBoxRef}>
      <div className="user-info-name">{auth.currentUser!.displayName}</div>
      <div className="user-info-email">{auth.currentUser!.email}</div>
      <div className={"user-info-box-logout"} onClick={logoutHandler}>
        로그아웃
      </div>
    </div>
  );
};

export default UserInfo;
