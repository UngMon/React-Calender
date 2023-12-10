import React, { useRef, useEffect } from "react";
import { RootState, useAppDispatch } from "../../redux/store";
import { useSelector } from "react-redux";
import { timeActions } from "../../redux/time-slice";
import { ListOrMore } from "../../type/RefType";
import SetTime from "./SetTime";
import SecondCaleder from "../miniCalender/Secon-Month";
import TimeBoxOne from "./TimeBoxOne";
import TimeBoxTwo from "./TimeBoxTwo";
import "./TimeSelector.css";

interface T {
  startDate: string;
  endDate: string;
  timeInputOneRef: React.RefObject<HTMLInputElement>;
  timeInputTwoRef: React.RefObject<HTMLInputElement>;
  dateIsVisible: [boolean, string];
  setDateIsVisible: React.Dispatch<React.SetStateAction<[boolean, string]>>;
}

const setTime = SetTime();
const firstTime = setTime.currentTime;
const lastTime = setTime.lastTime;

const TimeSelector = ({
  startDate,
  endDate,
  timeInputOneRef,
  timeInputTwoRef,
  dateIsVisible,
  setDateIsVisible,
}: T) => {
  const dispatch = useAppDispatch();
  const timeState = useSelector((state: RootState) => state.time);

  const 시작날 = startDate.split("-");
  const 마지막날 = endDate.split("-");

  const dateRef = useRef<ListOrMore>({});
  const timeRef = useRef<ListOrMore>({});
  const oneRef = useRef<ListOrMore>({});
  const twoRef = useRef<ListOrMore>({});

  const dateOpenHandler = (type: string) => {
    if (dateIsVisible[1] === type) {
      setDateIsVisible([false, ""]);
    }

    if (dateIsVisible[1] !== type) {
      setDateIsVisible([true, type]);
    }

    if (timeState.firstIsVisible || timeState.lastIsVisible)
      dispatch(timeActions.timeToggle());
  };

  useEffect(() => {
    const timePickerHandler = (e: MouseEvent) => {
      const target = e.target as Node;
      console.log("time click");

      for (let i in dateRef.current) {
        if (dateRef.current[i]?.contains(target)) return;
      }

      if (timeInputOneRef.current?.contains(target)) {
        if (dateIsVisible[0]) setDateIsVisible([false, ""]);
        dispatch(timeActions.selectFristTime({ firstTime, lastTime }));
        return;
      }

      if (timeInputTwoRef.current?.contains(target)) {
        if (dateIsVisible[0]) setDateIsVisible([false, ""]);
        dispatch(timeActions.selectLastTime({ firstTime, lastTime }));
        return;
      }

      for (let i in timeRef.current) {
        if (!timeRef.current[i]) continue;
        if (timeRef.current[i]?.contains(target)) return;
      }

      console.log("reset");
      setTimeout(() => {
        setDateIsVisible([false, ""]);
        (timeState.firstTime !== "" || timeState.lastTime !== "") &&
          dispatch(timeActions.resetTime());
      }, 150);
    };

    window.addEventListener("click", timePickerHandler);

    return () => window.removeEventListener("click", timePickerHandler);
  });

  return (
    <div className="time-container">
      <img
        src="../images/clock.png"
        alt="clock"
        width="20"
        className="clock-icon"
      />
      <div className="time-box">
        <div className="picker-one">
          <div className="date-area">
            <div
              className={dateIsVisible[1] === "start" ? "date-on" : ""}
              ref={(el: HTMLDivElement) => (dateRef.current[0] = el)}
              onClick={() => dateOpenHandler("start")}
            >
              <span>
                {시작날[0] + "년 " + 시작날[1] + "월 " + 시작날[2] + "일"}
              </span>
            </div>
          </div>
          <div className="time-picker">
            <input
              type="text"
              placeholder={timeState.firstTime || firstTime}
              ref={timeInputOneRef}
            />
          </div>
        </div>
        <div className="time-box-span">
          <span>~</span>
        </div>
        <div className="picker-one">
          <div className="date-area">
            <div
              className={dateIsVisible[1] === "end" ? "date-on" : ""}
              ref={(el: HTMLDivElement) => (dateRef.current[1] = el)}
              onClick={() => dateOpenHandler("end")}
            >
              <span>
                {마지막날[0] + "년 " + 마지막날[1] + "월 " + 마지막날[2] + "일"}
              </span>
            </div>
          </div>
          <div className="time-picker">
            <input
              type="text"
              placeholder={timeState.lastTime || lastTime}
              ref={timeInputTwoRef}
            />
          </div>
        </div>
      </div>
      <div className="picker-two">
        {dateIsVisible[0] && (
          <SecondCaleder
            platform="pc"
            type={dateIsVisible[1]}
            dateRef={dateRef}
            // dateOpenHandler={dateOpenHandler}
          />
        )}
        <TimeBoxOne
          timeInputOneRef={timeInputOneRef}
          oneRef={oneRef}
          timeVisible={timeState.firstIsVisible}
          timeRef={timeRef}
        />
        <TimeBoxTwo
          timeInputOneRef={timeInputTwoRef}
          twoRef={twoRef}
          timeVisible={timeState.lastIsVisible}
          timeRef={timeRef}
        />
      </div>
    </div>
  );
};

export default TimeSelector;
