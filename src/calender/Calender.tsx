import React, { useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { auth } from "../Auth/firebase";
import Main from "./Main";
import Header from "./Header";
import "./Calender.css";

const Calender = () => {
  console.log("month");
  const { dateParams } = useSearchParams();

  const [year, setYear] = useState<string>(`${dateParams.year}`);
  const [month, setMonth] = useState<string>(`${dateParams.month}`);

  const delayRef = useRef({ delay: true });
  const viewRef = useRef<HTMLDivElement>(null);

  const firstDay = new Date(+year, +month, 1).getDay();
  const lastDate = new Date(+year, +month + 1, 0).getDate();

  const movePrevMonth = () => {
    switch (month) {
      case "1":
        setMonth("12");
        setYear(String(+year - 1));
        break;
      default:
        setMonth(String(+month - 1).padStart(2, "0"));
    }
    setTimeout(() => {
      delayRef.current.delay = true;
    }, 350);
  };

  const moveNextMonth = () => {
    switch (month) {
      case "12":
        setMonth("1");
        setYear(String(+year + 1));
        break;
      default:
        setMonth(String(+month + 1).padStart(2, "0"));
    }
    setTimeout(() => {
      delayRef.current.delay = true;
    }, 350);
  };

  const wheelHandler = (e: React.WheelEvent) => {
    delayRef.current.delay = false;
    if (e.deltaY > 0) {
      movePrevMonth();
    }
    if (e.deltaY < 0) {
      moveNextMonth();
    }
  };

  return (
    <div
      className="view-area"
      onWheel={(e) => delayRef.current.delay && wheelHandler(e)}
      ref={viewRef}
    >
      <Header
        auth={auth}
        year={year}
        month={month}
        movePrevMonth={movePrevMonth}
        moveNextMonth={moveNextMonth}
      />
      <Main
        year={year}
        month={month}
        firstDay={firstDay}
        lastDate={lastDate}
        viewRef={viewRef}
      />
    </div>
  );
};

export default Calender;
