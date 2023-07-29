import { auth } from "./Auth/firebase";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchScheduleData, sendScheduleData } from "./store/fetch-action";
import { Navigate, Route, Routes } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import Loading from "./pages/Loading";
import LoginPage from "./pages/LoginPage";
import ResetPage from "./pages/ResetPage";
import Month from "./calender/Month";
import NotFound from "./pages/NotFound";

function App() {
  console.log("app");

  const dispatch = useDispatch();
  const modal = useSelector((state) => state.modal);
  const loginData = localStorage.getItem("userInfo") || undefined;

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(fetchScheduleData(JSON.parse(loginData)));
      }
    });
  }, [dispatch, loginData]);

  useEffect(() => {
    if (modal.dataChanged) {
      dispatch(sendScheduleData(modal.userSchedule, modal.uid));
    }
  }, [dispatch, modal]);

  return (
    <Routes>
      {!loginData && <Route path="/" element={<LoginPage />} />}
      {!loginData && <Route path="/reset-password" element={<ResetPage />} />}
      {!loginData && <Route path="/*" element={<NotFound />} />}
      {loginData && modal.isLoading && <Route path="*" element={<Loading />} />}
      {loginData && !modal.isLoading && (
        <Route path="/calender" element={<Month userInfo={loginData}/>} />
      )}
      {modal.isLogin && (
        <Route path="*" element={<Navigate to="/calender" />} />
      )}
    </Routes>
  );
}

export default App;
