import { useEffect, useState } from "react";
import Month from "./calender/Month";
import { useDispatch, useSelector } from "react-redux";
import { fetchScheduleData, sendScheduleData } from "./store/fetch-action";
import { Navigate, Route, Routes } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./Auth/firebase";
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
        console.log(user)
        setIsLoggedIn(user);
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
        {!isLoggedIn && <Route path="/" element={<Navigate replace to="/start" />} />}
        <Route path="/start" element={<StartPage />} />
        {!isLoggedIn && <Route path="/login" element={<LoginPage />} />}
        {isLoggedIn && <Route path="/calender" element={<Month userInfo={isLoggedIn}/>} />}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
