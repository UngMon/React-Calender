import React, { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../redux/store";
import { dateActions } from "../redux/date-slice";
import { modalActions } from "../redux/modal-slice";
import { getNationalDay } from "../redux/fetch-action";
import { ListOrMore } from "../type/RefType";
import Main from "./main/Main";
import Header from "./header/Header";
import NotLogin from "../error/NotLogin";
import Loading from "../ui/Loading";

interface T {
  loading: boolean;
  loggedIn: boolean;
}

let isMount = true;

const Calender = ({ loading, loggedIn }: T) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [param] = useSearchParams();

  const delayRef = useRef({ delay: true });

  console.log("Content");
  useEffect(() => {
    let y = param.get("year")!;
    let m = param.get("month")!;

    // 숫자를 제외한 모든 문자
    const pattern = /[^0-9]/g;

    // 사용자가 의도적으로 수를 제외한 문자열을 입력할 경우 수정
    if (isMount) {
      if (y.match(pattern)) y = y.replace(/\D/g, "");
      if (m.match(pattern)) m = m.replace(/\D/g, "");
      navigate(`/calender/date?year=${y}&month=${m}`);
    }

    if (!isMount) {
      if (+y > 9999) y = "9999";
      if (+y < 1000) y = "1000";
      if (+m > 12) {
        y = String(+y + 1);
        m = "01";
      }
      if (+m < 1) {
        y = String(+y - 1);
        m = "12";
      }
      navigate(`/calender/date?year=${y}&month=${m}`);
      isMount = false;
    }

    dispatch(getNationalDay(y));
    dispatch(dateActions.setDate({ y, m }));
  }, [dispatch, param, navigate]);

  const date = useSelector((state: RootState) => state.date);

  const listRef = useRef<ListOrMore>({}); // makeCalender에서 list ref
  const allListRef = useRef<ListOrMore>({}); // makeCalender에서 all ref
  const clickedElement = useRef<HTMLDivElement | null>(null);
  const list = useRef<HTMLDivElement>(null); // list모달창 ref

  const movePrevMonth = () => {
    let year = date.year;
    let mon = date.month;

    switch (+date.month) {
      case 1:
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
    dispatch(modalActions.clearSet());
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
      style={{ width: "100%" }}
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
