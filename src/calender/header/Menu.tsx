import React from "react";
import { auth } from "../../Auth/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { faRightFromBracket, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Menu.css";

interface T {
  openMenu: boolean;
  setOpenMenu: (type: boolean) => void;
}

const Menu = ({ openMenu, setOpenMenu }: T) => {
  const navigate = useNavigate();

  const logoutHandler = () => {
    signOut(auth)
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        alert("로그아웃 실패 했습니다!");
      });
  };

  return (
    <div className={`menu ${openMenu ? "open" : "offf"}`}>
      <div className="xmark" onClick={() => setOpenMenu(false)}>
        <FontAwesomeIcon icon={faXmark} />
      </div>
      <div className="user-info">
        <div className="user-image">
          <img src={auth.currentUser?.photoURL || ""} alt="user" width="45" />
        </div>
        <div className="user-name">
          <span>{auth.currentUser?.displayName}</span>
        </div>
        <div className="user-email">
          <span>{auth.currentUser?.email}</span>
        </div>
        <div className="logout" onClick={logoutHandler}>
          <FontAwesomeIcon icon={faRightFromBracket} />
        </div>
      </div>
    </div>
  );
};

export default Menu;
