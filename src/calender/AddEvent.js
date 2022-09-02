import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { modalActions } from "../store/modal-slice";
import classes from "./AddEvent.module.css";

const AddEvent = () => {
  const dispatch = useDispatch();

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
    dispatch(modalActions.inputList(inputList));
    inputRef.current.value = "";
  };

  const cancelHandler = () => {
    dispatch(modalActions.toggle());
  };

  return (
    <form className={classes.addMordal} onSubmit={listSubmitHandler}>
      <h2>{modalNameHandler()}</h2>
      <input placeholder="제목 입력" type="text" ref={inputRef} />
      <button type="submit">저장</button>
      <button type="button" onClick={cancelHandler}>
        취소
      </button>
    </form>
  );
};

export default AddEvent;
