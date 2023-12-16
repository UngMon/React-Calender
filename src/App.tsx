import React, { useEffect, useState } from "react";
import { useAppDispatch } from "./redux/store";
import { Route, Navigate, Routes } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./Auth/firebase";
import { getUserData } from "./redux/fetch-action";
import ResetPage from "./pages/ResetPage";
import Content from "./calender/Content";
import Result from "./pages/Result";
import Loading from "./ui/Loading";
import LoginPage from "./pages/LoginPage";
import MakeEvent from "./pages/MobileMakeEvent";
import NotFound from "./error/NotFound";

// const newDate = new Date();
// const year = newDate.getFullYear();
// const month = newDate.getMonth() + 1;
// let isMount = true;

function App() {
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState<boolean>(true);
  const [loggedIn, setLogged] = useState<boolean>(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(getUserData(user.uid));
        setLogged(true);
        setLoading(false);
      } else {
        setLogged(false);
        setLoading(false);
      }
    });
  }, [dispatch]);

  return (
    <Routes>
      <Route path="*" element={<NotFound />} />
      {!loggedIn && !loading && <Route path="/" element={<LoginPage />} />}
      {!loggedIn && !loading && (
        <Route path="/reset-password" element={<ResetPage />} />
      )}
      {loading && <Route path="*" element={<Loading />} />}
      {!loading && loggedIn && (
        <Route path="/calender">
          <Route path=":date" element={<Content />} />
          <Route path="event">
            <Route path="edit" element={<MakeEvent />} />
            <Route path="make" element={<MakeEvent />} />
          </Route>
        </Route>
      )}
      {loggedIn && (
        <Route path="/search">
          <Route path=":search" element={<Result />} />
        </Route>
      )}
    </Routes>
  );
}

export default App;
