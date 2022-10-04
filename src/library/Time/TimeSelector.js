import TimeBox from "./TimeBox";
import TimeBoxTwo from "./TimeBoxTwo";
import { useDispatch, useSelector } from "react-redux";
import { timeActions } from "../../store/time-slice";
import { useRef } from "react";

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
  const timeRef = useRef([]);
  const timeOneVisible = timeState.firstIsVisible;
  const timeTwoVisible = timeState.lastIsVisible;

  const firstTimeSelectorHandler = () => {
    dispatch(timeActions.firstTimetoggle());
  };

  const lastTimeSelectorHandler = () => {
    dispatch(timeActions.lastTimetoggle());
  };

  return (
    <div className="time-area">
      <div className="time-area-name">
        <h4>{month + "월 " + date + "일"}</h4>
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
          timeRef={timeRef}
          timeVisible={timeOneVisible}
        />
      </div>
      <div className="time-area-span">
        <span>~</span>
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
            timeRef={timeRef}
            timeVisible={timeTwoVisible}
          />
        )}
      </div>
    </div>
  );
};

export default TimeSelector;
