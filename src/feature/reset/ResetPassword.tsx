import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import AuthInput from "../../feature/login/email/AuthInput";
import Loading from "@/ui/loading/Loading";
import "./ResetPassword.css";

interface T {
  label: string;
  value: string;
  isValid: boolean;
  message: string;
  clearForm: () => void;
  onChange: (text: string) => void;
  setStep: (text: "인증단계" | "초기화단계") => void;
  setIsVerifying: (value: boolean) => void;
}

const ResetPassword = ({
  label,
  value,
  isValid,
  message,
  clearForm,
  onChange,
  setStep,
  setIsVerifying,
}: T) => {
  const navigate = useNavigate();

  const { updatePassword, sendResetPWOtp } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // 비밀번호 초기화 인증코드 받기
  const handleResetPassword = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isValid) {
      // 유효한 양식이 아닐 때,
      onChange("");
      return;
    }

    setLoading(true);

    try {
      if (label === "이메일") {
        // 1. 이메일 입력 상태일 때는 인증 코드를 발송한다.
        await sendResetPWOtp(value);
        setIsVerifying(true); // 인증코드 입력 컴포넌트UI로 변경
      } else {
        // 2. 비밀번호 초기화 입력 상태일 때는 새 비밀번호로 업데이트한다.
        await updatePassword(value);
        alert(
          "비밀번호가 성공적으로 변경되었습니다. 새 비밀번호로 로그인해주세요!",
        );
        clearForm();
        setStep("인증단계");
        setIsVerifying(false);
        navigate("/login"); // 로그인 페이지로 돌려보내기
      }
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBackBtn = () => {
    // 상태 초기화 후, 로그인 페이지로 다시 이동
    clearForm();
    setStep("인증단계");
    setIsVerifying(false);
    navigate("/login");
  };

  return (
    <form className="reset__form" onSubmit={handleResetPassword}>
      <button className="reset__back-btn" onClick={handleBackBtn}>
        <span className="material-symbols-outlined">arrow_back</span>
      </button>
      <h3 className="reset__form__title">비밀번호 초기화</h3>
      <div className="reset__form__explain">
        <span>비밀번호를 변경할 이메일을 입력해 주세요!</span>
      </div>

      <AuthInput
        id={label === "이메일" ? "reset-email" : "reset-password"}
        label={label}
        type={label === "이메일" ? "text" : "password"}
        value={value}
        onChange={onChange}
        message={message}
        isValid={isValid}
        category="recovery"
      />

      {errorMessage && <p className="reset__form__error">{errorMessage}</p>}

      {loading ? (
        <Loading />
      ) : (
        <button type="submit" className="reset__password__change-btn">
          {label === "이메일" ? "인증코드 보내기" : "비밀번호 변경하기"}
        </button>
      )}
    </form>
  );
};

export default ResetPassword;
