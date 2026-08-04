import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useClickOutside } from "@/hooks/useClickOutside";
import { getYMDString } from "@/utils/getTodayString";
import "./ViewMode.css";

// 뷰 모드에 따른 한글 텍스트 매핑 객체 (선택된 뷰를 화면에 표시하기 위함)
const VIEW_LABELS: Record<string, string> = {
  day: "일",
  week: "주",
  month: "월",
  year: "연도",
};

const ViewMode = () => {
  const [open, setOpen] = useState<boolean>(false);
  const viewModeRef = useClickOutside(() => setOpen(false));
  const { view = "month", date } = useParams<{ view: string; date: string }>();
  const navigate = useNavigate();

  // 항목을 클릭했을 때 URL을 변경하는 함수
  const handleViewChange = (viewMode: string, type: string) => {
    if (!date) return;
    navigate(`/calender/${viewMode}/${getYMDString(type)}`);
    setOpen(false); // 선택 후에는 드롭다운을 닫기
  };

  return (
    <div className="view-mode" ref={viewModeRef}>
      <button
        type="button"
        className="view-mode__selector"
        onClick={() => setOpen(!open)}
      >
        <span>{VIEW_LABELS[view]}</span>
        <span>▾</span>
      </button>
      {open && (
        <ul className="view-mode__list">
          <li onClick={() => handleViewChange("day", "D")}>
            <span>일</span>
            <span>D</span>
          </li>
          <li onClick={() => handleViewChange("week", "W")}>
            <span>주</span>
            <span>W</span>
          </li>
          <li onClick={() => handleViewChange("month", "M")}>
            <span>월</span>
            <span>M</span>
          </li>
          <li onClick={() => handleViewChange("year", "Y")}>
            <span>연도</span>
            <span>Y</span>
          </li>
        </ul>
      )}
    </div>
  );
};

export default ViewMode;
