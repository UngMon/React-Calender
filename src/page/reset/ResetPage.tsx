import { useState } from "react";
import { useAuthForm } from "@/hooks/useAuthForm";
import VerifyEmailCode from "@/feature/verify/VerifyEmailCode";
import ResetPassword from "@/feature/reset/ResetPassword";
import "./ResetPage.css";

const ResetPage = () => {
  const {
    email,
    clearForm,
    isEmail,
    emailMessage,
    onChangeEmail,
    password,
    passwordMessage,
    onChangePassword,
    isPassword,
  } = useAuthForm("recovery");
  const [step, setStep] = useState<"인증단계" | "초기화단계">("인증단계"); // 인증단계 or 초기화단계
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  return (
    <section className={"reset-container"}>
      {isVerifying ? (
        <div className="reset-box">
          <VerifyEmailCode
            type="recovery"
            email={email}
            setStep={setStep}
            onGoBack={() => {
              clearForm();
              setIsVerifying(false);
            }}
          />
        </div>
      ) : step === "인증단계" ? (
        <ResetPassword
          label="이메일"
          value={email}
          isValid={isEmail}
          message={emailMessage}
          onChange={onChangeEmail}
          clearForm={clearForm}
          setStep={setStep}
          setIsVerifying={setIsVerifying}
        />
      ) : (
        <ResetPassword
          label="비밀번호"
          value={password}
          isValid={isPassword}
          onChange={onChangePassword}
          message={passwordMessage}
          clearForm={clearForm}
          setStep={setStep}
          setIsVerifying={setIsVerifying}
        />
      )}
    </section>
  );
};

export default ResetPage;
