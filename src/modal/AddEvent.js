import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { modalActions } from "../store/modal-slice";
import ModalPosition from "../library/ModalPosition";
import "./AddEvent.css";
import Time from "../library/Time";
import TimeBox from "../library/TimeBox";
import { timeActions } from "../store/time-slice";

const AddEvent = () => {
  const dispatch = useDispatch();
  const modalState = useSelector((state) => state.modal);
  const timeState = useSelector(state => state.time);

  const inputRef = useRef();
  const [firstTimeRef, setFirstTimeRef ] = useState(timeState.firstTime ||Time().currentTime);
  const lastTimeRef = useRef();

  console.log(firstTimeRef)

  const modalNameHandler = () => {
    let splitDateArray = modalState.clickedDate.split(".");
    splitDateArray[1] = +splitDateArray[1] + 1;
    return (
      splitDateArray[0] + "." + splitDateArray[1] + "." + splitDateArray[2]
    );
  };

  // const inputHandler = (event) => {
  //   setFirstTimeRef(event.target.value);
  // }

  const listSubmitHandler = (event) => {
    event.preventDefault();

    let inputList = inputRef.current.value;
    let lastTime = timeState.lastTime;
    let timeData = '';
    if (inputList.trim() === "") {
      inputList = "(제목 없음)";
    }

    if (timeState.firstTime !== '') {
      timeData = timeState.firstTime;
    } else {
      timeData = Time().currentTime;
    };

    dispatch(modalActions.inputList({timeData, lastTime, inputList}));

    inputRef.current.value = "";
    cancelHandler();
    dispatch(timeActions.closeModal());
  };

  const cancelHandler = () => {
    console.log(`작동 캔슬`);
    dispatch(modalActions.toggle());
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
        <label htmlFor="time">시간</label>
        <input
          type="text"
          id="time"
          value={firstTimeRef}
          onClick={firstTimeSelectorHandler}
        />
        <span>-</span>
        <input
          type="text"
          id="time"
          defaultValue={Time().lastTime}
          onClick={lastTimeSelectorHandler}
          ref={lastTimeRef}
        />
      </div>
      {timeState.firstIsVisible && (
        <div className="time-select"><TimeBox setFirstTimeRef={setFirstTimeRef}/></div>
      )}
      {timeState.lastIsVisible && (
        <div className="time-select"><TimeBox setFirstTimeRef={setFirstTimeRef}/></div>
      )}
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
