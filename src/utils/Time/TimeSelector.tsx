import React, { useRef, useState, useEffect } from "react";
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
  timeOneRef: React.RefObject<HTMLInputElement>;
  timeTwoRef: React.RefObject<HTMLInputElement>;
}

const TimeSelector = ({ startDate, endDate, timeOneRef, timeTwoRef }: T) => {
  const setTime = SetTime();
  const firstTime = setTime.currentTime;
  const lastTime = setTime.lastTime;

  const dispatch = useAppDispatch();
  const timeState = useSelector((state: RootState) => state.time);

  const 시작날 = startDate.split("-");
  const 마지막날 = endDate.split("-");

  const [dateIsVisible, setDateIsVisible] = useState<[boolean, string]>([
    false,
    "start",
  ]);

  const dateRef = useRef<ListOrMore>({});
  const timeRef = useRef<ListOrMore>({});
  const oneRef = useRef<ListOrMore>({});
  const twoRef = useRef<ListOrMore>({});

  const timeOneVisible = timeState.firstIsVisible;
  const timeTwoVisible = timeState.lastIsVisible;

  const dateOpenHandler = (type: string) => {
    let boolean: boolean = false;
    if (dateIsVisible[1] === type) boolean = !dateIsVisible[0];
    if (dateIsVisible[1] !== type) boolean = true;
    setDateIsVisible([boolean, type]);
  };

  useEffect(() => {
    const clickEvent = (e: MouseEvent) => {
      let target = e.target as Node;

      for (let i in dateRef.current) {
        if (dateRef.current[i]!.contains(target)) return;
      }
      console.log("working?");
      setTimeout(() => {
        setDateIsVisible([false, dateIsVisible[1]]);
      }, 100);
      return;
    };

    document.addEventListener("mousedown", clickEvent);
    return () => {
      document.removeEventListener("mousedown", clickEvent);
    };
  });

  useEffect(() => {
    const timePickerHandler = (e: MouseEvent) => {
      const target = e.target as Node;

      if (timeOneRef.current!.contains(target)) {
        dispatch(timeActions.selectFristTime({ firstTime, lastTime }));
        return;
      }

      if (timeTwoRef.current!.contains(target)) {
        dispatch(timeActions.selectLastTime({ firstTime, lastTime }));
        return;
      }

      for (let i in timeRef.current) {
        if (!timeRef.current[i]) continue;

        if (timeRef.current[i]!.contains(target)) return;
      }

      setTimeout(() => {
        dispatch(timeActions.resetTime());
      }, 120);
    };

    window.addEventListener("click", timePickerHandler);

    return () => window.removeEventListener("click", timePickerHandler);
  });

  return (
    <div className="time-container">
      <img
        src="../images/clock.png"
        alt="clock"
        width="19"
        className="clock-icon"
      />
      <div className="time-box">
        <div className="date-area">
          <div ref={(el: HTMLDivElement) => (dateRef.current[0] = el)}>
            <span onClick={() => dateOpenHandler("start")}>
              {시작날[0] + "년 " + 시작날[1] + "월 " + 시작날[2] + "일"}
            </span>
          </div>
          <div
            className="second-calender"
            style={{ display: dateIsVisible[0] ? "block" : "none" }}
          >
            <SecondCaleder
              platform="pc"
              type={dateIsVisible[1]}
              dateRef={dateRef}
              dateClose={dateOpenHandler}
            />
          </div>
        </div>
        <div className="time-one">
          <input
            type="text"
            placeholder={timeState.firstTime || firstTime}
            ref={timeOneRef}
          />
          {timeState.firstIsVisible && (
            <TimeBoxOne
              timeOneRef={timeOneRef}
              oneRef={oneRef}
              timeVisible={timeOneVisible}
              timeRef={timeRef}
            />
          )}
        </div>
        <div className="time-box-span">
          <span>~</span>
        </div>
        <div className="date-area">
          <div ref={(el: HTMLDivElement) => (dateRef.current[1] = el)}>
            <span onClick={() => dateOpenHandler("end")}>
              {마지막날[0] + "년 " + 마지막날[1] + "월 " + 마지막날[2] + "일"}
            </span>
          </div>
        </div>
        <div className="time-two">
          <input
            type="text"
            placeholder={timeState.lastTime || lastTime}
            ref={timeTwoRef}
          />
          {timeState.lastIsVisible && (
            <TimeBoxTwo
              timeTwoRef={timeTwoRef}
              twoRef={twoRef}
              timeVisible={timeTwoVisible}
              timeRef={timeRef}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeSelector;
