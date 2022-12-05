import TimeBox from "./TimeBox";
import TimeBoxTwo from "./TimeBoxTwo";
import Month from "../secondcalender/Secon-Month";
import { useDispatch, useSelector } from "react-redux";
import { timeActions } from "../../store/time-slice";
import { useRef, useState, useEffect, useCallback } from "react";
import "./TimeSelector.css";

const TimeSelector = ({
  startDate,
  endDate,
  firstTime,
  lastTime,
  timeOneRef,
  timeTwoRef,
  comparison,
}) => {
  const dispatch = useDispatch();
  const timeState = useSelector((state) => state.time);

  const 시작날 = startDate.split(".");
  const 마지막날 = endDate.split(".");

  const [fristDateIsVisible, setFirstDateIsVisible] = useState(false);
  const [lastDateIsVisible, setLastDateIsVisible] = useState(false);

  const dateRef = useRef([]);
  const timeRef = useRef([]);
  const OneRef = useRef([]);
  const TwoRef = useRef([]);

  const timeOneVisible = timeState.firstIsVisible;
  const timeTwoVisible = timeState.lastIsVisible;

  const startDateOpenHandler = useCallback(() => {
    // console.log("??");
    setFirstDateIsVisible((prevState) => !prevState);
    setLastDateIsVisible(false);
  }, []);

  const endDateOpenHandler = useCallback(() => {
    // console.log("??");
    setFirstDateIsVisible(false);
    setLastDateIsVisible((prevState) => !prevState);
  }, []);

  const firstTimeSelectorHandler = () => {
    dispatch(timeActions.firstTimetoggle());
  };

  const lastTimeSelectorHandler = () => {
    dispatch(timeActions.lastTimetoggle());
  };

  const datePickerCloseHandler = useCallback((e) => {
    // console.log(e.target);
    // console.log(dateRef.current);
    let boolean = true;
    for (let i = 0; i < dateRef.current.length; i++) {
      // 5주와 6주 사이를 왔다갔다하면 ref의 마지막 인덱스가 null이 생성되어있음.
      if (dateRef.current[i] === null) {
        break; //반복문 탈출
      }
      // console.log(dateRef.current[i]);
      if (!dateRef.current[i].contains(e.target)) {
        console.log("포함 x");
        boolean = false;
      } else {
        console.log("포함 o");
        boolean = true;
        break;
      }
    }

    if (!boolean) {
      console.log("작동?");
      setTimeout(() => {
        setFirstDateIsVisible(false);
        setLastDateIsVisible(false);
      }, 100);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", datePickerCloseHandler);
    console.log("작동");
    return () => {
      document.removeEventListener("mousedown", datePickerCloseHandler);
    };
  });

  const timePickerCloseHandler = (e) => {
    let boolean = true;
    console.log(timeRef.current);
    for (let i = 0; i < timeRef.current.length; i++) {
      if (timeRef.current[i] === null) {
        continue;
      }

      if (!timeRef.current[i].contains(e.target)) {
        boolean = false;
      } else {
        boolean = true;
        break;
      }
    }

    if (!boolean) {
      setTimeout(() => {
        dispatch(timeActions.timeToggle());
      }, 100);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", timePickerCloseHandler);
    return () => {
      document.removeEventListener("mousedown", timePickerCloseHandler);
    };
  });

  return (
    <div className="time-date-box">
      <div className="time-area">
        <img
          src="img/clock.png"
          alt="clock"
          width="19"
          className="clock-icon"
        />
        <div className="time-area-date">
          {comparison !== 1 && (
            <span onClick={startDateOpenHandler}>
              {시작날[1] + "월 " + 시작날[2] + "일"}
            </span>
          )}
          {comparison === 1 && (
            <span onClick={startDateOpenHandler}>
              {시작날[0] + "년" + 시작날[1] + "월" + 시작날[2] + "일"}
            </span>
          )}
          <div className="date-area">
            {fristDateIsVisible && (
              <Month
                type={true}
                year={시작날[0]}
                month={시작날[1]}
                dateRef={dateRef}
                dateClose={startDateOpenHandler}
              />
            )}
          </div>
        </div>
        <div className="time-one">
          <input
            type="text"
            placeholder={timeState.firstTime || firstTime}
            onClick={firstTimeSelectorHandler}
            ref={timeOneRef}
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
        <div className="time-area-span">
          <span>~</span>
        </div>
        <div className="time-area-date">
          {comparison !== 1 && (
            <span onClick={endDateOpenHandler}>
              {마지막날[1] + "월 " + 마지막날[2] + "일"}
            </span>
          )}
          {comparison === 1 && (
            <span onClick={endDateOpenHandler}>
              {마지막날[0] + "년" + 마지막날[1] + "월" + 마지막날[2] + "일"}
            </span>
          )}
          <div className="date-area">
            {lastDateIsVisible && (
              <Month
                type={false}
                year={마지막날[0]}
                month={마지막날[1]}
                dateRef={dateRef}
                dateClose={endDateOpenHandler}
              />
            )}
          </div>
        </div>
        <div className="time-two">
          <input
            type="text"
            placeholder={timeState.lastTime || lastTime}
            onClick={lastTimeSelectorHandler}
            ref={timeTwoRef}
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
