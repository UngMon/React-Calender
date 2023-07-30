import React, { useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
// import Loading from "./pages/Loading";
// import LoginPage from "./pages/LoginPage";
import ResetPage from "./pages/ResetPage";
import NotFound from "./pages/NotFound";
import Root from "./pages/Root";
import Month from "./calender/Calender";

function App() {
  console.log("app");
  // useEffect(() => {
  //   onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       dispatch(fetchScheduleData(JSON.parse(loginData)));
  //     }
  //   });
  // }, [dispatch, loginData]);

  //  useEffect(() => {
  //   if (modal.dataChanged) {
  //     dispatch(sendScheduleData(modal.userSchedule.schedule, modal.uid));
  //   }
  // }, [dispatch, modal]);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="" element={<Root />}>
        <Route path="/reset-password" element={<ResetPage />} />
        <Route path="/reset-password" element={<ResetPage />} />
        <Route path="/calender">
          <Route path=":dateParams" element={<Month />} />
        </Route>
        <Route path="*" element={<NotFound />}></Route>
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
// <Routes>
//   {!loginData && <Route path="/" element={<LoginPage />} />}
//   {!loginData && <Route path="/reset-password" element={<ResetPage />} />}
//   {!loginData && <Route path="/*" element={<NotFound />} />}
//   {loginData && modal.isLoading && <Route path="*" element={<Loading />} />}
//   {loginData && !modal.isLoading && (
//     <Route path="/calender" element={<Month userInfo={loginData}/>} />
//   )}
//   {modal.isLogin && (
//     <Route path="*" element={<Navigate to="/calender" />} />
//   )}
// </Routes>
