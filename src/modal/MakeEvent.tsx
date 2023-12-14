import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../redux/store";
import { modalActions } from "../redux/modal-slice";
import { timeActions } from "../redux/time-slice";
import { MakeList } from "../utils/MakeList";
import { MakeListParameter } from "../type/Etc";
import { sendUserData } from "../redux/fetch-action";
import { DataType } from "../type/ReduxType";
import ModalPosition from "../utils/ModalPosition";
import TimeSelector from "../utils/Time/TimeSelector";
import ColorBox from "../utils/Time/ColorBox";
import { makeHeightObject } from "./Object";
import "./MakeEvent.css";
import { cloneActions } from "../redux/clone-slice";

interface T {
  data: DataType;
  week: number;
  uid: string;
  viewRef: React.RefObject<HTMLDivElement>;
  setIsDragging: (value: boolean) => void;
}

const MakeEvent = ({ data, week, uid, viewRef, setIsDragging }: T) => {
  const dispatch = useAppDispatch();

  const clone = useSelector((state: RootState) => state.clone);

  const [isMount, setIsMount] = useState<boolean>(true);
  const [color, setColor] = useState<string>("라벤더");
  const [openColor, setOpenColor] = useState<boolean>(false);
  const [animaOn, setAnimaOn] = useState<boolean>(true);
  const [size, setSize] = useState<[number, number]>([
    viewRef.current!.clientWidth,
    (viewRef.current!.clientHeight - 26) / week,
  ]);
  const [dateIsVisible, setDateIsVisible] = useState<[boolean, string]>([
    false,
    "",
  ]);

  const startDate: string = clone.startDate;
  const endDate: string = clone.endDate;

  const boxRef = useRef<HTMLDivElement>(null);
  const colorRef = useRef<HTMLDivElement>(null);

  const titleRef = useRef<HTMLInputElement>(null);
  const timeIputOneRef = useRef<HTMLInputElement>(null);
  const timeInputTwoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const widthCalculator = () => {
      setSize([
        viewRef.current!.clientWidth,
        (viewRef.current!.clientHeight - 26) / week,
      ]);
    };

    window.addEventListener("resize", widthCalculator);
    return () => window.removeEventListener("resize", widthCalculator);
  });

  useEffect(() => {
    const closeHandler = (e: MouseEvent) => {
      const target = e.target as Node;

      if (isMount) {
        setIsMount(false);
        return;
      }

      // 사용자가 클릭한 Node가 color가 아닌 경우 컬러창 닫게해줌.
      if (openColor && !colorRef.current?.contains(target)) {
        setTimeout(() => {
          setOpenColor(false);
        }, 150);
        return;
      }
      // modal 영역 밖을 클릭할 때, state 초기화
      if (!boxRef.current?.contains(target)) {
        setIsMount(true);
        cancelHandler();
      }
    };

    document.addEventListener("click", closeHandler);
    return () => {
      document.removeEventListener("click", closeHandler);
    };
  });

  const makeListHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    const pattern = /^(오전|오후)\s(([0][0-9]|[1][0-2])):([0-5][0-9])$/;

    let startTime = (
      timeIputOneRef.current!.value || timeIputOneRef.current!.placeholder
    ).trim();
    let endTime = (
      timeInputTwoRef.current!.value || timeInputTwoRef.current!.placeholder
    ).trim();

    if (!pattern.test(startTime) || !pattern.test(endTime))
      return alert("시간을 제대로 입력해주세요! ex) 오후 01:30");
    if (startDate > endDate) return alert("시작 날이 마지막 날 보다 큽니다!!");

    let title = titleRef.current!.value;
    if (title.trim() === "") title = "(제목 없음)";

    const parameter: MakeListParameter = {
      title,
      startDate,
      endDate,
      startTime,
      endTime,
      color,
      userSchedule: data.userSchedule,
    };
    try {
      const newSchedule = MakeList(parameter);
      dispatch(sendUserData({ newSchedule, uid, type: "PUT" }));
    } catch (error) {
      alert("데이터 전송 실패...");
    }

    titleRef.current!.value = "";
    // 제출 후 아래 두개의 reducer 함수를 실행시켜 state 초기화
    cancelHandler();
  };

  const cancelHandler = () => {
    setAnimaOn(false);
    setIsDragging(false);
    setTimeout(() => {
      dispatch(modalActions.clearSet());
      dispatch(timeActions.resetTime());
      dispatch(cloneActions.clearSet());
    }, 250);
  };

  // 여기는 스크린 크기에 따라 modal의 위치를 지정한다.
  const marginSize: number[] = ModalPosition(clone.day, clone.week, size);

  return (
    <div
      className={`make-modal-box  ${animaOn ? "on" : "off"}`}
      style={{
        left: `${marginSize && marginSize[0]}px`,
        top: `${clone.week < "4" && marginSize[1]}px`,
        bottom: `${clone.week > "3" && marginSize[1]}px`,
      }}
      ref={boxRef}
      onWheel={(e) => e.stopPropagation()}
    >
      <div className="add-modal-title">일정 추가</div>
      <form className={`addModal `} onSubmit={makeListHandler}>
        <div
          className={`addModal-menu ${
            makeHeightObject[week] > window.innerHeight ? "scroll" : ""
          }`}
          style={{
            height:
              dateIsVisible[0] && makeHeightObject[week] > window.innerHeight
                ? 412 - (makeHeightObject[week] - window.innerHeight)
                : "",
          }}
        >
          <div className="edit-title">
            <div>
              <img
                src="../images/memo.png"
                alt="memo"
                width="17"
                className="input-icon"
              />
            </div>
            <div>
              <input placeholder="(제목 추가)" type="text" ref={titleRef} />
            </div>
          </div>
          <TimeSelector
            startDate={startDate}
            endDate={endDate}
            timeInputOneRef={timeIputOneRef}
            timeInputTwoRef={timeInputTwoRef}
            dateIsVisible={dateIsVisible}
            setDateIsVisible={setDateIsVisible}
          />
          <ColorBox
            platform={"pc"}
            color={color}
            setColor={setColor}
            openColor={openColor}
            setOpenColor={setOpenColor}
            colorRef={colorRef}
          />
        </div>

        <div className="buttonBox">
          <button type="submit">저장</button>
          <button type="button" onClick={cancelHandler}>
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default MakeEvent;
