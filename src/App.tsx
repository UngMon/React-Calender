import { useEffect } from "react";
import { checkAuth } from "./auth/authHelper";
import { supabase } from "./auth/supabase";
import { authActions } from "./store/useAuthStore";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { getTodayDateString } from "./utils/getTodayString";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  redirect,
  RouterProvider,
} from "react-router-dom";
import LoginPage from "./page/login/LoginPage";
import CalenderPage from "./page/calender/CalenderPage";
import ResetPage from "./page/reset/ResetPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10,
    },
  },
});

const redirectToCalender = `/calendar/month/${getTodayDateString()}`;

// 로그인이 '필요한' 그룹의 로더 (없으면 로그인으로 쫓아냄)
const protectedLoader = async () => {
  const user = await checkAuth();

  if (!user) return redirect("/login");

  return null; // 통과
};

// 로그인이 '안 된' 사람만 보는 그룹의 로더
const publicLoader = async () => {
  const user = await checkAuth();

  if (user) return redirect(redirectToCalender);

  return null; // 통과
};

const router = createBrowserRouter([
  // ==========================================
  // 1. Public Routes (인증 불필요 구역)
  // ==========================================
  {
    id: "public",
    element: <Outlet />, // 껍데기
    loader: publicLoader,
    children: [
      { path: "/", element: <Navigate to="/login" replace /> }, // 기본 진입 시 로그인으로
      { path: "/login", element: <LoginPage /> },
      { path: "/reset-password", element: <ResetPage /> },
      // 추후 /signup, /forgot-password 등이 여기에 추가
    ],
  },
  // ==========================================
  // 2. Protected Routes (인증 필수 구역)
  // ==========================================
  {
    id: "protected",
    path: "/",
    element: <Outlet />,
    loader: protectedLoader,
    children: [
      {
        path: "calendar/:view/:date",
        element: <CalenderPage />,
      },
    ],
  },
]);

function App() {
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("인증상태 변경", event);

      if (session?.user) {
        // 유저 정보가 있다면 zustand 상태 업데이트
        authActions.setAuth(session.user);
      } else {
        // 로그아웃 혹은 세션 만료 시 zustand 상태 초기화
        authActions.clearAuth();
      }
    });

    // 컴포넌트 언마운트 시 리스너 구독 해제
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
