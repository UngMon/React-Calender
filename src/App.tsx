import React, { useEffect, useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
  Navigate,
  Routes,
} from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./Auth/firebase";
import ResetPage from "./pages/ResetPage";
import NotFound from "./pages/NotFound";
import Root from "./pages/Root";
import Calender from "./calender/Calender";
import LoginPage from "./pages/LoginPage";
import Loading from "./pages/Loading";

function App() {
  console.log("app");
  const [loading, setLoading] = useState<boolean>(true);
  const [loggedIn, setLogged] = useState<boolean>(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
        // dispatch(getUserData(user.uid)));
        setLogged(true);
      }
    });
    setLoading(false);
  }, []);

  //  useEffect(() => {
  //   if (modal.dataChanged) {
  //     dispatch(sendScheduleData(modal.userSchedule.schedule, modal.uid));
  //   }
  // }, [dispatch, modal]);

  // const router = createBrowserRouter(
  //   createRoutesFromElements(
  //     <Route >
  //       <Route path="/" element={<LoginPage />} />
  //       <Route path="/reset-password" element={<ResetPage />} />
  //       <Route path="/calender">
  //         <Route
  //           path=":date"
  //           element={<Calender loading={loading} loggedIn={loggedIn} />}
  //         />
  //       </Route>
  //       <Route path="*" element={<Navigate to="/login" />} />
  //       <Route path="*" element={<NotFound />}></Route>
  //     </Route>
  //   )
  // );

  // return <RouterProvider router={router} />;

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
    {loggedIn && <Route path="*" element={<Navigate to="/calender/date?year=2023&month=7" />} />}
  </Routes>
);
}

export default App;


