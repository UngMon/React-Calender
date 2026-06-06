import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { authActions, useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";
import "./User.css";

const User = () => {
  const { photoURL, displayName, email, isLoading } = useAuthStore();
  const { clearAuth } = authActions;
  const handleLogout = useAuth().logout;

  const navigagte = useNavigate();
  const [open, setOpen] = useState<boolean>(false);

  const logoutHandler = async () => {
    try {
      await handleLogout();
      clearAuth();
      navigagte("/login", { replace: true });
    } catch (erorr: any) {
      console.error("에러가 발생했습니다.", erorr.message);
      alert("에러가 발생했습니다.");
    }
  };

  return (
    <div className="user">
      <div className="user__image" onClick={() => setOpen(!open)}>
        <img src={photoURL || ""} alt="user" />
      </div>
      {open && (
        <div className="user__menu">
          <div className="xmark" onClick={() => setOpen(false)}>
            <span className="material-symbols-outlined">close_small</span>
          </div>
          <div className="user__menu-info">
            <div className="user-image">
              <img src={photoURL || ""} alt="user" width="45" />
            </div>
            <div className="user__menu-name">
              <span>{displayName || ""}</span>
            </div>
            <div className="user__menu-email">
              <span>{email || ""}</span>
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
