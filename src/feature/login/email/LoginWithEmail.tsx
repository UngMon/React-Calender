import { useEffect, useState } from "react";
import { useAuthForm } from "@/hooks/useAuthForm";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { getYMDString } from "@/utils/getTodayString";
import AuthInput from "./AuthInput";
import VerifyEmailCode from "./VerifyEmailCode";
import "./LoginWithEmail.css";

interface Props {}

const LoginWithEmail = () => {
  const navigate = useNavigate();
  const { loginWithEmail, signUpWithEmail } = useAuth();

  const [creatingUser, setCreatingUser] = useState<boolean>(false); // 회원 가입 유무
  const [isVerifying, setIsVerifying] = useState<boolean>(false); // 인증 코드 UI 전환
  const [errorMessage, setErrorMessage] = useState<string>("");

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
    setIsVerifying(false);
    setErrorMessage('');
  }, [creatingUser, clearForm]);

  if (isVerifying) {
    return (
      <VerifyEmailCode
        email={email}
        onGoBack={() => {
          clearForm();
          setIsVerifying(false);
          setCreatingUser(false);
        }}
      />
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) return;

    try {
      if (creatingUser) {
        const data = await signUpWithEmail(email, password, name);
        console.log(data);
        setIsVerifying(true); // 성공 시, 인증 코드 입력 UI로 전환
      } else {
        await loginWithEmail(email, password);
        navigate(`/calendar/month/${getYMDString("YM")}`); // 로그인 성공 시 달력으로 이동
      }
    } catch (error: any) {
      console.log("Error 발생", error);
      setErrorMessage(error.message);
    }
  };

  return (
    <form className="login__form" onSubmit={handleSubmit}>
      <div className="login__form-title">
        <span>{creatingUser ? "회원 가입" : "이메일 로그인"}</span>
      </div>
      {creatingUser && (
        <AuthInput
          id="name"
          label="이름"
          type="text"
          value={name}
          onChange={onChangeName}
          message={nameMessage}
          isValid={isName}
          creatingUser={creatingUser}
        />
      )}
      <AuthInput
        id="email"
        label="이메일"
        type="text"
        value={email}
        onChange={onChangeEmail}
        message={emailMessage}
        isValid={isEmail}
        creatingUser={creatingUser}
      />
      <AuthInput
        id="password"
        label="비밀번호"
        type="password"
        value={password}
        onChange={onChangePassword}
        message={passwordMessage}
        isValid={isPassword}
        creatingUser={creatingUser}
      />
      {/* 로그인 or 가입 전환 */}
      <div className="login__form__btn-box">
        <button
          className="login__form-toggle"
          type="button"
          onClick={() => setCreatingUser((prevState) => !prevState)}
        >
          <span>{creatingUser ? "이메일 로그인" : "회원가입"}</span>
        </button>
        <button
          className="login__form__find-pw"
          type="button"
          onClick={() => navigate("/reset-password")}
        >
          <span>비밀번호 찾기</span>
        </button>
      </div>
      {errorMessage && <p className="login__form__error">{errorMessage}</p>}
      <button className="login__form-submit" type="submit">
        {creatingUser ? "계정 생성" : "로그인"}
      </button>
    </form>
  );
};

export default LoginWithEmail;
