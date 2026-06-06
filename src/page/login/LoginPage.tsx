import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTodayDateString } from "../../utils/getTodayDateString";
import { useAuth } from "@/hooks/useAuth";
import { useAuthForm } from "@/hooks/useAuthForm";
import StartImages from "./StartImages";
import styles from "./LoginPage.module.css";
import SocialLogin from "./SocialLogin";
import AuthInput from "./AuthInput";

const LoginPage = () => {
  console.log("Login Page");
  const navigagte = useNavigate();

  // 회원 가입 유무
  const [creatingUser, setCreatingUser] = useState<boolean>(false);

  const { loginWithEmail, signUpWithEmail, loginWithSocial } = useAuth();
  const {
    name,
    email,
    password,
    nameMessage,
    emailMessage,
    passwordMessage,
    isEmail,
    isPassword,
    isFormValid,
    onChangeName,
    onChangeEmail,
    onChangePassword,
    clearForm,
    isName,
  } = useAuthForm(creatingUser);

  useEffect(() => {
    clearForm();
  }, [creatingUser, clearForm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      alert("올바른 양식을 기입해주세요!");
      return;
    }

    try {
      if (creatingUser) {
        await signUpWithEmail(email, password, name);
        alert(
          "이메일 인증 링크를 보냈습니다! 가입하신 이메일함을 확인하여 인증해주세요!",
        );
        setCreatingUser(false);
      } else {
        await loginWithEmail(email, password);
        navigagte(`/calendar/month/${getTodayDateString()}`);
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <section className={styles["login-section"]}>
      <StartImages />
      <div className={styles["login-box"]}>
        <div className={styles.logo}>
          <span>Your Calender</span>
        </div>
        <form className={styles["login-form"]} onSubmit={handleSubmit}>
          <div className={styles["login-info-area"]}>
            {creatingUser && (
              <AuthInput
                id="name"
                label="이름"
                type="text"
                placeholder="이름"
                value={name}
                onChange={onChangeName}
                message={nameMessage}
                isValid={isName}
              />
            )}
            <AuthInput
              id="email"
              label="이메일"
              type="text"
              placeholder="이메일"
              value={email}
              onChange={onChangeEmail}
              message={emailMessage}
              isValid={isEmail}
            />
            <AuthInput
              id="password"
              label="패스워드"
              type="password"
              placeholder="패스워드"
              value={password}
              onChange={onChangePassword}
              message={passwordMessage}
              isValid={isPassword}
            />
          </div>
          <button className={styles["form-button"]} type="submit">
            {creatingUser ? "계정 생성" : "확인"}
          </button>
          <SocialLogin onSocialLogin={loginWithSocial} />
          <div
            className={styles.passwordChangeButton}
            onClick={() => navigagte("/reset-password")}
          >
            <span>비밀번호를 잊으셨나요?</span>
          </div>
          <div className={styles["isLogin"]}>
            <span>
              {creatingUser
                ? "이미 계정이 있으신가요?"
                : "아직 회원이 아니신가요?"}
            </span>
            <div
              className={styles["change-button"]}
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
