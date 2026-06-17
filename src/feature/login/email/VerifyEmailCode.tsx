import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { getYMDString } from "@/utils/getTodayString";
import { supabase } from "@/auth/supabase";
import "./VerifyEmailCode.css";

interface Props {
  email: string; // 인증 코드를 보낸 이메일 주소 (화면 표시용)
  onGoBack: () => void; // 이전(회원가입 폼)으로 돌아가는 함수
}

const VerifyEmailCode = ({ email, onGoBack }: Props) => {
  const navigate = useNavigate();
  const { verifySignupCode } = useAuth();

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

  // =================입력 이벤트 핸들러======================
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

  // ==============백스페이스/화살표 키 핸들러==================
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (timeLeft === 0) return;

    if (e.key === "Backspace" && index > 0) {
      e.preventDefault(); // 기본 백스페이스 동작 방지
      const newCodes = [...codes];

      if (codes[index] !== "") {
        newCodes[index] = "";
        setCodes(newCodes);
      }

      if (index > 0) inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // ====================================================
  // 복사 붙여넣기(Paste) 핸들러
  // ====================================================
  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    currentIndex: number,
  ) => {
    e.preventDefault();
    if (timeLeft === 0) return;

    const pasteData = e.clipboardData.getData("text").replace(/[^0-9]/g, "");
    console.log(e.clipboardData, pasteData);
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
      if (inputRefs.current[targetIndex]) {
        inputRefs.current[targetIndex]!.value = pasteArray[i];
      }

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
    try {
      await verifySignupCode(email, finalCode);
      alert("회원가입이 완료되었습니다! 환영합니다");
      onGoBack();
      navigate(`/calendar/month/${getYMDString("YM")}`);
    } catch (error: any) {
      alert(`인증 실패: ${error.message}`);
      // 실패 시 박스 초기화
      setCodes(new Array(6).fill(""));
      inputRefs.current[0]?.focus();
    }
  };

  // 다시 보내기 함수
  const handleResend = async () => {
    try {
      await supabase.auth.resend({ type: "signup", email });
      alert("인증 코드가 재발송되었습니다. 이메일을 다시 확인해주세요.");
      setTimeLeft(180); // 타이머 3분으로 리셋
      setCodes(new Array(6).fill("")); // 입력창 초기화
      inputRefs.current[0]?.focus();
    } catch (error: any) {
      alert(`인증 코드 재발송 실패: ${error.message}`);
    }
  };

  return (
    <form className="verify__form" onSubmit={(e) => e.preventDefault()}>
      <div className="verify__form__title">
        <span>이메일 인증</span>
      </div>
      <div className="verify__form__explain">
        <p>
          방금 <strong>{email}</strong>로 전송된
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
            maxLength={1} // 한 글자만 입력하기
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
      {/* 타이머 텍스트 렌더링 */}
      <div className="verify__form__timer">
        {timeLeft > 0 ? formatTime(timeLeft) : "입력 시간이 초과되었습니다."}
      </div>
      <div className="verify__form__resend">
        <span>인증 코드를 받지 못하셨나요?</span>
        <button type="button" onClick={handleResend}>
          다시 보내기
        </button>
      </div>
      <div className="verify__form__move-prev">
        <button
          className="verify__form__toggle"
          type="button"
          onClick={onGoBack}
        >
          <span>이전으로 돌아가기</span>
        </button>
      </div>
    </form>
  );
};

export default VerifyEmailCode;
