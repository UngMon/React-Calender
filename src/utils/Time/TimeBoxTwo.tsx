import React, { useEffect } from "react";
import { timeActions } from "../../redux/time-slice";
import { ListOrMore } from "../../type/RefType";
import { useAppDispatch } from "../../redux/store";

interface T {
  timeInputTwoRef: React.RefObject<HTMLInputElement>;
  twoRef: React.MutableRefObject<ListOrMore>;
  timeVisible: boolean;
  timeRef: React.MutableRefObject<ListOrMore>;
}

const timeArray = [
  "오전 00:30",
  "오전 01:00",
  "오전 01:30",
  "오전 02:00",
  "오전 02:30",
  "오전 03:00",
  "오전 03:30",
  "오전 04:00",
  "오전 04:30",
  "오전 05:00",
  "오전 05:30",
  "오전 06:00",
  "오전 06:30",
  "오전 07:00",
  "오전 07:30",
  "오전 08:00",
  "오전 08:30",
  "오전 09:00",
  "오전 09:30",
  "오전 10:00",
  "오전 10:30",
  "오전 11:00",
  "오전 11:30",
  "오후 00:00",
  "오후 00:30",
  "오후 01:00",
  "오후 01:30",
  "오후 02:00",
  "오후 02:30",
  "오후 03:00",
  "오후 03:30",
  "오후 04:00",
  "오후 04:30",
  "오후 05:00",
  "오후 05:30",
  "오후 06:00",
  "오후 06:30",
  "오후 07:00",
  "오후 07:30",
  "오후 08:00",
  "오후 08:30",
  "오후 09:00",
  "오후 09:15",
  "오후 09:30",
  "오후 09:45",
  "오후 10:00",
  "오후 10:15",
  "오후 10:30",
  "오후 10:45",
  "오후 11:00",
  "오후 11:30",
  "오후 11:45",
];

const TimeBoxTwo = ({ timeInputTwoRef, twoRef, timeVisible, timeRef }: T) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    Object.keys(twoRef.current).forEach((item, index) => {
      let value: string =
        timeInputTwoRef.current!.value || timeInputTwoRef.current!.placeholder;
      twoRef.current[index]!.innerText === value &&
        twoRef.current[index]!.scrollIntoView();
    });
  });

  const clickHandler = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    timeInputTwoRef.current!.value = target.innerText;
    dispatch(timeActions.selectLastTime(target.innerText));
  };

  return (
    <div className={`time-selec-container ${timeVisible && "t-open"}`}>
      <div
        id="time-selector"
        ref={(el) => (timeRef.current[1] = el)}
        style={{ display: timeVisible ? "block" : "none" }}
      >
        {timeArray.map((item, index) => (
          <div
            key={index}
            ref={(el) => (twoRef.current[index] = el)}
            onClick={(e: React.MouseEvent) => clickHandler(e)}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeBoxTwo;
