import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { auth } from "../Auth/firebase";
import Main from "./Main";
import Header from "./Header";
import "./Calender.css";

const Calender = () => {
  console.log("month");

  const navigate = useNavigate();
  const [param] = useSearchParams();

  const [year, setYear] = useState<string>(param.get("year")!);
  const [month, setMonth] = useState<string>(param.get("month")!);

  const delayRef = useRef({ delay: true });
  const viewRef = useRef<HTMLDivElement>(null);

  const firstDay: number = new Date(+year, +month, 1).getDay();
  const lastDate: number = new Date(+year, +month + 1, 0).getDate();

  const movePrevMonth = () => {
    let mon = month;
    switch (month) {
      case "1":
        mon = '12';
        setYear(String(+year - 1));
        break;
      default:
        mon = String(+month - 1).padStart(2, "0");
    }
    navigate(`/calender/date?year=${year}&month=${+mon}`);
    setMonth(mon);
    setTimeout(() => {
      delayRef.current.delay = true;
    }, 350);
  };

  const moveNextMonth = () => {
    let mon = month;
    switch (month) {
      case "12":
        mon = '01';
        setYear(String(+year + 1));
        break;
      default:
        mon = String(+month + 1).padStart(2, '0');
    }
    navigate(`/calender/date?year=${year}&month=${+mon}`);
    setMonth(mon);
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
