import { useMemo } from "react";
import { CalendarEvent, mockEvents } from "../mockData";
import "./MonthCalender.css";

interface Props {
  date: string; // URL 파라미터에서 넘어온 날짜 (예: '2026-04-22')
  // events: CalendarEvent[]; // 부모 컴포넌트로부터 받을 더미 데이터
}

interface CalendarCell {
  year: number;
  month: number;
  day: number;
  isCurrentMonth: boolean; // 이번 달 날짜인지 여부 (투명도 처리를 위함)
  fullDateStr: string; // 식별자 및 키 값 (예: '2026-04-22')
}
// 사용자 뷰포트 너비에 따라 유동적으로 움직일 수 있게 event리스너가 필요할듯 싶다.
const CELL_MIN_HEIGHT = 120;
const EVENT_HEIGHT = 22;
const EVENT_GAP = 2;
const DATE_NUMBER_HEIGHT = 26;
const MORE_BTN_HEIGHT = 20;

const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

const MonthCalender = ({ date }: Props) => {
  const events = mockEvents;

  // 1. 기준 날짜 분해
  const targetDate = new Date(date);
  const currentYear = targetDate.getFullYear();
  const currentMonth = targetDate.getMonth(); // 0부터 시작 (0: 1월, 3: 4월)
  const currentDay = targetDate.getDate();

  // 2. 42칸(6주 x 7일) 매트릭스 생성 (시간복잡도 O(1), useMemo 최적화)
  // year나 month가 바뀔 때만 단 한 번 계산됩니다. (일(Day)이 바뀔 때는 캐싱된 배열 사용)
  const calendarMatrix = useMemo(() => {
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
  }, [currentYear, currentMonth]);

  const MAX_VISIBLE_SLOTS = Math.floor(
    (CELL_MIN_HEIGHT - DATE_NUMBER_HEIGHT - MORE_BTN_HEIGHT) /
      (EVENT_HEIGHT + EVENT_GAP),
  );

  // --- 3. 🌟 핵심: 주 단위 슬롯 할당 알고리즘 ---
  const renderedWeeks = useMemo(() => {
    return calendarMatrix.map((weekRow) => {
      const weekStartStr = weekRow[0].fullDateStr;
      const weekEndStr = weekRow[6].fullDateStr;

      // ① 이번 주 영역에 걸쳐 있는 일정 필터링
      const weekEvents = events.filter(
        (evt) => evt.startDate <= weekEndStr && evt.endDate >= weekStartStr,
      );

      // ② [황금 4원칙] 정렬
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
            for (let i = startIdx; i <= endIdx; i++)
              slots[assignedSlot][i] = evt.id;
            break;
          }
          assignedSlot++;
        }

        return { ...evt, startIdx, span, slot: assignedSlot };
      });

      return { weekRow, eventsWithPosition, slots };
    });
  }, [calendarMatrix, events]);

  return (
    <table className="month-calender">
      <thead className="month-calender__head">
        <tr>
          {weekDays.map((day, index) => (
            <th
              key={day}
              style={{
                color: index === 0 ? "red" : index === 6 ? "blue" : "black",
              }}
            >
              {day}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="month-calender__body">
        {renderedWeeks.map(({ weekRow, eventsWithPosition, slots }, wIdx) => (
          <tr key={`week-${wIdx}`} className="month-calender__body-week">
            {weekRow.map((cell, dIdx) => {
              const isToday = cell.day === currentDay && cell.isCurrentMonth;

              // 현재 셀(날짜)에서 시작하는 이벤트들만 렌더링 (중복 방지)
              const startingEvents = eventsWithPosition.filter(
                (e) => e.startIdx === dIdx,
              );

              // 현재 셀(요일 dIdx)에 숨겨진(오버플로우 된) 일정 개수 카운트
              let overflowCount = 0;
              for (let s = MAX_VISIBLE_SLOTS; s < slots.length; s++) {
                if (slots[s] && slots[s][dIdx] !== "") {
                  overflowCount++;
                }
              }

              return (
                <td
                  key={cell.fullDateStr}
                  className="month-calender__body-date"
                  style={{
                    backgroundColor: isToday ? "#dfe5ff" : "", // 선택된 날짜 배경색
                    color: cell.isCurrentMonth ? "#333" : "#8e8e8e", // 이전/다음달 날짜는 회색 처리
                  }}
                >
                  {/* 날짜 텍스트 */}
                  <div
                    className="month-calender__body-date-day"
                    style={{
                      height: `${DATE_NUMBER_HEIGHT}px`,
                      color: cell.isCurrentMonth ? "black" : "#ccc",
                      fontWeight: isToday ? "bold" : "normal",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        width: "26px",
                        height: "26px",
                        lineHeight: "30px",
                        textAlign: "center",
                        borderRadius: "50%",
                        backgroundColor: isToday ? "#1a73e8" : "transparent",
                        color: isToday ? "#fff" : "inherit",
                      }}
                    >
                      {cell.day}
                    </span>
                  </div>

                  {/* 일정 렌더링 구역 */}
                  <div style={{ position: "relative" }}>
                    {startingEvents.map((evt) => {
                      // 한계선을 넘어가는 슬롯은 렌더링하지 않음 (숨김 처리)
                      if (evt.slot >= MAX_VISIBLE_SLOTS) return null;

                      return (
                        <div
                          key={evt.createdAt + dIdx}
                          className={evt.color}
                          style={{
                            boxSizing: "border-box",
                            position: "absolute",
                            top: `${evt.slot * (EVENT_HEIGHT + EVENT_GAP)}px`,
                            left: "2px",
                            width: `calc(100% * ${evt.span} - 5px)`,
                            height: `${EVENT_HEIGHT}px`,
                            lineHeight: `${EVENT_HEIGHT}px`,
                            borderRadius: "3px",
                            padding: "0 6px",
                            fontSize: "12px",
                            color: "#fff",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            zIndex: 10,
                            cursor: "pointer",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                          }}
                        >
                          {evt.timeCategory === "time" && (
                            <span
                              style={{
                                fontSize: "10px",
                                marginRight: "4px",
                                opacity: 0.9,
                              }}
                            >
                              {evt.startTime}
                            </span>
                          )}
                          {evt.title}
                        </div>
                      );
                    })}
                  </div>

                  {/* 숨겨진 일정이 있다면 하단에 '+ N개 더보기' 버튼 렌더링 */}
                  {overflowCount > 0 && (
                    <div
                      style={{
                        boxSizing: 'border-box',
                        position: "absolute",
                        bottom: "2px",
                        left: "0px",
                        fontSize: "12px",
                        color: "#1a73e8",
                        fontWeight: "bold",
                        cursor: "pointer",
                        padding: "2px 4px",
                        borderRadius: "4px",
                        width: '100%'
                      }}
                      onClick={() => {
                        // TODO: 클릭 시 해당 날짜의 전체 일정을 팝업이나 모달로 보여주는 로직 추가
                        alert(
                          `${cell.fullDateStr}의 숨겨진 일정 ${overflowCount}개 보기!`,
                        );
                      }}
                    >
                      + {overflowCount}개 더보기
                    </div>
                  )}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MonthCalender;
