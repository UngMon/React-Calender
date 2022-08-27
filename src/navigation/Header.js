import classes from "./Header.module.css";

const Header = () => {
  return (
    <header className={classes.header}>
      <div>Calender</div>
      <nav>
        <ul>
          <li>Login</li>
          <li>Logout</li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
