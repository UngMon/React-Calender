import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listActions } from "../store/list-slice";
import { modalActions } from "../store/modal-slice";
import { timeActions } from "../store/time-slice";
import ModalPosition from "../library/ModalPosition";
import SetTime from "../library/Time/SetTime";
import "./List.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faTrash,
  faCheck,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import TimeSelector from "../library/Time/TimeSelector";

const List = () => {
  const dispatch = useDispatch();

  const listState = useSelector((state) => state.list);
  const timeState = useSelector((state) => state.time);
  const schedule = useSelector((state) => state.modal.schedule);

  const [listIsVisible, setListIsVisible] = useState(false);
  const inputRef = useRef();

  const removeListHandler = (listIndex, index) => {
    dispatch(modalActions.removeList({ listIndex, index }));
    dispatch(listActions.toggle());
  };

  const listEditHandler = () => {
    setListIsVisible((prevState) => !prevState);
  };

  const editListSubmitHandler = (event) => {
    event.preventDefault();

    let inputList = inputRef.current.value;
    let lastTime = timeState.lastTime;
    let index = listState.index;
    let listIndex = listState.listIndex;
    let timeData;
    if (inputList.trim() === "") {
      inputList = "(제목 없음)";
    }

    if (timeState.firstTime !== "") {
      timeData = timeState.firstTime;
    } else {
      timeData = SetTime().currentTime;
    }

    dispatch(
      modalActions.editList({
        timeData,
        lastTime,
        inputList,
        index,
        listIndex,
      })
    );

    inputRef.current.value = "";
    closeModalHandler();
    dispatch(timeActions.resetTime());
  };

  const listDoneHandler = (index, listIndex) => {
    dispatch(modalActions.listDone({ index, listIndex }));
  };

  const closeModalHandler = () => {
    dispatch(listActions.toggle());
  };

  const styleClass =
    schedule[listState.index].todo[listState.listIndex].style &&
    !listIsVisible &&
    "done";

  return (
    <div
      className={`list-box ${ModalPosition(
        listState.dayIndex,
        listState.week
      )}`}
    >
      <div className="option-box">
        <div onClick={listEditHandler}>
          <FontAwesomeIcon icon={faEdit} />
        </div>
        <div
          onClick={() =>
            removeListHandler(listState.listIndex, listState.index)
          }
        >
          <FontAwesomeIcon icon={faTrash} />
        </div>
        <div
          className="fa-check"
          onClick={() => listDoneHandler(listState.index, listState.listIndex)}
        >
          <FontAwesomeIcon icon={faCheck} />
        </div>
        <div className="fa-xmark" onClick={closeModalHandler}>
          <FontAwesomeIcon icon={faXmark} />
        </div>
      </div>
      <div className="list-area">
        {listIsVisible && (
          <form onSubmit={editListSubmitHandler}>
            <div className="edit-list">
              <input
                placeholder={listState.listName}
                type="text"
                ref={inputRef}
              />
              <button>저장</button>
            </div>
            <div className="edit-time-area">
              <TimeSelector />
            </div>
          </form>
        )}
        {!listIsVisible && (
          <>
            <div className="edit-list-colorbox"></div>
            <div className={`listName  ${styleClass}`}>
              {listState.listName}
            </div>
          </>
        )}
      </div>
      {!listIsVisible && <div className="list-time-area">
        <div>{schedule[listState.index].todo[listState.listIndex].firstTime}</div>
        <div>
          <span>~</span>
        </div>
        <div>{schedule[listState.index].todo[listState.listIndex].lastTime}</div>
      </div>}
    </div>
  );
};

export default List;
