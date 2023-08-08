import React, { useRef, useState, useEffect } from "react";
import { RootState, useAppDispatch } from "../../store/store";
import { useSelector } from "react-redux";
import { timeActions } from "../../store/time-slice";
import { ButtonRef, ListOrMore } from "../../utils/RefType";
import Month from "../secondcalender/Secon-Month";
import TimeBoxOne from "./TimeBoxOne";
import TimeBoxTwo from "./TimeBoxTwo";
import "./TimeSelector.css";

interface T {
  startDate: string;
  endDate: string;
  firstTime: string;
  lastTime: string;
  timeOneRef: React.RefObject<HTMLInputElement>;
  timeTwoRef: React.RefObject<HTMLInputElement>;
}

const TimeSelector = ({
  startDate,
  endDate,
  firstTime,
  lastTime,
  timeOneRef,
  timeTwoRef,
}: T) => {
  const dispatch = useAppDispatch();
  const timeState = useSelector((state: RootState) => state.time);

  const 시작날 = startDate.split("-");
  const 마지막날 = endDate.split("-");

  const [fristDateIsVisible, setFirstDateIsVisible] = useState<boolean>(false);
  const [lastDateIsVisible, setLastDateIsVisible] = useState<boolean>(false);

  const dateRef = useRef<ListOrMore>({});
  const timeRef = useRef<ListOrMore>({});
  const calenderRef = useRef<ListOrMore>({});
  const oneRef = useRef<ListOrMore>({});
  const twoRef = useRef<ListOrMore>({});

  const timeOneVisible = timeState.firstIsVisible;
  const timeTwoVisible = timeState.lastIsVisible;

  const startDateOpenHandler = () => {
    setFirstDateIsVisible((prevState) => !prevState);
  };

  const endDateOpenHandler = () => {
    setLastDateIsVisible((prevState) => !prevState);
  };

  useEffect(() => {
    const clickEvent = (e: MouseEvent) => {
      let target = e.target as Node;

      for (let i in dateRef.current) {
        if (!dateRef.current[i]!.contains(target)) {
          continue;
        }

        switch (i) {
          case "0":
            setTimeout(() => {
              setFirstDateIsVisible(false);
            }, 100);
            return;
          case "1":
            setTimeout(() => {
              setLastDateIsVisible(false);
            }, 100);
            return;
          default:
        }
        break;
      }

      setFirstDateIsVisible(false);
      setLastDateIsVisible(false);
      return;
    };

    document.addEventListener("mousedown", clickEvent);
    return () => {
      document.removeEventListener("mousedown", clickEvent);
    };
  });

  const timePickerCloseHandler = (e: React.MouseEvent) => {
    if (timeOneRef.current!.contains(e.currentTarget)) {
      dispatch(timeActions.selectFristTime({}));
      return;
    }

    if (timeTwoRef.current!.contains(e.currentTarget)) {
      dispatch(timeActions.selectLastTime({}));
      return;
    }

    for (let i in timeRef.current.length) {
      if (!timeRef.current[i]) continue;

      if (timeRef.current[i]!.contains(e.currentTarget)) return;
    }

    setTimeout(() => {
      dispatch(timeActions.timeToggle());
    }, 120);
  };

  return (
    <div className="time-container">
      <img src="img/clock.png" alt="clock" width="19" className="clock-icon" />
      <div className="time-box">
        <div className="date-area">
          <div ref={(el: HTMLDivElement) => (dateRef.current[0] = el)}>
            <span onClick={startDateOpenHandler}>
              {시작날[0] + "년 " + 시작날[1] + "월 " + 시작날[2] + "일"}
            </span>
          </div>
          {fristDateIsVisible && (
            <div className="second-calender">
              <Month
                type={"start"}
                year={시작날[0]}
                month={시작날[1]}
                dateRef={dateRef}
                dateClose={startDateOpenHandler}
              />
            </div>
          )}
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
            <span onClick={endDateOpenHandler}>
              {마지막날[0] + "년 " + 마지막날[1] + "월 " + 마지막날[2] + "일"}
            </span>
          </div>
          {lastDateIsVisible && (
            <div className="second-calender">
              <Month
                type={"end"}
                year={마지막날[0]}
                month={마지막날[1]}
                dateRef={dateRef}
                dateClose={endDateOpenHandler}
              />
            </div>
          )}
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
