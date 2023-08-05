import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { auth } from "../Auth/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Loading from "./Loading";
import LoginPage from "./LoginPage";

const Root = () => {
  console.log(auth.currentUser?.uid);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLogged, setIsLogged] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
        setIsLogged(true);
        // dispatch(getUserData(user.uid)));
      } else {
        setIsLogged(false);
      }
    });
    setLoading(false);
  }, [navigate]);

  return (
    <>
      {/* <Loading /> */}
      {/* {!loading && !isLogged && <Navigate to="/login" />} */}
      <Outlet />
    </>
  );
};

export default Root;
