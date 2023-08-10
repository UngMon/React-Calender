import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../redux/store";
import { dataActions } from "../redux/data-slice";
import { modalActions } from "../redux/modal-slice";
import { timeActions } from "../redux/time-slice";
import ModalPosition from "../library/ModalPosition";
import TimeSelector from "../library/Time/TimeSelector";
import ColorBox from "../library/ColorBox";
import "./MakeEvent.css";

interface T {
  viewRef: React.RefObject<HTMLDivElement>;
}

const MakeEvent = ({ viewRef }: T) => {
  const dispatch = useAppDispatch();
  const data = useSelector((state: RootState) => state.data);

  const [color, setColor] = useState<string>("라벤더");
  const [openColor, setOpenColor] = useState<boolean>(false);
  const [size, setSize] = useState<[number, number]>([
    viewRef.current!.clientWidth,
    viewRef.current!.clientHeight,
  ]);

  const startDate: string = data.startDate;
  const endDate: string = data.endDate;

  const modalRef = useRef<HTMLFormElement>(null);
  const colorRef = useRef<HTMLDivElement>(null);

  const titleRef = useRef<HTMLInputElement>(null);
  const timeOneRef = useRef<HTMLInputElement>(null);
  const timeTwoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const widthCalculator = () => {
      setSize([viewRef.current!.clientWidth, viewRef.current!.clientHeight]);
    };

    window.addEventListener("resize", widthCalculator);
    return () => window.removeEventListener("resize", widthCalculator);
  });

  useEffect(() => {
    const closeHandler = (e: MouseEvent) => {
      if (openColor) {
        // 색상 선택 on, off
        // 사용자가 클릭한 Node가 color가 아닌 경우 컬러창 닫게해줌.
        if (!colorRef.current!.contains(e.target as Node)) {
          setTimeout(() => {
            setOpenColor(false);
          }, 100);
        }
      }
      // 사용자가
      // AddEvent modal 닫을 때, state 초기화
      if (!modalRef.current!.contains(e.target as Node)) {
        setTimeout(() => {
          dispatch(dataActions.offModal());
          dispatch(modalActions.offModal());
          dispatch(timeActions.resetTime());
        }, 130);
      }
    };

    document.addEventListener("mousedown", closeHandler);
    return () => {
      document.removeEventListener("mousedown", closeHandler);
    };
  });

  const listSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();

    const pattern = /^(오전|오후)\s(([0][0-9]|[1][0-2])):([0-5][0-9])$/;

    let title = titleRef.current!.value;
    let startTime =
      timeOneRef.current!.value || timeOneRef.current!.placeholder;
    let endTime = timeTwoRef.current!.value || timeOneRef.current!.placeholder;
    
    if (!pattern.test(startTime) || !pattern.test(endTime))
      return alert("시간을 제대로 입력해주세요! ex) 오후 01:30");

    if (startDate > endDate) return alert("시작 날이 마지막 날 보다 큽니다!!");

    if (title.trim() === "") title = "(제목 없음)";

    dispatch(dataActions.makeList({ title, startTime, endTime, color }));
    
    titleRef.current!.value = "";

    // 제출 후 아래 두개의 reducer 함수를 실행시켜 state 초기화
    cancelHandler();
  };

  const cancelHandler = () => {
    dispatch(dataActions.offModal());
    dispatch(timeActions.resetTime());
  };

  // 여기는 size의 크기에 따라서 modalposition에서 값을 정해보자
  //  size > 425일때 이후의 과정 or media에서 정의한 사이즈 그대로 받아올것인지.

  const marginSize: number[] = ModalPosition(data.day, data.week, size);

  return (
    <form
      className={`addModal`}
      onSubmit={(e: React.FormEvent) => listSubmitHandler(e)}
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
        <img
          src="../images/memo.png"
          alt="memo"
          width="17"
          className="input-icon"
        />
        <input placeholder="(제목 추가)" type="text" ref={titleRef} />
      </div>
      <TimeSelector
        startDate={startDate}
        endDate={endDate}
        timeOneRef={timeOneRef}
        timeTwoRef={timeTwoRef}
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

export default MakeEvent;
