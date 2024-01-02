import React, { useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ListOrMore } from "../../type/RefType";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import SecondCaleder from "../miniCalender/Secon-Month";
import TimeBoxOne from "./TimeBoxOne";
import TimeBoxTwo from "./TimeBoxTwo";
import "./PickerBox.css";

interface T {
  startDate: string;
  endDate: string;
  openDate: [boolean, string];
  setOpenDate: React.Dispatch<React.SetStateAction<[boolean, string]>>;
  time: [string, string];
  openTime: [boolean, string];
  setOpenTime: React.Dispatch<React.SetStateAction<[boolean, string]>>;
  timeInputOneRef: React.RefObject<HTMLInputElement>;
  timeInputTwoRef: React.RefObject<HTMLInputElement>;
}

const PickerBox = ({
  startDate,
  endDate,
  openDate,
  setOpenDate,
  time,
  openTime,
  setOpenTime,
  timeInputOneRef,
  timeInputTwoRef,
}: T) => {
  const dateRef = useRef<ListOrMore>({});
  const timeRef = useRef<ListOrMore>({});
  const oneRef = useRef<ListOrMore>({});
  const twoRef = useRef<ListOrMore>({});
  // console.log(startDate)
  // console.log(endDate)
  // console.log(time)
  // console.log(openDate, openTime)

  const openDateHandler = (type: string) => {
    if (openDate[1] === type) setOpenDate([false, ""]);
    if (openDate[1] !== type) setOpenDate([true, type]);
    setOpenTime([false, ""]);
  };

  const openTimeHandler = (type: string) => {
    if (openTime[1] === type) setOpenTime([false, ""]);
    if (openTime[1] !== type) setOpenTime([true, type]);
    setOpenDate([false, ""]);
  };

  useEffect(() => {
    if (!openDate[0] && !openTime[0]) return;

    const timePickerHandler = (e: MouseEvent) => {
      const target = e.target as Node;

      for (let i in dateRef.current) {
        if (dateRef.current[i]?.contains(target)) return;
      }

      for (let i in timeRef.current) {
        if (timeRef.current[i]?.contains(target)) {
          setOpenTime([false, ""]);
          return;
        }
      }

      if (timeInputOneRef.current?.contains(target)) return;

      if (timeInputTwoRef.current?.contains(target)) return;

      setOpenDate([false, ""]);
      setOpenTime([false, ""]);
    };

    window.addEventListener("click", timePickerHandler);

    return () => window.removeEventListener("click", timePickerHandler);
  });

  return (
    <div className="pick-container">
      <FontAwesomeIcon
        icon={faClock}
        width="20"
        style={{ display: window.innerWidth > 500 ? "block" : "none" }}
      />
      <div className="picker-box">
        <div className="picker-one">
          <div className="date-picker">
            <div
              className={openDate[1] === "start" ? "date-on" : ""}
              ref={(el: HTMLDivElement) => (dateRef.current[0] = el)}
              onClick={() => openDateHandler("start")}
            >
              <span>{startDate}</span>
            </div>
          </div>
          <div className="time-picker">
            <input
              type="text"
              placeholder={time[0]}
              ref={timeInputOneRef}
              onClick={() => openTimeHandler("start")}
            />
          </div>
        </div>
        <div className="span-wave">
          <span>~</span>
        </div>
        <div className="picker-one">
          <div className="date-picker">
            <div
              className={openDate[1] === "end" ? "date-on" : ""}
              ref={(el: HTMLDivElement) => (dateRef.current[1] = el)}
              onClick={() => openDateHandler("end")}
            >
              <span>{endDate}</span>
            </div>
          </div>
          <div className="time-picker">
            <input
              type="text"
              placeholder={time[1]}
              ref={timeInputTwoRef}
              onClick={() => openTimeHandler("end")}
            />
          </div>
        </div>
      </div>
      <div className="picker-two">
        {openDate[0] && (
          <SecondCaleder platform="pc" type={openDate[1]} dateRef={dateRef} />
        )}
        <TimeBoxOne
          oneRef={oneRef}
          timeRef={timeRef}
          timeInputOneRef={timeInputOneRef}
          openTime={openTime[1]}
        />
        <TimeBoxTwo
          twoRef={twoRef}
          timeRef={timeRef}
          timeInputTwoRef={timeInputTwoRef}
          openTime={openTime[1]}
        />
      </div>
    </div>
  );
};

export default PickerBox;
