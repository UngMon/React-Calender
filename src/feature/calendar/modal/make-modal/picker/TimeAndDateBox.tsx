import React, { useEffect } from "react";
import { useGhostEventStore } from "@/store/useGhostEventStore";
import { useMediaQuery } from "@/hooks/useMediaQuery";
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
  const clearOpenPicker = useGhostEventStore((state) => state.clearOpenPicker);

  const isDesktop = useMediaQuery("(min-width: 750px)");
  console.log("TimeAndDateBox");
  console.log(openPicker);

  useEffect(() => {
    // 효과가 실행되는 시점의 최신 상태 확인
    const { openPicker } = useGhostEventStore.getState();

    // 모바일에서 열었던 피커만 초기화
    if (openPicker.device !== "") {
      clearOpenPicker();
    }
  }, [isDesktop]);

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
      {!isDesktop && (
        <MobilePanel
          type={type}
          start_date={start_date}
          end_date={end_date}
          start_time={start_time}
          end_time={end_time}
          openPicker={openPicker}
        />
      )}
    </div>
  );
};

export default React.memo(TimeAndDateBox);
