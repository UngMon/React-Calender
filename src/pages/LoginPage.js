/* eslint-disable */
import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../Auth/firebase";
import {
  GoogleAuthProvider,
  setPersistence,
  signInWithPopup,
  browserLocalPersistence,
} from "firebase/auth";
import { FacebookAuthProvider } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useDispatch } from "react-redux";
import { modalActions } from "../store/modal-slice";
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

  const socialLoginHandler = (event, type) => {
    // 구글 로그인을 위한 구글 provider 객체 생성
    event.preventDefault();

    let provider;

    if (type === "Google") {
      provider = new GoogleAuthProvider();
    }

    if (type === "Facebook") {
      provider = new FacebookAuthProvider();
    }
    setPersistence(auth, browserLocalPersistence).then(() => {
      signInWithPopup(auth, provider)
        .then((data) => {
          console.log(data);
          const name = data.user.displayName;
          const email = data.user.email;

          dispatch(modalActions.createUser({ name, email }));

          navigagte("/calender");
        })
        .catch((err) => {
          alert("로그인하는데 실패했습니다.");
          console.log(err);
        });
    });
  };

  const loginFormHandler = (email, password, e) => {
    e.preventDefault();

    if (!isEmail || !isPassword) {
      return alert("올바른 양식을 기입해주세요!");
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        localStorage.setItem('email', userCredential.user.auth.config)
        console.log(userCredential);
        console.log(userCredential.user.auth.config.apiKey);
        const user = userCredential.user;

        dispatch(modalActions.confirmUser({ email }));
        navigagte("/calender");
      })
      .catch((err) => {
        if (err.message === "Firebase: Error (auth/wrong-password).") {
          alert("패스워드가 틀렸습니다!");
        }

        if (err.message === "Firebase: Error (auth/user-not-found).") {
          alert("회원정보가 없습니다!");
        }
        console.log(err.message);
      });
  };

  const createAccount = (name, email, password) => {
    if (!isName || !isEmail || !isPassword) {
      return alert("올바른 양식을 기입해주세요!");
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential;
        console.log(user);
        dispatch(modalActions.createUser({ name, email }));
        navigagte("/calender");
      })
      .catch((err) => {
        if (err.message === "Firebase: Error (auth/email-already-in-use).") {
          alert("기입한 이메일이 이미 존재합니다.");
        } else {
          alert("계정 생성 중 오류가 발생했습니다.");
        }
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
            <Link to="/start">
              <FontAwesomeIcon icon={faArrowLeft} />
            </Link>
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
              <p style={{ color: isEmail ? "grey" : "red" }}>{nameMessage}</p>
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
                onClick={() => createAccount(name, email, password)}
              >
                계정 생성
              </button>
            ) : (
              <button type="submit">확인</button>
            )}
          </div>
          <span>소셜 로그인</span>
          <div className={classes["social-login-area"]}>
            <img
              className={classes["social-Logo"]}
              onClick={(e) => socialLoginHandler(e, "Google")}
              width="40"
              height="40"
              src="img/Google.jpeg"
              alt="Google"
            />
            <img
              className={classes["social-Logo"]}
              onClick={(e) => socialLoginHandler(e, "Facebook")}
              width="35"
              height="35"
              src="img/Facebook_Logo.png"
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
