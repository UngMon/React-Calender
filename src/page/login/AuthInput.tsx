interface AuthInputProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  message: string;
  isValid: boolean;
}

const AuthInput = ({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  message,
  isValid,
}: AuthInputProps) => (
  <>
    <label htmlFor={id}>{label}</label>
    <input
      type={type}
      id={id}
      placeholder={placeholder}
      required
      value={value}
      onChange={onChange}
    />
    <p style={{ color: isValid ? "rgb(175, 175, 175)" : "red" }}>{message}</p>
  </>
);

export default AuthInput;
