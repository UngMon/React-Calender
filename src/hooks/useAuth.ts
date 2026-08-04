import { supabase } from "@/auth/supabase";
import { getYMDString } from "@/utils/getTodayString";

export const useAuth = () => {
  const handleAuthError = (error: any): string => {
    console.error(`Auth Error: ${error.message} (Code: ${error.status})`);

    if (error.status === 400) {
      return "유효하지 않은 이메일 주소입니다";
    } else if (error.status === 429) {
      return "보안을 위해 잠시 후 다시 시도해 주세요.";
    }

    switch (error.message) {
      case "Invalid login credentials":
        return "유효하지 않는 로그인 정보입니다.";
      case "Email not confirmed":
        return "인증되지 않은 이메일입니다.";
      case "User already exists":
      case "Email already in use":
        return "이미 가입된 이메일 주소입니다.";
      case "Signup requires email verification":
        return "이메일 인증 링크를 확인해주세요.";
      case 'New password should be different from the old password.':
        return '이전과 다른 비밀번호를 입력하세요.'
      case "User already registered":
        return "이미 가입한 계정입니다";
      case "Token has expired or is invalid":
        return "유효하지 않는 인증 코드입니다.";
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

  // 6자리 OTP 코드 검증 (회원가입용)
  const verifyOtp = async (email: string, token: string, type: "signup" | "recovery") => {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type, // 비밀번호 초기화 인증 > 'recovery' or 회원가입 'singup'
    });

    if (error) throw new Error(handleAuthError(error));
    return data;
  };

  // 소셜 로그인 (OAuth)
  const loginWithSocial = async (provider: "google" | "facebook") => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/calender/month/${getYMDString('M')}`,
      },
    });

    if (error) throw new Error(handleAuthError(error));
    return data;
  };

  // 비밀번호 재설정 이메일 발송
  const sendResetPWOtp = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw new Error(handleAuthError(error));
    return data;
  };

  // 새 비밀번호로 업데이트
  const updatePassword = async (newPassword: string) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw new Error(handleAuthError(error));
    return data;
  };

  // 인증코드 재발송 (회원가입용)
  const resendOtp = async (email: string) => {
    const { data, error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
      },
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
    sendResetPWOtp,
    updatePassword,
    resendOtp,
    verifyOtp,
    logout,
  };
};
