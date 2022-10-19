import { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listActions } from "../store/list-slice";
import { modalActions } from "../store/modal-slice";
import { timeActions } from "../store/time-slice";
import { comparisonHandler } from "../library/Comparioson";
import ModalPosition from "../library/ModalPosition";
import "./List.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faTrash, faCheck, faEdit } from "@fortawesome/free-solid-svg-icons";
import TimeSelector from "../library/Time/TimeSelector";

const List = () => {
  const dispatch = useDispatch();

  const listState = useSelector((state) => state.list);
  const timeState = useSelector((state) => state.time);
  const modalState = useSelector((state) => state.modal);

  const [listIsVisible, setListIsVisible] = useState(false);

  const index = listState.index;
  const listIndex = listState.listIndex;

  const schedule = modalState.schedule;
  const 날짜정보 = schedule[index].todo[listIndex];

  const startDate = modalState.startDate;
  const endDate = modalState.endDate;

  const modalRef = useRef();
  const inputRef = useRef();

  const timeOneRef = useRef();
  const timeTwoRef = useRef();

  const comparison = comparisonHandler(startDate, endDate);

  const listModalCloseHandler = (e) => {
    if (listState.isVisible && !modalRef.current.contains(e.target)) {
      setTimeout(() => {
        dispatch(listActions.offModal());
        dispatch(modalActions.offModal());
        dispatch(timeActions.resetTime());
      }, 150);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", listModalCloseHandler);
    return () => {
      document.removeEventListener("mousedown", listModalCloseHandler);
    };
  });

  const removeListHandler = (listIndex, index) => {
    dispatch(modalActions.removeList({ listIndex, index }));
    dispatch(listActions.offModal());
  };

  const listEditHandler = (startDate, endDate) => {
    setListIsVisible((prevState) => !prevState);
    dispatch(modalActions.setDate({ startDate, endDate }));
  };

  const editListSubmitHandler = (event) => {
    event.preventDefault();
    const pattern = /^(오전|오후)\s(([0][0-9]|[1][0-2])):([0-5][0-9])$/;

    let list = inputRef.current.value;

    let firstTime = timeState.firstTime || 날짜정보.firstTime;
    let lastTime = timeState.lastTime || 날짜정보.lastTime;

    if (list.trim() === "") {
      list = listState.listName;
    }

    if (timeOneRef.current.value !== "") {
      if (!pattern.test(timeOneRef.current.value)) {
        alert("시간을 제대로 입력해주세요! ex) 오후 01:30");
        return;
      }
    }

    if (timeTwoRef.current.value !== "") {
      if (!pattern.test(timeTwoRef.current.value)) {
        alert("시간을 제대로 입력해주세요! ex) 오후 01:30");
        return;
      }
    }

    if (firstTime > lastTime) {
      if (startDate > endDate) {
        alert("끝나는 시간이 시작 시간보다 작습니다!! ex) 00:30 ~ 01:30");
        return;
      }
    } else {
      dispatch(modalActions.removeList({ index, listIndex }));
      if (comparison) {
        console.log("long?");
        dispatch(modalActions.longDateList({ firstTime, lastTime, list }));
      } else {
        console.log("여기?");
        dispatch(modalActions.inputList({ firstTime, lastTime, list }));
      }

      inputRef.current.value = "";
      closeModalHandler();
      dispatch(modalActions.offModal());
      dispatch(timeActions.resetTime());
    }
  };

  const listDoneHandler = (index, listIndex) => {
    dispatch(modalActions.listDone({ index, listIndex }));
  };

  const closeModalHandler = () => {
    dispatch(listActions.offModal());
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
      ref={modalRef}
    >
      <div className="option-box">
        <div
          onClick={() => listEditHandler(날짜정보.startDate, 날짜정보.endDate)}
        >
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
              <TimeSelector
                startDate={modalState.startDate}
                endDate={modalState.endDate}
                firstTime={날짜정보.firstTime}
                lastTime={날짜정보.lastTime}
                timeOneRef={timeOneRef}
                timeTwoRef={timeTwoRef}
              />
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
      {!listIsVisible && (
        <div className="list-time-area">
          <div>
            {schedule[listState.index].todo[listState.listIndex].firstTime}
          </div>
          <div>
            <span>~</span>
          </div>
          <div>
            {schedule[listState.index].todo[listState.listIndex].lastTime}
          </div>
        </div>
      )}
    </div>
  );
};

export default List;
