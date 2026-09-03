import { useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";

export type CalendarViewType = "year" | "month" | "week" | "day";

/**
 * - month: "YYYY-MM"
 * - week/day: "YYYY-MM-DD"
 * - year: "YYYY"
 */

interface UseCalendarWheelNavProps {
  view: CalendarViewType;
  currentDateStr: string;
}

export const useCalendarWheelNav = ({
  view,
  currentDateStr,
}: UseCalendarWheelNavProps) => {
  const navigate = useNavigate();
  const isScrollingRef = useRef<boolean>(false);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      // 스로틀링 락 상태는 무시하기
      if (isScrollingRef.current) return;

      let delta = e.deltaY;

      // 미세한 휠 튐 방지
      if (Math.abs(delta) < 25) return;

      isScrollingRef.current = true;
      const step = delta > 0 ? 1 : -1; //1: 다음, -1: 이전

      // 3. 뷰 타입별 날짜 연산
      const parts = currentDateStr.split("-").map(Number);
      const year = parts[0];
      const month = parts[1] || 1;
      const day = parts[2] || 1;

      let nextDateObj: Date;

      switch (view) {
        case "year":
          nextDateObj = new Date(year + step, month - 1, day);
          break;
        case "month":
          nextDateObj = new Date(year, month - 1 + step, 1);
          break;
        case "week":
          nextDateObj = new Date(year, month - 1, day + step * 7);
          break;
        case "day":
          nextDateObj = new Date(year, month - 1, day + step);
          break;
      }

      const nextYear = nextDateObj.getFullYear();
      const nextMonth = String(nextDateObj.getMonth() + 1).padStart(2, "0");
      const nextDay = String(nextDateObj.getDate()).padStart(2, "0");

      let targetPath = "";
      if (view === "year") {
        targetPath = `/calendar/year/${nextYear}`;
      } else if (view === "month") {
        targetPath = `/calendar/month/${nextYear}/${nextMonth}`;
      } else {
        targetPath = `/calendar/${view}/${nextYear}/${nextMonth}/${nextDay}`;
      }

      navigate(targetPath);

      setTimeout(() => {
        isScrollingRef.current = false;
      }, 400);
    },
    [view, currentDateStr, navigate],
  );

  return { handleWheel };
};
