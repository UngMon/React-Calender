import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { modalActions } from "./store/modal-slice";
import { fetchScheduleData, sendScheduleData } from "./store/fetch-action";
import { Navigate, Route, Routes } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./Auth/firebase";
import Month from "./calender/Month";
import StartPage from "./pages/StartPage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";

function App() {
  const dispatch = useDispatch();

  const modal = useSelector((state) => state.modal);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const userEmail = user.email
        setIsLoggedIn(user);
        dispatch(modalActions.setUserInfo({userEmail}))
      } else {
        setIsLoggedIn(false);
      }
    });
  }, []);

  useEffect(() => {
    dispatch(fetchScheduleData());
    console.log("fetch");
  }, [dispatch]);

  useEffect(() => {
    if (modal.changed) {
      console.log("작동여부");
      dispatch(sendScheduleData(modal.userData));
    }
  }, [modal, dispatch]);

  return (
    <>
      <Routes>
        {!isLoggedIn && (
          <Route path="/" element={<Navigate replace to="/start" />} />
        )}
        <Route path="/start" element={<StartPage />} />
        {!isLoggedIn && <Route path="/login" element={<LoginPage />} />}
        {isLoggedIn && (
          <Route path="/calender" element={<Month userInfo={isLoggedIn} />} />
        )}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
