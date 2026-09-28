import { GhostEvent, CalendarEvent } from "@/type/events";

export interface EventsWithPosition {
  startIdx: number;
  endIdx: number;
  span: number;
  slot: number;
  id: string;
  uid: string;
  title: string;
  text: string;
  start_date: string;
  end_date: string;
  color:
    | "토마토"
    | "연분홍"
    | "바나나"
    | "세이지"
    | "바질"
    | "공작"
    | "블루베리"
    | "라벤더"
    | "포도"
    | "흑연";
  time_category: "allday" | "time";
  start_time: string;
  end_time: string;
  created_at: string;
  isGhost?: boolean;
}

export interface CalendarCell {
  year: number;
  month: number;
  day: number;
  isCurrentMonth: boolean;
  fullDateStr: string;
}

const nowMonth = new Date().getMonth() + 1;

// year나 month가 바뀔 때만 단 한 번 계산됩니다. (일(Day)이 바뀔 때는 캐싱된 배열 사용)
export const generateCalendarMatrix = (
  currentYear: number,
  currentMonth: number,
): CalendarCell[][] => {
  const matrix: CalendarCell[][] = [];

  // 이번 달 1일의 요일 (0: 일요일 ~ 6: 토요일)
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  let currentCellIndex = 0;

  // 항상 6주(Row)를 고정으로 그림
  for (let week = 0; week < 6; week++) {
    const weekRow: CalendarCell[] = [];

    // 1주(Row)에는 항상 7일(Column)이 들어간다.
    for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
      // 💡 Date 객체의 자동 보정
      // 0일, -1일, 32일 등을 넣어도 브라우저가 알아서 이전 달/다음 달로 정확히 계산함
      const cellDate = new Date(
        currentYear,
        currentMonth,
        1 - firstDayOfWeek + currentCellIndex,
      );
      const cellYear = cellDate.getFullYear();
      const cellMonth = cellDate.getMonth() + 1; // 1 ~ 12
      const cellDay = cellDate.getDate();
      console.log(cellMonth, currentMonth);
      weekRow.push({
        year: cellYear,
        month: cellMonth,
        day: cellDay,
        isCurrentMonth: cellMonth === currentMonth + 1,
        // 'YYYY-MM-DD' 형태의 고유 문자열 포맷팅
        fullDateStr: `${cellYear}-${String(cellMonth).padStart(2, "0")}-${String(cellDay).padStart(2, "0")}`,
      });

      currentCellIndex++;
    }
    matrix.push(weekRow);
  }
  return matrix;
};

// --- 핵심: 주 단위 슬롯 할당 알고리즘 ---
export const calculateWeekSlots = (
  calendarMatrix: CalendarCell[][],
  events: Array<CalendarEvent | GhostEvent>,
) => {
  return calendarMatrix.map((weekRow) => {
    const weekStartStr = weekRow[0].fullDateStr;
    const weekEndStr = weekRow[6].fullDateStr;

    // ① 이번 주 영역에 걸쳐 있는 일정 필터링
    const weekEvents = events.filter(
      (evt) => evt.start_date <= weekEndStr && evt.end_date >= weekStartStr,
    );

    // ② 정렬 4원칙
    const sortedEvents = [...weekEvents].sort((a, b) => {
      if (a.start_date !== b.start_date)
        return a.start_date.localeCompare(b.start_date);
      const aLen =
        new Date(a.end_date).getTime() - new Date(a.start_date).getTime();
      const bLen =
        new Date(b.end_date).getTime() - new Date(b.start_date).getTime();
      if (aLen !== bLen) return bLen - aLen; // 긴 일정 우선
      if (a.time_category !== b.time_category)
        return a.time_category === "allday" ? -1 : 1;
      return (a.start_time || "").localeCompare(b.start_time || "");
    });

    // ③ 그리디 슬롯 할당
    const slots: string[][] = []; // slots[층수] = [이미 차지된 날짜들...]

    const eventsWithPosition = sortedEvents.map((evt) => {
      // 이 일정이 이번 주 내에서 시작하는 요일과 끝나는 요일 계산 (0~6)
      const startIdx = Math.max(
        0,
        weekRow.findIndex((c) => c.fullDateStr === evt.start_date),
      );
      const endIdx =
        evt.end_date > weekEndStr
          ? 6
          : weekRow.findIndex((c) => c.fullDateStr === evt.end_date);
      const span = endIdx - startIdx + 1;

      // 들어갈 수 있는 가장 낮은 층수 찾기
      let assignedSlot = 0;
      while (true) {
        if (!slots[assignedSlot]) slots[assignedSlot] = Array(7).fill("");
        const isBusy = slots[assignedSlot]
          .slice(startIdx, endIdx + 1)
          .some((day) => day !== "");

        if (!isBusy) {
          for (let i = startIdx; i <= endIdx; i++) {
            slots[assignedSlot][i] = evt.id;
          }
          break;
        }
        assignedSlot++;
      }

      return {
        ...evt,
        startIdx,
        endIdx: startIdx + span - 1,
        span,
        slot: assignedSlot,
      };
    });

    return { weekRow, eventsWithPosition };
  });
};
