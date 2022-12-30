import { auth } from "./Auth/firebase";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchScheduleData, sendScheduleData } from "./store/fetch-action";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import Loading from "./pages/Loading";
import LoginPage from "./pages/LoginPage";
import Month from "./calender/Month";
// import NotFound from "./pages/NotFound";

function App() {
  console.log("app");
  const dispatch = useDispatch();
  // const navigagte = useNavigate();
  const modal = useSelector((state) => state.modal);
  const loginData = localStorage.getItem("email") || undefined;

  // console.log(loginData)
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
        dispatch(fetchScheduleData(user));
      }
    });
  }, [dispatch]);

  useEffect(() => {
    if (modal.changed) {
      console.log("작동여부");
      dispatch(sendScheduleData(modal.userData));
    }
  }, [modal, dispatch]);

  return (
    <Routes>
      {!loginData && <Route path="/login" element={<LoginPage />} />}
      {!loginData && (
        <Route path="*" element={<Navigate replace to="/login" />} />
      )}
      {loginData && modal.isLoading && <Route path="*" element={<Loading />} />}
      {loginData && !modal.isLoading && (
        <Route path="/calender" element={<Month />} />
      )}
      {modal.isLogin && <Route path="*" element={<Navigate to="/calender" />} />}
    </Routes>
  );
}

export default App;
