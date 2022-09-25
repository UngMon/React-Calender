import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { modalActions } from "../store/modal-slice";
import { timeActions } from "../store/time-slice";
import ModalPosition from "../library/ModalPosition";
import "./AddEvent.css";
import Time from "../library/Time";
import TimeBox from "../library/TimeBox";
import TimeBoxTwo from "../library/TimeBoxTwo";

const AddEvent = () => {
  const dispatch = useDispatch();
  const modalState = useSelector((state) => state.modal);
  const timeState = useSelector((state) => state.time);

  const inputRef = useRef();

  const modalNameHandler = () => {
    let splitDateArray = modalState.clickedDate.split(".");
    console.log(modalState.clickedDate);
    splitDateArray[1] = +splitDateArray[1] + 1;
    return (
      splitDateArray[0] + "." + splitDateArray[1] + "." + splitDateArray[2]
    );
  };

  const listSubmitHandler = (event) => {
    event.preventDefault();

    let inputList = inputRef.current.value;
    let lastTime = timeState.lastTime;
    let timeData = "";
    if (inputList.trim() === "") {
      inputList = "(제목 없음)";
    }

    if (timeState.firstTime !== "") {
      timeData = timeState.firstTime;
    } else {
      timeData = Time().currentTime;
    }

    dispatch(modalActions.inputList({ timeData, lastTime, inputList }));

    inputRef.current.value = "";
    cancelHandler();
    dispatch(timeActions.closeModal());
  };

  const cancelHandler = () => {
    console.log(`작동 캔슬`);
    dispatch(modalActions.toggle());
    dispatch(timeState.closeModal());
  };

  const firstTimeSelectorHandler = () => {
    dispatch(timeActions.firstTimetoggle());
  };

  const lastTimeSelectorHandler = () => {
    dispatch(timeActions.lastTimetoggle());
  };

  return (
    <form
      className={`addMordal ${ModalPosition(
        modalState.dayIndex,
        modalState.week
      )}`}
      onSubmit={listSubmitHandler}
    >
      <div className="inputArea">
        <h2 className="modalMonth">{modalNameHandler()}</h2>
        <input placeholder="(제목 없음)" type="text" ref={inputRef} />
      </div>
      <div className="time-area">
        <div className="time-area-label">
          <h4>시간</h4>
        </div>
        <div className="time-one">
          <input
            type="text"
            placeholder={timeState.firstTime || Time().currentTime}
            onClick={firstTimeSelectorHandler}
          />
          {timeState.firstIsVisible && (
            <div className="time-select">
              <TimeBox />
            </div>
          )}
        </div>
        <div className="time-area-span">
          <span>~</span>
        </div>
        <div className="time-two">
          <input
            type="text"
            placeholder={timeState.lastTime || Time().lastTime}
            onClick={lastTimeSelectorHandler}
          />
          {timeState.lastIsVisible && (
            <div className="time-select">
              <TimeBoxTwo />
            </div>
          )}
        </div>
      </div>
      <div className="buttonBox">
        <button type="submit">저장</button>
        <button type="button" onClick={cancelHandler}>
          취소
        </button>
      </div>
    </form>
  );
};

export default AddEvent;
