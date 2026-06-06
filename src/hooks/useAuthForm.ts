import { useState, useCallback } from "react";

export const useAuthForm = (creatingUser: boolean) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isName, setIsName] = useState(false);
  const [isEmail, setIsEmail] = useState(false);
  const [isPassword, setIsPassword] = useState(false);

  const [nameMessage, setNameMessage] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  const onChangeName = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setName(value);
    if (value.length < 2 || value.length > 7) {
      setNameMessage("이름을 2글자 이상 7글자 이하로 입력해주세요.");
      setIsName(false);
    } else {
      setNameMessage("올바른 이름 형식입니다 ");
      setIsName(true);
    }
  }, []);

  const onChangeEmail = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setEmail(value);
      const regex =
        /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

      if (regex.test(value)) {
        setEmailMessage("올바른 이메일 형식입니다!");
        setIsEmail(true);
      } else {
        setEmailMessage("올바른 이메일을 입력하세요! ex)abc@abc.com");
        setIsEmail(false);
      }

      if (value.trim() === "") setEmailMessage("");
    },
    [],
  );

  const onChangePassword = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setPassword(value);

      if (creatingUser) {
        const passwordRegex =
          /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;

        if (!passwordRegex.test(value)) {
          setPasswordMessage(
            "숫자+영문자+특수문자 조합으로 8자리 이상 입력해주세요!",
          );
          setIsPassword(false);
        } else {
          setPasswordMessage("안전한 비밀번호에요!");
          setIsPassword(true);
        }
      } else {
        if (value.trim() !== "") {
          setPasswordMessage("");
          setIsPassword(true);
        } else {
          setPasswordMessage("패스워드를 입력해주세요!");
          setIsPassword(false);
        }
      }
    },
    [creatingUser],
  );

  const clearForm = useCallback(() => {
    setName("");
    setEmail("");
    setPassword("");
    setNameMessage("");
    setEmailMessage("");
    setPasswordMessage("");
    setIsName(false);
    setIsEmail(false);
    setIsPassword(false);
  }, []);

  const isFormValid = creatingUser
    ? isName && isEmail && isPassword
    : isEmail && isPassword;

  return {
    name,
    email,
    password,
    nameMessage,
    emailMessage,
    passwordMessage,
    isName,
    isEmail,
    isPassword,
    isFormValid,
    onChangeName,
    onChangeEmail,
    onChangePassword,
    clearForm,
  };
};
