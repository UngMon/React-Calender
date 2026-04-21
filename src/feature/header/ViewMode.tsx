import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// 뷰 모드에 따른 한글 텍스트 매핑 객체 (선택된 뷰를 화면에 표시하기 위함)
const VIEW_LABELS: Record<string, string> = {
  day: "일",
  week: "주",
  month: "월",
  year: "연도",
};

const ViewMode = () => {
  const [open, setOpen] = useState<boolean>(false);

  const { view = "month", date } = useParams<{ view: string; date: string }>();
  const navigate = useNavigate();

  // 항목을 클릭했을 때 URL을 변경하는 함수
  const handleViewChange = (newView: string) => {
    if (!date) return;

    navigate(`/calender/${newView}/${date}`);
    setOpen(false); // 선택 후에는 드롭다운을 닫기
  };

  return (
    <div className="view-mode">
      <button
        type="button"
        className="view-mode__selector"
        onClick={() => setOpen(!open)}
      >
        {VIEW_LABELS[view]} ▾
      </button>
      {open && (
          <ul className="view-mode__list">
            <li onClick={() => handleViewChange("day")}>
              <span>일</span>
              <span>D</span>
            </li>
            <li onClick={() => handleViewChange("week")}>
              <span>주</span>
              <span>W</span>
            </li>
            <li onClick={() => handleViewChange("month")}>
              <span>월</span>
              <span>M</span>
            </li>
            <li onClick={() => handleViewChange("year")}>
              <span>연도</span>
              <span>Y</span>
            </li>
          </ul>
      )}
    </div>
  );
};

export default ViewMode;
