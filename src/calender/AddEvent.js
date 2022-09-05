import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { modalActions } from "../store/modal-slice";
import classes from "./AddEvent.module.css";


const AddEvent = () => {
  const dispatch = useDispatch();
  const [isEmpty, setIsEmpty] = useState(false);

  const clickedDate = useSelector((state) => state.modal.clickedDate);

  const inputRef = useRef();

  const modalNameHandler = () => {
    let splitDateArray = clickedDate.split(".");
    splitDateArray[1] = +splitDateArray[1] + 1;
    return (
      splitDateArray[0] + "." + splitDateArray[1] + "." + splitDateArray[2]
    );
  };

  const listSubmitHandler = (event) => {
    event.preventDefault();
    const inputList = inputRef.current.value;
    if (inputList.trim() === '') {
      setIsEmpty(true);
      return;
    } else {
      setIsEmpty(false);
      console.log(isEmpty)
    }
    dispatch(modalActions.inputList(inputList));
    inputRef.current.value = "";
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
          placeholder={
            isEmpty ? "계획을 입력해주세요!" : "계획을 추가해보세요!"
          }
          type="text"
          ref={inputRef}
          className={`${isEmpty && classes["input-empty"]}`}
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
