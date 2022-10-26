import { useEffect } from "react";
import Header from "./navigation/Header";
import Month from "./calender/Month";
import { useDispatch, useSelector } from "react-redux";
import { fetchScheduleData, sendScheduleData } from "./store/fetch-action";
import { Navigate, Route, Routes } from "react-router-dom";
import CalenderLogin from "./pages/LoginPage";
import StartPage from "./pages/StartPage";

function App() {
  const dispatch = useDispatch();

  const modal = useSelector((state) => state.modal);

  useEffect(() => {
    dispatch(fetchScheduleData());
    console.log("fetch");
  }, [dispatch]);

  useEffect(() => {
    if (modal.changed) {
      console.log("작동여부");
      dispatch(sendScheduleData(modal.schedule));
    }
  }, [modal, dispatch]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate replace to="/start" />} />
        <Route path="/start" element={<StartPage />} />
        <Route path="/login" element={<CalenderLogin />}>
          <Route path="your-calender-login" />
          <Route path="google-login" />
        </Route>
        <Route path="/header" element={<Header />} />
        <Route path="/month" element={<Month />} />
        <Route path="*" element={<Navigate replace to="/login" />} />
      </Routes>
    </>
  );
}

export default App;
