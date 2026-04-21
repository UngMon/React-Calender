import { checkAuth } from "./auth/authHelper";
import { getTodayDateString } from "./utils/getTodayDateString";
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  redirect,
  replace,
  RouterProvider,
} from "react-router-dom";
import LoginPage from "./page/login/LoginPage";
import Root from "./page/Root";
import CalenderPage from "./page/calender/CalenderPage";

const redirectToCalender = `/calender/month/${getTodayDateString()}`;

// 로그인이 '필요한' 그룹의 로더 (없으면 로그인으로 쫓아냄)
const protectedLoader = async () => {
  const user = await checkAuth();

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
    element: <Root />,
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
  console.log("app");

  return <RouterProvider router={router} />;
}

export default App;

// const dispatch = useAppDispatch();

// const [loading, setLoading] = useState<boolean>(true);
// const [loggedIn, setLogged] = useState<boolean>(false);

// useEffect(() => {
//   onAuthStateChanged(auth, (user) => {
//     if (user) {
//       dispatch(getUserData(user.uid));
//       setLogged(true);
//       setLoading(false);
//     } else {
//       setLogged(false);
//       setLoading(false);
//     }
//   });
// }, [dispatch]);

// <Routes>
//   {!loggedIn && !loading && <Route path="/" element={<LoginPage />} />}
//   {!loggedIn && !loading && (
//     <Route path="/reset-password" element={<ResetPage />} />
//   )}
//   {!loading && loggedIn && (
//     <Route path="/calender/*">
//       <Route path="date" element={<Content />} />
//       <Route path="event">
//         <Route path="edit" element={<MakeEvent />} />
//         <Route path="make" element={<MakeEvent />} />
//       </Route>
//       <Route path="*" element={<NotFound />} />
//     </Route>
//   )}
//   {!loading && loggedIn && (
//     <Route path="*" element={<Navigate to={"/calender/date"} />} />
//   )}
//   {loggedIn && <Route path="/search" element={<Result />} />}
//   {loading && <Route path="*" element={<Loading />} />}
//   {!loading && <Route path="*" element={<NotFound />} />}
// </Routes>
