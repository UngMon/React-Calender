/* eslint-disable */
import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../Auth/firebase";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { useDispatch } from "react-redux";
import { userActions } from "../store/userSlice";
import { Link } from "react-router-dom";
import classes from "./LoginPage.module.css";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigagte = useNavigate();

  const [isLogin, setIsLogin] = useState(false);
  //   const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  const [isEmail, setIsEmail] = useState('');
  const [isPassword, setIsPassword] = useState(false);
  const [emailMessage, setEmailMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');

  const onConfirmEmail = useCallback((e) => {
    const regex = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

    if (regex.test(e.target.value)) {
      setEmailMessage('이메일 형식이 틀렸어요! ex)abc@abc.com');
      setIsEmail(true);
    } else {
      setEmailMessage('올바른 이메일 형식이에요! ');
      setIsEmail(false);
    }
  }, [])

  const confirmPassword = useCallback((e) => {
    
    if (e.target.value.trim() !== "") {
      setPasswordMessage('올바른 형식이에요!')
      setIsPassword(true);
    } else {
      setEmailMessage('패스워드를 입력해주세요!')
      setIsPassword(false);
    }
  }, []);

  const googleSignIn = (event) => {
    // 구글 로그인을 위한 구글 provider 객체 생성
    const provider = new GoogleAuthProvider();
    event.preventDefault();
    console.log(auth);
    console.log(provider);
    signInWithPopup(auth, provider)
      .then((data) => {
        console.log(data);
        setUserData(data.user);
        dispatch(userActions(data.user.email));
        navigagte("/month");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const logOut = () => {
    signOut(auth)
      .then((data) => {
        setUserData(null);
        console.log(data);
      })
      .catch((err) => alert(err));
  };

  const loginFormHandler = (event) => {
    event.preventDefault();
  };

  const toggleButtonHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  return (
    <section className={classes["login-box"]}>
      <div className={classes["login-box-header"]}>
        <Link className={classes["back"]} to="/start">
          뒤로가기
        </Link>
        <h1 className={classes["login-box-title"]}>
          {isLogin ? "Login" : "Sign Up"}
        </h1>
      </div>
      <form className={classes["login-form"]} onSubmit={loginFormHandler}>
        <div className={classes["login-id"]}>
          <label htmlFor="email">Your Email</label>
          <input
            type="text"
            id="emial"
            onChange={onConfirmEmail}
          />
          <p style={{color: isEmail ? 'lightgray' : 'red'}}>{emailMessage}</p>
        </div>
        <div className={classes["login-password"]}>
          <label htmlFor="password">Your password</label>
          <input
            type="password"
            id="password"
            value={isPassword}
            onChange={confirmPassword}
          />
          <p style={{color: isPassword ? 'lightgray' : 'red'}}>{passwordMessage}</p>
        </div>
        <div className={"login-selector"}>
          <button>{isLogin ? "Login" : "Create Account"}</button>
          <button type="button" onClick={toggleButtonHandler}>
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
      {!userData && (
        <button type="button" onClick={googleSignIn}>
          Google 로그인
        </button>
      )}
      {userData ? userData.displayName : null}
      {userData && <button onClick={logOut}>로그아웃</button>}
    </section>
  );
};

export default LoginPage;
