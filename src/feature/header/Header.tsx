import Logo from "./Logo";
import CalendarSwitcher from "./CalendarSwitcher";
import Search from "./Search";
import ViewMode from "./ViewMode";
import User from "./User";
import "./Header.css";

const Header = () => {

  return (
    <header className="header">
      <div className="header__box">
        <Logo />
        <CalendarSwitcher />
      </div>
      <div className="header__box">
        <Search />
        <ViewMode />
        <User />
      </div>
    </header>
  );
};

export default Header;
