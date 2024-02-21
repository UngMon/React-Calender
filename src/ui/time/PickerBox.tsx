import React, { useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { useAppDispatch } from "../../redux/store";
import { dateActions } from "../../redux/date-slice";
import SecondCaleder from "../miniCalender/Secon-Month";
import TimeBoxOne from "./TimeBoxOne";
import TimeBoxTwo from "./TimeBoxTwo";
import MobileTimePicker from "./MobileTimePicker";
import "./PickerBox.css";

interface T {
  platform: string;
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
  platform,
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
  const dispatch = useAppDispatch();

  const dateRef = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const timeRef = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const oneRef = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const twoRef = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const openDateHandler = (type: string, pickDate: string) => {
    if (openDate[1] === type) setOpenDate([false, ""]);
    if (openDate[1] !== type) setOpenDate([true, type]);
    setOpenTime([false, ""]);
    dispatch(
      dateActions.setDate({
        year: pickDate.split("-")[0],
        month: pickDate.split("-")[1],
      })
    );
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
      <div className="picker-box">
        <div className="picker-icon">
          <FontAwesomeIcon
            icon={faClock}
            width="20"
            style={{ display: window.innerWidth > 500 ? "block" : "none" }}
          />
        </div>
        <div className="picker-one">
          <div
            className={`date-picker ${
              openDate[1] === "start" ? "date-on" : ""
            }`}
            ref={(el: HTMLDivElement) => (dateRef.current[0] = el)}
            onClick={() => openDateHandler("start", startDate)}
          >
            <span>{startDate}</span>
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
        <div className="span-wave">~</div>
        <div className="picker-one">
          <div
            className={`date-picker ${openDate[1] === "end" ? "date-on" : ""}`}
            ref={(el: HTMLDivElement) => (dateRef.current[1] = el)}
            onClick={() => openDateHandler("end", endDate)}
          >
            <span>{endDate}</span>
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
          <SecondCaleder
            platform={platform}
            type={openDate[1]}
            dateRef={dateRef}
          />
        )}
        {window.innerWidth > 500 && openTime[0] && openTime[1] === "start" && (
          <TimeBoxOne
            oneRef={oneRef}
            timeRef={timeRef}
            timeInputOneRef={timeInputOneRef}
          />
        )}
        {window.innerWidth > 500 && openTime[0] && openTime[1] === "end" && (
          <TimeBoxTwo
            twoRef={twoRef}
            timeRef={timeRef}
            timeInputTwoRef={timeInputTwoRef}
          />
        )}
        {window.innerWidth <= 500 && openTime[0] && (
          <MobileTimePicker
            type={openTime[1]}
            startTime={time[0]}
            endTime={time[1]}
            timeInputOneRef={timeInputOneRef}
            timeInputTwoRef={timeInputTwoRef}
          />
        )}
      </div>
    </div>
  );
};

export default PickerBox;
