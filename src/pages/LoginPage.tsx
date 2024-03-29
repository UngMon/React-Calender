/* eslint-disable */
import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../auth/firebase";
import {
  GoogleAuthProvider,
  setPersistence,
  signInWithPopup,
  sendEmailVerification,
  browserSessionPersistence,
} from "firebase/auth";
import { FacebookAuthProvider } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { newYear, newMonth } from "../utils/nowDate";
import StartImages from "./StartImages";
import style from "./LoginPage.module.css";

const LoginPage = () => {
  const navigagte = useNavigate();
  // 회원가입 인지 아닌지~
  const [creatingUser, setCreatingUser] = useState<boolean>(false);

  // 이메일과 패스워드 state
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // 이메일과 패스워드 유효성 검사 state
  const [isName, setIsName] = useState<boolean>(false);
  const [isEmail, setIsEmail] = useState<boolean>(false);
  const [isPassword, setIsPassword] = useState<boolean>(false);

  // 이메일과 패스워드 에러메시지 state
  const [nameMessage, setNameMessage] = useState<string>("");
  const [emailMessage, setEmailMessage] = useState<string>("");
  const [passwordMessage, setPasswordMessage] = useState<string>("");

  const onChangeName = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (e.target.value.length < 2 || e.target.value.length > 5) {
      setNameMessage("이름을 2글자 이상 5글자 이하로 입력해주세요.");
      setIsName(false);
      setName("");
    } else {
      setNameMessage("올바른 이름 형식입니다 ");
      setIsName(true);
      setName(e.target.value);
    }
  }, []);

  const onConfirmEmail = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
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
    },
    []
  );

  const confirmPassword = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.value.trim() !== "") {
        setPasswordMessage("");
        setIsPassword(true);
        setPassword(e.target.value);
      } else {
        setPasswordMessage("패스워드를 입력해주세요!");
        setIsPassword(false);
        setPassword("");
      }
    },
    []
  );

  // 회원가입 버튼을 누른 후, 생성된 password input의 onClick 함수
  const createPassword = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
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
    },
    []
  );

  const socialLoginHandler = (e: React.MouseEvent, type: string) => {
    // 구글 로그인을 위한 구글 provider 객체 생성
    e.preventDefault();

    let provider: any;

    switch (type) {
      case "Google":
        provider = new GoogleAuthProvider();
        break;
      default:
        provider = new FacebookAuthProvider();
    }

    setPersistence(auth, browserSessionPersistence).then(() => {
      signInWithPopup(auth, provider)
        .then((data) => {
          navigagte(`/calender/date?year=${newYear}&month=${newMonth}`);
        })
        .catch((err) => {
          alert("로그인하는데 실패했습니다.");
          console.log(err);
        });
    });
  };

  const loginFormHandler = (
    e: React.FormEvent,
    email: string,
    password: string
  ) => {
    e.preventDefault();

    if (creatingUser) return;

    if (!isEmail || !isPassword) return alert("올바른 양식을 기입해주세요!");

    setPersistence(auth, browserSessionPersistence)
      .then((userCredential) => {
        return signInWithEmailAndPassword(auth, email, password);
      })
      .catch((error) => {
        // Handle Errors here.
        if (error.message === "Firebase: Error (auth/wrong-password).") {
          alert("패스워드가 틀렸습니다!");
        }

        if (error.message === "Firebase: Error (auth/user-not-found).") {
          alert("회원정보가 없습니다!");
        }
        console.log(`${error.message} ${error.code}`);
      });

    // signInWithEmailAndPassword(auth, email, password)
    //   .then((userCredential) => {
    //     // Signed in
    //     console.log(userCredential);
    //     if (!userCredential.user.emailVerified)
    //       return alert("이메일 인증을 해주세요!");
    //     navigagte("/calender");
    //   })
    //   .catch((err) => {
    //     if (err.message === "Firebase: Error (auth/wrong-password).") {
    //       alert("패스워드가 틀렸습니다!");
    //     }

    //     if (err.message === "Firebase: Error (auth/user-not-found).") {
    //       alert("회원정보가 없습니다!");
    //     }
    //     console.log(err.message);
    //   });
  };

  const createAccount = (email: string, password: string) => {
    if (!isName || !isEmail || !isPassword) {
      return alert("올바른 양식을 기입해주세요!");
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        sendEmailVerification(auth.currentUser!)
          .then(() => {
            alert("이메일 인증 링크를 보냈습니다! 링크를 따라 인증해주세요!");
            setName("");
            setEmail("");
            setPassword("");
            navigagte("/login");
          })
          .catch((err) => {
            alert(`인증 링크를 보내는데 실패했습니다! ${err.message}`);
          });
      })
      .catch((err) => {
        if (err.message === "Firebase: Error (auth/email-already-in-use).") {
          alert("이미 가입한 이메일 입니다.");
        } else {
          alert(`계정 생성 중 오류가 발생했습니다. ${err.message}`);
        }
      });
  };

  return (
    <section className={style["login-section"]}>
      <StartImages />
      <div className={style["login-box"]}>
        <div className={style.logo}>
          <span>Y</span>
          <span>o</span>
          <span>u</span>
          <span>r</span>
          <span> </span>
          <span>C</span>
          <span>a</span>
          <span>l</span>
          <span>e</span>
          <span>n</span>
          <span>d</span>
          <span>e</span>
          <span>r</span>
        </div>
        <form
          className={style["login-form"]}
          onSubmit={(event) => loginFormHandler(event, email, password)}
        >
          <div className={style["login-info-area"]}>
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
              <p style={{ color: isEmail ? "rgb(175, 175, 175)" : "red" }}>
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
            <p style={{ color: isEmail ? "rgb(175, 175, 175)" : "red" }}>
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
            <p style={{ color: isPassword ? "rgb(175, 175, 175)" : "red" }}>
              {passwordMessage}
            </p>
          </div>
          <button
            className={style["form-button"]}
            type="submit"
            onClick={() => creatingUser && createAccount(email, password)}
          >
            {creatingUser ? "계정 생성" : "확인"}
          </button>
          <span>소셜 로그인</span>
          <div className={style["social-login-area"]}>
            <img
              className={style["social-Logo"]}
              onClick={(e) => socialLoginHandler(e, "Google")}
              width="40"
              height="40"
              src="/images/Google.jpeg"
              alt="Google"
            />
            <img
              className={style["social-Logo"]}
              onClick={(e) => socialLoginHandler(e, "Facebook")}
              width="35"
              height="35"
              src="/images/Facebook_Logo.png"
              alt="Google"
            />
          </div>
          <div
            className={style.passwordChangeButton}
            onClick={() => navigagte("/reset-password")}
          >
            <span>비밀번호를 잊으셨나요?</span>
          </div>
          <div className={style["isLogin"]}>
            <span>
              {creatingUser
                ? "이미 계정이 있으신가요?"
                : "아직 회원이 아니신가요?"}
            </span>
            <div
              className={style["change-button"]}
              onClick={() => setCreatingUser((prevState) => !prevState)}
            >
              {creatingUser ? "로그인" : "회원 가입"}
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default LoginPage;
