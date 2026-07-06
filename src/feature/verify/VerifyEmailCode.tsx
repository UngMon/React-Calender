import { useAuth } from "@/hooks/useAuth";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import "./VerifyEmailCode.css";

interface Props {
  type: "signup" | "recovery";
  email: string; // 인증 코드를 보낸 이메일 주소 (화면 표시용)
  setStep?: (text: "인증단계" | "초기화단계") => void;
  onGoBack: () => void; // 이전(회원가입 폼)으로 돌아가는 함수
}

const VerifyEmailCode = ({ type, email, setStep, onGoBack }: Props) => {
  const { verifyOtp, sendResetPWOtp, resendOtp } = useAuth();

  const [errorCode, setErrorCode] = useState<string>("");
  const [codes, setCodes] = useState<string[]>(new Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // [타이머 상태] 3분 = 180초
  const [timeLeft, setTimeLeft] = useState<number>(180);

  useEffect(() => {
    // 컴포넌트 마운트 시 첫 번째 박스에 포커스
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // [타이머 로직] 1초마다 timeLeft 감소
  useEffect(() => {
    if (timeLeft <= 0) return; // 0초가 되면 타이머 정지

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer); // 컴포넌트 언마운트 시 클린업
  }, [timeLeft]);

  // 남은 시간을 MM:SS 포맷으로 변환하는 함수
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = String(time % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  // =================입력 이벤트 핸들러====================
  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // 숫자만 허용
    const newCodes = [...codes];

    // 여러 글자가 들어오면 마지막 한 글자만 남김 (붙여넣기 대비)
    newCodes[index] = value.substring(value.length - 1);
    setCodes(newCodes);

    // 숫자가 입력되었으면 다음 박스로 포커스 이동
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // [자동 제출] 6자리가 모두 채워졌으면 제출 함수 실행
    if (newCodes.every((code) => code !== "")) {
      submitVerification(newCodes.join(""));
    }
  };

  // ============== 텍스트 포커스 함수 ================
  const focusAndSelect = (input: HTMLInputElement | null) => {
    if (!input) return;

    input.focus();
    // settimeout을 사용함으로써 렌더링 사이클과 겹치지 않게 하기 위함
    setTimeout(() => input.select(), 0);
  };

  // ==============백스페이스/화살표 키 핸들러==================
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (timeLeft === 0) return;

    if (e.key === "Backspace") {
      e.preventDefault(); // 기본 백스페이스 동작 방지
      const newCodes = [...codes];

      if (codes[index] !== "") {
        // 현재 칸에 숫자가 있으면 지우기
        newCodes[index] = "";
        setCodes(newCodes);
      } else if (index > 0) {
        // 현재 칸이 비어있으면 왼쪽 칸으로 이동하면서 그 칸 지우기
        newCodes[index - 1] = "";
        setCodes(newCodes);
        focusAndSelect(inputRefs.current[index - 1]);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      focusAndSelect(inputRefs.current[index - 1]);
    } else if (e.key === "ArrowRight" && index < 5) {
      focusAndSelect(inputRefs.current[index + 1]);
    }
  };

  // =================복사 붙여넣기(Paste)===================
  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    currentIndex: number,
  ) => {
    e.preventDefault();
    if (timeLeft === 0) return;

    const pasteData = e.clipboardData.getData("text").replace(/[^0-9]/g, "");
    if (!pasteData) return;

    const pasteArray: string[] = pasteData.split("");
    const newCodes = [...codes];

    // 현재 커서가 있는 인덱스(currentIndex)부터 순차적으로 채워 넣기
    let lastUpdatedIndex = currentIndex;

    // 가져온 숫자를 인덱스부터 차례대로 인풋박스에 채우기
    for (let i = 0; i < pasteArray.length; i++) {
      const targetIndex = currentIndex + i;
      if (targetIndex > 5) break;

      newCodes[targetIndex] = pasteArray[i];

      lastUpdatedIndex = targetIndex;
    }

    setCodes(newCodes);

    // 마지막으로 채워진 박스에 포커스 (또는 6번째 박스)
    const nextFocusIndex = Math.min(lastUpdatedIndex + 1, 5);
    inputRefs.current[nextFocusIndex]?.focus();

    // 6자리가 모두 채워졌으면 자동 제출
    if (newCodes.every((code) => code !== "")) {
      submitVerification(newCodes.join(""));
    }
  };

  // ==================제출 처리 함수=======================
  const submitVerification = async (finalCode: string) => {
    if (timeLeft <= 0) return;

    try {
      await verifyOtp(email, finalCode, type);

      if (type === "recovery" && setStep) setStep("초기화단계");
      onGoBack();
    } catch (error: any) {
      // 실패 시 박스 초기화
      setCodes(new Array(6).fill(""));
      setErrorCode(error.message);
      inputRefs.current[0]?.focus();
    }
  };

  // 인증코드 다시 보내기
  const handleResend = async () => {
    try {
      if (type === "recovery") {
        // 비밀번호 초기화
        await sendResetPWOtp(email);
      } else {
        // 회원가입
        await resendOtp(email);
      }

      alert("인증 코드가 재발송되었습니다. 이메일을 다시 확인해주세요.");
      setTimeLeft(180); // 타이머 3분으로 리셋
      setCodes(new Array(6).fill("")); // 입력창 초기화
      setErrorCode("");
      inputRefs.current[0]?.focus();
    } catch (error: any) {
      alert(`인증 코드 재발송 실패: ${error.message}`);
      setErrorCode(error.message);
    }
  };

  return (
    <form className="verify__form" onSubmit={(e) => e.preventDefault()}>
      <button
        className="verify__form__prev-btn"
        type="button"
        onClick={onGoBack}
      >
        <span className="material-symbols-outlined">arrow_back</span>
      </button>

      <div className="verify__form__logo">
        <img src="./images/Email.png" alt="email" width={50} height={50} />
      </div>
      <div className="verify__form__explain">
        {type === "recovery" && (
          <p className="warning">⚠️ 입력하신 이메일이 가입한 계정일 때,</p>
        )}
        {type === "recovery" && (
          <p className="warning">비밀번호 재설정 코드가 발송됩니다.</p>
        )}
        <br />
        <p>
          <strong>{email}</strong>로 전송된
        </p>
        <p>6자리 인증 코드를 입력해 주세요.</p>
      </div>

      <div className="otp__box__container">
        {codes.map((code, index) => (
          <input
            key={index}
            type="text"
            id={`otp-code-${index}`}
            name={`otp-code-${index}`}
            inputMode="numeric" // 모바일에서 숫자 키패드 띄우기
            // maxLength={1} // 한 글자만 입력하기
            value={code}
            ref={(el) => {
              inputRefs.current[index] = el;
            }} // useRef 배열에 할당
            className="otp__box__input"
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={(e) => handlePaste(e, index)}
          />
        ))}
      </div>

      {/* 에러 메세지*/}
      {errorCode && <p className="verify__form__error">{errorCode}</p>}

      {/* 타이머 텍스트 렌더링 */}
      <div className="verify__form__timer">
        {timeLeft > 0 ? formatTime(timeLeft) : "입력 시간이 초과되었습니다."}
      </div>
      <div className="verify__form__resend">
        <span>인증 코드를 받지 못하셨나요?</span>
        <button
          type="button"
          onClick={handleResend}
          disabled={timeLeft > 120 ? true : false}
        >
          다시 보내기
        </button>
      </div>
    </form>
  );
};

export default VerifyEmailCode;
