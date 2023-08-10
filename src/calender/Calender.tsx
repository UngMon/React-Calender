import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Main from "./Main";
import Header from "./Header";
import NotLogin from "../error/NotLogin";
import Loading from "../pages/Loading";
import "./Calender.css";

interface T {
  loading: boolean;
  loggedIn: boolean;
}

const Calender = ({ loading, loggedIn }: T) => {
  console.log("month");

  const navigate = useNavigate();
  const [param] = useSearchParams();

  useEffect(() => {
    if (!delayRef.current.delay) return;

    let y = param.get("year")!;
    let m = param.get("month")!;

    if (+y > 9999) y = "9999";
    if (+y < 1000) y = "1000";
    if (+m > 12) m = "12";
    if (+m < 1) m = "1";

    setYear(y);
    setMonth(m);
    navigate(`/calender/date?year=${y}&month=${m}`);
  }, [param, navigate]);

  const [year, setYear] = useState<string>(param.get("year")!);
  const [month, setMonth] = useState<string>(param.get("month")!);

  const delayRef = useRef({ delay: true });
  const viewRef = useRef<HTMLDivElement>(null);

  const firstDay: number = new Date(+year, +month - 1, 1).getDay();
  const lastDate: number = new Date(+year, +month, 0).getDate();

  const movePrevMonth = () => {
    let mon = month;
    switch (+month) {
      case 1:
        mon = "12";
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
    switch (+month) {
      case 12:
        mon = "01";
        setYear(String(+year + 1));
        break;
      default:
        mon = String(+month + 1).padStart(2, "0");
    }
    navigate(`/calender/date?year=${year}&month=${+mon}`);
    setMonth(mon);
    setTimeout(() => {
      delayRef.current.delay = true;
    }, 350);
  };

  const wheelHandler = (e: React.WheelEvent) => {
    delayRef.current.delay = false;

    switch (e.deltaY > 0) {
      case true:
        movePrevMonth();
        break;
      default:
        moveNextMonth();
    }
  };

  return (
    <div
      className="view-area"
      onWheel={(e) => delayRef.current.delay && wheelHandler(e)}
      ref={viewRef}
    >
      {loading && <Loading />}
      {!loading && !loggedIn && <NotLogin />}
      {!loading && loggedIn && (
        <>
          <Header
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
        </>
      )}
    </div>
  );
};

export default Calender;