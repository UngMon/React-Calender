import React, { useEffect, useState } from "react";
import { useAppDispatch } from "./redux/store";
import { Navigate, Route, Routes } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./auth/firebase";
import { getUserData } from "./redux/fetch-action";
import ResetPage from "./pages/ResetPage";
import Content from "./calender/Content";
import Result from "./pages/Result";
import Loading from "./ui/loading/Loading";
import LoginPage from "./pages/LoginPage";
import MakeEvent from "./pages/MobileMakeEvent";
import NotFound from "./pages/NotFound";

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
      {!loggedIn && !loading && <Route path="/" element={<LoginPage />} />}
      {!loggedIn && !loading && (
        <Route path="/reset-password" element={<ResetPage />} />
      )}
      {!loading && loggedIn && (
        <Route path="/calender/*">
          <Route path="date" element={<Content />} />
          <Route path="event">
            <Route path="edit" element={<MakeEvent />} />
            <Route path="make" element={<MakeEvent />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      )}
      {!loading && loggedIn && (
        <Route path="*" element={<Navigate to={"/calender/date"} />} />
      )}
      {loggedIn && <Route path="/search" element={<Result />} />}
      {loading && <Route path="*" element={<Loading />} />}
      {!loading && <Route path="*" element={<NotFound />} />}
    </Routes>
  );
}

export default App;
