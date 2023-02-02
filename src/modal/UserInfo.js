import { useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { auth } from "../Auth/firebase";
import { signOut } from "firebase/auth";
import { modalActions } from "../store/modal-slice";
import "./UserInfo.css";
import { useEffect } from "react";

const UserInfo = ({ userInfo, setOpenUserInfo }) => {
  const dispatch = useDispatch();
  const navigagte = useNavigate();

  const userInfoBoxRef = useRef();

  const closeModalHandler = (e) => {
    if (!userInfoBoxRef.current.contains(e.target)) {
      setTimeout(() => {
        setOpenUserInfo(false);
      }, [100]);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', closeModalHandler);
    return () => {
        document.removeEventListener("mousedown", closeModalHandler);
      };
  });

  const logoutHandler = () => {
    signOut(auth)
      .then((res) => {
        localStorage.removeItem("email");
        dispatch(modalActions.logout());
        navigagte("/");
      })
      .catch((err) => {
        alert("로그아웃 실패");
        localStorage.clear();
      });
  };

  return (
    <div className="user-info-box" ref={userInfoBoxRef}>
      <div className="user-info-name">{userInfo.name}</div>
      <div className="user-info-email">{userInfo.email}</div>
      <div
        className={"user-info-box-logout"}
        to="/login"
        onClick={logoutHandler}
      >
        로그아웃
      </div>
    </div>
  );
};

export default UserInfo;
