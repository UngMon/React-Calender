import classes from "./AddEvent.module.css";

const AddEvent = () => {
  const listSubmitHanlder = (event) => {
    event.preventDefault();
  };
  return (
    <form className={classes.eventMordal} onSubmit={listSubmitHanlder}>
      <input placeholder="제목 입력" />
      <button>저장</button>
    </form>
  );
};

export default AddEvent;
