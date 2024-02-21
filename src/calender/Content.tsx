import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch } from "../redux/store";
import { cloneActions } from "../redux/clone-slice";
import { modalActions } from "../redux/modal-slice";
import { getNationalDay } from "../redux/fetch-action";
import Main from "./main/Main";
import Header from "./header/Header";

let delay = false;

const newDate = new Date();
const ye = String(newDate.getFullYear());
const mon = String(newDate.getMonth() + 1);

const Calender = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [checkUrl, setCheckUrl] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [param] = useSearchParams();
  // 사용자가 의도적으로 url에 수를 제외한 문자열을 입력할 경우 수를 제외한 모든 문자 제거
  let year = param.get("year")?.replace(/\D/g, "");
  let month = param.get("month")?.replace(/\D/g, "");

  useEffect(() => {
    // 페이지의 경로를 확인하고, 양식에 맞지 않은 경로를 입력했다면 수정한다.
    setCheckUrl(true);

    if (!year || !month)
      // 사용자가 year or month를 입력하지 않은 경우(undefined)
      return navigate(`/calender/date?year=${ye}&month=${mon}`);

    // 이후 year, month는 반드시 undefined가 아닌 문자열 데이터를 가진다.
    let y = year === "" ? ye : year;
    let m = month === "" ? mon : month;

    if (+y > 2003 && +y < +ye + 3 && m < "13" && m > "01" && m.length === 2)
      return;

    y = String(Math.max(2004, Math.min(+ye + 2, +year)));
    m = String(Math.max(1, Math.min(12, +month))).padStart(2, "0");

    navigate(`/calender/date?year=${y}&month=${m}`);

    if (!sessionStorage.getItem(y)) dispatch(getNationalDay(y));
  }, [dispatch, navigate, month, year]);

  const clearState = () => {
    dispatch(modalActions.clearSet({ type: "all" }));
    dispatch(cloneActions.clearSet());
    setIsDragging(false);
  };

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
    clearState();
    delay = true;
    setTimeout(() => {
      delay = false;
    }, 350);
  };

  const moveNextMonth = () => {
    switch (month!) {
      case "12":
        month = "01";
        year = String(+year! + 1);
        break;
      default:
        month = String(+month! + 1).padStart(2, "0");
    }

    navigate(`/calender/date?year=${year}&month=${month}`);
    clearState();
    delay = true;
    setTimeout(() => {
      delay = false;
    }, 350);
  };

  const wheelHandler = (e: React.WheelEvent) => {
    if (delay) return;

    switch (e.deltaY > 0) {
      case true:
        movePrevMonth();
        break;
      default:
        moveNextMonth();
    }
  };

  return (
    <div onWheel={(e) => wheelHandler(e)}>
      <Header
        type="calender"
        year={year!}
        month={month!}
        movePrevMonth={movePrevMonth}
        moveNextMonth={moveNextMonth}
      />
      {checkUrl && (
        <Main
          year={year!}
          month={month!}
          isDragging={isDragging}
          setIsDragging={setIsDragging}
        />
      )}
    </div>
  );
};

export default Calender;
