import React, { useRef, useState, useEffect } from "react";
import { RootState, useAppDispatch } from "../../redux/store";
import { useSelector } from "react-redux";
import { timeActions } from "../../redux/time-slice";
import { ListOrMore } from "../../type/RefType";
import SetTime from "./SetTime";
import SecondCaleder from "../miniCalender/Secon-Month";
import TimeBoxOne from "./TimeBoxOne";
import TimeBoxTwo from "./TimeBoxTwo";
import "./PickerBox.css";

interface T {
  startDate: string;
  endDate: string;
  timeInputOneRef: React.RefObject<HTMLInputElement>;
  timeInputTwoRef: React.RefObject<HTMLInputElement>;
}

const setTime = SetTime();
const firstTime = setTime.currentTime;
const lastTime = setTime.lastTime;

const PickerBox = ({
  startDate,
  endDate,
  timeInputOneRef,
  timeInputTwoRef,
}: T) => {
  const dispatch = useAppDispatch();
  const timeState = useSelector((state: RootState) => state.time);

  const dateRef = useRef<ListOrMore>({});
  const timeRef = useRef<ListOrMore>({});
  const oneRef = useRef<ListOrMore>({});
  const twoRef = useRef<ListOrMore>({});

  const [openDate, setOpenDate] = useState<[boolean, string]>([false, ""]);

  const openDateHandler = (type: string) => {
    if (openDate[1] === type) setOpenDate([false, ""]);
    if (openDate[1] !== type) setOpenDate([true, type]);
    dispatch(timeActions.timeToggle());
    console.log("Date Open Handler");
  };

  const openTimeHandler = (type: string) => {
    if (type === "start") dispatch(timeActions.openStartTime());
    else dispatch(timeActions.openEndTime());
    setOpenDate([false, ""]);
  };

  useEffect(() => {
    if (!openDate[0] && !timeState.firstIsVisible && !timeState.lastIsVisible)
      return;

    const timePickerHandler = (e: MouseEvent) => {
      const target = e.target as Node;

      for (let i in dateRef.current) {
        if (dateRef.current[i]?.contains(target)) return;
      }

      for (let i in timeRef.current) {
        if (timeRef.current[i]?.contains(target)) return;
      }

      if (timeInputOneRef.current?.contains(target)) return;

      if (timeInputTwoRef.current?.contains(target)) return;

      setOpenDate([false, ""]);
      dispatch(timeActions.timeToggle());
    };

    window.addEventListener("click", timePickerHandler);

    return () => window.removeEventListener("click", timePickerHandler);
  });

  return (
    <div className="pick-container">
      <img
        src="../images/clock.png"
        alt="clock"
        width="20"
        className="clock-icon"
      />
      <div className="pc-picker-box">
        <div className="picker-one">
          <div className="date-picker">
            <div
              className={openDate[1] === "start" ? "date-on" : ""}
              ref={(el: HTMLDivElement) => (dateRef.current[0] = el)}
              onClick={() => openDateHandler("start")}
            >
              <span>{startDate}</span>
            </div>
          </div>
          <div className="time-picker">
            <input
              type="text"
              placeholder={timeState.startTime || firstTime}
              ref={timeInputOneRef}
              onClick={() => openTimeHandler("start")}
            />
          </div>
        </div>
        <div className="span-wave">
          <span>~</span>
        </div>
        <div className="picker-one">
          <div className="date-picker">
            <div
              className={openDate[1] === "end" ? "date-on" : ""}
              ref={(el: HTMLDivElement) => (dateRef.current[1] = el)}
              onClick={() => openDateHandler("end")}
            >
              <span>{endDate}</span>
            </div>
          </div>
          <div className="time-picker">
            <input
              type="text"
              placeholder={timeState.endTime || lastTime}
              ref={timeInputTwoRef}
              onClick={() => openTimeHandler("end")}
            />
          </div>
        </div>
      </div>
      <div className="picker-two">
        {openDate[0] && (
          <SecondCaleder platform="pc" type={openDate[1]} dateRef={dateRef} />
        )}
        <TimeBoxOne
          oneRef={oneRef}
          timeRef={timeRef}
          timeInputOneRef={timeInputOneRef}
          timeVisible={timeState.firstIsVisible}
        />
        <TimeBoxTwo
          twoRef={twoRef}
          timeRef={timeRef}
          timeInputTwoRef={timeInputTwoRef}
          timeVisible={timeState.lastIsVisible}
        />
      </div>
    </div>
  );
};

export default PickerBox;
