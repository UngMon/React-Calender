import React, { useMemo } from "react";
import style from "./DailyCalendar.module.css";
import { calculateDailySlots } from "./calendarSlotting";
import { CalendarEvent, mockEvents } from "../mockData";

const PIXELS_PER_MINUTE = 1;
const HOUR_HEIGHT = 60 * PIXELS_PER_MINUTE;
const HOURS = Array.from({ length: 24 }, (_, i) => i);

interface DailyCalendarProps {
  targetDate: string;
  //   events: CalendarEvent[];
}

const DailyCalendarUI = ({ targetDate }: DailyCalendarProps) => {
  const events = mockEvents;

  // 알고리즘을 유틸리티 함수로 위임하여 가독성 극대화
  const slottedEvents = useMemo(
    () => calculateDailySlots(events, targetDate),
    [events, targetDate],
  );

  return (
    <div className={style.dailyContainer}>
      <div className={style.timeGridWrapper}>
        <div style={{ height: "70px", width: "100%" }}></div>
        <div className={style.timeGridBox}>
          {/* 시간 표시 */}
          <div className={style.timeLabels}>
            {HOURS.map((hour) => (
              <div
                key={`time-${hour}`}
                className={style.timeLabel}
                style={{ height: `${HOUR_HEIGHT}px` }}
              >
                <span>
                  {hour < 12
                    ? `오전 ${String(hour)}시`
                    : `오후 ${String(hour - 12)}시`}
                </span>
              </div>
            ))}
          </div>
          {/* 배경 가로선 렌더링 */}
          <div className={style.gridBoard}>
            {HOURS.map((hour) => (
              <div
                key={`line-${hour}`}
                className={style.gridLine}
                style={{ height: `${HOUR_HEIGHT}px` }}
              />
            ))}
            {/* N등분된 일정 막대기 렌더링 */}
            {slottedEvents.map((event) => {
              const blockHeight: number =
                event.endMin - event.startMin * PIXELS_PER_MINUTE;
              const blockWidth = `calc(100% / ${event.maxCols})`;

              return (
                <div
                  key={event.id + event.title}
                  className={`${style.eventBlock} ${event.color}`}
                  style={{
                    top: `${event.startMin * PIXELS_PER_MINUTE}px`,
                    height: `${blockHeight}px`,
                    width: blockWidth,
                    left: `calc((100% / ${event.maxCols}) * ${event.colIdx})`,
                  }}
                >
                  <div className={style.eventContent}>
                    <span>{event.title}</span>
                    {blockHeight >= 45 ? <br /> : <span>&nbsp;</span>}
                    <span>{`${event.startTime} ~ ${event.endTime}`}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(DailyCalendarUI);
