import { CalendarEvent } from "../mockData";

export interface CalendarCell {
  year: number;
  month: number;
  day: number;
  isCurrentMonth: boolean;
  fullDateStr: string;
}

// year나 month가 바뀔 때만 단 한 번 계산됩니다. (일(Day)이 바뀔 때는 캐싱된 배열 사용)
export const generateCalendarMatrix = (
  currentYear: number,
  currentMonth: number,
): CalendarCell[][] => {
  console.log("🗓️ 캘린더 매트릭스 계산 중..."); // 연/월이 바뀔 때만 찍히는지 확인용
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

      weekRow.push({
        year: cellYear,
        month: cellMonth,
        day: cellDay,
        isCurrentMonth: cellDate.getMonth() === currentMonth,
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
  events: CalendarEvent[],
) => {
  return calendarMatrix.map((weekRow) => {
    const weekStartStr = weekRow[0].fullDateStr;
    const weekEndStr = weekRow[6].fullDateStr;

    // ① 이번 주 영역에 걸쳐 있는 일정 필터링
    const weekEvents = events.filter(
      (evt) => evt.startDate <= weekEndStr && evt.endDate >= weekStartStr,
    );

    // ② 정렬 4원칙
    const sortedEvents = [...weekEvents].sort((a, b) => {
      if (a.startDate !== b.startDate)
        return a.startDate.localeCompare(b.startDate);
      const aLen =
        new Date(a.endDate).getTime() - new Date(a.startDate).getTime();
      const bLen =
        new Date(b.endDate).getTime() - new Date(b.startDate).getTime();
      if (aLen !== bLen) return bLen - aLen; // 긴 일정 우선
      if (a.timeCategory !== b.timeCategory)
        return a.timeCategory === "allday" ? -1 : 1;
      return (a.startTime || "").localeCompare(b.startTime || "");
    });

    // ③ 그리디 슬롯 할당
    const slots: string[][] = []; // slots[층수] = [이미 차지된 날짜들...]

    const eventsWithPosition = sortedEvents.map((evt) => {
      // 이 일정이 이번 주 내에서 시작하는 요일과 끝나는 요일 계산 (0~6)
      const startIdx = Math.max(
        0,
        weekRow.findIndex((c) => c.fullDateStr === evt.startDate),
      );
      const endIdx =
        evt.endDate > weekEndStr
          ? 6
          : weekRow.findIndex((c) => c.fullDateStr === evt.endDate);
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

      return { ...evt, startIdx, span, slot: assignedSlot };
    });

    return { weekRow, eventsWithPosition, slots };
  });
};
