import { lazy, Suspense, useEffect } from "react";
import { supabase } from "./auth/supabase";
import { authActions } from "./store/useAuthStore";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import {
  calendarLoader,
  protectedLoader,
  publicLoader,
} from "./router/loaders";

const LoginPage = lazy(() => import("./page/login/LoginPage"));
const ResetPage = lazy(() => import("./page/reset/ResetPage"));
const CalendarLayout = lazy(() => import("./page/calendar/CalednarLayout"));
const YearCalendarPage = lazy(() => import("./page/calendar/YearCalendarPage"));
const MonthCalendarPage = lazy(() => import("./page/calendar/MonthCalendarPage"));
const WeekCalendarPage = lazy(() => import("./page/calendar/WeekCalendarPage"));
const DayCalendarPage = lazy(() => import("./page/calendar/DayCalendarPage"));
const NotFound = lazy(() => import("./page/error/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10,
    },
  },
});

const router = createBrowserRouter([
  // ==========================================
  // 1. Public Routes (인증 불필요 구역)
  // ==========================================
  {
    id: "public",
    element: <Outlet />,
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
    path: "/calendar",
    element: <CalendarLayout />,
    loader: protectedLoader,
    children: [
      {
        path: "year/:year",
        element: <YearCalendarPage />,
        loader: calendarLoader,
      },
      {
        path: "month/:year/:month",
        element: <MonthCalendarPage />,
        loader: calendarLoader,
      },
      {
        path: "week/:year/:month/:day",
        element: <WeekCalendarPage />,
        loader: calendarLoader,
      },
      {
        path: "day/:year/:month/:day",
        element: <DayCalendarPage />,
        loader: calendarLoader,
      },
    ],
  },
  { path: "*", element: <NotFound /> },
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
