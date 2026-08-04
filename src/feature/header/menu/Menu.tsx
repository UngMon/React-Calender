import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { useClickOutside } from "@/hooks/useClickOutside";
import { getYMDString } from "@/utils/getTodayString";
import "./Menu.css";

const Menu = () => {
  const navigate = useNavigate();

  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const { photoURL, displayName } = useAuthStore();
  const { logout } = useAuth();

  const menuRef = useClickOutside(() => setOpenMenu(false));

  const handleClickMenu = () => {
    setOpenMenu(!openMenu);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  };

  const handleNavi = (view: string, type: string) => {
    navigate(`/calendar/${view}/${getYMDString(type)}`);
  };

  return (
    <div className="menu-container" ref={menuRef}>
      <div className="menu__icon">
        <button type="button" onClick={handleClickMenu}>
          <span className="material-symbols-outlined">dehaze</span>
        </button>
      </div>
      <div className={`menu-box ${openMenu ? "menu-open" : ""}`}>
        <div className="menu-box__close">
          <button type="button" onClick={handleClickMenu}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="menu-box__user">
          <div className="menu-box__user-image">
            <img src={photoURL || ""} alt="user" width="45" />
          </div>
          <div className="menu-box__user-name">
            <span>{displayName || "User"}님</span>
          </div>
          <div className="menu-box__user-logout">
            <button id="flex-center" type="button" onClick={handleLogout}>
              <span className="material-symbols-outlined">logout</span>
              <span>로그아웃</span>
            </button>
          </div>
        </div>
        <ul className="menu-box__list">
          <li>
            <button type="button" onClick={() => handleNavi('year', 'Y')}>
              <span className="material-symbols-outlined">calendar_month</span>
              <span>년</span>
            </button>
          </li>
          <li>
            <button type="button" onClick={() => handleNavi('month', 'M')}>
              <span className="material-symbols-outlined">edit_calendar</span>
              <span>월</span>
            </button>
          </li>
          <li>
            <button type="button" onClick={() => handleNavi('week', 'W')}>
              <span className="material-symbols-outlined">date_range</span>
              <span>주</span>
            </button>
          </li>
          <li>
            <button type="button" onClick={() => handleNavi('day', 'D')}>
              <span className="material-symbols-outlined">event</span>
              <span>일</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Menu;
