import Menu from "./menu/Menu";
import Logo from "./logo/Logo";
import CalendarSwitcher from "./switcher/CalendarSwitcher";
import Search from "./search/Search";
import ViewMode from "./viewmode/ViewMode";
import User from "./user/User";
import Today from "./today/Today";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="header__box">
        <Menu />
        <Logo />
        <CalendarSwitcher />
      </div>
      <div className="header__box">
        <Search />
        <ViewMode />
        <Today />
        <User />
      </div>
    </header>
  );
};

export default Header;
