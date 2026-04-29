import { useMemo } from "react";
import { CalendarEvent, mockEvents } from "../mockData";
import { generateCalendarMatrix, calculateWeekSlots } from "./renderdWeeks";
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

  const MAX_VISIBLE_SLOTS = Math.floor(
    (CELL_MIN_HEIGHT - DATE_NUMBER_HEIGHT - MORE_BTN_HEIGHT) /
      (EVENT_HEIGHT + EVENT_GAP),
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
                        boxSizing: "border-box",
                        position: "absolute",
                        bottom: "2px",
                        left: "0px",
                        fontSize: "12px",
                        color: "#1a73e8",
                        fontWeight: "bold",
                        cursor: "pointer",
                        padding: "2px 4px",
                        borderRadius: "4px",
                        width: "100%",
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
