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
  const OneRef = useRef([]);
  const TwoRef = useRef([]);
  console.log(dateRef);
  const timeOneVisible = timeState.firstIsVisible;
  const timeTwoVisible = timeState.lastIsVisible;

  const startDateOpenHandler = useCallback(() => {
    setFirstDateIsVisible((prevState) => !prevState);
    setLastDateIsVisible(false);
  }, []);

  const endDateOpenHandler = useCallback(() => {
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
    console.log(e.target);
    console.log(dateRef.current);
    let boolean = true;
    for (let i = 0; i < dateRef.current.length; i++) {
      console.log(dateRef.current[i])
      if (dateRef.current[i].contanis(e.target)) {
        boolean = false;
      } else {
        boolean = true;
      }
    }

    if (!boolean) {
      setFirstDateIsVisible(false);
      setLastDateIsVisible(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", datePickerCloseHandler);
    console.log("작동");
    return () => {
      document.removeEventListener("mousedown", datePickerCloseHandler);
    };
  });

  return (
    <div className="time-date-box">
      <div className="time-area">
        <div className="time-area-name">
          <div onClick={startDateOpenHandler}>
            {comparison !== 1 && 시작날[1] + "월 " + 시작날[2] + "일"}
            {comparison === 1 &&
              시작날[0] + "년" + 시작날[1] + "월" + 시작날[2] + "일"}
          </div>
        </div>
        <div className="time-one">
          <input
            type="text"
            placeholder={timeState.firstTime || firstTime}
            onClick={firstTimeSelectorHandler}
            ref={timeOneRef}
          />
          <TimeBox
            timeOneRef={timeOneRef}
            OneRef={OneRef}
            timeVisible={timeOneVisible}
          />
        </div>
        <div className="time-area-span">
          <span>~</span>
        </div>
        <div className="time-area-name">
          <div onClick={endDateOpenHandler}>
            {comparison !== 1 && 마지막날[1] + "월 " + 마지막날[2] + "일"}
            {comparison === 1 &&
              마지막날[0] + "년" + 마지막날[1] + "월" + 마지막날[2] + "일"}
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
            />
          )}
        </div>
      </div>
      <div className="date-area">
        <div className="start_date">
          {fristDateIsVisible && (
            <Month
              type={true}
              year={시작날[0]}
              month={시작날[1]}
              dateRef={dateRef}
            />
          )}
        </div>
        <div className="end_date">
          {lastDateIsVisible && (
            <Month
              type={false}
              year={마지막날[0]}
              month={마지막날[1]}
              dateRef={dateRef}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeSelector;
