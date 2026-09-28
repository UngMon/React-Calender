import { useNavigate } from "react-router-dom";
import { useGhostEventStore } from "@/store/useGhostEventStore";
import { EventsWithPosition } from "../../month/renderdWeeks";
import { getDetailPositionStyle } from "../make-modal/utils/getDetailPositionStyle";
import { useClickOutside } from "@/hooks/useClickOutside";
import { convertDate } from "./convertDate";
import { formatDisplayTime } from "@/utils/formatTime";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";
import "./EventDetailModal.css";

interface Props {
  options: {
    week: number;
    day: number;
    rect: DOMRect | null;
    event: EventsWithPosition | null;
    onClose: () => void;
  };
}

const EventDetailModal = ({ options }: Props) => {
  const { week, day, onClose, event, rect } = options;

  if (!event) return null;

  const navigate = useNavigate();
  const ref = useClickOutside(onClose);
  const dynamicStyle = getDetailPositionStyle(week, day, rect);

  const { deleteEvent, isDeleting } = useCalendarEvents();

  const handleReviseEvent = () => {
    navigate(`/eventedit/${event.id}`);
    const setEditEvent = useGhostEventStore.getState().setEditEvent;
    const { slot, span, startIdx, endIdx, ...rest } = event;

    setEditEvent(rest);
    onClose();
  };

  const handleDeleteEvent = () => {
    // 일정 삭제 함수
    if (isDeleting) return;
    onClose();
    deleteEvent(event.id);
  };

  return (
    <div className="event-modal-overlay">
      <div
        ref={ref}
        className="event-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-modal-title"
        onMouseDown={(e) => e.stopPropagation()}
        style={dynamicStyle}
      >
        <header className="event-modal__header">
          <div className="event-modal__actions">
            <button
              type="button"
              className="event-modal__icon-button event-modal__icon-button--primary"
              data-tooltip="일정 수정"
              aria-label="일정 수정"
              onClick={() => handleReviseEvent()}
            >
              <span className="material-symbols-outlined">edit</span>
            </button>

            <button
              type="button"
              className="event-modal__icon-button"
              data-tooltip="일정 삭제"
              aria-label="일정 삭제"
              onClick={() => handleDeleteEvent()}
            >
              <span className="material-symbols-outlined">delete</span>
            </button>

            <button
              type="button"
              className="event-modal__icon-button"
              data-tooltip="닫기"
              aria-label="닫기"
              onClick={onClose}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </header>

        <div className="event-modal__body">
          <div className="event-modal__title-row">
            <span className="event-modal__color-dot" />
            <h2 id="event-modal-title" className="event-modal__title">
              {event.title || "(제목 없음)"}
            </h2>
          </div>

          <div className="event-modal__detail-list">
            <div className="event-modal__detail">
              <span className="material-symbols-outlined">calendar_check</span>
              <span>{convertDate(event.start_date, event.end_date)}</span>
            </div>
          </div>

          <div className="event-modal__detail-list">
            <div className="event-modal__detail">
              <span className="material-symbols-outlined">alarm</span>
              <span>
                {event.time_category === "allday"
                  ? "하루종일"
                  : `${formatDisplayTime(event.start_time)} ~ ${formatDisplayTime(event.end_time)}`}
              </span>
            </div>
          </div>

          {event.text && (
            <div className="event-modal__detail-list">
              <div className="event-modal__detail">
                <span className="material-symbols-outlined">text_ad</span>
                <span>{event.text}</span>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default EventDetailModal;
