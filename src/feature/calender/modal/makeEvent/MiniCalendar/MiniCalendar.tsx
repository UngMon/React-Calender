import React, { useMemo } from "react";
import { generateCalendarMatrix } from "../../../month/renderdWeeks";
import { CalendarCell } from "../../../month/renderdWeeks";
import { getTodayDateString } from "@/utils/getTodayString";
import { useModalStore } from "@/store/useModalStore";
import { useTimeDateStore } from "@/store/useTimeDateStore";
import styles from "./MiniCalendar.module.css";

interface Props {
  order: string;
}

const weekDays = ["일", "월", "화", "수", "목", "금", "토"];
const today = getTodayDateString();

const MiniCalendar = ({ order }: Props) => {
  // 1. 기준 날짜 분해
  const startDate = useTimeDateStore((state) => state.startDate);
  const endDate = useTimeDateStore((state) => state.endDate);

  const targetDate = new Date(order === "start" ? startDate : endDate);
  const currentYear = targetDate.getFullYear();
  const currentMonth = targetDate.getMonth(); // 0부터 시작 (0: 1월, 3: 4월)

  const setMiniDate = useTimeDateStore((state) => state.setMiniDate);

  // 42칸 달력 매트릭스 생성 함수 (O(1) 시간복잡도)
  const calendarMatrix: CalendarCell[][] = useMemo(
    () => generateCalendarMatrix(currentYear, currentMonth),
    [currentYear, currentMonth],
  );

  const clickDate = (date: string) => {
    setMiniDate(order, date);
  };

  const getDateColor = (dayIndex: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) {
      if (dayIndex === 0) return "rgba(220, 38, 38, 0.35)";
      if (dayIndex === 6) return "rgba(37, 99, 235, 0.35)";
      return "#949494";
    }

    if (dayIndex === 0) return "#e53935";
    if (dayIndex === 6) return "#1a73e8";

    return "#333";
  };

  const getRangeClass = (dateStr: string) => {
    if (!startDate || !endDate) return {};

    if (startDate === endDate && dateStr === startDate)
      return styles["range-single"];

    if (dateStr === startDate) return styles["range-start"];

    if (dateStr === endDate) return styles["range-end"];

    if (dateStr > startDate && dateStr < endDate)
      return styles["range-between"];

    return "";
  };

  return (
    <div className={styles["container"]}>
      <table className={styles["calendar"]}>
        <thead className={styles["calendar__head"]}>
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
        <tbody className={styles["calendar__body"]}>
          {calendarMatrix.map((cell, wIdx) => (
            <tr key={`week-${wIdx}`}>
              {cell.map((data, Idx) => {
                const isToday = data.fullDateStr === today;

                return (
                  <td
                    key={data.fullDateStr}
                    className={styles["caldner__body-td"]}
                    style={{
                      color: getDateColor(Idx, data.isCurrentMonth),
                      opacity: data.isCurrentMonth ? 1 : 0.65,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      clickDate(data.fullDateStr);
                    }}
                  >
                    <div
                      className={`${styles["caldner__body-date"]} ${getRangeClass(data.fullDateStr)}`}
                      style={{
                        fontWeight: isToday ? "bold" : "normal",
                        color:
                          Idx === 0 ? "red" : Idx === 6 ? "blue" : "inherit",
                      }}
                    >
                      <span
                        style={{
                          backgroundColor: isToday ? "#1a73e8" : "transparent",
                          color: isToday ? "#fff" : "inherit",
                        }}
                      >
                        {data.day}
                      </span>
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default React.memo(MiniCalendar);
