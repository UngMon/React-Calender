import { useState } from "react";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../auth/firebase";
import "./User.css";

const User = () => {
  const navigagte = useNavigate();
  const [open, setOpen] = useState<boolean>(false);

  const logoutHandler = () => {
    signOut(auth)
      .then(() => {
        navigagte("/");
      })
      .catch((error) => {
        console.error(error);
        alert("로그아웃 오류 발생");
      });
  };

  return (
    <div className="user">
      <div className="user__image" onClick={() => setOpen(!open)}>
        <img src={auth.currentUser?.photoURL || ""} alt="user" />
      </div>
      {open && (
        <div className="user__menu">
          <div className="xmark" onClick={() => setOpen(false)}>
            <span className="material-symbols-outlined">close_small</span>
          </div>
          <div className="user__menu-info">
            <div className="user-image">
              <img
                src={auth.currentUser?.photoURL || ""}
                alt="user"
                width="45"
              />
            </div>
            <div className="user__menu-name">
              <span>{auth.currentUser?.displayName}</span>
            </div>
            <div className="user__menu-email">
              <span>{auth.currentUser?.email}</span>
            </div>
            <div className="user__menu-logout" onClick={logoutHandler}>
              <span className="material-symbols-outlined">logout</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default User;
