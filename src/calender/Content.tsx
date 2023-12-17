import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch } from "../redux/store";
import { modalActions } from "../redux/modal-slice";
import { getNationalDay } from "../redux/fetch-action";
import Main from "./main/Main";
import Header from "./header/Header";

let delay = false;

const newDate = new Date();
const ye = String(newDate.getFullYear());
const mon = String(newDate.getMonth() + 1);

const Calender = () => {
  console.log("Content Render");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [param] = useSearchParams();
  // 사용자가 의도적으로 수를 제외한 문자열을 입력할 경우 수를 제외한 모든 문자 공백
  let year = param.get("year")?.replace(/\D/g, "");
  let month = param.get("month")?.replace(/\D/g, "");

  useEffect(() => {
    // 아래 조건식으로 불 필요한 렌더링 방지
    if (!year || !month)
      return navigate(`/calender/date?year=${ye}&month=${mon}`);

    if (year > "2003" && year < String(+ye + 2) && month < "13" && month > "00")
      return;

    let y = year === "" ? ye : year;
    let m = month === "" ? mon : month;

    y = String(Math.max(2004, Math.min(+ye + 2, +y)));
    m = String(Math.max(1, Math.min(12, +m))).padStart(2, "0");

    navigate(`/calender/date?year=${y}&month=${m}`);

    dispatch(getNationalDay(y));
  }, [dispatch, navigate, month, year]);

  const movePrevMonth = () => {
    switch (+month!) {
      case 1:
        month = "12";
        year = String(+year! - 1);
        break;
      default:
        month = String(+month! - 1).padStart(2, "0");
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
        year = String(+year! + 1);
        break;
      default:
        month = String(+month! + 1).padStart(2, "0");
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
        year={year!}
        month={month!}
        movePrevMonth={movePrevMonth}
        moveNextMonth={moveNextMonth}
      />
      <Main year={year!} month={month!} />
    </div>
  );
};

export default Calender;
