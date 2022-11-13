import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { modalActions } from "../store/modal-slice";
import { timeActions } from "../store/time-slice";
import { allListActions } from "../store/all-list-slice";
import { listActions } from "../store/list-slice";
import ModalPosition from "../library/ModalPosition";
import SetTime from "../library/Time/SetTime";
import TimeSelector from "../library/Time/TimeSelector";
import { comparisonHandler } from "../library/Comparioson";
import "./AddEvent.css";

const setTime = SetTime();
const firstTime = setTime.currentTime;

const LastTime = setTime.lastTime;

const AddEvent = () => {
  const dispatch = useDispatch();
  const modalState = useSelector((state) => state.modal);

  const startDate = modalState.startDate;
  const endDate = modalState.endDate;

  const modalRef = useRef();
  const inputRef = useRef();

  const timeOneRef = useRef();
  const timeTwoRef = useRef();

  const modalCloseHandler = (e) => {
    if (!modalRef.current.contains(e.target)) {
      setTimeout(() => {
        dispatch(modalActions.offModal());
        dispatch(allListActions.offModal());
        dispatch(listActions.offModal());
        dispatch(timeActions.resetTime());
      }, 150);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", modalCloseHandler);
    return () => {
      document.removeEventListener("mousedown", modalCloseHandler);
    };
  });

  const comparison = comparisonHandler(startDate, endDate);

  const listSubmitHandler = (event) => {
    event.preventDefault();

    const pattern = /^(오전|오후)\s(([0][0-9]|[1][0-2])):([0-5][0-9])$/;

    let title = inputRef.current.value;
    let startTime = timeOneRef.current.value || firstTime;
    let endTime = timeTwoRef.current.value || LastTime;

    if (title.trim() === "") {
      title = "(제목 없음)";
    }

    if (timeOneRef.current.value !== "") {
      if (!pattern.test(timeOneRef.current.value)) {
        return alert("시간을 제대로 입력해주세요! ex) 오후 01:30");
      }
    }

    if (timeTwoRef.current.value !== "") {
      if (!pattern.test(timeTwoRef.current.value)) {
        return alert("시간을 제대로 입력해주세요! ex) 오후 01:30");
      }
    }

    if (comparison === 5) {
      return alert("시작 날이 마지막 날 보다 큽니다!!");
    }

    if (startTime > endTime) {
      if (comparison === 4) {
        return alert("종료 시간이 시작 시간보다 작습니다!! ex) 00:30 ~ 01:30");
      }
    }

    // 시작날과 마지막 날 일치
    if (comparison === 4) {
      dispatch(
        modalActions.inputList({ title, startTime, endTime })
      );
    }

    // 마지막 날이 시작날 보다 큼.
    if (comparison <= 3) {
      dispatch(
        modalActions.longDateList({ title, startTime, endTime })
      );
    }

    inputRef.current.value = "";

    cancelHandler();
    dispatch(timeActions.resetTime());
    dispatch(modalActions.resetState());
  };

  const cancelHandler = () => {
    dispatch(modalActions.offModal());
    dispatch(timeActions.resetTime());
  };

  return (
    <form
      className={`addMordal ${ModalPosition(
        modalState.dayIndex,
        modalState.week
      )}`}
      onSubmit={listSubmitHandler}
      ref={modalRef}
      style={{ display: !modalState.isVisible && "none" }}
    >
      <div className="add-modal-name">일정 추가</div>
      <div className="inputArea">
        <input placeholder="(제목 없음)" type="text" ref={inputRef} />
      </div>
      <TimeSelector
        startDate={startDate}
        endDate={endDate}
        firstTime={firstTime}
        lastTime={LastTime}
        timeOneRef={timeOneRef}
        timeTwoRef={timeTwoRef}
        comparison={comparison}
      />
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
