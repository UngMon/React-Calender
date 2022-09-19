import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { modalActions } from "../store/modal-slice";
import ModalPosition from "./ModalPosition";
import "./AddEvent.css";

const AddEvent = () => {
  const dispatch = useDispatch();
  console.log(new Date().getDate());

  const modalState = useSelector((state) => state.modal);
  const inputRef = useRef();

  const currnetTime = new Date().toLocaleTimeString();
  console.log(currnetTime);

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
    if (inputList.trim() === "") {
      inputList = "(제목 없음)";
    }
    dispatch(modalActions.inputList(inputList));

    inputRef.current.value = "";
    console.log(modalState.changed);
    cancelHandler();
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
        <input placeholder="(제목 없음)" type="text" ref={inputRef} autoFocus />
      </div>
      <div className="time-area">
        <label htmlFor="time">시간</label>
        <input type="text" id="time" defaultValue={currnetTime} />
        <span>-</span>
        <input type='text' id='time' defaultValue={currnetTime}/>
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
