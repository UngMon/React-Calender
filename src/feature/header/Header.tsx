import Menu from "./Menu";
import Logo from "./Logo";
import CalendarSwitcher from "./CalendarSwitcher";
import Search from "./Search";
import ViewMode from "./ViewMode";
import User from "./User";
import "./Header.css";
import Today from "./Today";

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
