import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { modalActions } from "../store/data-slice";
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

const AddEvent = ({ viewRef }) => {
  const dispatch = useDispatch();
  const modalState = useSelector((state) => state.modal);
  console.log("addevent");

  const [color, setColor] = useState("라벤더");
  const [openColor, setOpenColor] = useState(false);
  const [size, setSize] = useState(["", "", ""]);

  const startDate = modalState.startDate;
  const endDate = modalState.endDate;

  const modalRef = useRef();
  const inputRef = useRef();
  const colorRef = useRef();

  const timeOneRef = useRef();
  const timeTwoRef = useRef();

  useEffect(() => {
    setSize([viewRef.current.clientWidth, viewRef.current.clientHeight]);
  }, [viewRef]);

  const widthCalculator = useCallback(() => {
    setSize([viewRef.current.clientWidth, viewRef.current.clientHeight]);
  }, [viewRef]);

  useEffect(() => {
    window.addEventListener("resize", widthCalculator);
  });

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
      }, 130);
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

    if (!pattern.test(startTime) || !pattern.test(endTime))
      return alert("시간을 제대로 입력해주세요! ex) 오후 01:30");

    if (startDate > endDate) return alert("시작 날이 마지막 날 보다 큽니다!!");

    if (title.trim() === "") title = "(제목 없음)";

    dispatch(modalActions.makeList({ title, startTime, endTime, color }));

    inputRef.current.value = "";

    cancelHandler();

  };

  const cancelHandler = () => {
    dispatch(modalActions.offModal());
    dispatch(timeActions.resetTime());
  };
  // 여기는 size의 크기에 따라서 modalposition에서 값을 정해보자
  //  size > 425일때 이후의 과정 or media에서 정의한 사이즈 그대로 받아올것인지.
  console.log(size);
  const marginSize =
    size[0] !== ""
      ? ModalPosition(modalState.day, modalState.week, size)
      : false;
  console.log(marginSize);

  return (
    <form
      className={`addModal`}
      onSubmit={listSubmitHandler}
      ref={modalRef}
      style={{
        // 마운트시에 width 가 ''이므로 display none
        display: `${!marginSize ? "none" : "block"}`,
        marginLeft: `${marginSize && marginSize[0]}px`,
        marginTop: `${marginSize && marginSize[1]}px`,
      }}
      onWheel={(e) => e.stopPropagation()}
    >
      <div className="add-modal-name">일정 추가</div>
      <div className="inputArea">
        <img src="img/memo.png" alt="memo" width="17" className="input-icon" />
        <input placeholder="(제목 추가)" type="text" ref={inputRef} />
      </div>
      {/* <TimeSelector
        startDate={startDate}
        endDate={endDate}
        firstTime={firstTime}
        lastTime={LastTime}
        timeOneRef={timeOneRef}
        timeTwoRef={timeTwoRef}
        comparison={comparison}
        viewRef={viewRef}
      /> */}
      {/* <ColorBox
        color={color}
        setColor={setColor}
        openColor={openColor}
        setOpenColor={setOpenColor}
        colorRef={colorRef}
      /> */}
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
