import { auth } from "./Auth/firebase";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchScheduleData, sendScheduleData } from "./store/fetch-action";
import { Navigate, Route, Routes } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import Loading from "./pages/Loading";
import LoginPage from "./pages/LoginPage";
import Month from "./calender/Month";
import NotFound from "./pages/NotFound";

function App() {
  console.log("app");
  console.log(auth.currentUser)

  const dispatch = useDispatch();

  const modal = useSelector((state) => state.modal);

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) {
        dispatch(fetchScheduleData(user));
      }
    })
  }, [dispatch]);

  useEffect(() => {
    if (modal.changed) {
      console.log("작동여부");
      dispatch(sendScheduleData(modal.userData));
    }
  }, [modal, dispatch]);

  return (
    <Routes>
      {!modal.isLogin && <Route path="/login" element={<LoginPage />} />}
      {!modal.isLogin && (
        <Route path="*" element={<Navigate replace to="/login" />} />
      )}
      {modal.isLogin && <Route path="/calender" element={<Month />} />}
      {modal.isLogin && (
        <Route path="*" element={<Navigate replace to="/calender" />} />
      )}
    </Routes>
  );
}

export default App;
