import { useState } from "react";
import AllDay from "./AllDay";
import MobilePanel from "./mobile/MobilePanel";
import DatePicker from "./date/DatePicker";
import TimePicker from "./time/TimePicker";
import "./TimeAndDateBox.css";

interface Props {}

const TimeAndDateBox = ({}: Props) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isAllDay, setIsAllDay] = useState(false);

  return (
    <div className="time-date-box" onClick={(e) => e.stopPropagation()}>
      {/* 1. 상단: 하루 종일 토글 영역 */}
      <AllDay
        isAllDay={isAllDay}
        onToggleAllDay={() => setIsAllDay((prevState) => !prevState)}
      />

      {/* 2. 하단: 기간 설정 영역 (시작 ~ 종료) */}
      <div className="time-date-box__range">
        {/* 시작 */}
        <div className="time-date-box__group">
          <DatePicker order={"start"} setIsExpanded={setIsExpanded} />
          {!isAllDay && (
            <TimePicker order={"start"} setIsExpanded={setIsExpanded} />
          )}
        </div>
        {/* 구분 기호 (화살표) */}
        <span className="time-date-box__separator material-symbols-outlined">
          arrow_forward
        </span>
        {/* 종료 */}
        <div className="time-date-box__group">
          <DatePicker order={"end"} setIsExpanded={setIsExpanded} />
          {!isAllDay && (
            <TimePicker order={"end"} setIsExpanded={setIsExpanded} />
          )}
        </div>
      </div>

      {/* 모바일 다이얼, 달력 */}
      <MobilePanel isExpanded={isExpanded} />
    </div>
  );
};

export default TimeAndDateBox;


  // useEffect(() => {
  //   // 750픽셀 이하 picker값 변경하기
  //   const mediaQuery = window.matchMedia("(min-width: 750px)");

  //   const handleMediaChange = () => {
  //     // if (activeDatePicker) setActiveDatePicker(null);
  //     // if (activeTimePicker) setActiveTimePicker(null);
  //   };

  //   mediaQuery.addEventListener("change", handleMediaChange);

  //   return () => {
  //     mediaQuery.removeEventListener("change", handleMediaChange);
  //   };
  // }, []);
  // const [activeDatePicker, setActiveDatePicker] = useState<ActivePicker>(null);
  // const [activeTimePicker, setActiveTimePicker] = useState<ActivePicker>(null);