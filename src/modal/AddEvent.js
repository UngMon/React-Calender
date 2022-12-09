import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { modalActions } from "../store/modal-slice";
import { timeActions } from "../store/time-slice";
import { allListActions } from "../store/all-list-slice";
import { listActions } from "../store/list-slice";
import ModalPosition from "../library/ModalPosition";
import SetTime from "../library/Time/SetTime";
import TimeSelector from "../library/Time/TimeSelector";
import ColorBox from "../library/ColorBox";
import { comparisonHandler } from "../library/Comparioson";
import "./AddEvent.css";

const setTime = SetTime();
const firstTime = setTime.currentTime;

const LastTime = setTime.lastTime;

const AddEvent = () => {
  const dispatch = useDispatch();
  const modalState = useSelector((state) => state.modal);

  const [color, setColor] = useState("라벤더");
  const [openColor, setOpenColor] = useState(false);

  const startDate = modalState.startDate;
  const endDate = modalState.endDate;

  const modalRef = useRef();
  const inputRef = useRef();
  const colorRef = useRef();

  const timeOneRef = useRef();
  const timeTwoRef = useRef();

  const closeHandler = (e) => {
    if (openColor) {
      // 색상 선택 on, off
      if (!colorRef.current.contains(e.target)) {
        setTimeout(() => {
          setOpenColor(false);
        }, [100]);
      }
    }

    // AddEvent modal on, off
    if (!modalRef.current.contains(e.target)) {
      setTimeout(() => {
        dispatch(modalActions.offModal());
        dispatch(allListActions.offModal());
        dispatch(listActions.offModal());
        dispatch(timeActions.resetTime());
      }, 100);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", closeHandler);
    return () => {
      document.removeEventListener("mousedown", closeHandler);
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
      dispatch(modalActions.inputList({ title, startTime, endTime, color }));
    }

    // 마지막 날이 시작날 보다 큼.
    if (comparison <= 3) {
      dispatch(modalActions.longDateList({ title, startTime, endTime, color }));
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
      className={`addModal ${ModalPosition(
        modalState.dayIndex,
        modalState.week
      )}`}
      onSubmit={listSubmitHandler}
      ref={modalRef}
      style={{ display: !modalState.isVisible && "none" }}
    >
      <div className="add-modal-name">일정 추가</div>
      <div className="inputArea">
        <img src="img/memo.png" alt="memo" width="17" className="input-icon" />
        <input placeholder="(제목 추가)" type="text" ref={inputRef} />
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
      <ColorBox
        color={color}
        setColor={setColor}
        openColor={openColor}
        setOpenColor={setOpenColor}
        colorRef={colorRef}
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
