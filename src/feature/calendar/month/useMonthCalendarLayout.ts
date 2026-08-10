import { useEffect, useMemo, useRef, useState } from "react";

interface UseMonthCalendarLayoutReturn {
  cellRef: React.RefObject<HTMLTableCellElement | null>;
  MAX_VISIBLE_SLOTS: number;
}

export const useMonthCalendarLayout = (
  DATE_NUMBER_HEIGHT: number,
  EVENT_HEIGHT: number,
  EVENT_GAP: number,
): UseMonthCalendarLayoutReturn => {
  const cellRef = useRef<HTMLTableCellElement | null>(null);
  const [cellHeight, setCellHeight] = useState<number>(0);

  /* 달력 날짜 셀 크기 계산하기 */
  useEffect(() => {
    const element = cellRef.current;

    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      const nextHeight = entry.contentRect.height;

      setCellHeight((prev) => (prev === nextHeight ? prev : nextHeight));
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  /* 셀안에 최대 일정 칸 개수 정하기 */
  const MAX_VISIBLE_SLOTS = useMemo(() => {
    return Math.floor(
      (cellHeight - DATE_NUMBER_HEIGHT) / (EVENT_HEIGHT + EVENT_GAP),
    );
  }, [cellHeight]);

  return { cellRef, MAX_VISIBLE_SLOTS };
};
