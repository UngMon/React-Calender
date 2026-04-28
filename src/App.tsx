import { checkAuth } from "./auth/authHelper";
import { getTodayDateString } from "./utils/getTodayDateString";
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  redirect,
  RouterProvider,
} from "react-router-dom";
import LoginPage from "./page/login/LoginPage";
import CalenderPage from "./page/calender/CalenderPage";

const redirectToCalender = `/calender/month/${getTodayDateString()}`;

// 로그인이 '필요한' 그룹의 로더 (없으면 로그인으로 쫓아냄)
const protectedLoader = async () => {
  const user = await checkAuth();
  console.log("protectedLoader");
  if (!user) return redirect("/login");

  return null; // 통과
};

// 로그인이 '안 된' 사람만 보는 그룹의 로더
const publicLoader = async () => {
  const user = await checkAuth();
  if (user) redirect(redirectToCalender);

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
        path: "calender/:view/:date",
        element: <CalenderPage />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
