import { supabase } from "../auth/supabase";
import { User } from "@supabase/supabase-js";

export const checkAuth = async (): Promise<User | null> => {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) return null;

    return user;
  } catch (error) {
    console.error("인증 상태를 확인하는 중 오류 발생:", error);
    return null;
  }
};
