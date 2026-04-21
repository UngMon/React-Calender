import { useNavigate, useParams } from "react-router-dom";

const CalendarSwitcher = () => {
  const { view, date } = useParams<{ view: string; date: string }>();

  const navigate = useNavigate();

  // 이전 날짜로 URL 변경
  const handlePrevDay = () => {
    if (!date || !view) return;

    const prevDate = new Date(date);
    prevDate.setDate(prevDate.getDate() - 1);

    // 상태를 변경하는 대신, 새로운 날짜를 계산해 URL을 아예 이동시킵니다.
    navigate(`/calender/${view}/${formatDate(prevDate)}`);
  };

  // 다음 날짜로 URL 변경
  const handleNextDay = () => {
    if (!date || !view) return;

    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);

    navigate(`/calender/${view}/${formatDate(nextDate)}`);
  };

  // 날짜 포맷팅 유틸 함수
  const formatDate = (dateObj: Date): string => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="calender-switcher">
      <button type="button" onClick={handlePrevDay}>
        좌
      </button>
      <h2>{date}</h2>
      <button type="button" onClick={handleNextDay}>
        우
      </button>
    </div>
  );
};

export default CalendarSwitcher;
