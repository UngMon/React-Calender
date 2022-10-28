import classes from "./Header.module.css";
import { auth } from "../Auth/firebase";
import { signOut } from "firebase/auth";

const Header = () => {
  const logoutHandler = () => {
    signOut(auth)
      .then((data) => console.log(data))
      .catch((err) => {
        alert("로그아웃 실패");
        console.log(err);
      });
  };

  return (
    <header className={classes.header}>
      <div>Your Calender</div>
      <div></div>
      <nav>
        <ul>
          <li>프로필</li>
          <li onClick={logoutHandler}>Logout</li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;

//  const logOut = () => {
//   signOut(auth)
//   .then((data) => {
//     setUserData(null);
//     console.log(data);
//   })
//   .catch((err) => alert(err));
// };
