import { useRef } from "react";
import classes from "./AddEvent.module.css";

const AddEvent = (props) => {
  const inputRef = useRef();

  const listSubmitHanlder = (event) => {
    event.preventDefault();
    // const inputList = inputRef.current.value;
  };

  return (
    <form className={classes.eventMordal} onSubmit={listSubmitHanlder}>
      <h2>{props.todayYear}년 {props.todayMonth}월 {props.todayDate}일</h2>
      <input placeholder="제목 입력" ref={inputRef}/>
      <button>저장</button>
    </form>
  );
};

export default AddEvent;
