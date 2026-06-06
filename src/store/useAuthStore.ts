import { create } from "zustand";
import { User } from "@supabase/supabase-js";

// 타입 정의
interface AuthState {
  isLoading: boolean;
  isLoggedIn: boolean;
  uid: string | null;
  displayName: string | null;
  photoURL: string | null;
  email: string | null;
}

const initialState: AuthState = {
  isLoading: true,
  isLoggedIn: false,
  uid: null,
  displayName: null,
  photoURL: null,
  email: null,
};

// 스토어 생성
export const useAuthStore = create<AuthState>()(() => initialState);

// 인증 액션 함수.
export const authActions = {
  setAuth: (user: User) => {
    useAuthStore.setState({
      isLoggedIn: true,
      uid: user.id,
      displayName:
        user.user_metadata?.name || user.user_metadata?.full_name || null,
      photoURL: user.user_metadata?.avatar_url || null,
      email: user.email || null,
      isLoading: false,
    });
  },

  clearAuth: () => {
    useAuthStore.setState({
      ...initialState,
      isLoading: false,
    });
  },

  setLoading: (isLoading: boolean) => {
    useAuthStore.setState({ isLoading });
  },
};
