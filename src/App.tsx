import React, { useEffect, useState } from "react";
import { Route, Navigate, Routes } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./Auth/firebase";
import { getUserData } from "./redux/fetch-action";
import ResetPage from "./pages/ResetPage";
import NotFound from "./pages/NotFound";
import Calender from "./calender/Calender";
import LoginPage from "./pages/LoginPage";
import Loading from "./pages/Loading";
import { useAppDispatch } from "./redux/store";

function App() {
  console.log("app");
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState<boolean>(true);
  const [loggedIn, setLogged] = useState<boolean>(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user)
        dispatch(getUserData(user.uid));
        setLogged(true);
      } else {
        setLogged(false);
      }
    });
    setLoading(false);
  }, [dispatch]);

  //  useEffect(() => {
  //   if (modal.dataChanged) {
  //     dispatch(sendScheduleData(modal.userSchedule.schedule, modal.uid));
  //   }
  // }, [dispatch, modal]);

  return (
    <Routes>
      {!loggedIn && <Route path="/" element={<LoginPage />} />}
      {!loggedIn && <Route path="/reset-password" element={<ResetPage />} />}
      {loading && <Route path="*" element={<Loading />} />}
      {!loading && loggedIn && (
        <Route path="/calender">
          <Route
            path=":date"
            element={<Calender loading={loading} loggedIn={loggedIn} />}
          />
        </Route>
      )}
      {loggedIn && (
        <Route
          path="*"
          element={<Navigate to="/calender/date?year=2023&month=7" />}
        />
      )}
    </Routes>
  );
}

export default App;
