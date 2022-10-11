import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { modalActions } from "../store/modal-slice";
import { timeActions } from "../store/time-slice";
import ModalPosition from "../library/ModalPosition";
import "./AddEvent.css";
import SetTime from "../library/Time/SetTime";
import TimeSelector from "../library/Time/TimeSelector";
import { allListActions } from "../store/all-list-slice";
import { listActions } from "../store/list-slice";

const setTime = SetTime();
const currentTime = setTime.currentTime;
const LastTime = setTime.lastTime;

const AddEvent = () => {
  const dispatch = useDispatch();
  const modalState = useSelector((state) => state.modal);
  const timeState = useSelector((state) => state.time);

  const modalRef = useRef();
  const inputRef = useRef();
  const timeOneRef = useRef();
  const timeTwoRef = useRef();

  const addModalCloseHandler = (e) => {
    if (modalState.isVisible && !modalRef.current.contains(e.target)) {
      console.log(modalRef);
      setTimeout(() => {
        dispatch(modalActions.offModal());
        dispatch(allListActions.offModal());
        dispatch(listActions.offModal());
        dispatch(timeActions.resetTime());
      }, 150);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", addModalCloseHandler);
    return () => {
      document.removeEventListener("mousedown", addModalCloseHandler);
    };
  });

  const comparisonHandler = () => {
    return (
      (+modalState.year <= +modalState.secondYear && 
        // 시작 날짜의 연도가 마지막 날짜의 연도보다 작거나 같을 때,
        +modalState.month < +modalState.secondMonth && 
        // 시작 날짜의 달이 마지막 날짜의 달 보다 작을 때, true 
        true) || // 또는 둘의 달이 같을 때, 
      (modalState.month === modalState.secondMonth &&
        modalState.date < modalState.secondDate &&
        true)
    );
    // 시작 날이 마지막 날보다 크거나 작을 때 true 리턴 그 외 false
  };
  console.log(modalState.year);
  console.log(modalState.secondYear);
  console.log(modalState.month);
  console.log(modalState.secondMonth);
  console.log(modalState.date);
  console.log(modalState.secondDate);

  console.log(comparisonHandler());

  const listSubmitHandler = (event) => {
    event.preventDefault();
    const pattern = /^(오전|오후)\s(([0][0-9]|[1][0-2])):([0-5][0-9])$/;
    let list = inputRef.current.value;

    let firstTime = timeState.firstTime || currentTime;
    let lastTime = timeState.lastTime || LastTime;

    if (list.trim() === "") {
      list = "(제목 없음)";
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

    firstTime = timeOneRef.current.value || firstTime;
    lastTime = timeTwoRef.current.value || lastTime;

    if (firstTime > lastTime) {
      alert("끝나는 시간이 시작 시간보다 작습니다!! ex) 00:30 ~ 01:30");
      return;
    } else {
      console.log(comparisonHandler());
      if (modalState.startDate === modalState.endDate) {
        dispatch(modalActions.inputList({ list, firstTime, lastTime }));
      } else if (comparisonHandler()) {
        dispatch(
          modalActions.longDateList({
            firstTime,
            lastTime,
            list,
          })
        );
      }
    }

    inputRef.current.value = "";
    cancelHandler();
    dispatch(timeActions.resetTime());
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
        month={modalState.month}
        date={modalState.date}
        secondMonth={modalState.secondMonth}
        secondDate={modalState.secondDate}
        firstTime={currentTime}
        lastTime={LastTime}
        timeOneRef={timeOneRef}
        timeTwoRef={timeTwoRef}
      />
      <div className="buttonBox">
        <button type="submit" disabled={comparisonHandler() ? false : true}>
          저장
        </button>
        <button type="button" onClick={cancelHandler}>
          취소
        </button>
      </div>
    </form>
  );
};

export default AddEvent;
