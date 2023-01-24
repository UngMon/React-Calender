import { auth } from "./Auth/firebase";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchScheduleData, sendScheduleData } from "./store/fetch-action";
import { Navigate, Route, Routes } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import Loading from "./pages/Loading";
import LoginPage from "./pages/LoginPage";
import Month from "./calender/Month";


function App() {
  console.log("app");
  
  const dispatch = useDispatch();
  const modal = useSelector((state) => state.modal);
  const loginData = localStorage.getItem("email") || undefined;

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(fetchScheduleData(user));
      }
    });
  }, [dispatch]);

  useEffect(() => {
    if (modal.changed) {
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
