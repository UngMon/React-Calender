/* eslint-disable */
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../Auth/firebase";
import classes from "./ResetPage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const ResetPage = () => {
  const navigate = useNavigate();
  console.log("reset");

  // 이메일 state
  const [email, setEmail] = useState(null);

  // 이메일 유효성 검사 state
  const [isEmail, setIsEmail] = useState(false);

  // 이메일 에러메시지 state
  const [emailMessage, setEmailMessage] = useState("");

  const backPageHandler = () => {
    navigate('/');
  }

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

  const changePassword = (email) => {
    if (!isEmail) return alert("이메일을 제대로 입력해주세요!");

    sendPasswordResetEmail(auth, email)
      .then((data) => {
        // Password reset email sent!
        console.log(auth)
        console.log(data)
        alert("이메일 인증 링크를 보냈습니다!");
        navigate("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        if (errorCode === "auth/user-not-found")
          alert("찾을 수 없는 이메일 입니다. 회원가입을 해주세요!");
        console.log(errorCode);
        console.log(errorMessage);
      });
  };

  return (
    <section className={classes["reset-area"]}>
      <div className={classes["reset-box"]}>
        <div className={classes["back-page-button"]} onClick={backPageHandler}>
          <FontAwesomeIcon icon={faArrowLeft} className={classes['arrow']}/>
        </div>
        <div className={classes["reset-box-title"]}>
          <span>비밀번호 초기화</span>
        </div>
        <div className={classes["reset-box-ins"]}>
          <span>
            이메일을 인증을 완료하시면 패스워드가 변경됩니다. 아래 정확한
            이메일을 입력해주세요!
          </span>
        </div>
        <div className={classes["reset-form"]}>
          <div className={classes["reset-info-area"]}>
            <label htmlFor="email">Email</label>
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
          </div>
        </div>
        <button
          type="button"
          className={classes.passwordChangeButton}
          onClick={() => changePassword(email)}
        >
          인증하기
        </button>
      </div>
    </section>
  );
};

export default ResetPage;
