import { Auth, signOut } from "firebase/auth";
import { create } from "zustand";
import { auth } from "../auth/firebase";

interface AuthState {
  isLoading: boolean;
  isLoggedIn: boolean;
  uid: string | null;
  displayName: string | null | undefined;
  photoURL: string | null | undefined;
  email: string | null | undefined;
  // 상태를 변경하는 액션 함수들
  login: (userData: Auth) => void;
  logout: () => void;
  error: string;
}

const initialState = {
  isLoading: false,
  isLoggedIn: false,
  uid: null,
  displayName: null,
  photoURL: null,
  email: null,
  error: "",
};

export const useAuthStore = create<AuthState>((set) => ({
  // --- 상태 (State) ---
  ...initialState,

  // --- 액션 (Actions) ---
  login: (userData: Auth) => {
    const { uid, displayName, photoURL, email } = userData.currentUser!;

    set({
      isLoggedIn: true,
      uid,
      displayName,
      photoURL,
      email,
    });
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await signOut(auth);

      set({ ...initialState });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
