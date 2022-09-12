import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { modalActions } from "../store/modal-slice";
import classes from "./AddEvent.module.css";

const AddEvent = () => {
  const dispatch = useDispatch();

  const modalState = useSelector((state) => state.modal);
  const inputRef = useRef();

  const modalNameHandler = () => {
    let splitDateArray = modalState.clickedDate.split(".");
    splitDateArray[1] = +splitDateArray[1] + 1;
    return (
      splitDateArray[0] + "." + splitDateArray[1] + "." + splitDateArray[2]
    );
  };

  const listSubmitHandler = (event) => {
    event.preventDefault();

    const inputList = inputRef.current.value;

    dispatch(modalActions.inputList(inputList));

    inputRef.current.value = "";
    console.log(modalState.changed);
    cancelHandler();
  };

  const cancelHandler = () => {
    dispatch(modalActions.toggle());
  };

  return (
    <form className={classes.addMordal} onSubmit={listSubmitHandler}>
      <div className={classes.inputArea}>
        <h2 className={classes.modalMonth}>{modalNameHandler()}</h2>
        <input
          placeholder="계획을 입력해주세요!"
          type="text"
          ref={inputRef}
        />
      </div>
      <div className={classes.buttonBox}>
        <button type="submit">저장</button>
        <button type="button" onClick={cancelHandler}>
          취소
        </button>
      </div>
    </form>
  );
};

export default AddEvent;
