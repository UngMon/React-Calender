import { CalendarEvent } from "@/type/events";
import { Suspense, useEffect, useRef, useState } from "react";
import { Await, useLoaderData, useNavigate } from "react-router-dom";
import { useGhostEventStore } from "@/store/useGhostEventStore";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";
import { useModalStore } from "@/store/useModalStore";
import Loading from "@/ui/loading/Loading";
import Title from "@/feature/calendar/modal/make-modal/title/Title";
import TimeAndDateBox from "@/feature/calendar/modal/make-modal/picker/TimeAndDateBox";
import Memo from "@/feature/calendar/modal/make-modal/memo/Memo";
import ColorBox from "@/feature/calendar/modal/make-modal/color/ColorBox";
import "./EditEventPage.css";

interface Props {
  initialEvent: CalendarEvent;
}

const EditEvent = ({ initialEvent }: Props) => {
  const navigate = useNavigate();

  // 스토어 상태 및 액션 연결
  const editEvent =
    useGhostEventStore((state) => state.editEvent) || initialEvent;
  const setEditEvent = useGhostEventStore((state) => state.setEditEvent);
  const onClear = useGhostEventStore((state) => state.onClear);
  const setEventColor = useGhostEventStore((state) => state.setEventColor);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // update event api
  const { updateEvent, isUpdating } = useCalendarEvents();

  const titleRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);

  // 마운트 시 로더 데이터를 Zustand에 채워주고, 언마운트 시 메모리 클리어
  useEffect(() => {
    setEditEvent(initialEvent);
    return () => onClear();
  }, [initialEvent, setEditEvent, onClear]);

  const handleCancel = () => {
    navigate("/");
    useGhostEventStore.getState().onClear();
    useModalStore.getState().clearPosition();
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isUpdating) return;

    setIsSubmitted(true);

    const newEvent = {
      ...editEvent,
      title: titleRef.current?.value || "제목 없음",
      text: textRef.current?.value || "",
    };

    updateEvent(newEvent, {
      onSuccess: () => handleCancel(),
      onError: () => setIsSubmitted(false),
    });
  };

  const isLoading = isUpdating || isSubmitted;

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <form className="edit-box" onSubmit={(e) => handleSubmit(e)}>
          <header className="edit-header">
            <h2>일정 수정</h2>
          </header>
          <div className="edit-body">
            <div className="edit-body__wraper">
              <div className="edit-body__wraper-two">
                <Title titleRef={titleRef} defaultValue={editEvent.title} />
                <TimeAndDateBox
                  type="edit"
                  start_date={editEvent.start_date}
                  end_date={editEvent.end_date}
                  start_time={editEvent.start_time}
                  end_time={editEvent.end_time}
                  time_category={editEvent.time_category}
                />
                <Memo textRef={textRef} defaultValue={editEvent.text} />
                <ColorBox
                  type="edit"
                  colorValue={editEvent.color}
                  setEventColor={setEventColor}
                />
              </div>
            </div>
          </div>
          <footer className="edit-footer">
            <button type="button" onClick={handleCancel}>
              취소
            </button>
            <button type="submit">저장</button>
          </footer>
        </form>
      )}
    </>
  );
};

const EditEventPage = () => {
  // 로더에서 캐시 우선 조회로 확보한 일정 데이터를 즉시 수신
  const data = useLoaderData() as {
    event: Promise<CalendarEvent> | CalendarEvent;
  };

  return (
    <div className="edit-layout">
      <section className="edit-container">
        <Suspense fallback={<Loading />}>
          <Await resolve={data.event}>
            {(resolvedEvent: CalendarEvent) => (
              <EditEvent initialEvent={resolvedEvent} />
            )}
          </Await>
        </Suspense>
      </section>
    </div>
  );
};

export default EditEventPage;
