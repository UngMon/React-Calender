import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { modalActions } from "../store/modal-slice";
import { timeActions } from "../store/time-slice";
import ModalPosition from "../library/ModalPosition";
import "./AddEvent.css";
import SetTime from "../library/Time/SetTime";
import TimeSelector from "../library/Time/TimeSelector";
import { allListActions } from "../store/all-list-slice";
import { listActions } from "../store/list-slice";

const AddEvent = () => {
  const dispatch = useDispatch();
  const modalState = useSelector((state) => state.modal);
  const timeState = useSelector((state) => state.time);

  const modalRef = useRef();

  const addModalCloseHandler = (e) => {
    if (modalState.isVisible && !modalRef.current.contains(e.target)) {
      
      setTimeout(() => {
        dispatch(modalActions.offModal());
        dispatch(allListActions.offModal());
        dispatch(listActions.offModal());
        dispatch(timeActions.resetTime());
      }, 150);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", addModalCloseHandler);
    return () => {
      document.removeEventListener("mousedown", addModalCloseHandler);
    };
  });

  const inputRef = useRef();
  const currentTime = SetTime().currentTime;
  const LastTime = SetTime().lastTime;

  const modalNameHandler = () => {
    let splitDateArray = modalState.clickedDate.split(".");

    splitDateArray[1] = +splitDateArray[1] + 1;
    return (
      splitDateArray[0] + "." + splitDateArray[1] + "." + splitDateArray[2]
    );
  };

  const listSubmitHandler = (event) => {
    event.preventDefault();

    let inputList = inputRef.current.value;

    let timeData = timeState.firstTime || currentTime;
    let lastTime = timeState.lastTime || LastTime;

    if (inputList.trim() === "") {
      inputList = "(제목 없음)";
    }

    dispatch(modalActions.inputList({ inputList, timeData, lastTime }));

    inputRef.current.value = "";
    cancelHandler();
    dispatch(timeActions.resetTime());
  };

  const cancelHandler = () => {
    console.log(`작동 캔슬`);
    dispatch(modalActions.offModal());
  };

  return (
    <form
      className={`addMordal ${ModalPosition(
        modalState.dayIndex,
        modalState.week
      )}`}
      onSubmit={listSubmitHandler}
      ref={modalRef}
      style={{display: !modalState.isVisible && "none"}}
    >
      <div className="inputArea">
        <h2 className="modalMonth">{modalNameHandler()}</h2>
        <input placeholder="(제목 없음)" type="text" ref={inputRef}/>
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
