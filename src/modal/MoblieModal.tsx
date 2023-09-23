import React, { useEffect, useRef } from "react";
import { useAppDispatch } from "../redux/store";
import { modalActions } from "../redux/modal-slice";
import { useNavigate } from "react-router-dom";
import { CalenderData, DataType, ModalType } from "../type/ReduxType";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDay } from "@fortawesome/free-solid-svg-icons";
import "./MobileModal.css";

interface T {
  data: DataType;
  modal: ModalType;
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

const MobileModal = ({ data, modal }: T) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const inputRef = useRef<HTMLInputElement>(null);
  const backRef = useRef<HTMLDivElement>(null);

  const listClickHandler = (item: CalenderData) => {
    navigate(`/calender/makeEvent`);
    dispatch(modalActions.clickedListInMobile({ ...item }));
  };

  useEffect(() => {
    const clickHandler = (e: TouchEvent) => {
      console.log("????");
      e.preventDefault();
      if (e.target === backRef.current) {
        dispatch(modalActions.toggleMobilModal());
      }
    };

    window.addEventListener("touchend", clickHandler);

    return () => window.removeEventListener("touchend", clickHandler);
  });

  return (
    <div className="mobile-background" ref={backRef}>
      <div className="mobile">
        <header className="mobile-modal-title">
          <span>{+modal.startDate.split("-")[2]}</span>
          <span>{`${dayText[modal.day]}요일`}</span>
        </header>
        <main>
          <ul className="mobile-lists">
            {Object.values(data.userSchedule[modal.startDate]).map(
              (item, index) => (
                <li key={index} onTouchEnd={() => listClickHandler(item)}>
                  <div>
                    <FontAwesomeIcon icon={faCalendarDay} />
                  </div>
                  <div className={`color-bar ${item.color}`}></div>
                  <div>
                    <h4>{item.title}</h4>
                    <span>{item.startDate + item.endDate}</span>
                  </div>
                </li>
              )
            )}
          </ul>
        </main>
        <footer className="mobile-make">
          <label htmlFor="text" />
          <input id="text" placeholder="제목을 입력하세요" ref={inputRef} />
          <button>
            <span>+</span>
          </button>
        </footer>
      </div>
    </div>
  );
};

export default MobileModal;
