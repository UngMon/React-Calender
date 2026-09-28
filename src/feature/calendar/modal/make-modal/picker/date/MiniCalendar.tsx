import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { generateCalendarMatrix } from "../../../../month/renderdWeeks";
import { CalendarCell } from "../../../../month/renderdWeeks";
import { getYMDString } from "@/utils/getTodayString";
import { useGhostEventStore } from "@/store/useGhostEventStore";
import { useMakeModalStore } from "@/store/useMakeModalStore";
import styles from "./MiniCalendar.module.css";

interface Props {
  type: "make" | "edit";
  order: string;
  start_date: string;
  end_date: string;
}

const weekDays = ["일", "월", "화", "수", "목", "금", "토"];
const today = getYMDString("YMD");

const MiniCalendar = ({ type, order, start_date, end_date }: Props) => {
  const navigate = useNavigate();
  const { year, month } = useParams();

  // 고스트 일정의 시작 날, 종료 날 그리고 일정 변경
  const setMoveDate = useGhostEventStore((state) => state.setMoveDate);

  if (!start_date || !end_date) return null;

  // 미니 캘린더의 현재 년, 월  상태값 저장
  const date = new Date(order === "start" ? start_date : end_date);

  const [currentYear, setCurrentYear] = useState<number>(date.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(date.getMonth() + 1);

  // 3. 미니 캘린더 자체 좌/우 월 이동 핸들러
  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentMonth === 1) {
      setCurrentYear((prev) => prev - 1);
      setCurrentMonth(12);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentMonth === 12) {
      setCurrentYear((prev) => prev + 1);
      setCurrentMonth(1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  // 42칸 달력 매트릭스 생성 함수 (O(1) 시간복잡도)
  const calendarMatrix: CalendarCell[][] = useMemo(
    () => generateCalendarMatrix(currentYear, currentMonth - 1),
    [currentYear, currentMonth],
  );

  const clickDate = (
    order: string,
    pickedDate: string,
    wIdx: number,
    dIdx: number,
  ) => {
    setMoveDate(order, pickedDate, type);

    if (type === 'edit') return;

    if (currentYear !== Number(year) || currentMonth !== Number(month)) {
      const newDate = new Date(pickedDate);
      const newYear = newDate.getFullYear();
      const newMonth = newDate.getMonth() + 1;

      setCurrentYear(newYear);
      setCurrentMonth(newMonth);
      navigate(
        `/calendar/month/${newYear}/${String(newMonth).padStart(2, "0")}`,
      );
    }

    // MakeEvet 모달창 위치 변경
    if (order === "start") {
      const setPosition = useMakeModalStore.getState().setPosition;
      setPosition({ week: wIdx, day: dIdx });
    }
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
    if (!start_date || !end_date) return {};

    if (start_date === end_date && dateStr === start_date)
      return styles["range-single"];

    if (dateStr === start_date) return styles["range-start"];

    if (dateStr === end_date) return styles["range-end"];

    if (dateStr > start_date && dateStr < end_date)
      return styles["range-between"];

    return "";
  };

  return (
    <div className={styles["container"]}>
      <div className={styles["calendar__move-month"]}>
        <button type="button" onClick={(e) => handlePrevMonth(e)}>
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
        <span>{`${currentYear}년 ${currentMonth}월`}</span>
        <button type="button" onClick={(e) => handleNextMonth(e)}>
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>
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
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      clickDate(order, data.fullDateStr, wIdx, Idx);
                    }}
                  >
                    <div
                      className={`${styles["caldner__body-date"]} ${getRangeClass(data.fullDateStr)}`}
                      style={{
                        fontWeight: isToday ? "bold" : "normal",
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
