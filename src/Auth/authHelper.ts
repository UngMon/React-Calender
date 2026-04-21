import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../auth/firebase";

export const checkAuth = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      unsubscribe(); // 로그인 상태를 한 번만 확인하고 즉시 리스너를 해제
      resolve(currentUser); // 확인된 유저 정보(또는 null)를 resolve로 내보내기
    });
  });
};
