import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";
import "./User.css";

const User = () => {
  const { photoURL, displayName, uid } = useAuthStore();
  const handleLogout = useAuth().logout;

  const navigagte = useNavigate();
  const [open, setOpen] = useState<boolean>(false);
  // 모달 바깥 영역을 닫기 위한 커스텀 훅
  const userMenuRef = useClickOutside(() => setOpen(false));

  const logoutHandler = async () => {
    try {
      await handleLogout();
      navigagte("/login", { replace: true });
    } catch (erorr: any) {
      console.error("에러가 발생했습니다.", erorr.message);
      alert("에러가 발생했습니다.");
    }
  };

  return (
    <div className="header__user" ref={userMenuRef}>
      <div className="header__user__image" onClick={() => setOpen(!open)}>
        {uid ? (
          <img src={photoURL || ""} alt="user" />
        ) : (
          <div className="header__user__not-found"></div>
        )}
      </div>
      {open && (
        <div className="header__user__menu">
          <div className="xmark" onClick={() => setOpen(false)}>
            <span className="material-symbols-outlined">close_small</span>
          </div>
          <div className="header__user__info">
            <div className="header__user__info-image">
              <img src={photoURL || ""} alt="user" />
            </div>
            <div className="header__user__info-name">
              <span>{displayName || ""}님</span>
            </div>
          </div>
          <ul className="header__user__list">
            <li>
              <button
                type="button"
                id="flex-center"
                onClick={() => navigagte("/user")}
              >
                <span className="material-symbols-outlined">
                  settings_cinematic_blur
                </span>
                <span>계정설정</span>
              </button>
            </li>
            <li>
              <button type="button" id="flex-center" onClick={logoutHandler}>
                <span className="material-symbols-outlined">logout</span>
                <span>로그아웃</span>
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default User;
