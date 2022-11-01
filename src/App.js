import { useEffect } from "react";
import Month from "./calender/Month";
import { useDispatch, useSelector } from "react-redux";
import { fetchScheduleData, sendScheduleData } from "./store/fetch-action";
import { Navigate, Route, Routes } from "react-router-dom";
import StartPage from "./pages/StartPage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";

function App() {
  const dispatch = useDispatch();

  const modal = useSelector((state) => state.modal);

  useEffect(() => {
    if (modal.isStart) {
      dispatch(fetchScheduleData());
    }
    console.log("fetch");
  }, [modal, dispatch]);

  useEffect(() => {
    if (modal.changed) {
      console.log("작동여부");
      dispatch(sendScheduleData(modal.userData));
    }
  }, [modal, dispatch]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate replace to="/start" />} />
        <Route path="/start" element={<StartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/calender" element={<Month />} />
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </>
  );
}

export default App;
