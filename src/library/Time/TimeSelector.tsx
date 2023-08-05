import TimeBox from "./TimeBox";
import TimeBoxTwo from "./TimeBoxTwo";
import Month from "../secondcalender/Secon-Month";
import { useDispatch, useSelector } from "react-redux";
import { timeActions } from "../../store/time-slice";
import React, { useRef, useState, useEffect } from "react";
import "./TimeSelector.css";
import { ButtonRef, ListOrMore } from "../../utils/RefType";
import { RootState } from "../../store/store";

interface T {
  startDate: string;
  endDate: string;
  firstTime: string;
  lastTime: string;
  timeOneRef: React.MutableRefObject<HTMLDivElement | HTMLInputElement[]>;
  timeTwoRef: React.MutableRefObject<HTMLDivElement | HTMLInputElement[]>;
  viewRef: React.RefObject<HTMLDivElement>;
}

interface Ref {
  [key: string]: HTMLDivElement;
}

const TimeSelector = ({
  startDate,
  endDate,
  firstTime,
  lastTime,
  timeOneRef,
  timeTwoRef,
  viewRef,
}: T) => {
  const dispatch = useDispatch();
  const timeState = useSelector((state: RootState) => state.time);

  const 시작날 = startDate.split("-");
  const 마지막날 = endDate.split("-");

  const [fristDateIsVisible, setFirstDateIsVisible] = useState<boolean>(false);
  const [lastDateIsVisible, setLastDateIsVisible] = useState<boolean>(false);

  const dateRef = useRef<ButtonRef>({});
  const timeRef = useRef<ListOrMore>({});
  const calenderRef = useRef<ListOrMore>({});
  const OneRef = useRef<HTMLDivElement[]>([]);
  const TwoRef = useRef<HTMLDivElement[]>([]);

  const timeOneVisible = timeState.firstIsVisible;
  const timeTwoVisible = timeState.lastIsVisible;

  const startDateOpenHandler = () => {
    setFirstDateIsVisible((prevState) => !prevState);
  };

  const endDateOpenHandler = () => {
    setLastDateIsVisible((prevState) => !prevState);
  };

  // const clickEventHandler = (e: React.MouseEvent, type: string) => {
  //   let boolean = true;

  //   for (let i in dateRef.current) {
  //     if (!dateRef.current[i].contains(e.currentTarget)) {
  //       boolean = false;
  //       continue;
  //     }
  //     boolean = true;

  //     switch (i) {
  //       case "0":
  //         setTimeout(() => {
  //           setFirstDateIsVisible(false);
  //         }, 100);
  //         return;
  //       case "1":
  //         setTimeout(() => {
  //           setLastDateIsVisible(false);
  //         }, 100);
  //         return;
  //       default:
  //     }
  //   }

  //   if (!boolean) {
  //     setFirstDateIsVisible(false);
  //     setLastDateIsVisible(false);
  //     return;
  //   }
  // };

  // useEffect(() => {
  //   document.addEventListener("mousedown", clickEventHandler);
  //   return () => {
  //     document.removeEventListener("mousedown", clickEventHandler);
  //   };
  // });

  // const timePickerCloseHandler = (e: React.MouseEvent) => {
  //   let boolean = true;

  //   if (timeOneRef.current.contains(e.currentTarget)) {
  //     console.log("timeOnRef");
  //     dispatch(timeActions.firstTimetoggle());
  //     if (timeTwoVisible) {
  //       dispatch(timeActions.lastTimetoggle());
  //     }
  //     return;
  //   }

  //   if (timeTwoRef.current.contains(e.target)) {
  //     console.log("timetwoRef");
  //     dispatch(timeActions.lastTimetoggle());
  //     if (timeOneVisible) {
  //       dispatch(timeActions.firstTimetoggle());
  //     }
  //     return;
  //   }

  //   for (let i = 0; i < timeRef.current.length; i++) {
  //     console.log(timeRef.current);
  //     if (timeRef.current[i] === null || timeRef.current[i] === undefined) {
  //       continue;
  //     }

  //     if (!timeRef.current[i].contains(e.target)) {
  //       boolean = false;
  //       console.log("false");
  //     } else {
  //       boolean = true;
  //       console.log("true");
  //       break;
  //     }
  //   }

  //   if (!boolean) {
  //     console.log("!boolean");
  //     setTimeout(() => {
  //       dispatch(timeActions.timeToggle());
  //     }, 120);
  //   }
  // };



  return (
    <div className="time-container">
      <img src="img/clock.png" alt="clock" width="19" className="clock-icon" />
      <div className="time-box">
        <div className="date-area">
          <div
            // onClick={(e: React.MouseEvent) => dateClickHandler(e, "start")}
            ref={(el: HTMLDivElement) => (dateRef.current[0] = el)}
          >
            <span onClick={startDateOpenHandler}>
              {시작날[0] + "년 " + 시작날[1] + "월 " + 시작날[2] + "일"}
            </span>
          </div>
          {fristDateIsVisible && (
            <div className="second-calender">
              {/* <Month
                type={"start"}
                year={시작날[0]}
                month={시작날[1]}
                dateRef={dateRef}
                dateClose={startDateOpenHandler}
              /> */}
            </div>
          )}
        </div>
        <div className="time-one">
          <input
            type="text"
            placeholder={timeState.firstTime || firstTime}
            // ref={timeOneRef}
          />
          {timeState.firstIsVisible && (
            <TimeBox
              timeOneRef={timeOneRef}
              OneRef={OneRef}
              timeVisible={timeOneVisible}
              timeRef={timeRef}
            />
          )}
        </div>
        <div className="time-box-span">
          <span>~</span>
        </div>
        <div className="date-area">
          <div
            // onClick={(e: React.MouseEvent) => dateClickHandler(e, "end")}
            ref={(el: HTMLDivElement) => (dateRef.current[1] = el)}
          >
            <span onClick={endDateOpenHandler}>
              {마지막날[0] + "년 " + 마지막날[1] + "월 " + 마지막날[2] + "일"}
            </span>
          </div>
          {lastDateIsVisible && (
            <div className="second-calender">
              {/* <Month
                type={"end"}
                year={마지막날[0]}
                month={마지막날[1]}
                dateRef={dateRef}
                dateClose={endDateOpenHandler}
              /> */}
            </div>
          )}
        </div>
        <div className="time-two">
          <input
            type="text"
            placeholder={timeState.lastTime || lastTime}
            // ref={timeTwoRef}
          />
          {timeState.lastIsVisible && (
            <TimeBoxTwo
              timeTwoRef={timeTwoRef}
              TwoRef={TwoRef}
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
