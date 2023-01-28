import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { auth } from "../Auth/firebase";
import { signOut } from "firebase/auth";
import { modalActions } from "../store/modal-slice";
import "./UserInfo.css";

const UserInfo = ({ userInfo }) => {
  const dispatch = useDispatch();
  const navigagte = useNavigate();

  const logoutHandler = () => {
    signOut(auth)
      .then((res) => {
        localStorage.removeItem("email");
        dispatch(modalActions.logout());
        navigagte("/");
      })
      .catch((err) => {
        alert("로그아웃 실패");
        localStorage.clear();
      });
  };

  return (
    <div className="user-info-box">
      <div className="user-info-name">{userInfo.name}</div>
      <div className="user-info-email">{userInfo.email}</div>
      <div
        className={"user-info-box-logout"}
        to="/login"
        onClick={logoutHandler}
      >
        로그아웃
      </div>
    </div>
  );
};

export default UserInfo;
