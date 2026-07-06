import { useEffect, useState } from "react";
import "./AuthInput.css";

interface AuthInputProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (text: string) => void;
  message: string;
  isValid: boolean;
  category: "signin" | "signup" | 'recovery';
}

const AuthInput = ({
  id,
  label,
  type,
  value,
  onChange,
  message,
  isValid,
  category,
}: AuthInputProps) => {
  // 인풋이 현재 포커스 되어있는지 여부를 추적하는 상태
  const [isFocused, setIsFocused] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  // 플로팅 라벨
  const isFloating = isFocused || value.length > 0;

  useEffect(() => {
    setIsTouched(false);
  }, [category]);

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
      <p style={{ color: isValid ? "green" : "red" }}>{message}</p>
    </div>
  );
};

export default AuthInput;
