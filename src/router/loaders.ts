import { checkAuth } from "@/auth/authHelper";
import { getYMDString } from "@/utils/getTodayString";
import { LoaderFunctionArgs, redirect } from "react-router-dom";
import { isValidCalendarParams } from "./isValidCalendarParams";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/auth/supabase";
import { QueryClient } from "@tanstack/react-query";
import { CalendarEvent } from "@/type/events";
import { QUERY_KEY_EVENTS } from "@/hooks/useCalendarEvents";

type AuthenticatedLoaderCallback<T = any> = (
  args: LoaderFunctionArgs,
  user: User,
) => Promise<T> | T;

const getRedirectToCalendar = () => `/calendar/month/${getYMDString("M")}`;

export const withAuthLoader = <T>(
  callback?: AuthenticatedLoaderCallback<T>,
) => {
  return async (args: LoaderFunctionArgs) => {
    // 1 인증 및 리다이렉트 공통 처리
    const user = await checkAuth();
    if (!user) return redirect("/login");

    if (callback) return await callback(args, user);

    return null;
  };
};

// 로그인이 '필요한' 그룹의 로더 (없으면 로그인으로 쫓아냄)
export const protectedLoader = async () => {
  const user = await checkAuth();

  if (!user) return redirect("/login");

  return null; // 통과
};

// 로그인이 '안 된' 사람만 보는 그룹의 로더
export const publicLoader = async () => {
  const user = await checkAuth();

  if (user) return redirect(getRedirectToCalendar());

  return null; // 통과
};

// 사용자가 캘린더 페이지에서 year, month, day를 조작했을 때, 방어 로더
export const calendarLoader = async ({ params }: LoaderFunctionArgs) => {
  // 1. URL 동적 세그먼트 파라미터 검증
  const { year, month, day } = params;

  if (!isValidCalendarParams({ year, month, day })) {
    console.warn("유효하지 않는 캘린더 URL 접근입니다.");
    return redirect(getRedirectToCalendar());
  }

  return null;
};

// 이벤드 수정 페이지 방어 로더
export const editEventLoader = (queryClient: QueryClient) =>
  withAuthLoader(async ({ params }, user) => {
    const { eventId } = params;

    if (!eventId) {
      alert("잘못된 접근입니다.");
      return redirect(getRedirectToCalendar());
    }

    // 1. React Query 캐시 우선 조회(수정하려는 일정이 쿼리에 있는지 조회)
    const cachedQueries = queryClient.getQueriesData<CalendarEvent[]>({
      queryKey: [QUERY_KEY_EVENTS],
    });

    for (const [, events] of cachedQueries) {
      if (!events || !Array.isArray(events)) continue;

      // 캐시 배열에서 eventId가 일치하는 일정 탐색
      const foundEvent = events.find((e) => String(e.id) === String(eventId));

      if (foundEvent) {
        if (foundEvent.uid && foundEvent.uid !== user.id) {
          // 본인 일정이 맞는지 확인하기
          alert("수정 권한이 없는 일정입니다.");
          return redirect(getRedirectToCalendar());
        }

        return { event: foundEvent }; // 캐시가 있으면 즉시 반환
      }
    }

    // 2. 일정 데이터가 캐시에 없는 경우 (새로고침 or URL 직접 입력)
    const eventPromise = supabase
      .from("calendar_events")
      .select("*")
      .eq("id", eventId)
      .eq("uid", user.id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          alert("존재하지 않거나 수정 권한이 없는 일정입니다.");
          throw redirect(getRedirectToCalendar());
        }
        return data as CalendarEvent;
      });

    // if (error || !event) {
    //   alert("존재하지 않거나 수정 권한이 없는 일정입니다.");
    //   return redirect(getRedirectToCalendar());
    // }

    return { event: eventPromise };
  });
