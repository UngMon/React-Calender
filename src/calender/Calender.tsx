import React, { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ListOrMore } from "../type/RefType";
import Main from "./Main";
import Header from "./header/Header";
import NotLogin from "../error/NotLogin";
import Loading from "../pages/Loading";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../redux/store";
import { dateActions } from "../redux/date-slice";

interface T {
  loading: boolean;
  loggedIn: boolean;
}

const Calender = ({ loading, loggedIn }: T) => {
  console.log("Calender");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [param] = useSearchParams();

  useEffect(() => {
    if (!delayRef.current.delay) return;

    let y = param.get("year")!;
    let m = param.get("month")!;

    if (+y > 9999) y = "9999";
    if (+y < 1000) y = "1000";
    if (+m > 12) m = "12";
    if (+m < 1) m = "01";
    console.log('caledner effect')
    dispatch(dateActions.setDate({ y, m }));
    navigate(`/calender/date?year=${y}&month=${m}`);
  }, [dispatch, param, navigate]);


  const date = useSelector((state: RootState) => state.date);

  const delayRef = useRef({ delay: true });

  const listRef = useRef<ListOrMore>({}); // makeCalender에서 list ref
  const allListRef = useRef<ListOrMore>({}); // makeCalender에서 all ref
  const clickedElement = useRef<HTMLDivElement | null>(null);
  const list = useRef<HTMLDivElement>(null); // list모달창 ref

  const movePrevMonth = () => {
    let year = date.year;
    let mon = date.month;

    switch (date.month) {
      case "1":
        mon = "12";
        year = String(+date.year - 1);
        break;
      default:
        mon = String(+date.month - 1).padStart(2, "0");
    }

    dispatch(dateActions.prevMonth());
    navigate(`/calender/date?year=${year}&month=${mon}`);
    delayRef.current.delay = false;
    setTimeout(() => {
      delayRef.current.delay = true;
    }, 350);
  };

  const moveNextMonth = () => {
    let year = date.year;
    let mon = date.month;

    switch (date.month) {
      case "12":
        mon = "01";
        year = String(+date.year + 1);
        break;
      default:
        mon = String(+date.month + 1).padStart(2, "0");
    }

    dispatch(dateActions.nextMonth());
    navigate(`/calender/date?year=${year}&month=${mon}`);
    delayRef.current.delay = false;
    setTimeout(() => {
      delayRef.current.delay = true;
    }, 350);
  };

  const wheelHandler = (e: React.WheelEvent) => {
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
      onWheel={(e) => delayRef.current.delay && wheelHandler(e)}
      style={{ width: "100%", height: "100%" }}
    >
      {loading && <Loading />}
      {!loading && !loggedIn && <NotLogin />}
      {!loading && loggedIn && (
        <>
          <Header
            type="calender"
            year={date.year}
            month={date.month}
            movePrevMonth={movePrevMonth}
            moveNextMonth={moveNextMonth}
          />
          <Main
            year={date.year}
            month={date.month}
            list={list}
            listRef={listRef}
            allListRef={allListRef}
            clickedElement={clickedElement}
          />
        </>
      )}
    </div>
  );
};

export default Calender;
