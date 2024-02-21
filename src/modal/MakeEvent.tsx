import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../redux/store";
import { modalActions } from "../redux/modal-slice";
import { cloneActions } from "../redux/clone-slice";
import { makeList } from "../utils/makeList";
import { MakeListParameter } from "../type/Etc";
import { sendUserData } from "../redux/fetch-action";
import { DataType } from "../type/ReduxType";
import { calculateModalHeight } from "../utils/calculateModalHeight";
import { makePosition } from "../utils/makePosition";
import { setTime } from "../ui/time/SetTime";
import PickerBox from "../ui/time/PickerBox";
import ColorBox from "../ui/time/ColorBox";
import "./MakeEvent.css";

interface T {
  data: DataType;
  lastweek: number;
  uid: string;
  viewRef: React.RefObject<HTMLDivElement>;
  setIsDragging: (value: boolean) => void;
}

const setT = setTime();
const startTime = setT.currentTime;
const endTime = setT.lastTime;

const MakeEvent = ({ data, lastweek, uid, viewRef, setIsDragging }: T) => {
  const dispatch = useAppDispatch();
  const clone = useSelector((state: RootState) => state.clone);
  
  const [isMount, setIsMount] = useState<boolean>(true);
  const [color, setColor] = useState<string>("라벤더");
  const [openColor, setOpenColor] = useState<boolean>(false);
  const [animaOn, setAnimaOn] = useState<boolean>(true);
  const [size, setSize] = useState<[number, number]>([
    viewRef.current!.clientWidth,
    (viewRef.current!.clientHeight - 26) / lastweek,
  ]);
  const [openDate, setOpenDate] = useState<[boolean, string]>([false, ""]);
  const [openTime, setOpenTime] = useState<[boolean, string]>([false, ""]);

  const startDate: string = clone.startDate;
  const endDate: string = clone.endDate;

  const boxRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const timeIputOneRef = useRef<HTMLInputElement>(null);
  const timeInputTwoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const widthCalculator = () => {
      setSize([
        viewRef.current!.clientWidth,
        (viewRef.current!.clientHeight - 26) / lastweek,
      ]);
    };

    window.addEventListener("resize", widthCalculator);
    return () => window.removeEventListener("resize", widthCalculator);
  });

  useEffect(() => {
    const keyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") cancelHandler();
    };
    document.addEventListener("keydown", keyDown);
    return () => document.removeEventListener("keydown", keyDown);
  });

  useEffect(() => {
    const closeHandler = (e: MouseEvent) => {
      const target = e.target as Node;

      if (isMount) {
        setIsMount(false);
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
    else {
      if (startTime > endTime)
        return alert("시작 시간이 종료 시간 보다 늦어요!!");
    }

    let title =
      titleRef.current!.value.trim() === ""
        ? "(제목 없음)"
        : titleRef.current!.value;

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
      const newSchedule = makeList(parameter);
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
      dispatch(modalActions.clearSet({ type: "all" }));
      dispatch(cloneActions.clearSet());
    }, 250);
  };

  // 여기는 스크린 크기에 따라 modal의 위치를 지정한다.
  const 좌표: number[] = makePosition(clone.day, clone.week, size, 0);

  return (
    <div
      className={`make-modal-box  ${animaOn ? "on" : "off"}`}
      style={{
        left: 좌표[0],
        ...(clone.week < "4" ? { top: 좌표[1] } : {}),
        ...(clone.week > "3" ? { bottom: 좌표[1] } : {}),
      }}
      ref={boxRef}
      onWheel={(e) => e.stopPropagation()}
    >
      <div className="add-modal-title">일정 추가</div>
      <form className="addModal" onSubmit={makeListHandler}>
        <div
          className="addModal-menu"
          style={{
            height: calculateModalHeight(
              clone.week < "4" ? 좌표[1] + 65 : 좌표[1],
              openDate[0],
              openTime[0]
            ),
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
          <PickerBox
            platform="pc"
            startDate={startDate}
            endDate={endDate}
            openDate={openDate}
            setOpenDate={setOpenDate}
            time={[startTime, endTime]}
            openTime={openTime}
            setOpenTime={setOpenTime}
            timeInputOneRef={timeIputOneRef}
            timeInputTwoRef={timeInputTwoRef}
          />
          <ColorBox
            platform={"pc"}
            color={color}
            setColor={setColor}
            openColor={openColor}
            setOpenColor={setOpenColor}
          />
        </div>
        <div className="buttonBox">
          <button type="submit" onClick={makeListHandler}>
            저장
          </button>
          <button type="button" onClick={cancelHandler}>
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default MakeEvent;
