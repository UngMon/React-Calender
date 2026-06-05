import { useNavigate, useParams } from "react-router-dom";
import "./CalendarSwitcher.css";

const CalendarSwitcher = () => {
  const { view, date } = useParams<{ view: string; date: string }>();

  const navigate = useNavigate();

  // 날짜 포맷팅 유틸 함수
  const formatDate = (dateObj: Date): string => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  };

  // 이전 날짜로 URL 변경
  const handlePrevMonth = () => {
    if (!date || !view) return;

    const prevDate = new Date(date);
    prevDate.setMonth(prevDate.getMonth() - 1);

    // 상태를 변경하는 대신, 새로운 날짜를 계산해 URL을 아예 이동시킵니다.
    navigate(`/calender/${view}/${formatDate(prevDate)}`);
  };

  // 다음 날짜로 URL 변경
  const handleNextMonth = () => {
    if (!date || !view) return;
    const nextDate = new Date(date);
    nextDate.setMonth(nextDate.getMonth() + 1);

    navigate(`/calender/${view}/${formatDate(nextDate)}`);
  };

  const formatDateForHader = (date?: string): string => {
    if (!date) return "";
    const dateArray = date.split("-");
    return `${dateArray[0]}년 ${dateArray[1]}월`;
  };

  return (
    <div className="calender-switcher">
      <button type="button" onClick={handlePrevMonth}>
        <span className="material-symbols-outlined">keyboard_arrow_left</span>
      </button>
      <h2>{formatDateForHader(date)}</h2>
      <button type="button" onClick={handleNextMonth}>
        <span className="material-symbols-outlined">keyboard_arrow_right</span>
      </button>
    </div>
  );
};

export default CalendarSwitcher;
