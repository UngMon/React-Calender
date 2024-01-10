import React from "react";
import { useSelector } from "react-redux";
import { dateActions } from "../../redux/date-slice";
import { RootState, useAppDispatch } from "../../redux/store";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { ButtonRef } from "../../type/RefType";
import MakeCaledner from "./Secon-MakeCalender";
import style from "./miniCal.module.css";

interface T {
  platform: string;
  type: string;
  dateRef: React.MutableRefObject<ButtonRef>;
}

const date = new Date();
const fixYear = date.getFullYear();
const fixMonth = String(date.getMonth() + 1).padStart(2, "0");
const fixDate = String(date.getDate()).padStart(2, "0");

const Month = ({ platform, type, dateRef }: T) => {
  console.log("secondMonth");
  const date = useSelector((state: RootState) => state.date);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  //pc => /calender/date?year=''&month=''
  const [param] = useSearchParams();
  let year = param.get("year") ?? date.year;
  let month = param.get("month") ?? date.month;

  const identify = fixYear + "-" + fixMonth + "-" + fixDate;

  const moveMonthHandler = (type: string) => {
    if (type === "prev") {
      if (+month === 1) {
        month = "12";
        year = String(+year - 1);
      } else {
        month = String(+month - 1).padStart(2, "0");
      }
    } else {
      if (month === "12") {
        month = "01";
        year = String(+year + 1);
      } else {
        month = String(+month + 1).padStart(2, "0");
      }
    }

    if (platform === "mobile") {
      return dispatch(dateActions.setDate({ year, month }));
    }

    navigate(`/calender/date?year=${year}&month=${month}`);
  };

  return (
    <div className={`${style["container"]} ${style["platform-pc"]}`}>
      <div className={style["month-picker"]}>
        <div>
          <span>
            {year}년&nbsp;&nbsp;{+month}월
          </span>
        </div>
        <div>
          <button
            onClick={() => moveMonthHandler("prev")}
            type="button"
            ref={(el: HTMLButtonElement) => (dateRef.current[2] = el)}
          >
            <FontAwesomeIcon
              icon={faAngleLeft}
              style={{ backgroundColor: "transparent" }}
            />
          </button>
          <button
            onClick={() => moveMonthHandler("next")}
            type="button"
            ref={(el: HTMLButtonElement) => (dateRef.current[3] = el)}
          >
            <FontAwesomeIcon
              icon={faAngleRight}
              style={{ backgroundColor: "transparent" }}
            />
          </button>
        </div>
      </div>
      <div className={style.calender}>
        <table className={style.table}>
          <thead className={style.weekname}>
            <tr>
              <th>일</th>
              <th>월</th>
              <th>화</th>
              <th>수</th>
              <th>목</th>
              <th>금</th>
              <th>토</th>
            </tr>
          </thead>
          <tbody className={style.tbody}>
            <MakeCaledner
              type={type}
              year={year}
              month={month}
              identify={identify}
              dateRef={dateRef}
            />
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Month;
