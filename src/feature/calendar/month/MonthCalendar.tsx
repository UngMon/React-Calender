import React, { useCallback, useMemo } from "react";
import { mockEvents } from "../mockData";
import { generateCalendarMatrix, calculateWeekSlots } from "./renderdWeeks";
import { useModalStore } from "@/store/useModalStore";
import { useTimeDateStore } from "@/store/useTimeDateStore";
import { useMonthCalendarLayout } from "./useMonthCalendarLayout";
import { calculateWeekLayout } from "./calculateWeekLayout";
import "./MonthCalendar.css";

interface Props {
  date: string; // URL 파라미터에서 넘어온 날짜 (예: '2026-04-22')
  // events: CalendarEvent[]; // 부모 컴포넌트로부터 받을 더미 데이터
}

const EVENT_HEIGHT = 22;
const EVENT_GAP = 2;
const DATE_NUMBER_HEIGHT = 26;

const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

const MonthCalendar = ({ date }: Props) => {
  console.log("Month Claendar Rendering");
  const setPosition = useModalStore((state) => state.setPosition);
  const setTimeAndDate = useTimeDateStore(
    (state) => state.setInitialTimeAndDate,
  );

  const events = mockEvents;

  // 1. 기준 날짜 분해
  const targetDate = new Date(date);
  const currentYear = targetDate.getFullYear();
  const currentMonth = targetDate.getMonth(); // 0부터 시작 (0: 1월, 3: 4월)
  const currentDay = targetDate.getDate();

  // 42칸 달력 매트릭스 생성 함수 (O(1) 시간복잡도)
  const calendarMatrix = useMemo(
    () => generateCalendarMatrix(currentYear, currentMonth),
    [currentYear, currentMonth],
  );

  // 주 단위 이벤트 슬롯(층수) 할당 함수
  const renderedWeeks = useMemo(
    () => calculateWeekSlots(calendarMatrix, events),
    [calendarMatrix, events],
  );

  const { cellRef, MAX_VISIBLE_SLOTS } = useMonthCalendarLayout(
    DATE_NUMBER_HEIGHT,
    EVENT_HEIGHT,
    EVENT_GAP,
  );

  const handlerClick = useCallback(
    (e: React.MouseEvent, week: number, day: number, date: string) => {
      const { width, height } = e.currentTarget.getBoundingClientRect();

      setPosition({ week, day, width, height });
      setTimeAndDate({ startDate: date, endDate: date });
    },
    [],
  );

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
        {renderedWeeks.map(({ weekRow, eventsWithPosition }, wIdx) => {
          const { overflowCounts, visibleEvents, dailyLimits } =
            calculateWeekLayout(eventsWithPosition, MAX_VISIBLE_SLOTS);

          return (
            <tr key={`week-${wIdx}`} className="month-calender__body-week">
              {weekRow.map((cell, dIdx) => {
                const isToday = cell.day === currentDay && cell.isCurrentMonth;

                // 해당 날짜(dIdx)의 최종 숨겨진 일정 개수
                const overflowCount = overflowCounts[dIdx];
                if (wIdx === 1) {
                  console.log(wIdx, dIdx, dailyLimits[dIdx]);
                }
                return (
                  <td
                    key={cell.fullDateStr}
                    className="month-calender__body-date"
                    style={{
                      backgroundColor: isToday ? "#dfe5ff" : "", // 선택된 날짜 배경색
                      color: cell.isCurrentMonth ? "#333" : "#8e8e8e", // 이전/다음달 날짜는 회색 처리
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log(e.currentTarget.getBoundingClientRect());
                      handlerClick(e, wIdx, dIdx, cell.fullDateStr);
                    }}
                    ref={wIdx === 0 && dIdx === 0 ? cellRef : null}
                  >
                    {/* 날짜 텍스트 */}
                    <div
                      className="month-calender__body-date-day"
                      style={{
                        height: `${DATE_NUMBER_HEIGHT}px`,
                        fontWeight: isToday ? "bold" : "normal",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("날짜 클릭");
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
                      {visibleEvents
                        .filter((evt) => evt.startIdx === dIdx)
                        .map((evt, idx) => (
                          <div
                            key={wIdx + dIdx + idx}
                            className={`month-calender__body-date-event ${evt.color}`}
                            style={{
                              top: `${evt.slot * (EVENT_HEIGHT + EVENT_GAP)}px`,
                              width: `calc(100% * ${evt.span} - 5px)`,
                              height: `${EVENT_HEIGHT}px`,
                              lineHeight: `${EVENT_HEIGHT}px`,
                            }}
                          >
                            {evt.timeCategory === "time" && (
                              <span className="month-calender__body-date-event-time">
                                {evt.startTime}
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

export default React.memo(MonthCalendar);

// <div style={{ position: "relative" }}>
//   {eventsWithPosition
//     .filter(
//       (evt) =>
//         evt.startIdx === dIdx &&
//         evt.slot <= MAX_VISIBLE_SLOTS,
//     )
//     .map((evt, idx) => {
//       // 한계선을 넘어가는 슬롯은 렌더링하지 않음 (숨김 처리)
//       // 현재 셀(날짜)에서 시작하는 이벤트들만 렌더링 (긴 일정 중복 방지)

//       if (evt.slot < MAX_VISIBLE_SLOTS) {
//         return (
//           <div
//             key={wIdx + dIdx + idx}
//             className={`month-calender__body-date-event ${evt.color}`}
//             style={{
//               top: `${evt.slot * (EVENT_HEIGHT + EVENT_GAP)}px`,
//               width: `calc(100% * ${evt.span} - 5px)`,
//               height: `${EVENT_HEIGHT}px`,
//               lineHeight: `${EVENT_HEIGHT}px`,
//             }}
//           >
//             {evt.timeCategory === "time" && (
//               <span className="month-calender__body-date-event-time">
//                 {evt.startTime}
//               </span>
//             )}
//             {evt.title}
//           </div>
//         );
//       } else
//         return (
//           <div
//             className="month-calendar__body-date-hidden"
//             style={{
//               top: `${(evt.slot - 1) * (EVENT_HEIGHT + EVENT_GAP)}px`,
//             }}
//             onClick={() => {
//               // TODO: 클릭 시 해당 날짜의 전체 일정을 팝업이나 모달로 보여주는 로직 추가
//               alert(
//                 `${cell.fullDateStr}의 숨겨진 일정 ${overflowCount}개 보기!`,
//               );
//             }}
//           >
//             + {overflowCount}개 더보기
//           </div>
//         );
//     })}
// </div>
