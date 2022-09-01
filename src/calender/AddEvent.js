import { useRef } from "react";
import { useDispatch } from "react-redux";
import { modalActions } from "../store/modal-slice";
import classes from "./AddEvent.module.css";

const AddEvent = ({ todayDate }) => {
  const dispatch = useDispatch();
  const inputRef = useRef();

  const listSubmitHanlder = (event) => {
    event.preventDefault();
    // const inputList = inputRef.current.value;
  };
  const cancelHandler = () => {
    dispatch(modalActions.toggle())
  };


  return (
    <form className={classes.eventMordal} onSubmit={listSubmitHanlder}>
      <h2>{todayDate}</h2>
      <input placeholder="제목 입력" ref={inputRef} />
      <button type="submit">저장</button>
      <button type='button' onClick={cancelHandler}>취소</button>
    </form>
  );
};

export default AddEvent;
