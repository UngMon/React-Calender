import { useEffect, useRef, useState } from "react";
import { useModalStore } from "../../../../store/useModalStore";
import TimeAndDateBox from "./time/TimeAndDateBox";
import Memo from "./memo/Memo";
import ColorBox from "./color/ColorBox";
import "./MakeEvent.css";
import { makePosition } from "./utils/makePosition";

interface T {
  week: number; // 주
  day: number; // 요일
  width: number; // td 너비
  height: number; // td 높이
}

const MakeEvent = () => {
  const { week, day, width, height, clearPosition } = useModalStore();

  const boxRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState<boolean>(
    window.matchMedia("(min-width: 1200px)").matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1200px)");

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches);
    };

    mediaQuery.addEventListener("change", handleMediaChange);

    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  });

  useEffect(() => {
    const handlerKeyboard = (e: KeyboardEvent) => {
      if (e.key === "escape") {
        clearPosition();
      }
    };

    const handlerClick = (e: MouseEvent) => {
      const node = e.target as Node;
      const ref = boxRef.current;

      if (ref && ref.contains(node)) {
        clearPosition();
      }
    };

    window.addEventListener("click", handlerClick);
    window.addEventListener("keydown", handlerKeyboard);

    return () => {
      window.removeEventListener("click", handlerClick);
      window.removeEventListener("keydown", handlerKeyboard);
    };
  });

  const handlerSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
    } catch (error) {
      alert("데이터 전송 실패...");
    }
  };

  // 여기는 스크린 크기에 따라 modal의 위치를 지정한다.
  const 좌표: number[] = makePosition(week, day, width, height);

  const dynamicStyle = isDesktop
    ? {
        top: week < 3 ? `${좌표[1]}px` : "auto",
        bottom: week >= 3 ? `${좌표[1]}px` : "auto",
        left: day < 4 ? `${좌표[0]}px` : "auto",
        right: day >= 4 ? `${좌표[0]}px` : "auto",
      }
    : {};

  return (
    <div
      className="make-event"
      ref={boxRef}
      onClick={(e) => e.stopPropagation()}
      style={dynamicStyle}
    >
      <div className="make-event__top">일정 생성</div>
      <form
        className="make-event__form"
        onSubmit={(e) => {
          e.preventDefault();
          console.log("Form?");
        }}
      >
        <div className="make__form-wrapper">
          <div className="make-form-wrapper-two">
            <div className="make__form-box">
              <div className="make__form-input">
                <label htmlFor="text" />
                <input id="text" type="text" placeholder="제목 없음" />
              </div>
              <TimeAndDateBox />
              <Memo />
              <ColorBox />
            </div>
          </div>
        </div>
        <div className="make-event__button">
          <button type="button" onClick={() => clearPosition()}>
            취소
          </button>
          <button type="submit">저장</button>
        </div>
      </form>
    </div>
  );
};

export default MakeEvent;
