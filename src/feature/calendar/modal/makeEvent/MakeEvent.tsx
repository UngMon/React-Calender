import { useCallback, useRef } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useGhostEventStore } from "@/store/useGhostEventStore";
import { useModalStore } from "@/store/useModalStore";
import { getModalPositionStyle } from "./utils/getModalPositionStyle";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";
import TimeAndDateBox from "./picker/TimeAndDateBox";
import Memo from "./memo/Memo";
import ColorBox from "./color/ColorBox";
import "./MakeEvent.css";

interface Props {
  week: number;
  day: number;
  clearPosition: () => void;
}

const MakeEvent = ({ week, day, clearPosition }: Props) => {
  console.log("MakeEvent Render");
  const titleRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);

  const { createEvent, isCreating } = useCalendarEvents();
  const cancelGhostEvent = useGhostEventStore(
    (state) => state.cancelGhostEvent,
  );

  const handleCancelButton = useCallback(() => {
    clearPosition();
    cancelGhostEvent();
  }, []);

  const ref = useClickOutside(handleCancelButton);

  // 여기는 스크린 크기에 따라 modal의 위치를 지정한다.
  const dynamicStyle = getModalPositionStyle(week, day);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Zustand에서 드래그 or 피커로 설정된 최신 고스트 이벤트 데이터 조회
    const ghostEvent = useGhostEventStore.getState().ghostEvent;

    if (!ghostEvent) {
      alert("일정 날짜 정보가 없습니다.");
      return;
    }

    createEvent(
      {
        title: titleRef.current?.value.trim() || "제목 없음",
        text: textRef.current?.value.trim() || "",
        start_date: ghostEvent.start_date,
        end_date: ghostEvent.end_date,
        start_time: ghostEvent.start_time,
        end_time: ghostEvent.end_time,
        time_category: ghostEvent.time_category,
        color: ghostEvent.color,
        created_at: new Date().toISOString(),
      },
      {
        onSuccess: () => {
          handleCancelButton();
        },
      },
    );
  };

  return (
    <div className="modal-backdrop">
      <div
        className="make-event"
        ref={ref}
        onClick={(e) => e.stopPropagation()}
        style={dynamicStyle}
      >
        <div className="make-event__top">일정 생성</div>
        <form className="make-event__form" onSubmit={(e) => handleSubmit(e)}>
          <div className="make__form-wrapper">
            <div className="make-form-wrapper-two">
              <div className="make__form-box">
                <div className="make__form-input">
                  <label htmlFor="text" />
                  <input
                    id="text"
                    type="text"
                    placeholder="제목 없음"
                    ref={titleRef}
                  />
                </div>
                <TimeAndDateBox />
                <Memo textRef={textRef} />
                <ColorBox />
              </div>
            </div>
          </div>
          <div className="make-event__button">
            <button type="button" onClick={handleCancelButton}>
              취소
            </button>
            <button type="submit">저장</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const MakeEventLayout = () => {
  const { open, week, day, clearPosition } = useModalStore();

  return (
    <div>
      {open && (
        <MakeEvent week={week} day={day} clearPosition={clearPosition} />
      )}
    </div>
  );
};

export default MakeEventLayout;

// const [isDesktop, setIsDesktop] = useState<boolean>(
//   window.matchMedia("(min-width: 1200px)").matches,
// );

// useEffect(() => {
//   const mediaQuery = window.matchMedia("(min-width: 1200px)");

//   const handleMediaChange = (e: MediaQueryListEvent) => {
//     setIsDesktop(e.matches);
//   };

//   mediaQuery.addEventListener("change", handleMediaChange);

//   return () => mediaQuery.removeEventListener("change", handleMediaChange);
// }, []);
