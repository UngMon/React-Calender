import React from "react";
import { useGhostEventStore } from "@/store/useGhostEventStore";
import AllDay from "./AllDay";
import MobilePanel from "./mobile/MobilePanel";
import DatePicker from "./date/DatePicker";
import TimePicker from "./time/TimePicker";
import "./TimeAndDateBox.css";

interface Props {
  type: "make" | "edit";
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  time_category: "allday" | "time" | undefined;
}

const TimeAndDateBox = ({
  type,
  start_date,
  end_date,
  start_time,
  end_time,
  time_category,
}: Props) => {
  const setIsAllday = useGhostEventStore((state) => state.setIsAllday);
  const openPicker = useGhostEventStore((state) => state.openPicker);
  const setOpenPicker = useGhostEventStore((state) => state.setOpenPicker);
  console.log(openPicker);
  return (
    <div className="time-date-box" onClick={(e) => e.stopPropagation()}>
      {/* 1. 상단: 하루 종일 토글 영역 */}
      <AllDay
        type={type}
        time_category={time_category}
        setIsAllday={setIsAllday}
      />

      {/* 2. 하단: 기간 설정 영역 (시작 ~ 종료) */}
      <div className="time-date-box__range">
        {/* 시작 */}
        <div className="time-date-box__group">
          <DatePicker
            type={type}
            order="start"
            openPicker={openPicker}
            setOpenPicker={setOpenPicker}
            start_date={start_date}
            end_date={end_date}
          />
          {time_category === "time" && (
            <TimePicker
              type={type}
              order="start"
              openPicker={openPicker}
              setOpenPicker={setOpenPicker}
              start_time={start_time}
              end_time={end_time}
            />
          )}
        </div>
        {/* 구분 기호 (화살표) */}
        <span className="time-date-box__separator material-symbols-outlined">
          arrow_forward
        </span>
        {/* 종료 */}
        <div className="time-date-box__group">
          <DatePicker
            type={type}
            order="end"
            openPicker={openPicker}
            setOpenPicker={setOpenPicker}
            start_date={start_date}
            end_date={end_date}
          />
          {time_category === "time" && (
            <TimePicker
              type={type}
              order="end"
              openPicker={openPicker}
              setOpenPicker={setOpenPicker}
              start_time={start_time}
              end_time={end_time}
            />
          )}
        </div>
      </div>

      {/* 모바일 다이얼, 달력 */}
      {openPicker?.device === "mo" && (
        <MobilePanel
          type={type}
          start_date={start_date}
          end_date={end_date}
          start_time={start_time}
          end_time={end_time}
          openPicker={openPicker}
          setOpenPicker={setOpenPicker}
        />
      )}
    </div>
  );
};

export default React.memo(TimeAndDateBox);
