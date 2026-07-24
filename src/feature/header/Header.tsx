import Menu from "./menu/Menu";
import Logo from "./logo/Logo";
import CalendarSwitcher from "./switcher/CalendarSwitcher";
import Search from "./search/Search";
import ViewMode from "./viewmode/ViewMode";
import User from "./user/User";
import Today from "./today/Today";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import "./Header.css";

const Header = () => {
  const isDesktop = useMediaQuery("(min-width: 800px)");

  return (
    <header className="header">
      <div className="header__box header__left">
        {!isDesktop && <Menu />}
        <Logo />
      </div>
      <CalendarSwitcher />
      <div className="header__box header__right">
        <Search />
        {isDesktop && <ViewMode />}
        <Today />
        {isDesktop && <User />}
      </div>
    </header>
  );
};

export default Header;
