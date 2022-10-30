/* eslint-disable */
import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../Auth/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useDispatch } from "react-redux";
import { userActions } from "../store/userSlice";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import classes from "./LoginPage.module.css";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigagte = useNavigate();

  // 회원가입 인지 아닌지~
  const [creatingUser, setCreatingUser] = useState(false);

  // 이메일과 패스워드 state
  const [name, setName] = useState("");
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [passwordConfirm, setPasswordConfirm] = useState("");

  // 이메일과 패스워드 유효성 검사 state
  const [isName, setIsName] = useState(false);
  const [isEmail, setIsEmail] = useState(false);
  const [isPassword, setIsPassword] = useState(false);
  const [isPasswordConfirm, setIsPasswordConfirm] = useState(false);

  // 이메일과 패스워드 에러메시지 state
  const [nameMessage, setNameMessage] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordConfirmMessage, setPasswordConfirmMessage] = useState("");

  const onChangeName = useCallback((e) => {
    setName(e.target.value);
    if (e.target.value.length < 2 || e.target.value.length > 5) {
      setNameMessage("2글자 이상 5글자 미만으로 입력해주세요.");
      setIsName(false);
      setName("");
    } else {
      setNameMessage("올바른 이름 형식입니다 ");
      setIsName(true);
      setName(e.target.value);
    }
  }, []);

  const onConfirmEmail = useCallback((e) => {
    const regex =
      /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

    if (regex.test(e.target.value)) {
      setEmailMessage("올바른 이메일 형식이에요! ");
      setIsEmail(true);
      setEmail(e.target.value);
    } else {
      setEmailMessage("이메일 형식이 틀렸어요! ex)abc@abc.com");
      setIsEmail(false);
      setEmail("");
    }

    if (e.target.value.trim() === "") {
      setEmailMessage("");
    }
  }, []);

  const confirmPassword = useCallback((e) => {
    if (e.target.value.trim() !== "") {
      setPasswordMessage("");
      setIsPassword(true);
      setPassword(e.target.value);
    } else {
      setPasswordMessage("패스워드를 입력해주세요!");
      setIsPassword(false);
      setPassword("");
    }
  }, []);

  // 회원가입 버튼을 누른 후, 생성된 password input의 onClick 함수
  const createPassword = useCallback((e) => {
    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;

    if (!passwordRegex.test(e.target.value)) {
      setPasswordMessage(
        "숫자+영문자+특수문자 조합으로 8자리 이상 입력해주세요!"
      );
      setIsPassword(false);
      setPassword("");
    } else {
      setPasswordMessage("안전한 비밀번호에요!");
      setIsPassword(true);
      setPassword(e.target.value);
    }
    console.log();
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
        const name = data.user.name;
        const email = data.user.email;
        navigagte("/calender");
        dispatch(userActions.setUser({data, name, email}));
      })
      .catch((err) => {
        alert('로그인 실패')
        console.log(err);
      });
  };

  const loginFormHandler = (email, password, e) => {
    e.preventDefault();

    if (!isEmail || !isPassword) {
      return alert('올바른 양식을 기입해주세요!')
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        navigagte("/calender");
        console.log(user);
        const email = user.email;

        dispatch(userActions.setUser({user, name, email}));
      })
      .catch((error) => {
        console.log(error);
        const errorMessage = "회원 정보가 없습니다!";
        alert(errorMessage);
        throw new Error(errorMessage);
      });
  };

  const createAccount = (email, password) => {

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential;
        console.log(user);
        navigagte("/header");
      })
      .catch((error) => {
        alert("계정 생성 중 오류가 발생했습니다.");
        throw new Error(error);
      });
  };

  const toggleButtonHandler = () => {
    setCreatingUser((prevState) => !prevState);
  };

  return (
    <section className={classes["login-area"]}>
      <div className={classes["login-box"]}>
        <div className={classes["login-box-title"]}>
          <div className={classes["back"]}>
            <Link to="/start"><FontAwesomeIcon icon={faArrowLeft} /></Link>
          </div>
          <div className={classes["title"]}>
            <span>{creatingUser ? "회원 가입" : "로그인"}</span>
          </div>
        </div>
        <form
          className={classes["login-form"]}
          onSubmit={(event) => loginFormHandler(email, password, event)}
        >
          <div className={classes["login-info-area"]}>
            {creatingUser && <label htmlFor="name">이름</label>}
            {creatingUser && (
              <input
                type="text"
                id="name"
                placeholder="이름"
                required
                onChange={onChangeName}
              />
            )}
            {creatingUser && (
              <p style={{ color: isEmail ? "grey" : "red" }}>
                {nameMessage}
              </p>
            )}
            <label htmlFor="email">이메일</label>
            <input
              type="text"
              id="emial"
              placeholder="이메일"
              required
              onChange={onConfirmEmail}
            />
            <p style={{ color: isEmail ? "lightgray" : "red" }}>
              {emailMessage}
            </p>
            <label htmlFor="password">패스워드</label>
            <input
              type="password"
              id="password"
              placeholder="패스워드"
              required
              onChange={(e) =>
                creatingUser ? createPassword(e) : confirmPassword(e)
              }
            />
            <p style={{ color: isPassword ? "black" : "red" }}>
              {passwordMessage}
            </p>
          </div>
          <div className={classes["form-button"]}>
            {creatingUser ? (
              <button
                type="button"
                onClick={() => createAccount(email, password)}
              >
                계정 생성
              </button>
            ) : (
              <button
                type="submit"
                onClick={(e) => loginFormHandler(email, password, e)}
              >
                확인
              </button>
            )}
          </div>
          <div className={classes["social-login-area"]}>
            <span>소셜 로그인</span>
            <img
              style={{ display: "blcok" }}
              className={classes['goolge-Logo']}
              onClick={googleSignIn}
              width='40'
              height='40'
              src="img/Google.jpeg"
              alt="Google"
            />
          </div>
          <div className={classes["isLogin"]}>
            <span>
              {creatingUser
                ? "이미 계정이 있으신가요?"
                : "아직 회원이 아니신가요?"}
            </span>
            <button type="button" onClick={toggleButtonHandler}>
              {creatingUser ? "로그인" : "회원 가입"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default LoginPage;
