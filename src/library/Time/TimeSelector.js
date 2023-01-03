import TimeBox from "./TimeBox";
import TimeBoxTwo from "./TimeBoxTwo";
import Month from "../secondcalender/Secon-Month";
import { useDispatch, useSelector } from "react-redux";
import { timeActions } from "../../store/time-slice";
import { useRef, useState, useEffect } from "react";
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

  const 시작날 = startDate.split("-");
  const 마지막날 = endDate.split("-");

  const [fristDateIsVisible, setFirstDateIsVisible] = useState(false);
  const [lastDateIsVisible, setLastDateIsVisible] = useState(false);

  const dateRef = useRef([]);
  const timeRef = useRef([]);
  const OneRef = useRef([]);
  const TwoRef = useRef([]);

  const timeOneVisible = timeState.firstIsVisible;
  const timeTwoVisible = timeState.lastIsVisible;

  const startDateOpenHandler = () => {
    setFirstDateIsVisible((prevState) => !prevState);
  };

  const endDateOpenHandler = () => {
    setLastDateIsVisible((prevState) => !prevState);
  };

  const datePickerCloseHandler = (e) => {
    let boolean = true;

    for (let i = 0; i < dateRef.current.length; i++) {
      // 5주와 6주 사이를 왔다갔다하면 ref의 마지막 인덱스가 null이 생성되어있음.
      if (dateRef.current[i] === null) {
        break; //반복문 탈출
      }

      if (!dateRef.current[i].contains(e.target)) {
        boolean = false;
      } else {
        boolean = true; // i가 0,1은 'time-area-date'클래스를 클릭한 경우임
        if (i === 0) {
          if (fristDateIsVisible) {
            // 첫 번째
            setTimeout(() => {
              setFirstDateIsVisible(false);
            }, 100);
          }
          if (lastDateIsVisible) {
            setTimeout(() => {
              setFirstDateIsVisible(true);
            }, 100);
            setLastDateIsVisible(false);
          }
          return;
        }
        if (i === 1) {
          if (fristDateIsVisible) {
            setFirstDateIsVisible(false);
            setTimeout(() => {
              setLastDateIsVisible(true);
            }, 100);
          }
          if (lastDateIsVisible) {
            setTimeout(() => {
              setLastDateIsVisible(false);
            }, 100);
          }
          return;
        }
        break;
      }
    }

    if (!boolean) {
      // console.log("작동?");
      setTimeout(() => {
        setFirstDateIsVisible(false);
        setLastDateIsVisible(false);
      }, 100);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", datePickerCloseHandler);
    return () => {
      document.removeEventListener("mousedown", datePickerCloseHandler);
    };
  });

  const timePickerCloseHandler = (e) => {
    let boolean = true;

    if (timeOneRef.current.contains(e.target)) {
      console.log('timeOnRef')
      dispatch(timeActions.firstTimetoggle());
      if (timeTwoVisible) {
        dispatch(timeActions.lastTimetoggle());
      }
      return;
    }

    if (timeTwoRef.current.contains(e.target)) {
      console.log('timetwoRef')
      dispatch(timeActions.lastTimetoggle());
      if (timeOneVisible) {
        dispatch(timeActions.firstTimetoggle());
      }
      return;
    }

    for (let i = 0; i < timeRef.current.length; i++) {
      console.log(timeRef.current);
      if (timeRef.current[i] === null || timeRef.current[i] === undefined) {
        continue;
      }

      if (!timeRef.current[i].contains(e.target)) {
        boolean = false;
        console.log("false");
      } else {
        boolean = true;
        console.log("true");
        break;
      }
    }

    if (!boolean) {
      console.log('!boolean')
      setTimeout(() => {
        dispatch(timeActions.timeToggle());
      }, 120);
    }
  };

  useEffect(() => {
    console.log('timeEffect')
    document.addEventListener("mousedown", timePickerCloseHandler);
    return () => {
      document.removeEventListener("mousedown", timePickerCloseHandler);
    };
  });

  return (
    <div className="time-date-box">
      <img src="img/clock.png" alt="clock" width="19" className="clock-icon" />
      <div className="time-area-date">
        <div ref={(el) => (dateRef.current[0] = el)}>
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
        </div>
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
        <div ref={(el) => (dateRef.current[1] = el)}>
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
        </div>
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
  );
};

export default TimeSelector;
