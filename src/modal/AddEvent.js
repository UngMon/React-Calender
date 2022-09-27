import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { modalActions } from "../store/modal-slice";
import { timeActions } from "../store/time-slice";
import ModalPosition from "../library/ModalPosition";
import "./AddEvent.css";
import SetTime from "../library/Time/SetTime";
import TimeSelector from "../library/Time/TimeSelector";

const AddEvent = () => {
  const dispatch = useDispatch();
  const modalState = useSelector((state) => state.modal);
  const timeState = useSelector((state) => state.time);

  const inputRef = useRef();
  const currentTime = SetTime().currentTime;
  const LastTime = SetTime().lastTime;

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
    let lastTime = timeState.lastTime || LastTime;
    let timeData ;

    if (inputList.trim() === "") {
      inputList = "(제목 없음)";
    }

    if (timeState.firstTime !== "") {
      timeData = timeState.firstTime;
    } else {
      timeData = currentTime;
    }

    dispatch(modalActions.inputList({ timeData, lastTime, inputList }));

    inputRef.current.value = "";
    cancelHandler();
    dispatch(timeActions.resetTime());
  };

  const cancelHandler = () => {
    console.log(`작동 캔슬`);
    dispatch(modalActions.toggle());
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
      <TimeSelector />
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
