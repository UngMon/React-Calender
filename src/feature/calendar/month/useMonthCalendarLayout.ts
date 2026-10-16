import { useCallback, useRef, useState } from "react";

interface UseMonthCalendarLayoutReturn {
  cellRef: (node: HTMLTableCellElement | null) => void;
  MAX_VISIBLE_SLOTS: number;
}

// DOM 측정 전 사용할 초기 슬롯 개수를 계산하기 위한 높이
const DEFAULT_CELL_HEIGHT = 120;

export const useMonthCalendarLayout = (
  DATE_NUMBER_HEIGHT: number,
  EVENT_HEIGHT: number,
  EVENT_GAP: number,
): UseMonthCalendarLayoutReturn => {
  // 현제 셀(td)의 높이에 가능한 이벤트 슬롯 수 계산하기
  const calculateVisibleSlots = useCallback(
    (height: number) => {
      const availableHeight = height - DATE_NUMBER_HEIGHT;
      const slotHeight = EVENT_HEIGHT + EVENT_GAP;

      return Math.max(0, Math.floor(availableHeight / slotHeight));
    },
    [DATE_NUMBER_HEIGHT, EVENT_HEIGHT, EVENT_GAP],
  );

  // 화면에 필요한 값은 픽셀 단위 높이가 아니라 표시 가능한 슬롯 개수
  const [MAX_VISIBLE_SLOTS, setMaxVisibleSlots] = useState<number>(() =>
    calculateVisibleSlots(DEFAULT_CELL_HEIGHT),
  );
  // 마지막으로 요청한 슬롯 개수를 기억해 같은 값이면 setState도 호출하지 않기
  const visibleSlotsRef = useRef(MAX_VISIBLE_SLOTS);
  const observerRef = useRef<ResizeObserver | null>(null);

  // 월 이동으로 td가 교체되면 기존 관찰을 해제하고 새 셀을 측정
  // 계산 기준이 바뀌어도 ref를 다시 연결해 현재 높이로 슬롯 개수를 갱신한다.
  const cellRef = useCallback(
    (node: HTMLTableCellElement | null) => {
      observerRef.current?.disconnect();
      observerRef.current = null;

      if (!node) return;

      const updateVisibleSlots = (height: number) => {
        // 아직 배치되지 않았거나 숨겨진 셀의 높이로 기존 값을 덮어쓰지 않는다.
        if (height <= 0) return;

        const nextSlots = calculateVisibleSlots(height);
        if (visibleSlotsRef.current === nextSlots) return;

        visibleSlotsRef.current = nextSlots;
        setMaxVisibleSlots(nextSlots);
      };

      updateVisibleSlots(node.clientHeight);

      const observer = new ResizeObserver(([entry]) => {
        updateVisibleSlots(entry.contentRect.height || node.clientHeight);
      });

      observer.observe(node);
      observerRef.current = observer;
    },
    [calculateVisibleSlots],
  );

  return { cellRef, MAX_VISIBLE_SLOTS };
};
