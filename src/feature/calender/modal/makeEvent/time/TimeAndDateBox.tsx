import { ActivePicker } from "./types/type";
import { useEffect, useState } from "react";
import TimeDateHeader from "./component/TimeDateHeader";
import TimeDateGroup from "./component/time-date-group/TimeDateGroup";
import MobilePanel from "./component/mobile-panel/MobilePanel";
import "./TimeAndDateBox.css";

const TimeAndDateBox = ({}) => {
  const [activeDatePicker, setActiveDatePicker] = useState<ActivePicker>(null);
  const [activeTimePicker, setActiveTimePicker] = useState<ActivePicker>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isAllDay, setIsAllDay] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 750px)");

    const handleMediaChange = () => {
      if (activeDatePicker) setActiveDatePicker(null);
      if (activeTimePicker) setActiveTimePicker(null);
    };

    mediaQuery.addEventListener("change", handleMediaChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
    };
  }, []);

  return (
    <div className="time-date-box" onClick={(e) => e.stopPropagation()}>
      {/* 1. 상단: 하루 종일 토글 영역 */}
      <TimeDateHeader
        isAllDay={isAllDay}
        onToggleAllDay={() => setIsAllDay((prevState) => !prevState)}
      />

      {/* 2. 하단: 기간 설정 영역 (시작 ~ 종료) */}
      <div className="time-date-box__range">
        {/* 시작 */}
        <TimeDateGroup
          order="start"
          isAllDay={isAllDay}
          setIsExpanded={setIsExpanded}
        />
        {/* 구분 기호 (화살표) */}
        <span className="time-date-box__separator material-symbols-outlined">
          arrow_forward
        </span>
        {/* 종료 */}
        <TimeDateGroup
          order="end"
          isAllDay={isAllDay}
          setIsExpanded={setIsExpanded}
        />
      </div>

      {/* 모바일 다이얼, 달력 */}
      <MobilePanel isExpanded={isExpanded} />
    </div>
  );
};

export default TimeAndDateBox;
