import TimeBox from "./TimeBox";
import TimeBoxTwo from "./TimeBoxTwo";
import Month from "../secondcalender/Secon-Month";
import { useDispatch, useSelector } from "react-redux";
import { timeActions } from "../../store/time-slice";
import { useRef, useState } from "react";

const TimeSelector = ({
  month,
  date,
  firstTime,
  lastTime,
  timeOneRef,
  timeTwoRef,
}) => {
  const dispatch = useDispatch();
  const timeState = useSelector((state) => state.time);

  const [fristDateIsVisible, setFirstDateIsVisible] = useState(false);
  const [lastDateIsVisible, setLastDateIsVisible] = useState(false);

  const OneRef = useRef([]);
  // const TwoRef = useRef([]);

  const timeOneVisible = timeState.firstIsVisible;
  const timeTwoVisible = timeState.lastIsVisible;

  const firstDateHanlder = () => {
    setFirstDateIsVisible((prevState) => !prevState);
  };

  const lastDateHandler = () => {
    setLastDateIsVisible((prevState) => !prevState);
  };

  const firstTimeSelectorHandler = () => {
    dispatch(timeActions.firstTimetoggle());
  };

  const lastTimeSelectorHandler = () => {
    dispatch(timeActions.lastTimetoggle());
  };

  return (
    <div className="time-date-box">
      <div className="time-area">
        <div className="time-area-name">
          <h4 onClick={firstDateHanlder}>{month + "월 " + date + "일"}</h4>
        </div>
        <div className="time-one">
          <input
            type="text"
            placeholder={timeState.firstTime || firstTime}
            onClick={() => {
              firstTimeSelectorHandler();
            }}
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
          <h4 onClick={lastDateHandler}>{month + "월 " + date + "일"}</h4>
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
              TwoRef={OneRef}
              timeVisible={timeTwoVisible}
            />
          )}
        </div>
      </div>
        {fristDateIsVisible && <Month />}
        {lastDateIsVisible && <Month />}
    </div>
  );
};

export default TimeSelector;
