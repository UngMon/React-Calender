import { supabase } from "@/auth/supabase";
import { getTodayDateString } from "@/utils/getTodayDateString";

export const useAuth = () => {
  const handleAuthError = (error: any): string => {
    console.error(`Auth Error: ${error.message} (Code: ${error.status})`);

    switch (error.message) {
      case "Invalid login credentials":
        return "이메일 또는 패스워드가 틀렸습니다!";
      case "User already exists":
      case "Email already in use":
        return "이미 가입된 이메일 주소입니다.";
      case "Signup requires email verification":
        return "이메일 인증 링크를 확인해주세요.";
      default:
        return "인증 처리 중 알 수 없는 오류가 발생했습니다.";
    }
  };

  // 이메일 로그인
  const loginWithEmail = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new Error(handleAuthError(error));

    return data;
  };

  // 이메일 회원가입 (메타데이터에 이름 함께 저장)
  const signUpWithEmail = async (
    email: string,
    password: string,
    name: string,
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }, // 사용자 메타데이터 저장
      },
    });

    if (error) throw new Error(handleAuthError(error));
    return data;
  };

  // 소셜 로그인 (OAuth)
  const loginWithSocial = async (provider: "google" | "facebook") => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/calender/month/${getTodayDateString()}`,
      },
    });

    if (error) throw new Error(handleAuthError(error));
    return data;
  };

  // 비밀번호 재설정 이메일 발송
  const sendResetEmail = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw new Error(handleAuthError(error));
    return data;
  };

  // 🟢 로그아웃 기능 추가
  const logout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) throw new Error(handleAuthError(error));
  };

  return {
    loginWithEmail,
    signUpWithEmail,
    loginWithSocial,
    sendResetEmail,
    logout,
  };
};
