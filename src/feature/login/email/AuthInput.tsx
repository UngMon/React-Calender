import { useEffect, useState } from "react";

interface AuthInputProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (text: string) => void;
  message: string;
  isValid: boolean;
  creatingUser: boolean;
}

const AuthInput = ({
  id,
  label,
  type,
  value,
  onChange,
  message,
  isValid,
  creatingUser,
}: AuthInputProps) => {
  // 인풋이 현재 포커스 되어있는지 여부를 추적하는 상태
  const [isFocused, setIsFocused] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  // 플로팅 라벨
  const isFloating = isFocused || value.length > 0;

  useEffect(() => {
    setIsTouched(false);
  }, [creatingUser])

  return (
    <div
      className={`auth-input-container ${isFloating ? "floating" : ""} ${isTouched ? (!isValid ? "input-error" : "") : ""}`}
    >
      <div className="auth-input-wrapper">
        <label className="floating-label" htmlFor={id}>
          {label}
        </label>
        <input
          type={type}
          id={id}
          required
          value={value}
          onChange={(e) => onChange(e.currentTarget.value)}
          onFocus={() => {
            setIsFocused(true);
          }}
          onBlur={() => {
            setIsFocused(false);
            setIsTouched(true);
            if (!isTouched) onChange(value);
          }}
          className="auth-input"
        />
      </div>
      <p style={{ color: isValid ? "rgb(154, 154, 154)" : "red" }}>{message}</p>
    </div>
  );
};

export default AuthInput;
