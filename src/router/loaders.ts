import { checkAuth } from "@/auth/authHelper";
import { getYMDString } from "@/utils/getTodayString";
import { LoaderFunctionArgs, redirect } from "react-router-dom";
import { isValidCalendarParams } from "./isValidCalendarParams";

const getRedirectToCalendar = () =>  `/calendar/month/${getYMDString("M")}`;

// 로그인이 '필요한' 그룹의 로더 (없으면 로그인으로 쫓아냄)
export const protectedLoader = async () => {
  const user = await checkAuth();
  console.log('protectedLoader')
  if (!user) return redirect("/login");

  return null; // 통과
};

// 로그인이 '안 된' 사람만 보는 그룹의 로더
export const publicLoader = async () => {
  const user = await checkAuth();

  console.log('publicLoader')

  if (user) return redirect(getRedirectToCalendar());

  return null; // 통과
};

// 사용자가 캘린더 페이지에서 year, month, day를 조작했을 때, 방어 로더
export const calendarLoader = async ({ params }: LoaderFunctionArgs) => {
  // 1. URL 동적 세그먼트 파라미터 검증
  const { year, month, day } = params;

  if (!isValidCalendarParams({ year, month, day })) {
    console.warn('유효하지 않는 캘린더 URL 접근입니다.');
    return redirect(getRedirectToCalendar())
  }

  return null;
};
