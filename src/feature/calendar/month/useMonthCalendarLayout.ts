import { useCallback, useMemo, useRef, useState } from "react";

interface UseMonthCalendarLayoutReturn {
  cellRef: (node: HTMLTableCellElement | null) => void;
  MAX_VISIBLE_SLOTS: number;
}

// 기본 최소 셀 높이 (측정 전 깜빡임 방지용 기본값)
const DEFAULT_CELL_HEIGHT = 120;

export const useMonthCalendarLayout = (
  DATE_NUMBER_HEIGHT: number,
  EVENT_HEIGHT: number,
  EVENT_GAP: number,
): UseMonthCalendarLayoutReturn => {
  const [cellHeight, setCellHeight] = useState<number>(DEFAULT_CELL_HEIGHT);
  const observerRef = useRef<ResizeObserver | null>(null);

  // 미니 캘린더에서 보고있는 달(month)의 범위를 벗어나면 url(year, month)를 변경하면서
  // MonthCalendar 렌더링 발생 => 이때 DOM 요소가 변경되거나 새로 생성되어도 컴포넌트에 알려주지 않음.
  // callback ref를 사용해서 react가 Dom에 td요소를 붙이는 순간 아래 함수를 즉시 실행해서
  // 최신 cell height값을 가져올 수 있다.
  const cellRef = useCallback((node: HTMLTableCellElement | null) => {
    // 기존 observer 연결 해제
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    if (node) {
      if (node.clientHeight > 0) {
        setCellHeight(node.clientHeight);
      }

      const observer = new ResizeObserver(([entry]) => {
        const nextHeight = entry.contentRect.height || node.clientHeight;

        if (nextHeight > 0) {
          setCellHeight((prev) => (prev === nextHeight ? prev : nextHeight));
        }
      });

      observer.observe(node);
      observerRef.current = observer;
    }
  }, []);

  /* 셀안에 최대 일정 칸 개수 정하기 */
  const MAX_VISIBLE_SLOTS = useMemo(() => {
    const availableHeight = cellHeight - DATE_NUMBER_HEIGHT;
    const slotHeight = EVENT_HEIGHT + EVENT_GAP;
    // -음수 방지
    return Math.max(0, Math.floor(availableHeight / slotHeight));
  }, [cellHeight]);
  
  return { cellRef, MAX_VISIBLE_SLOTS };
};