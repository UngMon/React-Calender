import React, { useEffect, useState } from "react";
import { useAppDispatch } from "./redux/store";
import { Route, Navigate, Routes } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./Auth/firebase";
import { getUserData } from "./redux/fetch-action";
import ResetPage from "./pages/ResetPage";
import Calender from "./calender/Calender";
import Result from "./pages/Result";
import Loading from "./ui/Loading";
import LoginPage from "./pages/LoginPage";
import MakeEvent from "./pages/MakeEvent";

function App() {
  console.log("app");
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState<boolean>(true);
  const [loggedIn, setLogged] = useState<boolean>(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(getUserData(user.uid));
        setLogged(true);
      } else setLogged(false);
    });
    setLoading(false);
  }, [dispatch]);

  return (
    <Routes>
      {!loggedIn && !loading && <Route path="/" element={<LoginPage />} />}
      {!loggedIn && <Route path="/reset-password" element={<ResetPage />} />}
      {loading && <Route path="*" element={<Loading />} />}
      {!loading && loggedIn && (
        <Route path="/calender">
          <Route
            path=":date"
            element={<Calender loading={loading} loggedIn={loggedIn} />}
          />
          <Route path='makeEvent' element={<MakeEvent/>}/>
        </Route>
      )}
      {loggedIn && (
        <Route
          path="*"
          element={<Navigate to="/calender/date?year=2023&month=8" />}
        />
      )}
      {loggedIn && <Route path=":search" element={<Result />} />}
    </Routes>
  );
}

export default App;
