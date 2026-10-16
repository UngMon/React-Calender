import { useCallback, useRef } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useGhostEventStore } from "@/store/useGhostEventStore";
import { useModalEventLayout } from "../hook/useModalEventLayout";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";
import Title from "./title/Title";
import TimeAndDateBox from "./picker/TimeAndDateBox";
import Memo from "./memo/Memo";
import ColorBox from "./color/ColorBox";
import "./MakeEvent.css";

interface Props {
  options: {
    week: number;
    day: number;
    rect: DOMRect | null;
    clearPosition: () => void;
  };
}

const MakeEvent = ({ options }: Props) => {
  const { week, day, rect, clearPosition } = options;

  console.log("MakeEvent Render");
  const titleRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);

  const { createEvent, isCreating } = useCalendarEvents();
  const ghostEvent = useGhostEventStore((state) => state.ghostEvent);
  const setEventColor = useGhostEventStore((state) => state.setEventColor);
  const onClear = useGhostEventStore((state) => state.onClear);
  const clearOpenPicker = useGhostEventStore((state) => state.clearOpenPicker);

  const handleCancelButton = useCallback(() => {
    clearPosition();
    onClear();
  }, []);

  const modalRef = useClickOutside(handleCancelButton);

  const { modalStyle, isPositioned, dragHandlers } = useModalEventLayout({
    category: "make",
    modalRef,
    week,
    day,
    rect,
    onDragStart: clearOpenPicker,
  });

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    // api 보내는 중 일때는 정지, 중복 제출 x
    if (isCreating) return;

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
        className={`make-event${isPositioned ? " is-moved" : ""}`}
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        style={modalStyle}
      >
        <header className="make-event__header" {...dragHandlers}>
          일정 생성
        </header>
        <form className="make-event__form" onSubmit={(e) => handleSubmit(e)}>
          <div className="make__form-wrapper">
            <div className="make-form-wrapper-two">
              <div className="make__form-box">
                <Title titleRef={titleRef} defaultValue="" />
                <TimeAndDateBox
                  type="make"
                  start_date={ghostEvent!.start_date}
                  end_date={ghostEvent!.end_date}
                  start_time={ghostEvent!.start_time}
                  end_time={ghostEvent!.end_time}
                  time_category={ghostEvent!.time_category}
                />
                <Memo textRef={textRef} defaultValue="" />
                <ColorBox
                  type="make"
                  colorValue={ghostEvent?.color || "라벤더"}
                  setEventColor={setEventColor}
                />
              </div>
            </div>
          </div>
          <footer className="make-event__button">
            <button type="button" onClick={handleCancelButton}>
              취소
            </button>
            <button type="submit">저장</button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default MakeEvent;
