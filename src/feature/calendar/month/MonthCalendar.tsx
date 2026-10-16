import { useCallback, useMemo, useState } from "react";
import { getYMDString } from "@/utils/getTodayString";
import { useModalStore } from "@/store/useModalStore";
import {
  generateCalendarMatrix,
  calculateWeekSlots,
  EventsWithPosition,
} from "./renderdWeeks";
import { useMonthCalendarLayout } from "./useMonthCalendarLayout";
import { calculateWeekLayout } from "./calculateWeekLayout";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";
import { useGhostEventStore } from "@/store/useGhostEventStore";
import { GhostEvent, CalendarEvent } from "@/type/events";
import "./MonthCalendar.css";

interface Props {
  year: string; // URL 파라미터에서 넘어온 날짜 (예: '2026-04-22')
  month: string;
}

const EVENT_HEIGHT = 22;
const EVENT_GAP = 2;
const DATE_NUMBER_HEIGHT = 26;
const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

const today = getYMDString("YMD");

const MonthCalendar = ({ year, month }: Props) => {
  console.log("Month Claendar Rendering");
  // 1. 기준 날짜 분해
  const targetDate = new Date(Number(year), Number(month));
  const currentYear = targetDate.getFullYear();
  const currentMonth = targetDate.getMonth(); // 0부터 시작 (0: 1월, 3: 4월)

  // 2. 42칸 달력 매트릭스 생성 함수 (O(1) 시간복잡도)
  const calendarMatrix = useMemo(
    () => generateCalendarMatrix(currentYear, currentMonth - 1),
    [currentYear, currentMonth],
  );

  // 3. 셀안에서 일정막대 최대 개수 정하기
  const { cellRef, MAX_VISIBLE_SLOTS } = useMonthCalendarLayout(
    DATE_NUMBER_HEIGHT,
    EVENT_HEIGHT,
    EVENT_GAP,
  );

  // 4. 1주차 일요일 ~ 6주차 토요일 날짜 추출
  const rangeStart = calendarMatrix[0][0].fullDateStr;
  const rangeEnd = calendarMatrix[calendarMatrix.length - 1][6].fullDateStr;

  // 5. DB에 저장된 사용자의 캘린더 일정 불러오기
  const { serverEvents } = useCalendarEvents({
    rangeStart,
    rangeEnd,
  });
  const ghostEvent = useGhostEventStore((state) => state.ghostEvent);
  const setGhostEvent = useGhostEventStore((state) => state.setGhostEvent);

  // 6. 드래그 상태 추가
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<string | null>(null);

  // 7. 모달 on / off 상태 추가
  const setPosition = useModalStore((state) => state.setPosition);

  // 8. 마우스 이벤트 핸들러 추가
  const handleMouseDown = useCallback((dateStr: string) => {
    const openModal = useModalStore.getState().openModal;
    if (openModal) return;
    setIsDragging(true);
    setDragStart(dateStr);
    setGhostEvent(dateStr, dateStr); // 고스트 일정 생성(시작, 종료);
  }, []);

  const handleMouseEnter = useCallback(
    (dateStr: string) => {
      if (!isDragging || !dragStart) return;
      const startDate = dragStart <= dateStr ? dragStart : dateStr;
      const endDate = dragStart >= dateStr ? dragStart : dateStr;

      setGhostEvent(startDate, endDate);
    },
    [isDragging, dragStart],
  );

  const handleMouseUp = useCallback(
    (e: React.MouseEvent, week: number, day: number) => {
      e.stopPropagation();

      if (!isDragging || !dragStart) return;

      const rect = e.currentTarget.getBoundingClientRect();
      setPosition({ week, day, rect }, null, "make");

      // 상태 초기화
      setIsDragging(false);
      setDragStart(null);
    },
    [isDragging, dragStart],
  );

  // 기존 코드에서 mockEvents 대신 displayEvents를 넣어 계산!
  const weeksWithEvents = useMemo(() => {
    const results: Array<CalendarEvent | GhostEvent> = [...serverEvents];
    if (ghostEvent) results.push(ghostEvent);

    return calculateWeekSlots(calendarMatrix, results);
  }, [calendarMatrix, serverEvents, ghostEvent]);

  const handleClickEvent = (
    e: React.MouseEvent,
    week: number,
    day: number,
    event_data: EventsWithPosition,
  ) => {
    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({ week, day, rect }, event_data, "detail");
  };

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
        {weeksWithEvents.map(({ weekRow, eventsWithPosition }, wIdx) => {
          const { overflowCounts, visibleEvents, dailyLimits } =
            calculateWeekLayout(eventsWithPosition, MAX_VISIBLE_SLOTS);

          const eventsByStartIdx: Record<number, typeof visibleEvents> = {};
          visibleEvents.forEach((evt) => {
            if (!eventsByStartIdx[evt.startIdx])
              eventsByStartIdx[evt.startIdx] = [];
            eventsByStartIdx[evt.startIdx].push(evt);
          });

          return (
            <tr key={`week-${wIdx}`} className="month-calender__body-week">
              {weekRow.map((cell, dIdx) => {
                const isToday = today === cell.fullDateStr;

                // 현재 셀(날짜)에서의 이벤트 일정들
                const currentCellEvents = eventsByStartIdx[dIdx] || [];

                // 해당 날짜(dIdx)의 최종 숨겨진 일정 개수
                const overflowCount = overflowCounts[dIdx];

                return (
                  <td
                    key={cell.fullDateStr}
                    className="month-calender__body-date"
                    style={{
                      backgroundColor: isToday ? "#dfe5ff" : "", // 선택된 날짜 배경색
                      color: cell.isCurrentMonth ? "#333" : "#8e8e8e", // 이전/다음달 날짜는 회색 처리
                    }}
                    onMouseDown={() => handleMouseDown(cell.fullDateStr)}
                    onMouseEnter={() => handleMouseEnter(cell.fullDateStr)}
                    onMouseUp={(e) => handleMouseUp(e, wIdx, dIdx)}
                    ref={wIdx === 0 && dIdx === 0 ? cellRef : null}
                  >
                    {/* 날짜 텍스트 */}
                    <div
                      className="month-calender__body-date-day"
                      style={{
                        height: `${DATE_NUMBER_HEIGHT}px`,
                        fontWeight: isToday ? "bold" : "normal",
                      }}
                    >
                      <span
                        style={{
                          backgroundColor: isToday ? "#1a73e8" : "transparent",
                          color: isToday ? "#fff" : "inherit",
                        }}
                      >
                        {cell.day}
                      </span>
                    </div>

                    {/* 일정 렌더링 구역 */}
                    <div className="month-calendar__body-date-eventarea">
                      {currentCellEvents.map((evt) => (
                        <div
                          key={`${evt.id || "ghost"}-${cell.fullDateStr}`}
                          className={`month-calender__body-date-event ${evt.color}`}
                          style={{
                            top: `${evt.slot * (EVENT_HEIGHT + EVENT_GAP)}px`,
                            width: `calc(100% * ${evt.span} - 5px + ${evt.span - 1}px)`,
                            height: `${EVENT_HEIGHT}px`,
                            lineHeight: `${EVENT_HEIGHT}px`,
                            opacity: evt.isGhost ? 0.6 : 1, // 가상 막대는 반투명하게
                            pointerEvents: isDragging ? "none" : "auto",
                          }}
                          onMouseDown={(e) => e.stopPropagation()}
                          onMouseUp={(e) =>
                            handleClickEvent(e, wIdx, dIdx, evt)
                          }
                        >
                          {evt.time_category === "time" && (
                            <span className="month-calender__body-date-event-time">
                              {evt.start_time.slice(0, 5)}
                            </span>
                          )}
                          {evt.title}
                        </div>
                      ))}
                    </div>

                    {/* 숨겨진 일정이 있다면 하단에 '+ N개 더보기' 버튼 렌더링 */}
                    {overflowCount > 0 && (
                      <div
                        className="month-calendar__body-date-hidden"
                        style={{
                          // 더보기 버튼은 항상 허용된 마지막 슬롯 자리에 고정
                          top: `${(dailyLimits[dIdx] + 1) * (EVENT_HEIGHT + EVENT_GAP)}px`,
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
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
          );
        })}
      </tbody>
    </table>
  );
};

export default MonthCalendar;
