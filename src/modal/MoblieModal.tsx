import React, { useEffect, useRef } from "react";
import { RootState, useAppDispatch } from "../redux/store";
import { useSelector } from "react-redux";
import { cloneActions } from "../redux/clone-slice";
import { modalActions } from "../redux/modal-slice";
import { useNavigate } from "react-router-dom";
import { CalenderData, DataType } from "../type/ReduxType";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDay } from "@fortawesome/free-solid-svg-icons";
import "./MobileModal.css";

interface T {
  data: DataType;
}

const dayText: { [key: string]: string } = {
  "1": "일",
  "2": "월",
  "3": "화",
  "4": "수",
  "5": "목",
  "6": "금",
  "7": "토",
};

const MobileModal = ({ data }: T) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const clone = useSelector((state: RootState) => state.clone);

  const inputRef = useRef<HTMLInputElement>(null);
  const backRef = useRef<HTMLDivElement>(null);

  const listClickHandler = (item: CalenderData) => {
    navigate(`/calender/event/edit`);
    dispatch(cloneActions.clickedListInMobile({ ...item }));
  };

  useEffect(() => {
    const clickHandler = (e: TouchEvent) => {
      e.preventDefault();
      if (e.target === backRef.current) {
        dispatch(modalActions.toggleMobilModal());
        dispatch(cloneActions.clear());
      }
    };

    window.addEventListener("touchend", clickHandler);
    return () => window.removeEventListener("touchend", clickHandler);
  });

  const addEvent = () => {
    dispatch(cloneActions.addEvent({ title: inputRef.current!.value }));
    navigate(`/calender/event/make`);
  };

  return (
    <div className="mobile-background" ref={backRef}>
      <div className="mobile">
        <header className="mobile-modal-title">
          <span>{+clone.startDate.split("-")[2]}</span>
          <span>{`${dayText[clone.day]}요일`}</span>
        </header>
        <main>
          <ul className="mobile-lists">
            {data.userSchedule[clone.startDate] &&
              Object.values(data.userSchedule[clone.startDate]).map(
                (item, index) => (
                  <li key={index} onTouchEnd={() => listClickHandler(item)}>
                    <div>
                      <FontAwesomeIcon icon={faCalendarDay} />
                    </div>
                    <div className={`color-bar ${item.color}`}></div>
                    <div>
                      <h4>{item.title}</h4>
                      <span>{item.startDate + " ~ " + item.endDate}</span>
                    </div>
                  </li>
                )
              )}
          </ul>
        </main>
        <form className="mobile-make" onSubmit={() => addEvent()}>
          <label htmlFor="title" />
          <input
            id="title"
            type="text"
            placeholder="제목을 입력하세요"
            onTouchEnd={() => inputRef.current!.focus()}
            ref={inputRef}
          />
          <button type="submit" onTouchEnd={() => addEvent()}>
            <span>+</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default MobileModal;
