import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch } from "../redux/store";
import { modalActions } from "../redux/modal-slice";
import { getNationalDay } from "../redux/fetch-action";
import Main from "./main/Main";
import Header from "./header/Header";

let isMount = true;
let delay = false;

const Calender = () => {
  console.log("Content");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [param] = useSearchParams();
  let year = param.get("year")!;
  let month = param.get("month")!;

  useEffect(() => {
    let y = year;
    let m = month;
    console.log('?????')
    // 숫자를 제외한 모든 문자
    const pattern = /[^0-9]/g;

    // 사용자가 의도적으로 수를 제외한 문자열을 입력할 경우 수정
    if (isMount) {
      if (y.match(pattern)) y = y.replace(/\D/g, "");
      if (m.match(pattern)) m = m.replace(/\D/g, "");
      isMount = false;
    }

    if (!isMount) {
      if (+y > 2026) {
        alert("지원하지 않는 연도입니다.");
        y = "2025";
      }
      if (+y < 2004) {
        alert("지원하지 않는 연도입니다.");
        y = "2004";
      }

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
  }, [dispatch, navigate, month, year]);

  const movePrevMonth = () => {
    switch (+month) {
      case 1:
        month = "12";
        year = String(+year - 1);
        break;
      default:
        month = String(+month - 1).padStart(2, "0");
    }

    navigate(`/calender/date?year=${year}&month=${month}`);
    delay = true;
    setTimeout(() => {
      delay = false;
    }, 350);
  };

  const moveNextMonth = () => {
    switch (month) {
      case "12":
        month = "01";
        year = String(+year + 1);
        break;
      default:
        month = String(+month + 1).padStart(2, "0");
    }

    navigate(`/calender/date?year=${year}&month=${month}`);
    delay = true;
    setTimeout(() => {
      delay = false;
    }, 350);
  };

  const wheelHandler = (e: React.WheelEvent) => {
    if (delay) return;

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
    <div onWheel={(e) => wheelHandler(e)} style={{ width: "100%" }}>
      <Header
        type="calender"
        year={year}
        month={month}
        movePrevMonth={movePrevMonth}
        moveNextMonth={moveNextMonth}
      />
      <Main year={year} month={month} />
    </div>
  );
};

export default Calender;
