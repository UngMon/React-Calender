import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./CalendarSwitcher.css";

type CalendarViewMode = "year" | "month" | "week" | "day";

const CalendarSwitchar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { year, month } = useParams<{
    year: string;
    month?: string;
  }>();

  const viewMode = location.pathname.split("/")[2] as CalendarViewMode;

  // 날짜 포맷팅 유틸 함수
  const formatDate = (dateObj: Date): string => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    return `${year}/${month}`;
  };

  const handleMoveMonth = (type: string) => {
    if (!year || !month || !viewMode) return;

    let newDate = new Date(`${year}/${month}`);

    if (type === "prev") {
      // 이전 날짜로 URL 변경
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      // 다음 날짜로 URL 변경
      newDate.setMonth(newDate.getMonth() + 1);
    }

    navigate(`/calendar/${viewMode}/${formatDate(newDate)}`);
  };

  return (
    <div className="calendar-switcher">
      <button type="button" onClick={() => handleMoveMonth("prev")}>
        <span className="material-symbols-outlined">keyboard_arrow_left</span>
      </button>
      <h2>{`${year}년 ${month}월`}</h2>
      <button type="button" onClick={() => handleMoveMonth("next")}>
        <span className="material-symbols-outlined">keyboard_arrow_right</span>
      </button>
    </div>
  );
};

export default CalendarSwitchar;
