import React, { useEffect } from "react";
import { timeActions } from "../../redux/time-slice";
import { ListOrMore } from "../../type/RefType";
import { useAppDispatch } from "../../redux/store";

interface T {
  oneRef: React.MutableRefObject<ListOrMore>;
  timeRef: React.MutableRefObject<ListOrMore>;
  timeInputOneRef: React.RefObject<HTMLInputElement>;
  timeVisible: boolean;
}

const timeArray = [
  "오전 00:15",
  "오전 00:30",
  "오전 00:45",
  "오전 01:00",
  "오전 01:15",
  "오전 01:30",
  "오전 01:45",
  "오전 02:00",
  "오전 02:15",
  "오전 02:30",
  "오전 02:45",
  "오전 03:00",
  "오전 03:15",
  "오전 03:30",
  "오전 03:45",
  "오전 04:00",
  "오전 04:15",
  "오전 04:30",
  "오전 04:45",
  "오전 05:00",
  "오전 05:15",
  "오전 05:30",
  "오전 05:45",
  "오전 06:00",
  "오전 06:15",
  "오전 06:30",
  "오전 06:45",
  "오전 07:00",
  "오전 07:15",
  "오전 07:30",
  "오전 07:45",
  "오전 08:00",
  "오전 08:15",
  "오전 08:30",
  "오전 08:45",
  "오전 09:00",
  "오전 09:15",
  "오전 09:30",
  "오전 09:45",
  "오전 10:00",
  "오전 10:15",
  "오전 10:30",
  "오전 10:45",
  "오전 11:00",
  "오전 11:15",
  "오전 11:30",
  "오전 11:45",
  "오후 00:00",
  "오후 00:15",
  "오후 00:30",
  "오후 00:45",
  "오후 01:00",
  "오후 01:15",
  "오후 01:30",
  "오후 01:45",
  "오후 02:00",
  "오후 02:15",
  "오후 02:30",
  "오후 02:45",
  "오후 03:00",
  "오후 03:15",
  "오후 03:30",
  "오후 03:45",
  "오후 04:00",
  "오후 04:15",
  "오후 04:30",
  "오후 04:45",
  "오후 05:00",
  "오후 05:15",
  "오후 05:30",
  "오후 05:45",
  "오후 06:00",
  "오후 06:15",
  "오후 06:30",
  "오후 06:45",
  "오후 07:00",
  "오후 07:15",
  "오후 07:30",
  "오후 07:45",
  "오후 08:00",
  "오후 08:15",
  "오후 08:30",
  "오후 08:45",
  "오후 09:00",
  "오후 09:15",
  "오후 09:30",
  "오후 09:45",
  "오후 10:00",
  "오후 10:15",
  "오후 10:30",
  "오후 10:45",
  "오후 11:00",
  "오후 11:15",
  "오후 11:30",
  "오후 11:45",
];

const TimeBox = ({ timeInputOneRef, oneRef, timeVisible, timeRef }: T) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    Object.keys(oneRef.current).forEach((item, index) => {
      let value: string =
        timeInputOneRef.current!.value || timeInputOneRef.current!.placeholder;
      oneRef.current[index]!.innerText === value &&
        oneRef.current[index]!.scrollIntoView();
    });
  });

  const clickHandler = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    timeInputOneRef.current!.value = target.innerText;
    dispatch(timeActions.selectFristTime(target.innerText));
  };

  return (
    <div className={`time-selec-container ${timeVisible && "t-open"}`}>
      <div
        id="time-selector"
        ref={(el) => (timeRef.current[0] = el)}
        style={{ display: timeVisible ? "block" : "none" }}
      >
        {timeArray.map((item, index) => (
          <div
            key={index}
            ref={(el) => (oneRef.current[index] = el)}
            onClick={(e: React.MouseEvent) => clickHandler(e)}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeBox;
